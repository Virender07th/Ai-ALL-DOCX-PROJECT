import axios from "axios";

// const BASE_URL = "http://localhost:8000/api/v1";
const BASE_URL = "https://ai-all-docx-project-77.onrender.com";


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or wherever you store it
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: headers || null, // you can override token if needed
    params: params || null,
  });
};
