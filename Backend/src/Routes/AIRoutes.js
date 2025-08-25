import express from "express";
import { ChatOnDocs, ChatOnURL, InterviewQuestion , InterviewQuestionWithFile , QuizQuestion , QuizQuestionWithFile, UploadFile,   } from "../Controllers/AIController.js";
import {uploadAS} from "../Middleware/multer.js";
import auth from "../Middleware/auth.middlewares.js"

const router = express.Router();

router.post("/interview-question",auth , InterviewQuestion);
router.post("/interview-question-file",auth , uploadAS.single("file"), InterviewQuestionWithFile);
router.post("/quiz-question", auth ,QuizQuestion);
router.post("/quiz-question-file", auth  ,uploadAS.single("file"),QuizQuestionWithFile);
router.post("/upload-file", auth ,  uploadAS.single("file") , UploadFile);
router.post("/chat-on-file",auth , ChatOnDocs);
router.post("/chat-on-url",auth , ChatOnURL);


export default router;
