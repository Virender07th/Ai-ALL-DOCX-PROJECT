import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { uploadFile } from "../../../../Service/Operations/AiAPI";

const UploadFile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ file: null, url: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlForChat , setUrlForChat] = useState("");

  const supportedTypes = [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = ["pdf", "txt", "docx"];

  /** File selection + validation */
  const handleFileSelection = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (
      supportedTypes.includes(selectedFile.type) ||
      allowedExtensions.includes(ext)
    ) {
      setFormData((prev) => ({ ...prev, file: selectedFile }));
      setError("");
    } else {
      e.target.value = null;
      setFormData((prev) => ({ ...prev, file: null }));
      setError("Only PDF, DOCX, or TXT files are supported.");
    }
  };

  /** URL input change */
  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /** Upload handler */
const handleUpload = async () => {
  if (!formData.file && !formData.url.trim()) {
    setError("Please upload a file or enter a topic or URL.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    // File upload flow
    if (formData.file) {
      const data = new FormData();
      data.append("file", formData.file); // <-- fix here
      await dispatch(uploadFile(data, navigate));
    }

    // URL/topic flow
    if (formData.url.trim()) {
      setUrlForChat(formData.url);
      navigate("/chat-with-file", { state: { output: formData.url } });
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Failed to generate questions.");
  } finally {
    setLoading(false);
  }
};



  const isUploadDisabled = loading || (!formData.file && !formData.url.trim());

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Upload File or Link to Chat
            </h1>
          </div>
          <p className="text-gray-600">
            Upload study material or enter a URL to chat with AI
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col lg:flex-row gap-4 p-6 max-w-6xl mx-auto justify-center items-center">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 space-y-5">
          <div className="bg-white rounded-2xl shadow p-8 border border-gray-200 space-y-8">
            {/* File Upload */}
            <div>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
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
                  <p className="text-gray-500 text-sm">
                    Supports PDF, DOCX, TXT formats
                  </p>
                </div>
              </label>

              {formData.file && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-green-100 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500" />
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

            {/* URL Input */}
            <div className="space-y-2">
              <label
                htmlFor="url"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center">
                  <LinkIcon className="w-3 h-3 text-white" />
                </div>
                URL
              </label>
              <input
                id="url"
                type="text"
                name="url"
                placeholder="e.g., https://example.com/resource"
                value={formData.url}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploadDisabled}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition ${
                isUploadDisabled
                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow"
              }`}
            >
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
            </button>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadFile;
