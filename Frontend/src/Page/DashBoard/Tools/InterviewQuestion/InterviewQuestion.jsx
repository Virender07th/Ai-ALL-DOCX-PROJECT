import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  BookOpen,
  Eye,
  EyeOff,
  Home,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const InterviewQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve questions passed via navigate state
  const questionsFromNavigate = location.state?.questions || [];

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks which explanations are expanded (by index)
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  // Global toggle for showing/hiding all explanations
  const [showExplanations, setShowExplanations] = useState(true);

  useEffect(() => {
    if (questionsFromNavigate.length > 0) {
      setQuestions(questionsFromNavigate);
      setLoading(false);
    } else {
      setError("No questions provided. Please generate questions first.");
      setLoading(false);
    }
  }, [questionsFromNavigate]);

  // Toggle expand/collapse of individual explanation
  const toggleExplanation = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Toggle show/hide all explanations
  const toggleAllExplanations = () => {
    if (showExplanations) {
      setExpandedIndexes([]);
      setShowExplanations(false);
    } else {
      setExpandedIndexes(questions.map((_, i) => i));
      setShowExplanations(true);
    }
  };

  const handleFinish = () => {
    alert("Great job! Questions completed.");
  };

  const handleRestart = () => {
    setExpandedIndexes([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = () => {
    alert("Questions downloaded as PDF!");
  };

  const handleBackToDashboard = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI-Generated Interview Questions
                </h1>
                <p className="text-gray-500 text-sm">
                  {questions.length} questions ready for your interview
                  preparation
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAllExplanations}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black rounded-xl border border-gray-300 transition-all duration-300"
              >
                {showExplanations ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {showExplanations ? "Hide" : "Show"} Explanations
                </span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 rounded-xl border border-green-300 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 && (
            <p className="text-gray-600 text-center">No questions available.</p>
          )}
          {questions.map((question, idx) => {
            const isExpanded = expandedIndexes.includes(idx);
            const explanation = question.answer || ""; // <-- use 'answer' here
            const shouldTruncate = explanation.length > 160;

            return (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl shadow border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                {/* Question Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {question.question || "No question text provided."}
                      </h3>
                    </div>
                  </div>

                  {/* Explanation Section */}
                  {showExplanations && (
                    <div className="mt-6 pl-12">
                      <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-emerald-600 mb-2">
                              Explanation
                            </h4>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {explanation ? (
                                shouldTruncate && !isExpanded ? (
                                  <>
                                    {explanation.slice(0, 160)}...
                                    <button
                                      onClick={() => toggleExplanation(idx)}
                                      className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                                    >
                                      <span>Read more</span>
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {explanation}
                                    {shouldTruncate && (
                                      <button
                                        onClick={() => toggleExplanation(idx)}
                                        className="inline-flex items-center gap-1 ml-2 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                                      >
                                        <span>Show less</span>
                                        <ChevronUp className="w-3 h-3" />
                                      </button>
                                    )}
                                  </>
                                )
                              ) : (
                                <p className="text-gray-500 italic">
                                  No explanation provided.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Question Footer */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <span>
                        Question {idx + 1} of {questions.length}
                      </span>
                    </div>
                    <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                        style={{
                          width: `${((idx + 1) / questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={handleRestart}
            className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black rounded-xl border border-gray-300 transition-all duration-300 font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Start Over
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
            Complete Session
          </button>

          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-3 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-xl border border-blue-300 transition-all duration-300 font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold">Session Complete!</h3>
                <p className="text-gray-600 text-sm">
                  You've reviewed all {questions.length} interview questions
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-gray-600 text-sm">Questions</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewQuestion;

