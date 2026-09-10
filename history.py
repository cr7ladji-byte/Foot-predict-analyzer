import json
from pathlib import Path
from datetime import datetime

DB = Path(__file__).resolve().parents[2] / "data" / "history.json"

def save(item: dict):
    DB.parent.mkdir(parents=True, exist_ok=True)
    records = []
    if DB.exists():
        try:
            records = json.loads(DB.read_text(encoding="utf-8"))
        except Exception:
            records = []
    item["saved_at"] = datetime.utcnow().isoformat() + "Z"
    records.insert(0, item)
    DB.write_text(json.dumps(records[:100], ensure_ascii=False, indent=2), encoding="utf-8")

def list_history():
    if not DB.exists():
        return []
    try:
        return json.loads(DB.read_text(encoding="utf-8"))
    except Exception:
        return []
