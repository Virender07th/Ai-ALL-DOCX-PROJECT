from langchain_tavily import TavilySearch
import os
from dotenv import load_dotenv

load_dotenv()

def search_snippet_using_tavily(topic: str) -> str:
    try:
        search_tool = TavilySearch(api_key=os.getenv("TAVILY_API_KEY"))
        
        # Perform the search
        results = search_tool.results(topic + " news", max_results=1)
        
        if not results or "results" not in results or not results["results"]:
            return "No useful results found."
        
        return results["results"][0].get("content", "No content available.")
    
    except Exception as e:
        return f"Error during Tavily search: {str(e)}"
