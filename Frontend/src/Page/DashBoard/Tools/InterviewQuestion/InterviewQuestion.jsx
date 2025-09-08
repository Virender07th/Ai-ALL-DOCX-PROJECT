import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ArrowLeft,
  Share2,
  Clock,
  Target,
} from "lucide-react";

const InterviewQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve questions passed via navigate state
  const questionsFromNavigate = location.state?.questions || [];

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [showExplanations, setShowExplanations] = useState(true);
  const [sessionStartTime] = useState(Date.now());

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
  const toggleExplanation = useCallback((index) => {
    setExpandedIndexes(prev =>
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  }, []);

  // Toggle show/hide all explanations
  const toggleAllExplanations = useCallback(() => {
    if (showExplanations) {
      setExpandedIndexes([]);
      setShowExplanations(false);
    } else {
      setExpandedIndexes(questions.map((_, i) => i));
      setShowExplanations(true);
    }
  }, [showExplanations, questions]);

  const handleFinish = useCallback(() => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000 / 60);
    const message = `Great job! You've completed ${questions.length} questions in ${sessionDuration} minutes.`;
    
    // You could also navigate to a completion page or save session data
    alert(message);
    navigate(-1); // Go back to previous page
  }, [questions.length, sessionStartTime, navigate]);

  const handleRestart = useCallback(() => {
    setExpandedIndexes([]);
    setShowExplanations(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDownload = useCallback(() => {
    // Create downloadable content
    const content = questions.map((q, index) => 
      `Question ${index + 1}: ${q.question || 'No question provided'}\n\nAnswer: ${q.answer || 'No explanation provided'}\n\n---\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-questions-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [questions]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Interview Questions',
        text: `I've generated ${questions.length} interview questions using AI!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }, [questions.length]);

  const handleBackToDashboard = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Computed values
  const sessionDuration = useMemo(() => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000 / 60);
    return duration > 0 ? duration : 1;
  }, [sessionStartTime]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading your interview questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Interview Questions
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{sessionDuration} min session</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={toggleAllExplanations}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black rounded-lg border border-gray-300 transition-all duration-200 text-sm font-medium"
              >
                {showExplanations ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {showExplanations ? "Hide" : "Show"} Explanations
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 rounded-lg border border-blue-300 transition-all duration-200 text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 rounded-lg border border-green-300 transition-all duration-200 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No questions available.</p>
            </div>
          ) : (
            questions.map((question, idx) => {
              const isExpanded = expandedIndexes.includes(idx);
              const explanation = question.answer || "";
              const shouldTruncate = explanation.length > 200;
              const questionText = question.question || "No question text provided.";

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Question Header */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {questionText}
                        </h3>
                      </div>
                    </div>

                    {/* Explanation Section */}
                    {showExplanations && explanation && (
                      <div className="mt-6 pl-12">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-emerald-600 mb-2">
                                Explanation
                              </h4>
                              <div className="text-gray-700 text-sm leading-relaxed">
                                {shouldTruncate && !isExpanded ? (
                                  <>
                                    <p className="mb-3">{explanation.slice(0, 200)}...</p>
                                    <button
                                      onClick={() => toggleExplanation(idx)}
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 text-sm"
                                    >
                                      <span>Read more</span>
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <p className="mb-3 whitespace-pre-wrap">{explanation}</p>
                                    {shouldTruncate && (
                                      <button
                                        onClick={() => toggleExplanation(idx)}
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 text-sm"
                                      >
                                        <span>Show less</span>
                                        <ChevronUp className="w-3 h-3" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {showExplanations && !explanation && (
                      <div className="mt-6 pl-12">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-gray-500" />
                            </div>
                            <p className="text-gray-500 italic text-sm">
                              No explanation provided for this question.
                            </p>
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
            })
          )}
        </div>

        {/* Action Buttons */}
        {questions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={handleRestart}
              className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black rounded-xl border border-gray-300 transition-all duration-300 font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Start Over
            </button>

            <button
              onClick={handleFinish}
              className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Session
            </button>

            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-3 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-xl border border-blue-300 transition-all duration-300 font-medium"
            >
              <Home className="w-5 h-5" />
              Back to Generator
            </button>
          </div>
        )}

        {/* Progress Summary */}
        {questions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">Session Progress</h3>
                  <p className="text-gray-600 text-sm">
                    {questions.length} interview questions • {sessionDuration} minutes elapsed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {questions.length}
                </div>
                <div className="text-gray-600 text-sm font-medium">Total Questions</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Completion Status</span>
                <span>100% Generated</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                     style={{ width: '100%' }}>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewQuestion;