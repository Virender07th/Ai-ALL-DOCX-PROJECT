from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)
parser = StrOutputParser()

news_cleaning_prompt = PromptTemplate.from_template(
    """
You are a strict article formatter. Your job is to clean raw news articles and format them using **only clean Markdown**.

### ❌ What to Remove Completely:
- LLM response markers: "Sure!", "Here's the cleaned version:", "Certainly!" etc.
- Repeated or duplicated headlines or subheadings
- Extra whitespace, line breaks, or symbols (e.g., "**", ">>", "---", "### Output", etc. that aren't part of the article)
- Any non-news phrases added by the AI

### ✅ What to Keep and Normalize:
- Clean headline → use `#`
- Subheadings → use `##`
- Section headers (if needed) → use `###`
- Paragraphs with proper sentence spacing and punctuation
- Bullet points (if present in original content)
- Bold (`**`) or italics (`*`) only if clearly part of original content

### Output Format Rules:
- Final output must look like a professionally formatted Markdown news article
- No additional commentary, explanation, or system messages
- Only the cleaned and formatted article content — nothing else

---

### Raw Article:
{article}
"""
)

news_cleaning_chain = news_cleaning_prompt | llm | parser

def clean_and_format_news(article: str) -> str:
    return news_cleaning_chain.invoke({"article": article})

