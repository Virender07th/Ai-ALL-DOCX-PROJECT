import re
from typing import List
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from app.Utiles.jsonExtract import extract_json
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.6)
parser = StrOutputParser()

interview_prompt = PromptTemplate.from_template("""
You are an expert technical interviewer.

Generate exactly {numberOfQuestions} **unique technical interview questions** from the given content.

Rules for ALL questions:
- Each question must be technical and relevant to the content.
- Provide a **detailed answer** for each question.
- Include **code snippets or real-world examples** where useful.
- **Escape all newlines inside strings using \\n.**
- **Escape all backticks inside strings using \\`**.
- Output ONLY valid JSON, nothing else.
- The JSON must be a single line (no actual line breaks inside string values).

Content:
{article}

JSON Format:
{{
  "questions": [
    {{
      "question": "Example interview question?",
      "answer": "Detailed explanation here with escaped newlines and backticks"
    }}
  ]
}}
""")

interview_chain = interview_prompt | llm | parser

class InterviewQuestionItem(BaseModel):
    question: str
    answer: str

class InterviewQuestionModel(BaseModel):
    questions: List[InterviewQuestionItem]

def generate_interview_questions(article: str, numberOfQuestions: int) -> InterviewQuestionModel:
    raw_output = interview_chain.invoke({
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

    return InterviewQuestionModel(**data)
