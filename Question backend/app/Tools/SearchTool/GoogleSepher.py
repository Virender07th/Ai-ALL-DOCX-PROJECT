import os
from dotenv import load_dotenv
from langchain_community.utilities import GoogleSerperAPIWrapper

load_dotenv()

def search_snippet_using_serper(topic: str) -> str:
    try:
        tool = GoogleSerperAPIWrapper()
        result = tool.run(topic + " news")  # ✅ Correct method

        if not result or not isinstance(result, str):
            return "No useful results found."

        return result.strip()

    except Exception as e:
        return f"Error during Serper search: {str(e)}"
