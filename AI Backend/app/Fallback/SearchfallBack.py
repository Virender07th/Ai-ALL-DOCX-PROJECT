# app/Fallback/SearchFallBack.py

import logging
from fastapi import HTTPException
from app.Tools.SearchTool.DuckDuckgoSearch import search_snippet_using_DuckDuckGoSearchRun
from app.Tools.SearchTool.Tavily import search_snippet_using_tavily
from app.Tools.SearchTool.Exa import search_snippet_using_exa
from app.Tools.SearchTool.GoogleSepher import search_snippet_using_serper
from langchain_groq import ChatGroq

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- LLM for fallback ----------
llm = ChatGroq(model="llama3-70b-8192", temperature=0.7)


# ---------- Utility ----------
def preprocess_topic_for_search(topic: str) -> str:
    """
    Remove phrases that make search engines return poor results.
    Keeps only the core subject for better search matches.
    """
    junk_phrases = [
        "question for backend practice",
        "quiz for practice",
        "test questions",
        "interview questions",
        "mcq"
    ]
    clean_topic = topic.lower()
    for phrase in junk_phrases:
        clean_topic = clean_topic.replace(phrase, "")
    return clean_topic.strip().capitalize()


def extract_snippet(raw_result) -> str:
    if isinstance(raw_result, str):
        return raw_result.strip()
    if isinstance(raw_result, dict):
        return raw_result.get("snippet") or raw_result.get("content") or raw_result.get("text", "")
    return ""


def is_valid_snippet(snippet: str) -> bool:
    if not isinstance(snippet, str) or not snippet.strip():
        return False
    snippet_lower = snippet.lower()
    if (
        "no useful result" in snippet_lower
        or "error" in snippet_lower
        or snippet_lower.startswith("http")
        or len(snippet.split()) < 30
    ):
        return False
    return True


# ---------- Fallback ----------
def generate_fallback_article(topic: str) -> str:
    prompt = f"""
    Write a clear, detailed, and technically accurate article about "{topic}".
    It should be around 250–300 words, well-structured, and useful for creating multiple-choice quiz questions.
    Include definitions, examples, and practical applications.
    Make sure the explanation is original and not repeated from earlier responses.
    """
    response = llm.invoke(prompt)
    return response.content.strip()


def Search_article_by_topic(topic: str, regenerate: bool = False) -> str:
    """
    Search for an article by topic using multiple engines.
    If regenerate=True, skip search and create a new article directly.
    """

    if not topic or len(topic.strip().split()) < 1:
        raise HTTPException(status_code=400, detail="Topic too vague or short. Provide a longer topic.")

    # If regenerate → skip search entirely
    if regenerate:
        logger.info(f"♻️ Regenerate mode ON — generating fresh content for '{topic}'")
        return generate_fallback_article(topic)

    # Preprocess topic for search
    search_topic = preprocess_topic_for_search(topic)

    search_engines = [
        ("Tavily", search_snippet_using_tavily),
        ("DuckDuckGo", search_snippet_using_DuckDuckGoSearchRun),
        # ("Exa", search_snippet_using_exa),
        # ("Serper", search_snippet_using_serper),
    ]

    for name, engine in search_engines:
        try:
            logger.info(f"🔍 Trying {name} for topic: {search_topic}")
            raw = engine(search_topic)
            cleaned = extract_snippet(raw)

            if is_valid_snippet(cleaned):
                logger.info(f"✅ {name} returned valid content.")
                return cleaned

            logger.warning(f"⚠️ {name} returned no useful result.")
        except Exception as e:
            logger.error(f"❌ {name} failed with error: {str(e)}")

    # If all searches fail → LLM fallback
    logger.warning(f"⚠️ No useful search result found for '{topic}', generating fallback article.")
    return generate_fallback_article(topic)


