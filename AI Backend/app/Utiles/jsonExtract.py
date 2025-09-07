import json
import re
from typing import Dict

def extract_json(raw_output: str) -> Dict:
    """
    Safely extract JSON from AI output with code snippets.
    Escapes control characters and ensures valid JSON.
    """
    # 1. Try to extract JSON block if present
    json_match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
    if json_match:
        json_str = json_match.group(1).strip()
    else:
        start = raw_output.find("{")
        end = raw_output.rfind("}")
        if start == -1 or end == -1:
            raise ValueError("No JSON object found in AI output.")
        json_str = raw_output[start:end+1]

    # 2. Escape unescaped quotes inside strings
    def escape_control_chars(match):
        inner = match.group(1)
        inner = inner.replace("\\", "\\\\")  # escape existing backslashes first
        inner = inner.replace('"', '\\"')    # escape quotes
        inner = inner.replace("\n", "\\n")   # escape newlines
        inner = inner.replace("\r", "\\r")
        return f'"{inner}"'

    # Replace all string values safely
    json_str = re.sub(r'"(.*?)"', escape_control_chars, json_str, flags=re.DOTALL)

    # 3. Parse JSON
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print("Failed JSON parse. Original output snippet:", raw_output[:500])
        raise ValueError(f"JSON parsing failed: {e}")
