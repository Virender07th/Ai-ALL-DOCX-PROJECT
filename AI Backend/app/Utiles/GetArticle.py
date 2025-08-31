from fastapi import HTTPException
from app.Tools.URLTOOL.ArticleExtractor import extract_article_from_url
from app.Fallback.SearchfallBack import Search_article_by_topic
from app.Utiles.NewsCleaningService import clean_and_format_news


def get_article(topic: str = None, url: str = None) -> str:
    topic = topic.strip() if topic else None
    url = url.strip() if url and url.lower() != "string" else None

    if not topic and not url:
        raise HTTPException(status_code=400, detail="Provide either a topic or a valid URL.")

    try:
        if url:
            article = extract_article_from_url(url)
            if article.startswith("Error"):
                raise Exception(article)
        else:
            article = Search_article_by_topic(topic)

        if not article or len(article.strip()) < 100:
            raise Exception("No useful content retrieved.")

        return clean_and_format_news(article)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
