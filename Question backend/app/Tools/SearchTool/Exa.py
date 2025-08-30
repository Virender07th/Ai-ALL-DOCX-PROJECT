import os
from dotenv import load_dotenv
from langchain_exa import ExaSearchResults

load_dotenv()

def search_snippet_using_exa(topic: str) -> str:
    try:
        search_tool = ExaSearchResults(api_key=os.getenv("EXA_API_KEY"))

        # Perform a search query
        search_results = search_tool._run(
            query="When was the last time the New York Knicks won the NBA Championship?",
            num_results=1,
            text_contents_options=True,
            highlights=True,
        )

        print("Search Results:", search_results)
        if not search_results or not isinstance(search_results, str):
            return "No useful results found."

        return search_results.strip()

    except Exception as e:
        return f"Error during Exa search: {str(e)}"
