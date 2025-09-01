import json5
import re

def extract_json(raw_output: str) -> dict:
    """
    Extracts JSON from a string, handling common AI output issues like
    surrounding text, code blocks, and unescaped newlines within strings.
    """
    # 1. Isolate the JSON part
    json_block_match = re.search(r"```json(.*?)```", raw_output, re.DOTALL)
    if json_block_match:
        json_str = json_block_match.group(1).strip()
    else:
        start_index = raw_output.find("{")
        end_index = raw_output.rfind("}")
        if start_index == -1 or end_index == -1:
            raise ValueError("No JSON object found in the AI output.")
        json_str = raw_output[start_index : end_index + 1]

    # 2. Sanitize JSON (escape newlines inside strings only)
    sanitized_chars = []
    in_string = False
    last_char = ""

    for char in json_str:
        if char == '"' and last_char != "\\":
            in_string = not in_string
        if char == "\n" and in_string:
            sanitized_chars.append("\\n")
        else:
            sanitized_chars.append(char)
        last_char = char

    sanitized_json_str = "".join(sanitized_chars)

    # 3. Parse with JSON5
    try:
        return json5.loads(sanitized_json_str)
    except Exception as e:
        print("Original AI output:", raw_output)
        print("Sanitized JSON string for parsing:", sanitized_json_str)
        raise ValueError(f"Failed to parse JSON5: {e}")