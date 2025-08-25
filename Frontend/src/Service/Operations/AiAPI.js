import { aiEndpoints } from "../APIs";
import { apiConnector } from "../apiConnector";
import { setLoading } from "../../Slice/authSlice";
import toast from "react-hot-toast";

const {
  INTERVIEW_QUESTION_API,
  INTERVIEW_QUESTION_FILE_API,
  QUIZ_QUESTION_API,
  QUIZ_QUESTION_FILE_API,
  UPLOAD_FILE_API,
  CHAT_ON_FILE_API,
  CHAT_ON_URL_API,
} = aiEndpoints;

export function interviewQuestionGeneration(formData, navigate, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        INTERVIEW_QUESTION_API,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Unknown error occurred");
      }

      toast.dismiss(toastBar);
      toast.success("Interview Question Generated");

      navigate("/interview-question", {
        state: { questions: response.data.questions },
      });

      return response.data.questions;
    } catch (error) {
      toast.dismiss(toastBar);
      console.error("INTERVIEW_QUESTION_GENERATION_API ERROR", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate interview questions"
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function quizQuestionGeneration(formData, navigate, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", QUIZ_QUESTION_API, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Quiz Question Generated");
      navigate("/questions", { state: { questions: response.data.questions } });
    } catch (error) {
      console.error("QUIZ_QUESTION_GENERATION_API ERROR", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate quiz questions"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}

export function uploadFile(formData, navigate, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", UPLOAD_FILE_API, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("File Uploaded Successfully");
      navigate("/chat-with-file", { state: { output: response.data } });
    } catch (error) {
      console.error("UPLOAD_FILE_API_ERROR", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload file"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}

export function chatOnFile(formData, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", CHAT_ON_FILE_API, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      console.log("API response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("CHAT_ON_FILE_API ERROR", error);
      toast.error(
        error.response?.data?.message || error.message || "Chat on File failed"
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}

export function chatOnURL(formData, navigate, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", CHAT_ON_URL_API, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Quiz Question Generated");
      navigate("/questions", { state: { questions: response.data.questions } });
    } catch (error) {
      console.error("QUIZ_QUESTION_GENERATION_API ERROR", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate quiz questions"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastBar);
    }
  };
}

export function interviewQuestionFileGeneration(formData, navigate, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Uploading & Generating...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        INTERVIEW_QUESTION_FILE_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Unknown error occurred");
      }

      toast.dismiss(toastBar);
      toast.success("Interview Questions Generated from File");

      navigate("/interview-question", {
        state: { questions: response.data.questions },
      });

      return response.data.questions;
    } catch (error) {
      toast.dismiss(toastBar);
      console.error("INTERVIEW_QUESTION_FILE_API ERROR", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate interview questions from file"
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Quiz Question from File
export function quizQuestionFileGeneration(formData, navigate, token) {
  return async (dispatch) => {
    const toastBar = toast.loading("Uploading & Generating...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        QUIZ_QUESTION_FILE_API,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.dismiss(toastBar);
      toast.success("Quiz Questions Generated from File");

      navigate("/questions", { state: { questions: response.data.questions } });
      return response.data.questions;
    } catch (error) {
      toast.dismiss(toastBar);
      console.error("QUIZ_QUESTION_FILE_API ERROR", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate quiz questions from file"
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
}
