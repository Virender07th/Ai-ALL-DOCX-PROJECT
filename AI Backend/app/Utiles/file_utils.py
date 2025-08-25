import os
import uuid
import tempfile
import fitz  # PyMuPDF
from unstructured.partition.docx import partition_docx
from unstructured.partition.pptx import partition_pptx
from unstructured.partition.text import partition_text
from unstructured.partition.csv import partition_csv
from unstructured.partition.html import partition_html

from app.Tools.URLTOOL.ArticleExtractor import extract_article_from_url

# --- Save upload file temporarily ---
def save_uploadfile_temp(upload_file) -> str:
    MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 5 MB
    content = upload_file.file.read()
    size = len(content)

    if size == 0:
        raise ValueError("Uploaded file is empty.")
    if size > MAX_UPLOAD_SIZE:
        raise ValueError("Uploaded file exceeds 5 MB size limit.")

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
    return "\n\n".join(texts)

# --- Extract text from other formats ---
def extract_text_unstructured(path: str, ext: str) -> str:
    if ext == ".docx":
        elements = partition_docx(filename=path)
    elif ext == ".pptx":
        elements = partition_pptx(filename=path)
    elif ext in [".txt", ".md"]:
        elements = partition_text(filename=path)
    elif ext == ".csv":
        elements = partition_csv(filename=path)
    elif ext in [".html", ".htm"]:
        elements = partition_html(filename=path)
    else:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    text = "\n\n".join(el.text for el in elements if el.text)
    return text

def load_file_text(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(path)
    return extract_text_unstructured(path, ext)

def extract_article_text(url: str) -> str:
    return extract_article_from_url(url)
