from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.Service.ChatWithDocs import handle_file_upload,  chat_with_docs , chat_with_url

router = APIRouter()

class ChatRequest(BaseModel):
    topic: str
    top_k: int = 4

class URLChatRequest(BaseModel):
    topic: str
    url: str
    top_k: int = 4

@router.post("/upload-file", summary="Upload and ingest a file")
async def upload_file(file: UploadFile = File(...)):
    try:
        result = handle_file_upload(file)
        return {"success": True, "details": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to ingest file: {str(e)}")

@router.post("/chat-on-docs", summary="Chat with ingested documents")
async def chat_docs(request: ChatRequest):
    try:
        result = chat_with_docs(request.topic, top_k=request.top_k)
        return {"success": True, "response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/chat-url", summary="Chat with content from a URL (no ingestion)")
async def chat_url(request: URLChatRequest):
    try:
        result = chat_with_url(request.topic, request.url, top_k=request.top_k)
        return {"success": True, "response": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to chat on URL: {str(e)}")
