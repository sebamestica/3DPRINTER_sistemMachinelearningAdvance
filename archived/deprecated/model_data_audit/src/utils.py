import json
import logging
import os
from pathlib import Path


def get_project_root():
    return Path(__file__).resolve().parent.parent.parent


def get_cleaned_dir():
    return get_project_root() / "Normalization" / "cleaned"


def get_registry_path():
    return get_project_root() / "Normalization" / "config" / "file_registry.json"


def get_pipeline_target_config():
    p = get_project_root() / "model_pipeline" / "config" / "target_config.json"
    if p.exists():
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    return {}


def setup_logger(log_path):
    log_path = Path(log_path)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger("model_data_audit")
    logger.setLevel(logging.DEBUG)
    if not logger.handlers:
        fmt = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
        fh = logging.FileHandler(log_path, encoding="utf-8")
        fh.setFormatter(fmt)
        ch = logging.StreamHandler()
        ch.setFormatter(fmt)
        logger.addHandler(fh)
        logger.addHandler(ch)
    return logger


def write_md(path, content):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)


def write_json(path, data):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)


def load_registry():
    p = get_registry_path()
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def md_table(headers, rows):
    sep = "|" + "|".join(["---"] * len(headers)) + "|"
    h = "|" + "|".join(headers) + "|"
    body = "\n".join("|" + "|".join(str(c) for c in row) + "|" for row in rows)
    return "\n".join([h, sep, body])
