import json
from pathlib import Path
from src.utils import write_md, write_json, md_table


def _load_json(path):
    p = Path(path)
    if p.exists():
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    return {}


def export_audit_results(candidates, target_results, pipeline_trace, profiles,
                          compatibility, candidate_summaries, comparison,
                          decision, reports_dir, artifacts_dir, logger):
    logger.info("=== Exportando reportes y artefactos ===")

    _write_discovery_audit(candidates, profiles, reports_dir)
    _write_target_mapping_audit(target_results, reports_dir)
    _write_inclusion_exclusion_report(pipeline_trace, candidates, reports_dir)
    _write_compatibility_audit(profiles, compatibility, reports_dir)
    _write_final_decision(decision, candidate_summaries, comparison, reports_dir)

    write_json(f"{artifacts_dir}/dataset_profiles/profiles_export.json", profiles)
    write_json(f"{artifacts_dir}/compatibility_tables/compatibility_export.json", compatibility)

    logger.info("  Todos los reportes y artefactos exportados.")


def _write_discovery_audit(candidates, profiles, reports_dir):
    lines = ["# Auditoría de Descubrimiento de Datasets\n"]
    lines.append("Esta fase inventaría todos los datasets limpios disponibles en disco.\n")

    headers = ["Dataset", "Filas (aprox)", "Columnas", "Tipo de Ensayo", "Value Score", "Reliability", "Tabular"]
    rows = []
    for name, info in candidates.items():
        rows.append([
            name,
            info.get("rows_approx", "?"),
            info.get("n_columns", "?"),
            info.get("test_type", "?"),
            info.get("value_score", "?"),
            info.get("reliability_score", "?"),
            str(info.get("is_tabular", False)),
        ])
    lines.append(md_table(headers, rows))
    lines.append("\n\n## Columnas por Dataset\n")
    for name, info in candidates.items():
        lines.append(f"\n### {name}\n")
        cols = info.get("columns", [])
        lines.append(", ".join(f"`{c}`" for c in cols[:30]))
        if len(cols) > 30:
            lines.append(f" ... y {len(cols) - 30} más.")

    lines.append("\n\n## Observaciones clave\n")
    for name, p in profiles.items():
        lines.append(f"- **{name}**: {p.get('null_pct', '?')}% nulls | "
                     f"timeseries={p.get('is_high_frequency_timeseries', '?')} | "
                     f"compatibilidad={p.get('compatibility_verdict', '?')}")

    write_md(f"{reports_dir}/discovery_audit.md", "\n".join(lines))


def _write_target_mapping_audit(target_results, reports_dir):
    lines = ["# Auditoría de Mapeo del Target `compressive_strength`\n"]
    lines.append(
        "Para cada dataset se determina si `compressive_strength` existe directamente, "
        "como sinónimo técnicamente válido, como derivación legítima, o no existe.\n"
    )

    verdicts = {"direct_target": [], "safely_derived_target": [], "no_valid_target": []}
    for name, r in target_results.items():
        verdicts[r.get("verdict", "no_valid_target")].append(name)

    for verdict_key, label in [
        ("direct_target", "✅ Target Directo"),
        ("safely_derived_target", "⚠️ Target Derivado con Validez Técnica"),
        ("no_valid_target", "❌ Sin Target Válido"),
    ]:
        lines.append(f"\n## {label}\n")
        for name in verdicts[verdict_key]:
            r = target_results[name]
            lines.append(f"### {name}\n")
            lines.append(f"- **Veredicto**: `{r.get('verdict')}`")
            lines.append(f"- **Razón**: {r.get('verdict_reason')}")
            lines.append(f"- **Columna directa encontrada**: `{r.get('direct_target_col') or 'ninguna'}`")
            lines.append(f"- **Sinónimo encontrado**: `{r.get('synonym_target_col') or 'ninguno'}`")
            lines.append(f"- **Derivación posible**: {r.get('derivable', False)}")
            if r.get("derivation_note"):
                lines.append(f"- **Nota de derivación**: {r.get('derivation_note')}")
            lines.append("")

    write_md(f"{reports_dir}/target_mapping_audit.md", "\n".join(lines))


