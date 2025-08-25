# app/Tools/ArticleExtractor.py
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders.firecrawl import FireCrawlLoader
from newspaper import Article
from urllib.parse import urlparse
from langchain_core.documents import Document

def is_valid_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return all([parsed.scheme, parsed.netloc])
    except:
        return False

def extract_article_from_url(url: str) -> str:
    if not is_valid_url(url):
        return "Error: Invalid URL format"


    try:
        # 1. Fallback: Newspaper3k
        article = Article(url)
        article.download()
        article.parse()
        text = article.text.strip()
        if len(text) > 100:
            return text
    except:
        pass

    try:
        # 2. Final fallback: WebBaseLoader
        docs = WebBaseLoader(url).load()
        text = docs[0].page_content.strip()
        if len(text) > 100:
            return text
    except:
        pass

    try:
        # 3. Use FireCrawl first (handles JS-rendered pages)
        docs = FireCrawlLoader(url).load()
        text = docs[0].page_content.strip()
        if len(text) > 100:
            return text
    except:
        pass
    
    return "Error: Article content is empty or could not be parsed"
