from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import tempfile
import json
from datetime import datetime

from demo_provider import DemoProvider
from ocr import extract_text, candidate_lines
from model import analyze

BASE = Path(__file__).resolve().parent
DB = BASE / "data" / "history.json"

app = FastAPI(title="FOOT PREDICT ANALYZER")

# Les fichiers du dépôt servent aussi de fichiers statiques
app.mount("/static", StaticFiles(directory=BASE), name="static")

provider = DemoProvider()


def save_history(item: dict):
    DB.parent.mkdir(parents=True, exist_ok=True)

    records = []

    if DB.exists():
        try:
            records = json.loads(DB.read_text(encoding="utf-8"))
        except Exception:
            records = []

    item["saved_at"] = datetime.utcnow().isoformat() + "Z"

    records.insert(0, item)

    DB.write_text(
        json.dumps(records[:100], ensure_ascii=False, indent=2),
        encoding="utf-8"
    )


def get_history():
    if not DB.exists():
        return []

    try:
        return json.loads(DB.read_text(encoding="utf-8"))
    except Exception:
        return []


@app.get("/")
def home():
    return FileResponse(BASE / "index.html")


@app.get("/api/history")
def history():
    return get_history()


@app.post("/api/read-capture")
async def read_capture(screenshot: UploadFile = File(...)):

    suffix = Path(
        screenshot.filename or "capture.png"
    ).suffix or ".png"

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as f:

        f.write(await screenshot.read())
        path = f.name

    text = extract_text(path)

    return {
        "filename": screenshot.filename,
        "ocr_text": text,
        "candidate_lines": candidate_lines(text)[:20],
        "note": "Confirmez toujours les équipes avant l'analyse."
    }


@app.post("/api/analyze")
async def api_analyze(

    home: str = Form(...),
    away: str = Form(...),
    competition: str = Form(""),

):

    raw = await provider.get_match_context(
        home,
        away,
        competition
    )

    result = analyze(
        raw,
        home,
        away
    )

    payload = {

        "match": {
            "home": home,
            "away": away,
            "competition": competition or "Non précisée"
        },

        "provider_data": raw,

        "analysis": result,

        "sources": [

            {
                "name": "Adaptateur de données",
                "status": "Architecture prête pour API autorisées"
            },

            {
                "name": "OCR / capture",
                "status": "Module optionnel"
            },

            {
                "name": "Moteur statistique",
                "status": "Poisson + pondération"
            }

        ],

        "disclaimer":
        "Les résultats sont des estimations probabilistes et non des garanties."

    }

    save_history(payload)

    return payload
