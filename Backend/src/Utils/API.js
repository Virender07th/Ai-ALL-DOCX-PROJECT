const FASTAPI_BASE_URL = "http://127.0.0.1:8000"

// all post
export const AiEndpoints = {
    Interview_Question_API :FASTAPI_BASE_URL + "/api/interview-question",
    Interview_Question_File_API :FASTAPI_BASE_URL +"/api/interview-question-file",
    Quiz_Question_API :FASTAPI_BASE_URL + "/api/quiz-question",
    Quiz_Question_File_API :FASTAPI_BASE_URL +"/api/quiz-question-file",
    Upload_File_API :FASTAPI_BASE_URL +"/chat/upload-file",
    Chat_On_Docs_API :FASTAPI_BASE_URL +"/chat/chat-on-docs",
    Chat_On_URL_API:FASTAPI_BASE_URL +"/chat/chat-url"
}