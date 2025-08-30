# import os
# import uuid
# import tempfile
# from typing import Optional, List, Dict
# import fitz  # PyMuPDF
# from dotenv import load_dotenv

# # Unstructured loaders
# from unstructured.partition.docx import partition_docx
# from unstructured.partition.pptx import partition_pptx
# from unstructured.partition.text import partition_text
# from unstructured.partition.csv import partition_csv
# from unstructured.partition.html import partition_html

# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_groq import ChatGroq

# import faiss
# from langchain_community.docstore.in_memory import InMemoryDocstore
# from langchain_community.vectorstores import FAISS

# from app.Tools.URLTOOL.ArticleExtractor import extract_article_from_url

# load_dotenv()

# # Config variables
# EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2")
# GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")
# GROQ_TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", "0.1"))

# # Initialize embeddings and LLM
# embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
# llm = ChatGroq(model=GROQ_MODEL, temperature=GROQ_TEMPERATURE)

# # Global in-memory vector store and metadata (namespace keyed)
# vectorstores: Dict[str, FAISS] = {}
# metadata_store: Dict[str, List[Dict]] = {}

# # --- Text extraction ---
# def extract_text_from_pdf(path: str) -> str:
#     doc = fitz.open(path)
#     texts = [page.get_text() for page in doc if page.get_text()]
#     return "\n\n".join(texts)

# def extract_text_unstructured(path: str, ext: str) -> str:
#     if ext == ".docx":
#         elements = partition_docx(filename=path)
#     elif ext == ".pptx":
#         elements = partition_pptx(filename=path)
#     elif ext in [".txt", ".md"]:
#         elements = partition_text(filename=path)
#     elif ext == ".csv":
#         elements = partition_csv(filename=path)
#     elif ext in [".html", ".htm"]:
#         elements = partition_html(filename=path)
#     else:
#         with open(path, "r", encoding="utf-8", errors="ignore") as f:
#             return f.read()

#     text = "\n\n".join(el.text for el in elements if el.text)
#     return text

# def load_file_text(path: str) -> str:
#     ext = os.path.splitext(path)[1].lower()
#     if ext == ".pdf":
#         return extract_text_from_pdf(path)
#     else:
#         return extract_text_unstructured(path, ext)

# # --- Chunk text ---
# def chunk_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
#     splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
#     return splitter.split_text(text)

# # --- Create or get FAISS vector store for a namespace ---
# def get_or_create_vectorstore(namespace: str) -> FAISS:
#     if namespace in vectorstores:
#         return vectorstores[namespace]

#     # Create empty FAISS index with correct dimension
#     emb_dim = len(embeddings.embed_query("hello world"))
#     index = faiss.IndexFlatL2(emb_dim)

#     vectorstore = FAISS(
#         embedding_function=embeddings,
#         index=index,
#         docstore=InMemoryDocstore(),
#         index_to_docstore_id={},
#     )
#     vectorstores[namespace] = vectorstore
#     metadata_store[namespace] = []
#     return vectorstore

# # --- Ingest file to FAISS ---
# def ingest_file_to_faiss(path: str, namespace: Optional[str] = "default", source_name: Optional[str] = None) -> Dict:
#     base_name = os.path.basename(path)
#     if not source_name:
#         name, ext = os.path.splitext(base_name)
#         source_name = f"{name}_{str(uuid.uuid4())}{ext}"

#     text = load_file_text(path)
#     if not text.strip():
#         raise ValueError("No text extracted from file.")

#     chunks = chunk_text(text)
#     ids = [str(uuid.uuid4()) for _ in chunks]

#     vectorstore = get_or_create_vectorstore(namespace)

#     # Add texts + metadata to FAISS
#     metadatas = [{"source": source_name, "chunk_index": i} for i in range(len(chunks))]
#     vectorstore.add_texts(chunks, metadatas=metadatas, ids=ids)

#     # Store metadata locally
#     metadata_store[namespace].extend(metadatas)

#     return {"namespace": namespace, "source": source_name, "chunks": len(chunks), "ids_added": len(ids)}

# # --- Chat with ingested docs ---
# def chat_with_docs(topic: str, namespace: str = "default", top_k: int = 4, include_sources: bool = False) -> Dict:
#     if namespace not in vectorstores:
#         raise ValueError(f"No vectorstore found for namespace '{namespace}'. Please ingest documents first.")

