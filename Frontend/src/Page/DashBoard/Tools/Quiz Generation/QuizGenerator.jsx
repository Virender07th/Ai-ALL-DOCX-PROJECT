import React, { useState, useCallback, useRef } from "react";
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
  Upload,
} from "lucide-react";
import { quizQuestionGeneration, quizQuestionFileGeneration } from "../../../../Service/Operations/AiAPI";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const QuizGenerator = () => {
  const [formData, setFormData] = useState({
    file: null,
    topic: "",
    url: "",
    numberOfQuestions: 10,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // PDF only support
  const SUPPORTED_FILE_TYPE = "application/pdf";
  const SUPPORTED_EXTENSION = ".pdf";
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MIN_QUESTIONS = 5;
  const MAX_QUESTIONS = 30;

  const validateFile = useCallback((file) => {
    if (!file) return { isValid: false, error: "No file selected" };

    const fileName = file.name.toLowerCase();
    const hasValidExtension = fileName.endsWith(SUPPORTED_EXTENSION);
    const hasValidType = file.type === SUPPORTED_FILE_TYPE;

    if (!hasValidExtension && !hasValidType) {
      return {
        isValid: false,
        error: "Invalid file format. Only PDF files are supported.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size too large. Maximum ${MAX_FILE_SIZE / (1024 * 1024)}MB allowed.`,
      };
    }

    return { isValid: true, error: null };
  }, []);

  const validateForm = useCallback(() => {
    // Check if at least one input method is provided
    if (!formData.file && !formData.topic.trim() && !formData.url.trim()) {
      return "Please provide a topic, URL, or upload a PDF file.";
    }

    // Validate URL format if provided
    if (formData.url.trim()) {
      try {
        const url = new URL(formData.url.trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
          return "URL must use HTTP or HTTPS protocol.";
        }
      } catch {
        return "Please enter a valid URL.";
      }
    }

    // Validate number of questions
    const numQuestions = Number(formData.numberOfQuestions);
    if (isNaN(numQuestions) || numQuestions < MIN_QUESTIONS || numQuestions > MAX_QUESTIONS) {
      return `Number of questions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}.`;
    }

    return null;
  }, [formData]);

  const handleFileSelection = useCallback((file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (validation.isValid) {
      setFormData(prev => ({ ...prev, file }));
      setError("");
    } else {
      setFormData(prev => ({ ...prev, file: null }));
      setError(validation.error);
    }
  }, [validateFile]);

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    handleFileSelection(selectedFile);
    // Reset input value to allow selecting the same file again
    if (e.target) e.target.value = '';
  }, [handleFileSelection]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    handleFileSelection(droppedFile);
  }, [handleFileSelection]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'numberOfQuestions') {
      const numValue = Math.max(MIN_QUESTIONS, Math.min(MAX_QUESTIONS, parseInt(value) || MIN_QUESTIONS));
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  const removeFile = useCallback(() => {
    setFormData(prev => ({ ...prev, file: null }));
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const handleUpload = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      if (formData.file) {
        // File upload path
        const filePayload = new FormData();
        filePayload.append("file", formData.file);
        filePayload.append("numberOfQuestions", String(formData.numberOfQuestions));

        await dispatch(quizQuestionFileGeneration(filePayload, navigate, token));
        toast.success("Quiz generated successfully from PDF!");
      } else {
        // Topic/URL path
        const payload = {
          topic: formData.topic?.trim() || "",
          url: formData.url?.trim() || "",
          numberOfQuestions: formData.numberOfQuestions,
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
  }, [formData, validateForm, dispatch, navigate]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ClipboardList className="text-white w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Quiz Generator
            </h1>
          </div>
          <p className="text-gray-600 ml-13">
            Upload PDF files, enter a topic, or provide a URL to generate custom quizzes using AI.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto">
        {/* Input Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-8">
            {/* Upload Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
                <UploadCloud className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Upload or Input Content</h2>
            </div>

            {/* File Upload with Drag & Drop */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50 shadow-inner"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileInput}
                id="file-upload"
                aria-describedby="file-upload-description"
              />
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${
                  dragActive ? 'bg-blue-200' : 'bg-blue-100'
                }`}>
                  <Upload className={`w-8 h-8 transition-colors ${
                    dragActive ? 'text-blue-600' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <p className="text-blue-600 font-semibold text-lg mb-1">
                    {dragActive
                      ? "Drop PDF file here"
                      : "Click to upload or drag & drop PDF"}
                  </p>
                  <p
                    id="file-upload-description"
                    className="text-gray-500 text-sm"
                  >
                    Only PDF files supported (Max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* File Selected Display */}
            {formData.file && (
              <div className="mt-4 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">PDF Selected:</p>
                    <p className="text-gray-700 text-sm font-medium">
                      {formData.file.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatFileSize(formData.file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-2 hover:bg-green-100 rounded-full transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-green-600" />
                </button>
              </div>
            )}

            {/* OR Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-gray-500 font-medium px-4 bg-white text-sm">
                OR
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
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
                placeholder="e.g., Machine Learning Fundamentals, React Hooks, Data Structures"
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                Enter a specific topic for AI-generated quiz questions
              </p>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-gray-500 font-medium px-4 bg-white text-sm">
                OR
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
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
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">
                Provide a URL to generate quiz questions from web content
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Quiz Settings</h2>
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
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                value={formData.numberOfQuestions}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500">
                Choose between {MIN_QUESTIONS} and {MAX_QUESTIONS} questions
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload a PDF file for content-based questions</li>
                <li>• Enter a topic for AI-generated questions</li>
                <li>• Provide a URL to extract content from web pages</li>
                <li>• Get instant quiz results with explanations</li>
              </ul>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
              loading
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
            aria-label={loading ? "Generating quiz..." : "Generate quiz"}
          >
            <div className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Generate Quiz
                </>
              )}
            </div>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizGenerator;