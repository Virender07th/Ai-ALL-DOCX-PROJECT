from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Ai-News-Project

# AI-All-Docs
from app.Router.InterviewQGeneration_router import router as interviewQGeneration_router
from app.Router.QuizGeneration_router import router as quizGeneration_router
from app.Router.ChatWithDocs_router import router as chatWithDocs_router

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(interviewQGeneration_router, prefix="/api", tags=["interview"])
app.include_router(quizGeneration_router, prefix="/api", tags=["quiz"])
app.include_router(chatWithDocs_router, prefix="/api/chat", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "FastAPI is working"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # fallback to 8000 for local
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
