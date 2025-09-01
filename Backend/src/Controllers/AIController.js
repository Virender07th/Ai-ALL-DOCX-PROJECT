import axios from "axios";
import { AiEndpoints } from "../Utils/API.js";
import FormData from "form-data";
import Activity from "../Models/Activity.js";
import UserStats from "../Models/UserStats.js";

//
// --- Helper: Record Activity + Update Stats ---
//
const recordActivityHelper = async ({ userId, title, type, status }) => {
  try {
    const activity = await Activity.create({ userId, title, type, status });

    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = new UserStats({ userId });
    }

    if (type === "upload") stats.filesUploaded += 1;
    if (type === "quiz") stats.quizzesCreated += 1;
    if (type === "interview") stats.interviewQuestions += 1;

    await stats.save();

    return { activity, stats };
  } catch (error) {
    console.error("Error recording activity:", error);
    return null; // don’t crash the API if logging fails
  }
};

//
// --- Reusable callFastAPI ---
//
const callFastAPI = async (endpoint, data, res, { userId, type, title }) => {
  try {
    const response = await axios.post(endpoint, data, {
      headers: { "Content-Type": "application/json" },
    });

    const apiData = response.data;

    if (apiData.success) {
      // Record activity
      await recordActivityHelper({
        userId,
        title,
        type,
        status: "completed",
      });

      return res.status(200).json({
        success: true,
        questions: apiData.questions || [],
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "API returned success=false",
      });
    }
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);

    return res.status(500).json({
      success: false,
      message: `Failed to fetch from ${endpoint}`,
      error: error?.response?.data || "Internal Server Error",
    });
  }
};

//
// --- Controllers ---
//
const InterviewQuestion = async (req, res) => {
  if (!req.body.topic && !req.body.url) {
    return res.status(400).json({
      success: false,
      message: "Either topic or url is required.",
    });
  }
  await callFastAPI(AiEndpoints.Interview_Question_API, req.body, res, {
    userId: req.user.id,
    type: "interview",
    title: req.body.topic || "Interview Question",
  });
};

const QuizQuestion = async (req, res) => {
  if (!req.body.topic && !req.body.url) {
    return res.status(400).json({
      success: false,
      message: "Either topic or url is required.",
    });
  }
  await callFastAPI(AiEndpoints.Quiz_Question_API, req.body, res, {
    userId: req.user.id,
    type: "quiz",
    title: req.body.topic || "Quiz Question",
  });
};

const InterviewQuestionWithFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File is required" });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const numberOfQuestions = req.body?.numberOfQuestions || 5;
    formData.append("numberOfQuestions", numberOfQuestions);

    const response = await axios.post(
      AiEndpoints.Interview_Question_File_API,
      formData,
      { headers: formData.getHeaders() }
    );

    // Record activity
    await recordActivityHelper({
      userId: req.user.id,
      title: req.file.originalname,
      type: "interview",
      status: "completed",
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Upload error", error: error.message });
  }
};

const QuizQuestionWithFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File is required" });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const numberOfQuestions = req.body?.numberOfQuestions || 5;
    formData.append("numberOfQuestions", numberOfQuestions);

    const response = await axios.post(
      AiEndpoints.Quiz_Question_File_API,
      formData,
      { headers: formData.getHeaders() }
    );

    // Record activity
    await recordActivityHelper({
      userId: req.user.id,
      title: req.file.originalname,
      type: "quiz",
      status: "completed",
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Upload error", error: error.message });
  }
};

const UploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File is required" });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(AiEndpoints.Upload_File_API, formData, {
      headers: formData.getHeaders(),
    });

    // Record activity
    await recordActivityHelper({
      userId: req.user.id,
      title: req.file.originalname,
      type: "upload",
      status: "completed",
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Upload error", error: error.message });
  }
};

const ChatOnDocs = async (req, res) => {
  if (!req.body.topic) {
    return res.status(400).json({ success: false, message: "topic is required." });
  }

  try {
    const response = await axios.post(AiEndpoints.Chat_On_Docs_API, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    const apiData = response.data;

    if (!apiData.success) {
      return res.status(500).json({
        success: false,
        message: "AI API responded with failure",
      });
    }

    // Optional: record as "chat"
    await recordActivityHelper({
      userId: req.user.id,
      title: req.body.topic,
      type: "chat",
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      answer: apiData.response?.answer || "",
    });
  } catch (error) {
    console.error(`Error calling Chat_On_Docs_API:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch from Chat_On_Docs_API`,
      error: error?.response?.data || error.message || "Internal Server Error",
    });
  }
};

const ChatOnURL = async (req, res) => {
  if (!req.body.query && !req.body.url) {
    return res.status(400).json({
      success: false,
      message: "Either Query or url is required.",
    });
  }
  await callFastAPI(AiEndpoints.Chat_On_URL_API, req.body, res, {
    userId: req.user.id,
    type: "chat",
    title: req.body.url || "Chat on URL",
  });
};

//
// --- Export ---
//
export {
  recordActivityHelper,
  InterviewQuestion,
  InterviewQuestionWithFile,
  QuizQuestion,
  QuizQuestionWithFile,
  UploadFile,
  ChatOnDocs,
  ChatOnURL,
};
