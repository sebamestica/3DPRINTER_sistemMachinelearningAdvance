"""
plot_process_params.py
----------------------
Visualizaciones de parámetros de proceso de impresión 3D FDM.
Fuente: FDM_Dataset_cleaned.csv  y  data_cleaned.csv

Gráficos generados:
  1. Distribución de parámetros clave del proceso (histogramas + KDE)
  2. Categorías: infill_pattern, material, filament_type, microstructure
  3. Influencia de infill_density vs tension_strenght (data_cleaned)
  4. Influencia de layer_height vs elongation (data_cleaned)
  5. Heatmap de parámetros FDM normalizados (vista global)
"""

import matplotlib
matplotlib.use("Agg")  # backend no-interactivo (sin ventana)
import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import numpy as np
from matplotlib.colors import Normalize
from matplotlib.cm import ScalarMappable

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CLEANED = os.path.join(ROOT, "Normalization", "cleaned")
OUT = os.path.join(ROOT, "graphics", "output", "process")
os.makedirs(OUT, exist_ok=True)

# ─── Estilo global ────────────────────────────────────────────────────────────
plt.rcParams.update({
    "figure.facecolor": "#0f1117",
    "axes.facecolor":   "#181c25",
    "axes.edgecolor":   "#3a3f4b",
    "axes.labelcolor":  "#c9d1d9",
    "axes.titlecolor":  "#e6edf3",
    "xtick.color":      "#8b949e",
    "ytick.color":      "#8b949e",
    "text.color":       "#c9d1d9",
    "grid.color":       "#21262d",
    "grid.linestyle":   "--",
    "grid.alpha":       0.5,
    "font.family":      "DejaVu Sans",
    "font.size":        10,
})

ACCENT   = "#58a6ff"   # azul claro
ACCENT2  = "#f78166"   # naranja/rojo
ACCENT3  = "#3fb950"   # verde


def _save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  [OK] {path}")


# ─── 1. Distribuciones de parámetros numéricos FDM ────────────────────────────
def plot_fdm_distributions(df):
    cols = [
        "layer_height_mm", "infill_density_%", "melting_temperature_c",
        "nozzle_diameter_mm", "fan_speed_m_s", "retraction_distance_mm",
        "acceleration_mm_s2", "linear_advance"
    ]
    cols = [c for c in cols if c in df.columns]
    n = len(cols)
    ncols = 4
    nrows = (n + ncols - 1) // ncols

    fig, axes = plt.subplots(nrows, ncols, figsize=(16, nrows * 3.2))
    fig.suptitle("Distribución de Parámetros de Proceso FDM", fontsize=14, fontweight="bold", y=1.01)
    axes = axes.flatten()

    colors = plt.cm.cool(np.linspace(0.3, 0.9, n))

    for i, col in enumerate(cols):
        ax = axes[i]
        data = df[col].dropna()
        ax.hist(data, bins=15, color=colors[i], alpha=0.75, edgecolor="#0f1117", linewidth=0.6)
        ax.set_title(col.replace("_", " "), fontsize=9)
        ax.set_xlabel("")
        ax.yaxis.set_visible(False)
        ax.grid(True, axis="x")
        # línea de media
        ax.axvline(data.mean(), color="#f0e68c", linewidth=1.4, linestyle="--", alpha=0.9)

    for j in range(i + 1, len(axes)):
        axes[j].set_visible(False)

    fig.tight_layout()
    _save(fig, "fdm_param_distributions.png")


# ─── 2. Frecuencia de variables categóricas FDM ───────────────────────────────
def plot_fdm_categoricals(df):
    cat_cols = ["infill_pattern", "material", "filament_type", "microstructure", "material_type"]
    cat_cols = [c for c in cat_cols if c in df.columns]

    fig, axes = plt.subplots(1, len(cat_cols), figsize=(14, 4))
    fig.suptitle("Variables Categóricas — FDM Dataset", fontsize=13, fontweight="bold")

    palette = [ACCENT, ACCENT2, ACCENT3, "#bc8cff", "#f0e68c"]

    for i, col in enumerate(cat_cols):
        ax = axes[i] if len(cat_cols) > 1 else axes
        counts = df[col].value_counts()
        bars = ax.bar(counts.index, counts.values, color=palette[i % len(palette)], alpha=0.85,
                      edgecolor="#0f1117", linewidth=0.7)
        ax.set_title(col.replace("_", " "), fontsize=9)
        ax.set_xlabel("")
        ax.yaxis.set_visible(False)
        ax.grid(True, axis="y")
        ax.tick_params(axis="x", rotation=15, labelsize=8)
        for bar in bars:
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.2,
                    str(int(bar.get_height())), ha="center", va="bottom", fontsize=7.5,
                    color="#e6edf3")

    fig.tight_layout()
    _save(fig, "fdm_categoricals.png")