def _write_inclusion_exclusion_report(pipeline_trace, candidates, reports_dir):
    lines = ["# Reporte de Inclusión/Exclusión — Diagnóstico de la Pipeline Previa\n"]
    lines.append(
        "Este reporte diagnostica con exactitud por qué la pipeline anterior solo procesó "
        "`data.csv` (50 filas) a pesar de haber descubierto 6 datasets válidos.\n"
    )

    lines.append("## Resumen del problema\n")
    lines.append(
        "La pipeline previa aplicó una cadena de filtros incorrectamente calibrados que "
        "descartó datasets válidos o los incluyó con un target equivocado. "
        "Los 5 puntos de fallo se detallan por dataset a continuación.\n"
    )

    headers = ["Dataset", "Stage", "Resultado", "Razón principal"]
    rows = []
    for name, trace in pipeline_trace.items():
        s1 = trace.get("pipeline_stage1_decision", {})
        s2 = trace.get("pipeline_stage2_decision", {})
        final = trace.get("final_pipeline_outcome", "UNKNOWN")

        if final == "EXCLUDED":
            reasons_all = s1.get("reasons", []) + s2.get("reasons", [])
            primary_reason = reasons_all[0] if reasons_all else "desconocida"
            stage = s1.get("stage", "select_model_data")
        else:
            primary_reason = "N/A — pasó todos los filtros"
            stage = "validate_experimental_compatibility"

        rows.append([name, stage, final, primary_reason[:90]])
    lines.append(md_table(headers, rows))

    lines.append("\n\n## Diagnóstico por dataset\n")
    for name, trace in pipeline_trace.items():
        lines.append(f"\n### {name}\n")
        s1 = trace.get("pipeline_stage1_decision", {})
        s2 = trace.get("pipeline_stage2_decision", {})
        header_issue = trace.get("csv_header_issue_detected", False)

        lines.append(f"- **Outcome final**: `{trace.get('final_pipeline_outcome')}`")
        lines.append(f"- **Scores en registry**: value={s1.get('value_score')} | reliability={s1.get('reliability_score')}")
        lines.append(f"- **Target encontrado en primeras 100 filas**: {s1.get('found_targets', [])}")
        lines.append(f"- **Problema de encabezado CSV multi-fila**: {header_issue}")

        for r in s1.get("reasons", []) + s2.get("reasons", []):
            lines.append(f"  - {r}")

    lines.append("\n\n## Causa raíz identificada\n")
    lines.append("""
Los 5 fallos encadenados de la pipeline previa:

1. **`Propiedades_Extraidas.csv`**: Excluida en `select_model_data.py` porque `reliability_score=low_reliability`. Regla ciega: no evalúa si el dataset tiene el único compressive data válido disponible.

2. **`TensiondataA.csv`**: Excluida por `reliability_score=low_reliability`. Esta evaluación fue asignada manualmente en el registry sin justificación sólida para excluirla de todas las fases.

3. **`Compressivedata.csv`**: Tiene `reliability_score=medium_reliability` (pasa stage 1), pero su CSV tiene un encabezado de 2 filas. Las primeras 100 filas que lee `select_model_data` contienen los sub-headers como datos, no las columnas reales. En consecuencia, el nombre de columnas como `stress[mpa]` no aparece en las primeras 100 filas → el target no es detectado → el dataset es **excluido antes de llegar a validate_compatibility**.

4. **`FDM_Dataset.csv`**: Tiene parámetros de proceso pero ninguna columna de resistencia mecánica. Excluido correctamente, ya que no tiene target directo ni sinónimo.

5. **`TensiondataB.csv`**: Tiene `reliability_score=high_reliability` y pasa stage 1 (detecta columnas de tensión). Pero en `validate_experimental_compatibility`, la condición `"Tension" in name` la **excluye directamente** por nombre, sin verificar si tiene datos de compresión embebidos. Exclusión por string matching, no por análisis real del contenido.

**Consecuencia**: Solo `data.csv` pasó todos los filtros — no porque sea el mejor dataset para el target, sino porque es el único que no activa ninguna regla de exclusión ciega y tiene la palabra `strenght` en sus columnas (mapeada como sinónimo de `compressive_strength`). El resultado es 50 filas de datos de **tracción** mislabeled como `compressive_strength`.
""")

    write_md(f"{reports_dir}/inclusion_exclusion_report.md", "\n".join(lines))


