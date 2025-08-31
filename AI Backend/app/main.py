from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Ai-News-Project

# AI-All-Docs
from app.Router.InterviewQGeneration_router import router as interviewQGeneration_router
from app.Router.QuizGeneration_router import router as quizGeneration_router
from app.Router.ChatWithDocs_router import router as chatWithDocs_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interviewQGeneration_router , prefix="/api")
app.include_router(quizGeneration_router , prefix="/api")
app.include_router(chatWithDocs_router, prefix="/chat", tags=["chat"])


@app.get("/")
def read_root():
    return {"message": "FastAPI is working"}
