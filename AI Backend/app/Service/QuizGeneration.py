import os
import json
import re
from typing import List, Dict
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from app.Utiles.jsonExtract import extract_json

load_dotenv()

llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.6)
parser = StrOutputParser()


_article_cache: Dict[str, Dict] = {}

quiz_prompt = PromptTemplate.from_template("""
You are an expert MCQ generator for Computer Science, AI, and IT.
Generate exactly {numberOfQuestions} multiple-choice questions from the given content.

Rules for ALL questions:
- Each question must be technical and relevant to the content.
- Exactly 4 distinct options per question.
- Exactly 1 correct answer.
- Provide a concise explanation for the correct answer.
- Include code snippets or examples if relevant.
- **Escape all newlines in strings using \\n.**
- **Escape all backticks in strings using \\`**
- Output ONLY valid JSON, nothing else.

Ensure the questions cover all key concepts from the content.

Content:
{article}

JSON Format:
{{
  "questions": [
    {{
      "question": "Example?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Why A is correct, with escaped newlines and backticks"
    }}
  ]
}}
""")

quiz_chain = quiz_prompt | llm | parser

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str

class QuizResponse(BaseModel):
    questions: List[Question]


def generate_quiz_questions(article: str, numberOfQuestions: int, topic: str = None) -> QuizResponse:
  
    raw_output = quiz_chain.invoke({
        "article": article,
        "numberOfQuestions": numberOfQuestions
    })

    try:
        data = extract_json(raw_output)
    except Exception:
        match = re.search(r"\{.*\}", raw_output, re.DOTALL)
        if match:
            import json
            data = json.loads(match.group())
        else:
            raise ValueError(f"AI output is not valid JSON: {raw_output[:200]}...")

    return QuizResponse(**data)
