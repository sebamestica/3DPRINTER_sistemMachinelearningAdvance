import pandas as pd
from src.utils import write_json


COMPRESSIVE_DIRECT = [
    "compressive_strength",
    "compressive_stress",
    "stress_mpa",
    "stress[mpa]",
    "compressive_load",
]

COMPRESSIVE_SYNONYMS = [
    "max_force",
    "axial_force",
    "force",
    "tension_strenght",
    "tension_strength",
]

DERIVABLE_FROM = [
    ("max_force", "transverse_area"),
    ("axial_force", "transverse_area"),
    ("max_force", "area_calc"),
]

STRICTLY_INCOMPATIBLE = [
    "elongation",
    "strainext",
    "maxstrainext",
]


def _load_columns_and_sample(path, nrows=200):
    try:
        df = pd.read_csv(path, nrows=nrows, low_memory=False)
        return df
    except Exception:
        return pd.DataFrame()


def _col_match(col, candidates):
    c = col.lower().replace(" ", "_").replace("[", "").replace("]", "").replace("/", "_")
    for cand in candidates:
        norm = cand.lower().replace(" ", "_").replace("[", "").replace("]", "").replace("/", "_")
        if norm in c or c in norm:
            return cand
    return None


def inspect_targets(candidates, logger, artifacts_dir):
    logger.info("=== FASE 2: Auditoría del target compressive_strength ===")

    results = {}

    for name, info in candidates.items():
        path = info["cleaned_path"]
        df = _load_columns_and_sample(path)
        cols_raw = list(df.columns)
        cols_norm = [c.lower().strip() for c in cols_raw]

        direct = None
        synonym = None
        derivable = False
        derivation_note = ""
        incompatible_only = False
        verdict = None
        verdict_reason = ""

        for col in cols_raw:
            m = _col_match(col, COMPRESSIVE_DIRECT)
            if m:
                direct = col
                break

        if not direct:
            for col in cols_raw:
                m = _col_match(col, COMPRESSIVE_SYNONYMS)
                if m:
                    test_type = info.get("test_type", "")
                    if test_type in ("compressive", "process_parameters", "unknown"):
                        synonym = col
                        break
                    elif test_type in ("tension", "tension_summary", "tension_or_both"):
                        synonym = col
                        break

        for force_col, area_col in DERIVABLE_FROM:
            fc_found = any(_col_match(c, [force_col]) for c in cols_raw)
            ac_found = any(_col_match(c, [area_col]) for c in cols_raw)
            if fc_found and ac_found:
                derivable = True
                derivation_note = f"Derivable via ({force_col} / {area_col})"
                break

        if direct:
            verdict = "direct_target"
            verdict_reason = f"Columna '{direct}' mapea directamente a compressive_strength."
        elif synonym:
            test_type = info.get("test_type", "")
            if test_type == "compressive":
                verdict = "safely_derived_target"
                verdict_reason = (
                    f"Columna '{synonym}' es sinónimo válido en contexto compresivo. "
                    f"Renombrar a compressive_strength es técnicamente correcto."
                )
            elif test_type in ("tension", "tension_summary"):
                verdict = "no_valid_target"
                verdict_reason = (
                    f"Columna '{synonym}' mide resistencia a tracción, no compresión. "
                    f"Usarla como compressive_strength sería una confusión de ensayo."
                )
            elif test_type == "process_parameters":
                verdict = "safely_derived_target"
                verdict_reason = (
                    f"Columna '{synonym}' en dataset de parámetros de proceso puede "
                    f"representar resistencia mecánica resultado del proceso. Incluible con cautela."
                )
            elif test_type == "tension_or_both":
                verdict = "no_valid_target"
                verdict_reason = (
                    f"Dataset mezcla ensayos de tracción. '{synonym}' no puede asumir "
                    f"representar compresión sin separación explícita."
                )
            else:
                verdict = "no_valid_target"
                verdict_reason = f"Sinónimo '{synonym}' encontrado pero tipo de ensayo desconocido."
        elif derivable:
            if info.get("test_type") == "compressive":
                verdict = "safely_derived_target"
                verdict_reason = (
                    f"{derivation_note}. Derivación mecánicamente válida "
                    f"solo si area y fuerza son del mismo ensayo compresivo."
                )
            else:
                verdict = "no_valid_target"
                verdict_reason = (
                    f"{derivation_note} pero el tipo de ensayo no es compresivo, "
                    f"derivar sería técnicamente incorrecto."
                )
        else:
            verdict = "no_valid_target"
            verdict_reason = "Sin target directo, sinónimo aplicable ni derivación técnicamente válida."

        results[name] = {
            "direct_target_col": direct,
            "synonym_target_col": synonym,
            "derivable": derivable,
            "derivation_note": derivation_note,
            "test_type": info.get("test_type"),
            "verdict": verdict,
            "verdict_reason": verdict_reason,
            "columns_found": cols_raw,
        }
        logger.info(f"  {name}: verdict={verdict} | reason={verdict_reason[:80]}")

    write_json(f"{artifacts_dir}/candidate_targets/target_mapping.json", results)
    return results
