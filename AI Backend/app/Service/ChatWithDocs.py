import os
import uuid
from typing import Dict
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from app.Utiles.vectorstore_utils import vectorstores, embeddings
from app.Utiles.text_utils import chunk_text
from app.Utiles.vectorstore_utils import ingest_file_to_faiss , get_or_create_vectorstore
from app.Utiles.file_utils import save_uploadfile_temp
from app.Tools.URLTOOL.ArticleExtractor import extract_article_from_url

load_dotenv()

llm = ChatGroq(model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
               temperature=float(os.getenv("GROQ_TEMPERATURE", "0.3")))

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



def chat_with_url(topic: str, url: str, namespace: str = "url_namespace", top_k: int = 4, include_sources: bool = False) -> Dict:
    # ✅ Extract text from URL
    article_text = extract_article_from_url(url)
    if not isinstance(article_text, str) or not article_text.strip():
        raise ValueError("No article text could be extracted from the provided URL.")
    if article_text.startswith("Error"):
        raise ValueError(article_text)

    # ✅ Chunk text and push into FAISS (under a namespace)
    chunks = chunk_text(article_text)
    ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [{"source": url, "chunk_index": i} for i in range(len(chunks))]

    vectorstore = get_or_create_vectorstore(namespace)
    vectorstore.add_texts(chunks, metadatas=metadatas, ids=ids)

    # ✅ Retrieve most relevant chunks
    results = vectorstore.similarity_search(topic, k=top_k)
    sources = [
        {"text": doc.page_content, "metadata": getattr(doc, "metadata", {}), "score": None}
        for doc in results
    ]

    # ✅ Build context
    context = "\n\n---\n\n".join(
        f"Source: {src['metadata'].get('source','unknown')}\n\n{src['text']}"
        for src in sources
    )

    # ✅ LLM prompt
    prompt = (
        f"You are an expert assistant answering questions using the provided context.\n\n"
        f"<context>\n{context}\n</context>\n\n"
        f"User question: {topic}\n\n"
        "Instructions:\n"
        "- Answer strictly from the given context (mention if context is insufficient).\n"
        "- Provide a clear, detailed answer (5–8 sentences).\n"
        "- Add a short explanation and sources.\n\n"
        "Answer:\n"
    )

    llm_response = llm.invoke(prompt)
    answer = getattr(llm_response, "content", llm_response)
    if isinstance(answer, dict):
        answer = answer.get("text") or str(answer)

    output = {"answer": answer}
    if include_sources:
        output["sources"] = sources
    return output
