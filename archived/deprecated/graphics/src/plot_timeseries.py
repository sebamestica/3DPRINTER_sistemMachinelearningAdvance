"""
plot_timeseries.py
------------------
Curvas de comportamiento mecánico por probeta (series de tiempo).
Fuentes: TensiondataA_cleaned.csv, TensiondataB_cleaned.csv, Compressivedata_cleaned.csv

Gráficos generados:
  1. Curvas Stress-Strain superpuestas por probeta (TensiondataA) — selección representativa
  2. Curvas Fuerza-Desplazamiento por probeta (TensiondataA) — selección
  3. Comparativa Stress-Strain: TensiondataA vs TensiondataB (media por timestamp)
  4. Curva compresiva media: Fuerza vs Desplazamiento (Compressivedata, 1 probeta representativa)

NOTA: Los archivos de timeseries son grandes. Se usa chunk reading con iteración
      eficiente para no consumir toda la RAM de una vez.
"""

import matplotlib
matplotlib.use("Agg")  # backend no-interactivo
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# ─── Paths ────────────────────────────────────────────────────────────────────
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CLEANED = os.path.join(ROOT, "Normalization", "cleaned")
OUT = os.path.join(ROOT, "graphics", "output", "timeseries")
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

PALETTE = [
    "#58a6ff", "#f78166", "#3fb950", "#bc8cff",
    "#f0e68c", "#79c0ff", "#ff9f43", "#54a0ff",
    "#5f27cd", "#01abc2", "#48dbfb", "#ff6b6b",
]


def _save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  [OK] {path}")


# ─── Carga TensiondataA ───────────────────────────────────────────────────────
def load_tensionA():
    """Carga TensiondataA y retorna dict {probeta: DataFrame con stress/strain}."""
    path = os.path.join(CLEANED, "TensiondataA_cleaned.csv")
    df = pd.read_csv(path, usecols=["probeta", "strain_[mm/mm]", "stress[mpa]",
                                     "axial_force", "axial_displacement",
                                     "strainext[mm/mm]"],
                     low_memory=False)
    df = df[df["probeta"].notna()].copy()
    return df


def load_tensionB():
    """Carga TensiondataB con columnas disponibles."""
    path = os.path.join(CLEANED, "TensiondataB_cleaned.csv")
    # Leer solo primeras filas para detectar columnas disponibles
    sample = pd.read_csv(path, nrows=3)
    usecols = [c for c in ["probeta", "strain_[mm/mm]", "stress[mpa]",
                            "axial_force", "axial_displacement", "strainext[mm/mm]"]
               if c in sample.columns]
    if not usecols:
        return None
    df = pd.read_csv(path, usecols=usecols, low_memory=False)
    df = df[df["probeta"].notna()].copy() if "probeta" in df.columns else df
    return df


