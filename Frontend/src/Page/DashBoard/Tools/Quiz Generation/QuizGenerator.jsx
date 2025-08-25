import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  ClipboardList,
  Loader2,
  Link,
  BookOpen,
  Settings,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { quizQuestionGeneration , quizQuestionFileGeneration } from "../../../../Service/Operations/AiAPI";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const QuizGenerator = () => {
  const [formData, setFormData] = useState({
    file: null,
    topic: "",
    url: "",
    numberOfQuestions: "5",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Improved file type validation
  const supportedTypes = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/javascript",
    "application/javascript",
    "text/x-python-script", // More accurate Python MIME type
    "application/x-python-code",
  ];

  const supportedExtensions = [
    ".pdf",
    ".txt",
    ".docx",
    ".xls",
    ".xlsx",
    ".js",
    ".py",
  ];

  const validateFile = (file) => {
    if (!file) return { isValid: false, error: "No file selected" };

    const fileName = file.name.toLowerCase();
    const hasValidExtension = supportedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    const hasValidType = supportedTypes.includes(file.type);

    if (!hasValidExtension && !hasValidType) {
      return {
        isValid: false,
        error:
          "Invalid file format. Supported: PDF, DOCX, TXT, Python, JavaScript, Excel",
      };
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        error: "File size too large. Maximum 10MB allowed.",
      };
    }

    return { isValid: true, error: null };
  };

  const validateForm = () => {
    // Check if at least one input method is provided
    if (!formData.file && !formData.topic.trim() && !formData.url.trim()) {
      return "Please provide a topic, URL, or upload a file.";
    }

    // Validate URL format if provided
    if (formData.url.trim()) {
      try {
        new URL(formData.url.trim());
      } catch {
        return "Please enter a valid URL.";
      }
    }

    // Validate number of questions
    const numQuestions = Number(formData.numberOfQuestions);
    if (isNaN(numQuestions) || numQuestions < 5 || numQuestions > 30) {
      return "Number of questions must be between 5 and 30.";
    }

    return null;
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (validation.isValid) {
      setFormData((prev) => ({ ...prev, file }));
      setError("");
    } else {
      setFormData((prev) => ({ ...prev, file: null }));
      setError(validation.error);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    handleFileSelection(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    handleFileSelection(droppedFile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setError("");
  };

  const token =localStorage.getItem("token")
 const handleUpload = async () => {
  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

  setError("");
  setLoading(true);

  try {
    if (formData.file) {
      // ✅ If file is uploaded → use FormData
      const filePayload = new FormData();
      filePayload.append("file", formData.file);
      filePayload.append(
        "numberOfQuestions",
        formData.numberOfQuestions || 5
      );

      await dispatch(quizQuestionFileGeneration(filePayload, navigate, token));
      toast.success("Quiz generated successfully from file!");
    } else {
      // ✅ If only topic/url → send JSON payload
      const payload = {
        topic: formData.topic?.trim() || "",
        url: formData.url?.trim() || "",
        numberOfQuestions: formData.numberOfQuestions || 5,
      };

      await dispatch(quizQuestionGeneration(payload, navigate, token));
      toast.success("Quiz generated successfully!");
    }
  } catch (err) {
    console.error("Upload error:", err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to generate quiz. Please try again.";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
              <ClipboardList className="text-white w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Quiz Generator
            </h1>
          </div>
          <p className="text-gray-500 ml-13">
            Upload files, enter a topic or link to generate custom quizzes using
            AI.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto">
        {/* Input Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow p-8 border border-gray-200 space-y-8">
            {/* Upload Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UploadCloud className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Upload or Input</h2>
            </div>

            {/* File Upload with Drag & Drop */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 cursor-pointer bg-gray-50 text-center transition duration-300 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-100"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt,.py,.js,.xls,.xlsx"
                className="hidden"
                onChange={handleFileInput}
                id="file-upload"
                aria-describedby="file-upload-description"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-blue-600 font-semibold text-lg">
                    {dragActive
                      ? "Drop file here"
                      : "Click to upload or drag & drop"}
                  </p>
                  <p
                    id="file-upload-description"
                    className="text-gray-500 text-sm"
                  >
                    PDF, DOCX, TXT, Python, JavaScript, Excel supported (Max
                    10MB)
                  </p>
                </div>
              </label>
            </div>

            {formData.file && (
              <div className="mt-4 flex items-center justify-between p-4 bg-green-100 border border-green-300 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-700 font-medium">File selected:</p>
                    <p className="text-gray-700 text-sm">
                      {formData.file.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-green-200 rounded-full transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-green-600" />
                </button>
              </div>
            )}

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 font-medium px-4 bg-white rounded-full">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Topic Input */}
            <div className="space-y-3">
              <label
                htmlFor="topic-input"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-white" />
                </div>
                Topic
              </label>
              <input
                id="topic-input"
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Machine Learning Basics"
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 font-medium px-4 bg-white rounded-full">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* URL Input */}
            <div className="space-y-3">
              <label
                htmlFor="url-input"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center">
                  <Link className="w-3 h-3 text-white" />
                </div>
                Reference URL
              </label>
              <input
                id="url-input"
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/article"
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Quiz Settings</h2>
            </div>
            {/* Number of Questions */}
            <div className="space-y-3">
              <label
                htmlFor="num-questions"
                className="text-sm font-semibold text-gray-700"
              >
                Number of Questions
              </label>
              <input
                id="num-questions"
                type="number"
                name="numberOfQuestions"
                min={5}
                max={30}
                value={formData.numberOfQuestions}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">
                Choose between 5 and 30 questions
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
              loading
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow hover:shadow-lg transform hover:scale-[1.02]"
            }`}
            aria-label={loading ? "Generating quiz..." : "Generate quiz"}
          >
            <div className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Generating...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Generate Quiz
                </>
              )}
            </div>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizGenerator;