# ─── 3. Infill density vs Tension strength ────────────────────────────────────
def plot_infill_vs_tension(df_data):
    required = {"infill_density", "tension_strenght", "material"}
    if not required.issubset(df_data.columns):
        print("  [SKIP] data_cleaned no tiene las columnas requeridas para plot 3.")
        return

    fig, ax = plt.subplots(figsize=(8, 5))
    fig.suptitle("Densidad de Relleno vs. Resistencia a la Tensión", fontsize=13, fontweight="bold")

    materials = df_data["material"].unique()
    colors_mat = {m: c for m, c in zip(materials, [ACCENT, ACCENT2, ACCENT3, "#bc8cff"])}

    for mat in materials:
        sub = df_data[df_data["material"] == mat]
        ax.scatter(sub["infill_density"], sub["tension_strenght"],
                   color=colors_mat[mat], label=mat.upper(), s=60, alpha=0.85,
                   edgecolors="#0f1117", linewidth=0.5)

    ax.set_xlabel("Densidad de Relleno (%)")
    ax.set_ylabel("Resistencia Tensión (MPa)")
    ax.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "infill_vs_tension.png")


# ─── 4. Layer height vs Elongation ────────────────────────────────────────────
def plot_layer_vs_elongation(df_data):
    required = {"layer_height", "elongation", "infill_pattern"}
    if not required.issubset(df_data.columns):
        print("  [SKIP] data_cleaned no tiene las columnas requeridas para plot 4.")
        return

    fig, ax = plt.subplots(figsize=(8, 5))
    fig.suptitle("Altura de Capa vs. Elongación", fontsize=13, fontweight="bold")

    patterns = df_data["infill_pattern"].unique()
    colors_pat = {p: c for p, c in zip(patterns, [ACCENT, ACCENT2])}
    markers = {p: m for p, m in zip(patterns, ["o", "s"])}

    for pat in patterns:
        sub = df_data[df_data["infill_pattern"] == pat]
        ax.scatter(sub["layer_height"], sub["elongation"],
                   color=colors_pat[pat], marker=markers[pat],
                   label=pat, s=60, alpha=0.85, edgecolors="#0f1117", linewidth=0.5)

    # Tendencia general
    z = np.polyfit(df_data["layer_height"], df_data["elongation"], 1)
    p = np.poly1d(z)
    xs = np.linspace(df_data["layer_height"].min(), df_data["layer_height"].max(), 100)
    ax.plot(xs, p(xs), color="#f0e68c", linewidth=1.5, linestyle="--", alpha=0.8, label="Tendencia")

    ax.set_xlabel("Altura de Capa (mm)")
    ax.set_ylabel("Elongación (%)")
    ax.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "layer_vs_elongation.png")


# ─── 5. Heatmap de parámetros FDM normalizados ────────────────────────────────
def plot_fdm_heatmap(df):
    num_cols = df.select_dtypes(include="number").columns.tolist()
    if len(num_cols) < 2:
        return

    df_norm = df[num_cols].copy()
    # min-max por columna
    for col in num_cols:
        rng = df_norm[col].max() - df_norm[col].min()
        if rng > 0:
            df_norm[col] = (df_norm[col] - df_norm[col].min()) / rng
        else:
            df_norm[col] = 0.5

    fig, ax = plt.subplots(figsize=(16, 6))
    fig.suptitle("Heatmap de Parámetros FDM Normalizados (por muestra)", fontsize=13, fontweight="bold")

    im = ax.imshow(df_norm.T.values, aspect="auto", cmap="plasma", vmin=0, vmax=1)
    ax.set_yticks(range(len(num_cols)))
    ax.set_yticklabels([c.replace("_", " ") for c in num_cols], fontsize=8)
    ax.set_xlabel("Muestra #")
    ax.set_xticks(range(0, len(df_norm), max(1, len(df_norm) // 10)))

    cbar = fig.colorbar(im, ax=ax, orientation="vertical", shrink=0.9)
    cbar.set_label("Valor normalizado", labelpad=10)

    fig.tight_layout()
    _save(fig, "fdm_heatmap_normalizado.png")


# ─── Entrypoint ───────────────────────────────────────────────────────────────
def run():
    print("\n[process_params] Cargando datos...")
    fdm = pd.read_csv(os.path.join(CLEANED, "FDM_Dataset_cleaned.csv"))
    data = pd.read_csv(os.path.join(CLEANED, "data_cleaned.csv"))

    print("[process_params] Generando gráficos...")
    plot_fdm_distributions(fdm)
    plot_fdm_categoricals(fdm)
    plot_infill_vs_tension(data)
    plot_layer_vs_elongation(data)
    plot_fdm_heatmap(fdm)
    print("[process_params] Listo.\n")


if __name__ == "__main__":
    run()
