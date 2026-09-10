from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import tempfile

from .providers.demo_provider import DemoProvider
from .services.ocr import extract_text, candidate_lines
from .services.model import analyze
from .services.history import save, list_history

BASE = Path(__file__).resolve().parent.parent
app = FastAPI(title="FOOT PREDICT ANALYZER Advanced")
app.mount("/static", StaticFiles(directory=BASE/"static"), name="static")

provider = DemoProvider()

@app.get("/")
def home():
    return FileResponse(BASE/"static"/"index.html")

@app.get("/api/history")
def history():
    return list_history()

@app.post("/api/read-capture")
async def read_capture(screenshot: UploadFile = File(...)):
    suffix = Path(screenshot.filename or "capture.png").suffix or ".png"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as f:
        f.write(await screenshot.read())
        path = f.name
    text = extract_text(path)
    return {
        "filename": screenshot.filename,
        "ocr_text": text,
        "candidate_lines": candidate_lines(text)[:20],
        "note": "L'OCR est optionnel. Confirmez toujours les équipes avant l'analyse."
    }

@app.post("/api/analyze")
async def api_analyze(
    home: str = Form(...),
    away: str = Form(...),
    competition: str = Form(""),
):
    raw = await provider.get_match_context(home, away, competition)
    result = analyze(raw, home, away)
    payload = {
        "match": {"home":home, "away":away, "competition":competition or "Non précisée"},
        "provider_data": raw,
        "analysis": result,
        "sources": [
            {"name":"Adaptateur de données", "status":"Architecture prête pour API autorisées"},
            {"name":"OCR / capture", "status":"Module optionnel avec confirmation utilisateur"},
            {"name":"Moteur statistique", "status":"Poisson + pondération calibrable"},
        ],
        "disclaimer":"Les résultats sont des estimations probabilistes. Ils ne constituent pas une certitude ni une garantie."
    }
    save(payload)
    return payload
