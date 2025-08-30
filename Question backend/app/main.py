from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Ai-News-Project

# AI-All-Docs
from app.Router.InterviewQGeneration_router import router as interviewQGeneration_router
from app.Router.QuizGeneration_router import router as quizGeneration_router





#Ai-All-Docx-Project


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI ALL DOCS AND VIDEO
app.include_router(interviewQGeneration_router , prefix="/api")
app.include_router(quizGeneration_router , prefix="/api")



@app.get("/")
def read_root():
    return {"message": "FastAPI is working"}
