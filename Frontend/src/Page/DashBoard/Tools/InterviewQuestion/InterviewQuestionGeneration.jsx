import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  Settings,
  Loader2,
  Sparkles,
  Link,
  BookOpen,
  CheckCircle,
  AlertCircle,
  X,
  Info,
} from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { 
  interviewQuestionGeneration, 
  interviewQuestionFileGeneration 
} from "../../../../Service/Operations/AiAPI";

const InterviewQuestionGeneration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    file: null,
    topic: "",
    url: "",
    numberOfQuestions: "10",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const supportedTypes = ["application/pdf"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!supportedTypes.includes(file.type)) {
      return "Only PDF files are supported.";
    }
    if (file.size > maxFileSize) {
      return "File size must be less than 10MB.";
    }
    return null;
  };

  const validateUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return "URL must start with http:// or https://";
      }
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const handleFileSelection = useCallback((file) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
    setError("");
  }, []);

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [handleFileSelection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    // Validation
    if (!formData.file && !formData.topic.trim() && !formData.url.trim()) {
      setError("Please upload a PDF file, enter a topic, or provide a URL.");
      return;
    }

    const numQuestions = Number(formData.numberOfQuestions);
    if (numQuestions < 5 || numQuestions > 30 || isNaN(numQuestions)) {
      setError("Number of questions must be between 5 and 30.");
      return;
    }

    // URL validation if provided
    if (formData.url.trim()) {
      const urlError = validateUrl(formData.url.trim());
      if (urlError) {
        setError(urlError);
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      if (formData.file) {
        // File upload
        const filePayload = new FormData();
        filePayload.append("file", formData.file);
        filePayload.append("numberOfQuestions", formData.numberOfQuestions);

        await dispatch(
          interviewQuestionFileGeneration(filePayload, navigate, token)
        );
        toast.success("Interview questions generated from PDF!");
      } else {
        // Topic/URL
        const payload = {
          topic: formData.topic?.trim() || "",
          url: formData.url?.trim() || "",
          numberOfQuestions: numQuestions,
        };

        await dispatch(interviewQuestionGeneration(payload, navigate, token));
        toast.success("Interview questions generated successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = 
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate questions. Please try again.";
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasValidInput = formData.file || formData.topic.trim() || formData.url.trim();
  const isValidQuestionCount = 
    Number(formData.numberOfQuestions) >= 5 && 
    Number(formData.numberOfQuestions) <= 30;
  const isUploadDisabled = loading || !hasValidInput || !isValidQuestionCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Interview Question Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Upload a PDF document, enter a topic, or provide a URL to generate custom interview questions.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UploadCloud className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upload File or Provide Details
              </h2>
            </div>

            {/* File Upload with Drag & Drop */}
            <div className="relative group">
              <div
                className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : formData.file
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.file ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      formData.file ? "text-green-500" : "text-blue-500"
                    }`} />
                  </div>
                  <p className={`font-semibold text-lg ${
                    formData.file ? "text-green-600" : "text-blue-600"
                  }`}>
                    {dragActive ? "Drop your PDF here" : "Click to upload PDF or drag & drop"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Supports PDF files up to 10MB
                  </p>
                </div>
              </div>

              {formData.file && (
                <div className="mt-4 flex items-center justify-between p-4 bg-green-100 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-medium">File selected:</p>
                      <p className="text-gray-700 text-sm">{formData.file.name}</p>
                      <p className="text-gray-500 text-xs">
                        {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 font-medium px-4 bg-gray-100 rounded-full text-sm">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Topic Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-white" />
                </div>
                Topic
              </label>
              <input
                type="text"
                name="topic"
                placeholder="e.g., Machine Learning, ReactJS, Data Structures, System Design..."
                value={formData.topic}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 font-medium px-4 bg-gray-100 rounded-full text-sm">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* URL Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center">
                  <Link className="w-3 h-3 text-white" />
                </div>
                URL
              </label>
              <input
                type="url"
                name="url"
                placeholder="https://example.com/article"
                value={formData.url}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">URL Guidelines:</p>
                  <p className="text-xs mt-1">
                    Please provide short, direct URLs for better processing. Avoid very long URLs with many parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-600 font-medium text-sm">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Settings */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Question Settings
              </h2>
            </div>

            {/* Number of Questions */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Number of Questions
              </label>
              <input
                type="number"
                name="numberOfQuestions"
                min={5}
                max={30}
                value={formData.numberOfQuestions}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p className="text-xs text-gray-500">Between 5 and 30 questions</p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleUpload}
            disabled={isUploadDisabled}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 relative overflow-hidden group ${
              isUploadDisabled
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            }`}
          >
            <div className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Questions
                </>
              )}
            </div>
            {!isUploadDisabled && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
          </button>

          {/* Info Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-sm">
                    AI-Powered Generation
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    Advanced AI analyzes your content to create relevant, high-quality interview questions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mt-0.5">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-sm">
                    PDF Support
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    Upload PDF documents to extract content and generate targeted questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewQuestionGeneration;