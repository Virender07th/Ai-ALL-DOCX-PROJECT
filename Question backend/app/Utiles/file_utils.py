import os
import uuid
import tempfile
import logging
import fitz  # PyMuPDF

from app.Tools.URLTOOL.ArticleExtractor import extract_article_from_url

try:
    from pdf2image import convert_from_path
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False


# --- Save upload file temporarily ---
def save_uploadfile_temp(upload_file) -> str:
    MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50 MB actually (fix comment)
    content = upload_file.file.read()
    size = len(content)

    if size == 0:
        raise ValueError("Uploaded file is empty.")
    if size > MAX_UPLOAD_SIZE:
        raise ValueError("Uploaded file exceeds 50 MB size limit.")

    suffix = os.path.splitext(upload_file.filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp.flush()
        temp_path = tmp.name

    upload_file.file.seek(0)
    return temp_path

# --- Extract text from PDF ---
def extract_text_from_pdf(path: str) -> str:
    doc = fitz.open(path)
    texts = [page.get_text() for page in doc if page.get_text()]

    if texts:
        return "\n\n".join(texts)

    # Fallback to OCR
    if OCR_AVAILABLE:
        images = convert_from_path(path)
        ocr_texts = [pytesseract.image_to_string(img) for img in images]
        combined = "\n\n".join(t for t in ocr_texts if t.strip())
        return combined
    return "" 

def load_file_text(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    return extract_text_from_pdf(path)


def extract_article_text(url: str) -> str:
    return extract_article_from_url(url)
