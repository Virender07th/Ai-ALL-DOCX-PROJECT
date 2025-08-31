// const BASE_URL = "http://localhost:8000/api/v1";
const BASE_URL ="https://ai-all-docx-project-77.onrender.com/api/v1"

// AUTH ENDPOINTS
export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",

  FORGET_PASSWORD_API :BASE_URL + "/auth/forgot-password",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// SETTINGS PAGE API
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserProfile",
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateUserProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteUserProfile",
};


export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

export const aiEndpoints = {
    INTERVIEW_QUESTION_API:BASE_URL+ "/ai/interview-question",
    INTERVIEW_QUESTION_FILE_API:BASE_URL+ "/ai/interview-question-file",
    QUIZ_QUESTION_API:BASE_URL+ "/ai/quiz-question",
    QUIZ_QUESTION_FILE_API:BASE_URL+ "/ai/quiz-question-file",
    UPLOAD_FILE_API :BASE_URL + "/ai/upload-file",
    CHAT_ON_FILE_API:BASE_URL + "/ai/chat-on-file",
    CHAT_ON_URL_API:BASE_URL + "/ai/chat-on-url",
}
