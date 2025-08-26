import uuid
import faiss
import os
from typing import Dict, List, Optional
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore

# -------------------------------
# Global in-memory stores
# -------------------------------
vectorstores: Dict[str, FAISS] = {}
metadata_store: Dict[str, List[Dict]] = {}

# -------------------------------
# Load embeddings once (global)
# -------------------------------
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
EMB_DIM = 768  # fixed dimension for all-mpnet-base-v2

# -------------------------------
# Vectorstore creation
# -------------------------------
def get_or_create_vectorstore(namespace: str) -> FAISS:
    if namespace in vectorstores:
        return vectorstores[namespace]
    
    index = faiss.IndexFlatL2(EMB_DIM)
    vectorstore = FAISS(
        embedding_function=embeddings,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )
    vectorstores[namespace] = vectorstore
    metadata_store[namespace] = []
    return vectorstore

# -------------------------------
# File ingestion
# -------------------------------
def ingest_file_to_faiss(path: str, namespace: Optional[str] = "default", source_name: Optional[str] = None) -> Dict:
    from .file_utils import load_file_text
    from .text_utils import chunk_text

    base_name = os.path.basename(path)
    if not source_name:
        name, ext = os.path.splitext(base_name)
        source_name = f"{name}_{str(uuid.uuid4())}{ext}"

    text = load_file_text(path)
    if not text.strip():
        raise ValueError("No text extracted from file.")

    # Split text into chunks
    chunks = chunk_text(text)
    ids = [str(uuid.uuid4()) for _ in chunks]

    # Add to vectorstore
    vectorstore = get_or_create_vectorstore(namespace)
    metadatas = [{"source": source_name, "chunk_index": i} for i in range(len(chunks))]
    
    # Add all chunks in batch
    vectorstore.add_texts(chunks, metadatas=metadatas, ids=ids)
    metadata_store[namespace].extend(metadatas)
    
    return {"namespace": namespace, "source": source_name, "chunks": len(chunks), "ids_added": len(ids)}   