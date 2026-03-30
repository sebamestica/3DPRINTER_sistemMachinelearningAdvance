import os
import shutil
import pandas as pd
from datetime import datetime

# ==========================================
# CONFIGURATION
# ==========================================
SOURCE_ROOT = os.getcwd()
CLEANUP_DIR = os.path.join(SOURCE_ROOT, "project_cleanup")
ARCHIVE_DIR = os.path.join(SOURCE_ROOT, "archived")
REPORTS_DIR = os.path.join(CLEANUP_DIR, "reports")
ARTIFACTS_DIR = os.path.join(CLEANUP_DIR, "artifacts")
LOG_FILE = os.path.join(CLEANUP_DIR, "logs/cleanup.log")

# ==========================================
# CORE AUDIT CLASSIFICATION
# ==========================================
CORE_PIPELINES = [
    "specimen_linkage",
    "model_pipeline",
    "decision_ready",
    "frontend"
]

AUX_MODULES = [
    "normalization",
    "compression_graphics"
]

DEPRECATED_MODULES = [
    "eda",
    "graphics",
    "model_data_audit",
    "model_selection"
]

# ==========================================
# CLEANUP ENGINE
# ==========================================
def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(f"[{datetime.now()}] {msg}\n")
    print(msg)

def scan_project():
    log("Scanning project structure...")
    inventory = []
    for root, dirs, files in os.walk(SOURCE_ROOT):
        # Skip internal folders
        if any(x in root for x in [".git", ".venv", "__pycache__", "node_modules", "project_cleanup", "archived"]):
            continue
            
        for name in files:
            path = os.path.join(root, name)
            rel_path = os.path.relpath(path, SOURCE_ROOT)
            module = rel_path.split(os.sep)[0] if os.sep in rel_path else "root"
            
            classification = "UNKNOWN"
            if module in CORE_PIPELINES: classification = "KEEP (CORE)"
            elif module in AUX_MODULES: classification = "KEEP (AUX)"
            elif module in DEPRECATED_MODULES: classification = "ARCHIVE"
            elif any(x in name for x in [".log", ".tmp", "temp_"]): classification = "DELETE_CANDIDATE"
            
            inventory.append({
                "path": rel_path,
                "module": module,
                "size": os.path.getsize(path),
                "classification": classification
            })
    return pd.DataFrame(inventory)

def execute_reorganization(df):
    log("Executing reorganization and full directory relocation...")
    
    # Create archive folders
    main_folders = ["deprecated", "experiments", "duplicate_outputs", "old_reports", "old_models", "review_needed"]
    for f in main_folders:
        os.makedirs(os.path.join(ARCHIVE_DIR, f), exist_ok=True)
        
    registry = []
    
    # Process DEPRECATED_MODULES entire folders
    for mod in DEPRECATED_MODULES:
        source_dir = os.path.join(SOURCE_ROOT, mod)
        if os.path.exists(source_dir):
            target_dir = os.path.join(ARCHIVE_DIR, "deprecated", mod)
            log(f"Archiving folder: {mod} -> archived/deprecated/{mod}")
            shutil.move(source_dir, target_dir)
            registry.append({"original": mod, "new": f"archived/deprecated/{mod}", "status": "FOLDER_MOVED"})
            
    # Also handle individual files classified as ARCHIVE but not in deprecated modules
    # (Skip files that were already moved because their module was moved)
    archive_files = df[(df['classification'] == "ARCHIVE") & (~df['module'].isin(DEPRECATED_MODULES))]
    for _, row in archive_files.iterrows():
        source = os.path.join(SOURCE_ROOT, row['path'])
        if os.path.exists(source):
            target = os.path.join(ARCHIVE_DIR, "deprecated", row['path'])
            os.makedirs(os.path.dirname(target), exist_ok=True)
            shutil.move(source, target)
            registry.append({"original": row['path'], "new": os.path.relpath(target, SOURCE_ROOT), "status": "FILE_MOVED"})
            
    # Delete candidates - move to review_needed
    del_candidates = df[df['classification'] == "DELETE_CANDIDATE"]
    for _, row in del_candidates.iterrows():
        source = os.path.join(SOURCE_ROOT, row['path'])
        if os.path.exists(source):
            target = os.path.join(ARCHIVE_DIR, "review_needed/trash_bin", row['path'])
            os.makedirs(os.path.dirname(target), exist_ok=True)
            shutil.move(source, target)
            registry.append({"original": row['path'], "new": os.path.relpath(target, SOURCE_ROOT), "status": "REMOVED_TO_REVIEW"})
            
    return pd.DataFrame(registry)

def generate_reports(inventory, registry):
    log("Exporting final reports...")
    inventory.to_csv(os.path.join(ARTIFACTS_DIR, "file_inventory.csv"), index=False)
    registry.to_csv(os.path.join(ARTIFACTS_DIR, "relocation_registry.csv"), index=False)
    
    # Write summary
    summary = f"""# Project Consolidation Summary
    
- Total files scanned: {len(inventory)}
- Files moved to archive: {len(registry)}
- Core modules preserved: {", ".join(CORE_PIPELINES)}
- Aux modules preserved: {", ".join(AUX_MODULES)}
- Modules archived: {", ".join(DEPRECATED_MODULES)}

Cleaning completed successfully.
"""
    with open(os.path.join(REPORTS_DIR, "final_cleanup_summary.md"), "w") as f:
        f.write(summary)

if __name__ == "__main__":
    inv = scan_project()
    reg = execute_reorganization(inv)
    generate_reports(inv, reg)
