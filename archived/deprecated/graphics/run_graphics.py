"""
run_graphics.py
---------------
Runner principal de la capa de visualización.
Ejecuta todos los módulos de graphics/src/ en orden y reporta el estado final.

Uso:
    python graphics/run_graphics.py [módulo]

    Opciones:
        (sin argumento)     → ejecuta todos los módulos
        process             → solo plot_process_params
        mechanical          → solo plot_mechanical_props
        timeseries          → solo plot_timeseries
        summary             → solo plot_summary

Ejemplo:
    python graphics/run_graphics.py
    python graphics/run_graphics.py timeseries
"""

import sys
import os
import time

# Agregar graphics/src al path
GRAPHICS_SRC = os.path.join(os.path.dirname(__file__), "src")
sys.path.insert(0, GRAPHICS_SRC)


def run_module(name, module):
    print(f"\n{'─' * 60}")
    print(f"  Módulo: {name}")
    print(f"{'─' * 60}")
    t0 = time.time()
    try:
        module.run()
        elapsed = time.time() - t0
        print(f"  → Completado en {elapsed:.1f}s")
        return True
    except Exception as e:
        print(f"  [ERROR] {name}: {e}")
        return False


def main():
    target = sys.argv[1].lower() if len(sys.argv) > 1 else "all"

    # Importar módulos solo cuando se necesiten
    import importlib
    modules_map = {
        "process":    "plot_process_params",
        "mechanical": "plot_mechanical_props",
        "timeseries": "plot_timeseries",
        "summary":    "plot_summary",
    }

    if target != "all" and target not in modules_map:
        print(f"Módulo desconocido: '{target}'")
        print(f"Opciones válidas: all, {', '.join(modules_map.keys())}")
        sys.exit(1)

    selected = modules_map if target == "all" else {target: modules_map[target]}

    print("\n" + "═" * 60)
    print("  GRAPHICS LAYER — PLA_3dPrinter_RESISTENCE")
    print("═" * 60)

    results = {}
    t_total = time.time()

    for label, mod_name in selected.items():
        mod = importlib.import_module(mod_name)
        results[label] = run_module(label, mod)

    elapsed_total = time.time() - t_total

    print("\n" + "═" * 60)
    print("  RESUMEN")
    print("═" * 60)
    for label, ok in results.items():
        status = "✓ OK" if ok else "✗ ERROR"
        print(f"  {status}  {label}")
    print(f"\n  Tiempo total: {elapsed_total:.1f}s")
    print("═" * 60 + "\n")


if __name__ == "__main__":
    main()
