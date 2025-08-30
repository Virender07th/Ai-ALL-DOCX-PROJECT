from langchain_community.tools import DuckDuckGoSearchRun

def search_snippet_using_DuckDuckGoSearchRun(topic: str) -> str:
    """
    Uses DuckDuckGoSearchRun to fetch a short news snippet related to a topic.
    
    Parameters:
        topic (str): The topic to search for.
    
    Returns:
        str: A snippet of relevant news or an error message.
    """
    try:
        tool = DuckDuckGoSearchRun()
        query = f"{topic} news"
        result = tool.invoke({"query": query})

        if not result or not isinstance(result, str) or result.strip() == "":
            return "No useful results found."

        return result.strip()

    except Exception as e:
        return f"Error during DuckDuckGo search: {str(e)}"
