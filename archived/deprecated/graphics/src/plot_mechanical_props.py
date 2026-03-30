"""
plot_mechanical_props.py
------------------------
Visualizaciones de propiedades mecánicas extraídas.
Fuente: Propiedades_Extraidas_cleaned.csv  (solo filas TensiondataA.xlsx con datos)

Gráficos generados:
  1. Dispersión max_force vs modulo_young, coloreado por grupo de probeta
  2. Dispersión max_force vs maxstrainext, coloreado por grupo
  3. Boxplot de max_force por grupo de estructura (lattice vs sólido)
  4. Ranking de probetas por max_force (barras horizontales)
  5. Scatter matrix reducido (max_force, maxstrain, modulo_young, maxstrainext)
"""

import matplotlib
matplotlib.use("Agg")  # backend no-interactivo
import os
import re
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CLEANED = os.path.join(ROOT, "Normalization", "cleaned")
OUT = os.path.join(ROOT, "graphics", "output", "mechanical")
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

PALETTE = ["#58a6ff", "#f78166", "#3fb950", "#bc8cff", "#f0e68c", "#79c0ff"]


def _save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  [OK] {path}")


def _classify_group(sheet_name):
    """Clasifica la probeta por prefijo del código de hoja."""
    s = str(sheet_name).upper()
    if s.startswith("SOL"):
        return "Sólido"
    if re.match(r"G\d", s):
        return "Gyroid"
    if re.match(r"H\d", s):
        return "Honeycomb"
    if re.match(r"T\d", s):
        return "Triply-Periodic"
    return "Otro"


# ─── Carga y filtro de datos ──────────────────────────────────────────────────
def load_data():
    df = pd.read_csv(os.path.join(CLEANED, "Propiedades_Extraidas_cleaned.csv"))
    # Solo TensiondataA tiene propiedades numéricas extraídas
    df = df[df["file"] == "TensiondataA.xlsx"].copy()
    df = df[df["max_force"].notna()].copy()
    df["group"] = df["sheet"].apply(_classify_group)
    return df


# ─── 1. max_force vs modulo_young ─────────────────────────────────────────────
def plot_force_vs_modulus(df):
    sub = df[df["modulo_young"].notna()]
    if sub.empty:
        print("  [SKIP] No hay datos modulo_young.")
        return

    fig, ax = plt.subplots(figsize=(8, 6))
    fig.suptitle("Fuerza Máxima vs. Módulo de Young", fontsize=13, fontweight="bold")

    groups = sub["group"].unique()
    color_map = {g: PALETTE[i] for i, g in enumerate(groups)}

    for g in groups:
        s = sub[sub["group"] == g]
        ax.scatter(s["max_force"], s["modulo_young"],
                   color=color_map[g], label=g, s=70, alpha=0.9,
                   edgecolors="#0f1117", linewidth=0.5)
        # etiqueta probeta
        for _, row in s.iterrows():
            ax.annotate(row["sheet"], (row["max_force"], row["modulo_young"]),
                        fontsize=6.5, color="#8b949e",
                        xytext=(4, 2), textcoords="offset points")

    ax.set_xlabel("Fuerza Máxima (N)")
    ax.set_ylabel("Módulo de Young (MPa)")
    ax.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "force_vs_modulus.png")


# ─── 2. max_force vs maxstrainext ─────────────────────────────────────────────
def plot_force_vs_strainext(df):
    sub = df[df["maxstrainext"].notna()]
    if sub.empty:
        print("  [SKIP] No hay datos maxstrainext.")
        return

    fig, ax = plt.subplots(figsize=(8, 6))
    fig.suptitle("Fuerza Máxima vs. Deformación Extensométrica Máxima", fontsize=13, fontweight="bold")

    groups = sub["group"].unique()
    color_map = {g: PALETTE[i] for i, g in enumerate(groups)}

    for g in groups:
        s = sub[sub["group"] == g]
        ax.scatter(s["max_force"], s["maxstrainext"],
                   color=color_map[g], label=g, s=70, alpha=0.9,
                   edgecolors="#0f1117", linewidth=0.5)

    ax.set_xlabel("Fuerza Máxima (N)")
    ax.set_ylabel("Maxstrainext (mm/mm)")
    ax.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "force_vs_strainext.png")


