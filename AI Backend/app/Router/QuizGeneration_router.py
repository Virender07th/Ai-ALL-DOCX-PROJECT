from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from pydantic import BaseModel, ValidationError
import json

from app.Service.QuizGeneration import generate_quiz_questions
from app.Utiles.GetArticle import get_article
from app.Utiles.file_utils import save_uploadfile_temp, load_file_text

router = APIRouter()
class QuizRequest(BaseModel):
    topic: Optional[str] = None
    url: Optional[str] = None
    numberOfQuestions: Optional[int] = 5
class Question(BaseModel):
    question: str
    options: list[str]
    answer: str
    explanation: str
class QuizResponse(BaseModel):
    questions: list[Question]

@router.post("/quiz-question", summary="Generate quiz questions from topic or URL")
async def quiz_question(req: QuizRequest):
    if not req.topic and not req.url:
        raise HTTPException(status_code=422, detail="Please provide either a 'topic' or a 'url'.")

    try:
        article = get_article(topic=req.topic, url=req.url)
        if not article or article.strip() == "":
            raise HTTPException(status_code=400, detail="Could not extract article content.")

        result = generate_quiz_questions(
            article=article,
            numberOfQuestions=req.numberOfQuestions,
            topic=req.topic
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

@router.post("/quiz-question-file", summary="Generate quiz questions from uploaded file")
async def quiz_question_file(
    file: UploadFile = File(...),
    numberOfQuestions: int = Form(5)
):
    try:
        temp_path = save_uploadfile_temp(file)

        article = load_file_text(temp_path)
        if not article.strip():
            raise HTTPException(status_code=400, detail="No text extracted from file.")

        result = generate_quiz_questions(
            article=article,
            numberOfQuestions=numberOfQuestions
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
