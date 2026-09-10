import os
from PIL import Image
import pytesseract

def extract_text(path: str) -> str:
    if os.getenv("OCR_ENABLED", "false").lower() != "true":
        return ""
    try:
        return pytesseract.image_to_string(Image.open(path), lang="eng+fra")
    except Exception:
        return ""

def candidate_lines(text: str):
    return [x.strip() for x in text.splitlines() if x.strip()]