# ─── 1. Curvas Stress-Strain por probeta (TensiondataA) ──────────────────────
def plot_stress_strain_A(df):
    required = {"probeta", "strain_[mm/mm]", "stress[mpa]"}
    if not required.issubset(df.columns):
        print("  [SKIP] Columnas insuficientes para stress-strain.")
        return

    # Filtrar filas válidas
    sub = df[["probeta", "strain_[mm/mm]", "stress[mpa]"]].dropna()
    probetas = sub["probeta"].unique()

    # Limitar a las primeras 12 probetas para legibilidad
    probetas_sel = probetas[:12]

    fig, ax = plt.subplots(figsize=(12, 7))
    fig.suptitle("Curvas Tensión-Deformación por Probeta (TensiondataA)", fontsize=13, fontweight="bold")

    for i, prob in enumerate(probetas_sel):
        group = sub[sub["probeta"] == prob].sort_values("strain_[mm/mm]")
        # Submuestrear para eficiencia visual
        step = max(1, len(group) // 500)
        group = group.iloc[::step]
        ax.plot(group["strain_[mm/mm]"], group["stress[mpa]"],
                color=PALETTE[i % len(PALETTE)], linewidth=1.2,
                alpha=0.85, label=str(prob))

    ax.set_xlabel("Deformación (mm/mm)")
    ax.set_ylabel("Tensión (MPa)")
    ax.legend(bbox_to_anchor=(1.02, 1), loc="upper left", fontsize=7.5,
              framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "stress_strain_A_probetas.png")


# ─── 2. Curvas Fuerza-Desplazamiento (TensiondataA) ──────────────────────────
def plot_force_displacement_A(df):
    required = {"probeta", "axial_force", "axial_displacement"}
    if not required.issubset(df.columns):
        print("  [SKIP] Columnas insuficientes para force-displacement.")
        return

    sub = df[["probeta", "axial_force", "axial_displacement"]].dropna()
    probetas = sub["probeta"].unique()[:12]

    fig, ax = plt.subplots(figsize=(12, 7))
    fig.suptitle("Curvas Fuerza-Desplazamiento por Probeta (TensiondataA)", fontsize=13, fontweight="bold")

    for i, prob in enumerate(probetas):
        group = sub[sub["probeta"] == prob].sort_values("axial_displacement")
        step = max(1, len(group) // 500)
        group = group.iloc[::step]
        ax.plot(group["axial_displacement"], group["axial_force"],
                color=PALETTE[i % len(PALETTE)], linewidth=1.2,
                alpha=0.85, label=str(prob))

    ax.set_xlabel("Desplazamiento Axial (mm)")
    ax.set_ylabel("Fuerza Axial (N)")
    ax.legend(bbox_to_anchor=(1.02, 1), loc="upper left", fontsize=7.5,
              framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "force_displacement_A_probetas.png")


# ─── 3. Comparativa media A vs B (Stress-Strain) ─────────────────────────────
def plot_AB_comparison(df_A, df_B):
    if df_B is None:
        print("  [SKIP] TensiondataB no disponible.")
        return

    cols_needed = {"strain_[mm/mm]", "stress[mpa]"}
    for name, df in [("A", df_A), ("B", df_B)]:
        if not cols_needed.issubset(df.columns):
            print(f"  [SKIP] TensiondataB no tiene columnas necesarias para comparativa.")
            return

    # Calcular curva media por cuantiles de strain
    def mean_curve(df, n_bins=200):
        d = df[["strain_[mm/mm]", "stress[mpa]"]].dropna()
        d = d[d["strain_[mm/mm]"] >= 0]
        bins = np.linspace(d["strain_[mm/mm]"].min(), d["strain_[mm/mm]"].max(), n_bins)
        d["bin"] = pd.cut(d["strain_[mm/mm]"], bins, labels=bins[:-1])
        grouped = d.groupby("bin")["stress[mpa]"].agg(["mean", "std"]).reset_index()
        grouped["bin"] = grouped["bin"].astype(float)
        return grouped.dropna()

    curve_A = mean_curve(df_A)
    curve_B = mean_curve(df_B)

    fig, ax = plt.subplots(figsize=(10, 6))
    fig.suptitle("Curva Media Tensión-Deformación: TensiondataA vs TensiondataB", fontsize=13, fontweight="bold")

    for curve, label, color in [(curve_A, "TensiondataA", "#58a6ff"), (curve_B, "TensiondataB", "#f78166")]:
        ax.plot(curve["bin"], curve["mean"], color=color, linewidth=2, label=label)
        ax.fill_between(curve["bin"],
                        curve["mean"] - curve["std"],
                        curve["mean"] + curve["std"],
                        color=color, alpha=0.15)

    ax.set_xlabel("Deformación (mm/mm)")
    ax.set_ylabel("Tensión Media (MPa)")
    ax.legend(framealpha=0.2, facecolor="#181c25", edgecolor="#3a3f4b")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "stress_strain_AB_comparativa.png")


# ─── 4. Curva compresiva (Compressivedata — 1 probeta) ────────────────────────
def plot_compressive_curve():
    path = os.path.join(CLEANED, "Compressivedata_cleaned.csv")

    # Leer las primeras filas para detectar estructura real
    header_raw = pd.read_csv(path, header=None, nrows=3)
    # Fila 0: nombres de columnas originales, fila 1: sub-nombres (Axial Force, etc.)
    # Identificar columnas de Axial Force y Axial Displacement desde la fila de subnames
    subnames_row = header_raw.iloc[1].tolist()

    try:
        col_force = subnames_row.index("Axial Force")
        col_disp  = subnames_row.index("Axial Displacement")
    except ValueError:
        print("  [SKIP] No se encontraron columnas de fuerza/desplazamiento en Compressivedata.")
        return

    # Cargar con nombres de columna según índice, saltar 2 filas de encabezado
    df = pd.read_csv(path, skiprows=2, header=None, usecols=[col_force, col_disp],
                     names=["force", "displacement"], low_memory=False)
    df["force"] = pd.to_numeric(df["force"], errors="coerce")
    df["displacement"] = pd.to_numeric(df["displacement"], errors="coerce")
    df = df.dropna()

    if df.empty:
        print("  [SKIP] Compressivedata vacío tras parseo.")
        return

    # Submuestrear para visualización
    step = max(1, len(df) // 2000)
    df_plot = df.iloc[::step].sort_values("displacement")

    fig, ax = plt.subplots(figsize=(10, 6))
    fig.suptitle("Curva Compresiva — Fuerza vs Desplazamiento Axial", fontsize=13, fontweight="bold")

    ax.plot(df_plot["displacement"], df_plot["force"],
            color="#58a6ff", linewidth=1.4, alpha=0.9)
    ax.fill_between(df_plot["displacement"], 0, df_plot["force"],
                    color="#58a6ff", alpha=0.08)

    ax.set_xlabel("Desplazamiento Axial (mm)")
    ax.set_ylabel("Fuerza Axial (N)")
    ax.grid(True)
    fig.tight_layout()
    _save(fig, "compressive_force_displacement.png")


# ─── Entrypoint ───────────────────────────────────────────────────────────────
def run():
    print("\n[timeseries] Cargando TensiondataA...")
    df_A = load_tensionA()
    print(f"[timeseries] TensiondataA: {len(df_A)} filas, {df_A['probeta'].nunique()} probetas.")

    print("[timeseries] Cargando TensiondataB...")
    df_B = load_tensionB()
    if df_B is not None:
        print(f"[timeseries] TensiondataB: {len(df_B)} filas.")

    print("[timeseries] Generando gráficos...")
    plot_stress_strain_A(df_A)
    plot_force_displacement_A(df_A)
    plot_AB_comparison(df_A, df_B)
    plot_compressive_curve()
    print("[timeseries] Listo.\n")


if __name__ == "__main__":
    run()
