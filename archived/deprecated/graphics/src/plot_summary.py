"""
plot_summary.py
---------------
Gráficos de resumen cruzado: parámetros de proceso vs propiedades mecánicas.
Fuentes: data_cleaned.csv, FDM_Dataset_cleaned.csv, Propiedades_Extraidas_cleaned.csv

Gráficos generados:
  1. Correlación de variables numéricas de data_cleaned (heatmap)
  2. Roughness vs Tension strength (data_cleaned) coloreado por material
  3. Print speed vs Tension strength y Elongation (subplots)
  4. Nozzle temperature vs Tension strength (data_cleaned)
  5. Variance overview: coeficiente de variación (CV%) por variable numérica — FDM y data combinados
"""

import matplotlib
matplotlib.use("Agg")  # backend no-interactivo
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CLEANED = os.path.join(ROOT, "Normalization", "cleaned")
OUT = os.path.join(ROOT, "graphics", "output", "summary")
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

ACCENT  = "#58a6ff"
ACCENT2 = "#f78166"
ACCENT3 = "#3fb950"


def _save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  [OK] {path}")


# ─── 1. Heatmap de correlación — data_cleaned ─────────────────────────────────
def plot_correlation_heatmap(df):
    num = df.select_dtypes(include="number")
    corr = num.corr()

    # Colormap personalizado oscuro
    cmap = LinearSegmentedColormap.from_list(
        "dark_div",
        ["#f78166", "#181c25", "#58a6ff"]
    )

    fig, ax = plt.subplots(figsize=(10, 8))
    fig.suptitle("Matriz de Correlación — data_cleaned", fontsize=13, fontweight="bold")

    im = ax.imshow(corr.values, cmap=cmap, vmin=-1, vmax=1, aspect="auto")
    cbar = fig.colorbar(im, ax=ax, shrink=0.85)
    cbar.set_label("Pearson r", labelpad=10)

    labels = [c.replace("_", "\n") for c in corr.columns]
    ax.set_xticks(range(len(labels)))
    ax.set_yticks(range(len(labels)))
    ax.set_xticklabels(labels, fontsize=8, rotation=45, ha="right")
    ax.set_yticklabels(labels, fontsize=8)

    # Anotar valores
    for i in range(len(corr)):
        for j in range(len(corr)):
            val = corr.values[i, j]
            color = "#e6edf3" if abs(val) < 0.5 else "#0f1117"
            ax.text(j, i, f"{val:.2f}", ha="center", va="center",
                    fontsize=7, color=color)

    fig.tight_layout()
    _save(fig, "correlation_heatmap_data.png")


# ─── 2. Roughness vs Tension strength ─────────────────────────────────────────
def plot_roughness_vs_tension(df):
    if not all(c in df.columns for c in ["roughness", "tension_strenght", "material"]):
        print("  [SKIP] Columnas faltantes para roughness vs tension.")
        return

    fig, ax = plt.subplots(figsize=(9, 6))
    fig.suptitle("Rugosidad vs. Resistencia a la Tensión", fontsize=13, fontweight="bold")

    for mat, color in zip(df["material"].unique(), [ACCENT, ACCENT2]):
        sub = df[df["material"] == mat]
        ax.scatter(sub["roughness"], sub["tension_strenght"],
                   color=color, label=mat.upper(), s=65, alpha=0.85,
                   edgecolors="#0f1117", linewidth=0.5)

    # Línea de tendencia general
    z = np.polyfit(df["roughness"], df["tension_strenght"], 1)
    xs = np.linspace(df["roughness"].min(), df["roughness"].max(), 100)
    ax.plot(xs, np.poly1d(z)(xs), color="#f0e68c", linewidth=1.4,
            linestyle="--", alpha=0.85, label="Tendencia")

    ax.set_xlabel("Rugosidad (Ra)")
    ax.set_ylabel("Resistencia Tensión (MPa)")
    ax.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "roughness_vs_tension.png")


# ─── 3. Print speed vs Tension & Elongation ───────────────────────────────────
def plot_speed_vs_properties(df):
    required = {"print_speed", "tension_strenght", "elongation", "material"}
    if not required.issubset(df.columns):
        print("  [SKIP] Columnas faltantes para speed vs properties.")
        return

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle("Velocidad de Impresión vs. Propiedades Mecánicas", fontsize=13, fontweight="bold")

    for mat, color in zip(df["material"].unique(), [ACCENT, ACCENT2]):
        sub = df[df["material"] == mat]
        ax1.scatter(sub["print_speed"], sub["tension_strenght"],
                    color=color, label=mat.upper(), s=60, alpha=0.85,
                    edgecolors="#0f1117", linewidth=0.5)
        ax2.scatter(sub["print_speed"], sub["elongation"],
                    color=color, label=mat.upper(), s=60, alpha=0.85,
                    edgecolors="#0f1117", linewidth=0.5)

    ax1.set_xlabel("Velocidad de Impresión (mm/s)")
    ax1.set_ylabel("Resistencia Tensión (MPa)")
    ax1.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax1.grid(True)
    ax1.set_title("vs. Resistencia a la Tensión")

    ax2.set_xlabel("Velocidad de Impresión (mm/s)")
    ax2.set_ylabel("Elongación (%)")
    ax2.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax2.grid(True)
    ax2.set_title("vs. Elongación")

    fig.tight_layout()
    _save(fig, "speed_vs_properties.png")


