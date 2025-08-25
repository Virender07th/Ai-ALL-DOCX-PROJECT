import React, { useState } from "react";
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
} from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { interviewQuestionGeneration , interviewQuestionFileGeneration } from "../../../../Service/Operations/AiAPI";

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

  const supportedTypes = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (supportedTypes.includes(selectedFile.type)) {
      setFormData((prev) => ({ ...prev, file: selectedFile }));
      setError("");
    } else {
      setFormData((prev) => ({ ...prev, file: null }));
      e.target.value = null; // Clear invalid file from input
      setError("Only PDF, DOCX, or TXT files are supported.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const token = localStorage.getItem("token");
 const handleUpload = async () => {
  if (!formData.file && !formData.topic.trim() && !formData.url.trim()) {
    setError("Please upload a file or enter a topic or URL.");
    return;
  }

  if (
    Number(formData.numberOfQuestions) < 5 ||
    Number(formData.numberOfQuestions) > 30 ||
    isNaN(Number(formData.numberOfQuestions))
  ) {
    setError("Number of questions must be between 5 and 30.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    if (formData.file) {
      // ✅ File upload → use FormData + file API
      const filePayload = new FormData();
      filePayload.append("file", formData.file);
      filePayload.append(
        "numberOfQuestions",
        formData.numberOfQuestions || 5
      );

      await dispatch(
        interviewQuestionFileGeneration(filePayload, navigate, token)
      );
      toast.success("Interview questions generated from file!");
    } else {
      // ✅ Topic/URL → JSON payload
      const payload = {
        topic: formData.topic?.trim() || "",
        url: formData.url?.trim() || "",
        numberOfQuestions: formData.numberOfQuestions || 5,
      };

      await dispatch(interviewQuestionGeneration(payload, navigate, token));
      toast.success("Interview questions generated successfully!");
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast.error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to generate questions."
    );
  } finally {
    setLoading(false);
  }
};


  const isUploadDisabled =
    loading ||
    (!formData.file && !formData.topic.trim() && !formData.url.trim()) ||
    Number(formData.numberOfQuestions) < 5 ||
    Number(formData.numberOfQuestions) > 30;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Interview Question Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Upload study material, enter a topic or link to generate custom
            interview questions.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow p-8 border border-gray-200 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UploadCloud className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upload File or Provide Details
              </h2>
            </div>

            {/* File Upload */}
            <div className="relative group">
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelection}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-blue-600 font-semibold text-lg">
                    Click to upload file
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Supports PDF, DOCX, TXT formats
                  </p>
                </div>
              </label>

              {formData.file && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-green-100 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-green-700 font-medium">File selected:</p>
                    <p className="text-gray-700 text-sm">{formData.file.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 font-medium px-4 bg-gray-100 rounded-full">
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
                placeholder="e.g., Operating Systems, ReactJS, Machine Learning..."
                value={formData.topic}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 font-medium px-4 bg-gray-100 rounded-full">
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
                type="text"
                name="url"
                placeholder="e.g., https://example.com/resource"
                value={formData.url}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Settings */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Interview Question Settings
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
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleUpload}
            disabled={isUploadDisabled}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition relative overflow-hidden group ${
              isUploadDisabled
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow"
            }`}
          >
            <div className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Upload & Generate
                </>
              )}
            </div>
          </button>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-sm">
                  AI-Powered Generation
                </h3>
                <p className="text-gray-600 text-xs mt-1">
                  Our AI analyzes your content and creates relevant interview
                  questions tailored to your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewQuestionGeneration;