#     vectorstore = vectorstores[namespace]

#     results = vectorstore.similarity_search(topic, k=top_k)

#     sources = []
#     for i, doc in enumerate(results):
#         meta = doc.metadata if hasattr(doc, 'metadata') else {}
#         sources.append({
#             "text": doc.page_content,
#             "metadata": meta,
#             "score": None,  # FAISS wrapper does not provide distance by default
#         })

#     context = "\n\n---\n\n".join(
#         f"Source: {src['metadata'].get('source', 'unknown')}\n\n{src['text']}" for src in sources
#     )

#     prompt_template = ChatPromptTemplate.from_template(
#         """
#         You are an expert assistant. Use the provided context from the document to answer the question accurately.

#         First, provide an answer strictly based on the information available in the context below. 
#         If the context does not contain enough information, clearly mention that the answer is based only on the available context.

#         Then, provide a full, comprehensive answer by including relevant additional knowledge, explanations, examples, or opinions beyond the context.

#         <context>
#         {context}
#         </context>

#         Question: {input}

#         Answer strictly from the context:
#         """ + "\n\n" + """
#         Full, detailed answer with additional insights:
#         """
#     )

#     formatted_prompt = prompt_template.format_prompt(context=context, input=topic)
#     prompt_str = formatted_prompt.to_string()

#     llm_response = llm.invoke(prompt_str)
#     answer = getattr(llm_response, "content", llm_response)
#     if isinstance(answer, dict):
#         answer = answer.get("text") or str(answer)

#     output = {"answer": answer}
#     if include_sources:
#         output["sources"] = sources
#     return output

# # --- Chat with URL content on the fly (in-memory only) ---
# def chat_with_url(topic: str, url: str, top_k: int = 4, include_sources: bool = False) -> Dict:
#     article_text = extract_article_from_url(url)
#     if article_text.startswith("Error"):
#         raise ValueError(article_text)

#     chunks = chunk_text(article_text)
#     ids = [str(uuid.uuid4()) for _ in chunks]
#     metadatas = [{"source": url, "chunk_index": i} for i in range(len(chunks))]

#     # Create temporary FAISS index for this query
#     emb_dim = len(embeddings.embed_query("hello world"))
#     index = faiss.IndexFlatL2(emb_dim)
#     temp_vectorstore = FAISS(
#         embedding_function=embeddings,
#         index=index,
#         docstore=InMemoryDocstore(),
#         index_to_docstore_id={},
#     )
#     temp_vectorstore.add_texts(chunks, metadatas=metadatas, ids=ids)

#     results = temp_vectorstore.similarity_search(topic, k=top_k)

#     sources = []
#     for i, doc in enumerate(results):
#         meta = doc.metadata if hasattr(doc, 'metadata') else {}
#         sources.append({
#             "text": doc.page_content,
#             "metadata": meta,
#             "score": None,
#         })

#     context = "\n\n---\n\n".join(
#         f"Source: {src['metadata'].get('source', 'unknown')}\n\n{src['text']}" for src in sources
#     )

#     prompt = (
#         "You are an expert assistant answering questions using the provided context.\n\n"
#         f"Context:\n{context}\n\n"
#         f"User question: {topic}\n\n"
#         "Instructions:\n"
#         "- Use the context to answer. If not in context, answer based on knowledge and note context missing.\n"
#         "- Provide a concise answer (5-8 sentences) and brief explanation.\n"
#         "- List sources at the end.\n\n"
#         "Answer:\n"
#     )

#     llm_response = llm.invoke(prompt)
#     answer = getattr(llm_response, "content", llm_response)
#     if isinstance(answer, dict):
#         answer = answer.get("text") or str(answer)

#     output = {"answer": answer}
#     if include_sources:
#         output["sources"] = sources
#     return output

# # --- Save UploadFile to temp ---
# def save_uploadfile_temp(upload_file) -> str:
#     MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB in bytes

#     # Read file content in memory for size check
#     content = upload_file.file.read()
#     size = len(content)

#     if size == 0:
#         raise ValueError("Uploaded file is empty.")

#     if size > MAX_UPLOAD_SIZE:
#         raise ValueError("Uploaded file exceeds 5 MB size limit.")

#     suffix = os.path.splitext(upload_file.filename)[1]

#     # Write content to temp file
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         tmp.write(content)
#         tmp.flush()
#         temp_path = tmp.name