# ─── 3. Boxplot max_force por grupo ───────────────────────────────────────────
def plot_force_boxplot(df):
    groups = df["group"].unique()
    data_by_group = [df[df["group"] == g]["max_force"].dropna().values for g in groups]

    fig, ax = plt.subplots(figsize=(9, 5))
    fig.suptitle("Distribución de Fuerza Máxima por Grupo de Estructura", fontsize=13, fontweight="bold")

    bp = ax.boxplot(data_by_group, patch_artist=True, notch=False,
                    medianprops=dict(color="#f0e68c", linewidth=2),
                    whiskerprops=dict(color="#8b949e"),
                    capprops=dict(color="#8b949e"),
                    flierprops=dict(marker="o", color="#f78166", markersize=5, alpha=0.6))

    for patch, color in zip(bp["boxes"], PALETTE):
        patch.set_facecolor(color)
        patch.set_alpha(0.6)

    ax.set_xticklabels(groups, rotation=15)
    ax.set_ylabel("Fuerza Máxima (N)")
    ax.grid(True, axis="y")
    fig.tight_layout()
    _save(fig, "force_boxplot_by_group.png")


# ─── 4. Ranking de probetas por max_force ─────────────────────────────────────
def plot_force_ranking(df):
    ranked = df[["sheet", "max_force", "group"]].dropna(subset=["max_force"]) \
                                                  .sort_values("max_force", ascending=True)
    groups = df["group"].unique()
    color_map = {g: PALETTE[i] for i, g in enumerate(groups)}

    fig, ax = plt.subplots(figsize=(8, max(5, len(ranked) * 0.35)))
    fig.suptitle("Ranking de Probetas por Fuerza Máxima", fontsize=13, fontweight="bold")

    colors_bars = [color_map[g] for g in ranked["group"]]
    bars = ax.barh(ranked["sheet"], ranked["max_force"], color=colors_bars, alpha=0.80,
                   edgecolor="#0f1117", linewidth=0.5)

    for bar in bars:
        ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height() / 2,
                f"{bar.get_width():.1f}", va="center", ha="left", fontsize=7.5, color="#8b949e")

    handles = [mpatches.Patch(color=color_map[g], alpha=0.8, label=g) for g in groups]
    ax.legend(handles=handles, framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b", fontsize=8)
    ax.set_xlabel("Fuerza Máxima (N)")
    ax.grid(True, axis="x")
    fig.tight_layout()
    _save(fig, "force_ranking.png")


# ─── 5. Scatter matrix reducido ───────────────────────────────────────────────
def plot_scatter_matrix(df):
    props = ["max_force", "maxstrain", "modulo_young", "maxstrainext"]
    props = [c for c in props if c in df.columns]
    sub = df[props + ["group"]].dropna(subset=["max_force"])

    n = len(props)
    fig, axes = plt.subplots(n, n, figsize=(12, 10))
    fig.suptitle("Matriz de Dispersión — Propiedades Mecánicas Extraídas", fontsize=13, fontweight="bold")

    groups = sub["group"].unique()
    color_map = {g: PALETTE[i] for i, g in enumerate(groups)}

    for i, col_y in enumerate(props):
        for j, col_x in enumerate(props):
            ax = axes[i][j]
            if i == j:
                # diagonal: distribución
                data = sub[col_y].dropna()
                ax.hist(data, bins=10, color=PALETTE[i % len(PALETTE)], alpha=0.7, edgecolor="#0f1117")
            else:
                for g in groups:
                    s = sub[sub["group"] == g]
                    valid = s[[col_x, col_y]].dropna()
                    ax.scatter(valid[col_x], valid[col_y],
                               color=color_map[g], s=25, alpha=0.75, edgecolors="none")

            if i == n - 1:
                ax.set_xlabel(col_x.replace("_", " "), fontsize=7)
            else:
                ax.set_xticklabels([])
            if j == 0:
                ax.set_ylabel(col_y.replace("_", " "), fontsize=7)
            else:
                ax.set_yticklabels([])
            ax.tick_params(labelsize=6)
            ax.grid(True, alpha=0.3)

    handles = [mpatches.Patch(color=color_map[g], alpha=0.8, label=g) for g in groups]
    fig.legend(handles=handles, loc="upper right", framealpha=0.2, facecolor="#0f1117",
               edgecolor="#3a3f4b", fontsize=8)
    fig.tight_layout()
    _save(fig, "scatter_matrix_props.png")


# ─── Entrypoint ───────────────────────────────────────────────────────────────
def run():
    print("\n[mechanical_props] Cargando datos...")
    df = load_data()
    if df.empty:
        print("[mechanical_props] Sin datos numéricos disponibles.")
        return

    print(f"[mechanical_props] {len(df)} probetas con datos extraídos.")
    plot_force_vs_modulus(df)
    plot_force_vs_strainext(df)
    plot_force_boxplot(df)
    plot_force_ranking(df)
    plot_scatter_matrix(df)
    print("[mechanical_props] Listo.\n")


if __name__ == "__main__":
    run()