def _write_compatibility_audit(profiles, compatibility, reports_dir):
    lines = ["# Auditoría de Compatibilidad Experimental\n"]
    lines.append(
        "Evaluación dataset por dataset de si es experimentalmente compatible "
        "con un modelo de regresión cuyo target es `compressive_strength`.\n"
    )

    for verdict, label in [
        ("compatible", "✅ Compatible"),
        ("compatible_with_caution", "⚠️ Compatible con Cautela"),
        ("incompatible", "❌ Incompatible"),
    ]:
        lines.append(f"\n## {label}\n")
        for name, c in compatibility.items():
            if c.get("verdict") == verdict:
                p = profiles.get(name, {})
                lines.append(f"### {name}\n")
                lines.append(f"- **Tipo de ensayo**: `{p.get('test_type', '?')}`")
                lines.append(f"- **Filas**: ~{p.get('rows_approx', '?')} | **Columnas**: {p.get('n_columns', '?')}")
                lines.append(f"- **Timeseries alta frecuencia**: {p.get('is_high_frequency_timeseries', '?')}")
                lines.append(f"- **Nulls**: {p.get('null_pct', '?')}%")
                for r in c.get("reasons", []):
                    lines.append(f"- {r}")
                lines.append("")

    write_md(f"{reports_dir}/compatibility_audit.md", "\n".join(lines))


def _write_final_decision(decision, candidate_summaries, comparison, reports_dir):
    lines = ["# Decisión Final — Dataset de Modelado para `compressive_strength`\n"]

    if decision.get("block_modeling"):
        lines.append("> [!CAUTION]")
        lines.append(f"> **MODELADO BLOQUEADO**: {decision.get('block_reason')}\n")

    rec = decision.get("recommended_dataset")
    lines.append(f"\n## Dataset recomendado: `{rec or 'ninguno'}`\n")
    if rec:
        s = candidate_summaries.get(rec, {})
        lines.append(f"- **Filas**: {s.get('rows', '?')}")
        lines.append(f"- **Target**: {s.get('target', '?')}")
        lines.append(f"- **Origen del target**: {s.get('target_origin', '?')}")
        lines.append(f"- **Tarea de modelado**: {decision.get('recommended_modeling_task', '?')}")
        lines.append(f"\n### Advertencias del dataset recomendado\n")
        for w in s.get("warnings", []):
            lines.append(f"- ⚠️ {w}")

    lines.append(f"\n## Datasets rechazados\n")
    for rej in decision.get("datasets_rejected", []):
        lines.append(f"### {rej['dataset']}")
        for r in rej.get("reasons", []):
            lines.append(f"- {r}")
        lines.append("")

    lines.append(f"\n## Limitaciones abiertas\n")
    for lim in decision.get("open_limitations", []):
        lines.append(f"- {lim}")

    lines.append(f"\n## Siguiente paso correcto\n")
    lines.append(decision.get("next_step", "No definido."))

    lines.append("\n\n## Tabla comparativa de candidatos\n")
    headers = ["Dataset candidato", "Filas", "Features", "Target correcto", "Viabilidad"]
    rows = []
    for k, v in comparison.items():
        sc = v["scoring"]
        rows.append([
            k,
            sc.get("rows", "?"),
            sc.get("n_useful_features", "?"),
            sc.get("target_correctness", "?"),
            sc.get("viability_rating", "?"),
        ])
    lines.append(md_table(headers, rows))

    write_md(f"{reports_dir}/final_dataset_decision.md", "\n".join(lines))