# ─── 4. Nozzle temperature vs Tension strength ────────────────────────────────
def plot_nozzle_temp_vs_tension(df):
    if not all(c in df.columns for c in ["nozzle_temperature", "tension_strenght", "layer_height"]):
        print("  [SKIP] Columnas faltantes para nozzle_temp vs tension.")
        return

    fig, ax = plt.subplots(figsize=(9, 6))
    fig.suptitle("Temperatura de Nozzle vs. Resistencia a la Tensión", fontsize=13, fontweight="bold")

    heights = sorted(df["layer_height"].unique())
    cmap = plt.cm.plasma
    colors_h = {h: cmap(i / max(len(heights) - 1, 1)) for i, h in enumerate(heights)}

    for h in heights:
        sub = df[df["layer_height"] == h]
        ax.scatter(sub["nozzle_temperature"], sub["tension_strenght"],
                   color=colors_h[h], label=f"{h} mm", s=60, alpha=0.85,
                   edgecolors="#0f1117", linewidth=0.5)

    ax.set_xlabel("Temperatura de Nozzle (°C)")
    ax.set_ylabel("Resistencia Tensión (MPa)")
    ax.legend(title="Layer Height", framealpha=0.2, facecolor="#181c25",
              edgecolor="#3a3f4b", fontsize=8)
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "nozzle_temp_vs_tension.png")


# ─── 5. Coeficiente de Variación por variable ─────────────────────────────────
def plot_cv_overview(df_fdm, df_data):
    """
    Muestra el CV% (std/mean * 100) de todas las variables numéricas relevantes.
    Es una manera rápida de ver qué parámetros tienen más dispersión experimental.
    """
    cvs = {}
    for df, prefix in [(df_fdm, "FDM"), (df_data, "data")]:
        for col in df.select_dtypes(include="number").columns:
            series = df[col].dropna()
            if series.mean() != 0 and len(series) > 1:
                cv = (series.std() / abs(series.mean())) * 100
                label = f"{prefix}: {col.replace('_', ' ')}"
                cvs[label] = cv

    if not cvs:
        return

    items = sorted(cvs.items(), key=lambda x: x[1], reverse=True)
    labels, values = zip(*items)

    # Color por dataset
    bar_colors = [ACCENT if l.startswith("FDM") else ACCENT2 for l in labels]

    fig, ax = plt.subplots(figsize=(12, max(5, len(labels) * 0.38)))
    fig.suptitle("Coeficiente de Variación (CV%) por Variable Numérica", fontsize=13, fontweight="bold")

    bars = ax.barh(labels, values, color=bar_colors, alpha=0.82,
                   edgecolor="#0f1117", linewidth=0.5)

    ax.axvline(30, color="#f0e68c", linewidth=1, linestyle="--", alpha=0.7)
    ax.text(31, 0, "Alta dispersión (30%)", color="#f0e68c", fontsize=7.5, va="bottom")

    ax.set_xlabel("CV (%)")
    ax.grid(True, axis="x")

    from matplotlib.patches import Patch
    handles = [Patch(color=ACCENT, alpha=0.82, label="FDM Dataset"),
               Patch(color=ACCENT2, alpha=0.82, label="data_cleaned")]
    ax.legend(handles=handles, framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b", fontsize=8)

    fig.tight_layout()
    _save(fig, "cv_overview.png")


# ─── Entrypoint ───────────────────────────────────────────────────────────────
def run():
    print("\n[summary] Cargando datos...")
    data   = pd.read_csv(os.path.join(CLEANED, "data_cleaned.csv"))
    fdm    = pd.read_csv(os.path.join(CLEANED, "FDM_Dataset_cleaned.csv"))

    print("[summary] Generando gráficos...")
    plot_correlation_heatmap(data)
    plot_roughness_vs_tension(data)
    plot_speed_vs_properties(data)
    plot_nozzle_temp_vs_tension(data)
    plot_cv_overview(fdm, data)
    print("[summary] Listo.\n")


if __name__ == "__main__":
    run()
