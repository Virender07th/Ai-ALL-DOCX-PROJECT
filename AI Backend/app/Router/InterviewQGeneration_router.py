from fastapi import APIRouter, HTTPException , UploadFile, File
from typing import Optional
from pydantic import BaseModel, ValidationError
import json

from app.Service.InterviewQGeneration import generate_interview_questions
from app.Utiles.GetArticle import get_article

router = APIRouter()

class InterviewRequest(BaseModel):
    topic: Optional[str] = None
    url: Optional[str] = None
    numberOfQuestions: Optional[int] = 5 

class Question(BaseModel):
    question: str
    answer: str

class InterviewResponse(BaseModel):
    questions: list[Question]

@router.post("/interview-question", summary="Generate interview questions from topic or URL")
async def interview_question(req: InterviewRequest):
    if not req.topic and not req.url:
        raise HTTPException(
            status_code=422,
            detail="Please provide either a 'topic' or a 'url'."
        )

    try:
        article = get_article(topic=req.topic, url=req.url)
        if not article or article.strip() == "":
            raise HTTPException(status_code=400, detail="Could not extract article content.")

        result = generate_interview_questions(
            article=article,
            numberOfQuestions=req.numberOfQuestions
        )

        if isinstance(result, dict):
            result_data = result
        elif isinstance(result, str):
            try:
                result_data = json.loads(result)
            except json.JSONDecodeError as e:
                raise HTTPException(status_code=500, detail=f"Invalid JSON from AI: {e}")
        else:
            result_data = result.dict()

        questions_raw = result_data.get("questions", [])
        if not isinstance(questions_raw, list):
            raise HTTPException(status_code=500, detail="Invalid questions format in AI response.")

        questions = [Question(**q) for q in questions_raw]

        return {"success": True, "questions": questions}

    except ValidationError as e:
        raise HTTPException(status_code=500, detail=f"Response validation error: {e}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview-question-file", summary="Generate interview questions from uploaded file")
async def interview_question_file(
    file: UploadFile = File(...),
    numberOfQuestions: int = 5
):
    try:
        from app.Utiles.file_utils import save_uploadfile_temp, load_file_text
        temp_path = save_uploadfile_temp(file)

        article = load_file_text(temp_path)
        if not article.strip():
            raise HTTPException(status_code=400, detail="No text extracted from file.")

        result = generate_interview_questions(article=article, numberOfQuestions=numberOfQuestions)

        return {"success": True, "questions": result.questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