#     # Reset upload_file.file cursor so it can be read again later if needed
#     upload_file.file.seek(0)

#     return temp_path



from app.Utiles.vectorstore_utils import ingest_file_to_faiss
from app.Utiles.file_utils import save_uploadfile_temp
from app.Tools.URLTOOL.ArticleExtractor import extract_article_from_url
import os
import uuid
from typing import Dict
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from app.Utiles.vectorstore_utils import vectorstores, embeddings
from app.Utiles.text_utils import chunk_text
from dotenv import load_dotenv
# Load environment
load_dotenv()

llm = ChatGroq(model=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
               temperature=float(os.getenv("GROQ_TEMPERATURE", "0.1")))

def handle_file_upload(upload_file):
    temp_path = save_uploadfile_temp(upload_file)
    result = ingest_file_to_faiss(temp_path, source_name=upload_file.filename)

    if not result:
        raise ValueError("Vectorstore ingestion returned no result")

    return {
        "filename": upload_file.filename,
        "temp_path": temp_path,
        "namespace": "default",
        "chunks": result.get("chunks") if isinstance(result, dict) else None,
        "text_length": result.get("text_length") if isinstance(result, dict) else None
    }


def chat_with_docs(topic: str, namespace: str = "default", top_k: int = 4, include_sources: bool = False) -> Dict:
    if namespace not in vectorstores:
        raise ValueError(f"No vectorstore found for '{namespace}'. Ingest docs first.")
    vectorstore = vectorstores[namespace]
    results = vectorstore.similarity_search(topic, k=top_k)

    sources = [{"text": doc.page_content,
                "metadata": getattr(doc, 'metadata', {}),
                "score": None} for doc in results]

    context = "\n\n---\n\n".join(f"Source: {src['metadata'].get('source','unknown')}\n\n{src['text']}" for src in sources)

    prompt_template = ChatPromptTemplate.from_template(
        """
        You are an expert assistant. Use the provided context to answer the question accurately.

        <context>
        {context}
        </context>

        Question: {input}

        Answer strictly from the context:
        """ + "\n\n" + """
        Full, detailed answer with additional insights:
        """
    )
    formatted_prompt = prompt_template.format_prompt(context=context, input=topic)
    prompt_str = formatted_prompt.to_string()
    llm_response = llm.invoke(prompt_str)
    answer = getattr(llm_response, "content", llm_response)
    if isinstance(answer, dict):
        answer = answer.get("text") or str(answer)

    output = {"answer": answer}
    if include_sources:
        output["sources"] = sources
    return output

def chat_with_url(topic: str, url: str, top_k: int = 4, include_sources: bool = False) -> Dict:
    
    article_text = extract_article_from_url
    
    (url)
    if article_text.startswith("Error"):
        raise ValueError(article_text)

    chunks = chunk_text(article_text)
    ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [{"source": url, "chunk_index": i} for i in range(len(chunks))]

    import faiss
    from langchain_community.vectorstores import FAISS
    from langchain_community.docstore.in_memory import InMemoryDocstore

    emb_dim = len(embeddings.embed_query("hello world"))
    index = faiss.IndexFlatL2(emb_dim)
    temp_vectorstore = FAISS(embedding_function=embeddings, index=index,
                             docstore=InMemoryDocstore(), index_to_docstore_id={})
    temp_vectorstore.add_texts(chunks, metadatas=metadatas, ids=ids)

    results = temp_vectorstore.similarity_search(topic, k=top_k)
    sources = [{"text": doc.page_content,
                "metadata": getattr(doc, 'metadata', {}),
                "score": None} for doc in results]

    context = "\n\n---\n\n".join(f"Source: {src['metadata'].get('source','unknown')}\n\n{src['text']}" for src in sources)
    prompt = (
        f"You are an expert assistant answering questions using the provided context.\n\nContext:\n{context}\n\n"
        f"User question: {topic}\n\nInstructions:\n- Use context to answer; note missing context if needed.\n"
        "- Concise answer (5-8 sentences) and brief explanation.\n- List sources.\n\nAnswer:\n"
    )
    llm_response = llm.invoke(prompt)
    answer = getattr(llm_response, "content", llm_response)
    if isinstance(answer, dict):
        answer = answer.get("text") or str(answer)
    output = {"answer": answer}
    if include_sources:
        output["sources"] = sources
    return output

