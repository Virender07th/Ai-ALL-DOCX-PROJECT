import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Home,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckSquare,
  Square,
} from "lucide-react";

const Button = ({
  click,
  content,
  condition = true,
  data = true,
  style,
  icon: Icon,
  loading = false,
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={click}
      disabled={!condition || !data || loading}
      className={`${sizeClasses[size]} font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${style}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {content}
    </button>
  );
};

const QuizQuestion = ({
  onNavigate,
  isSolutionMode = false,
  filledAnswers = [],
  questions = [],
  timeLimit = null, // in minutes
  showProgress = true,
  allowReview = true,
}) => {
  // Validation
  if (!onNavigate || typeof onNavigate !== 'function') {
    console.error('QuizQuestion: onNavigate prop is required and must be a function');
    return <div className="p-4 text-red-600">Navigation function not provided</div>;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">No Questions Available</h2>
            <p className="text-gray-600">There are no quiz questions to display at the moment.</p>
          </div>
          <Button
            click={() => onNavigate("dashboard")}
            content="Back to Dashboard"
            icon={Home}
            style="bg-blue-500 text-white hover:bg-blue-600"
            size="lg"
          />
        </div>
      </div>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    () => Array(questions.length).fill(null)
  );
  const [timeRemaining, setTimeRemaining] = useState(
    timeLimit ? timeLimit * 60 : null // Convert to seconds
  );
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setTimeRemaining(timeLimit ? timeLimit * 60 : null);
    setShowSubmitConfirm(false);
    setIsAutoSubmitting(false);
  }, [questions.length, timeLimit]);

  // Timer logic
  useEffect(() => {
    if (!timeLimit || isSolutionMode || timeRemaining === null) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsAutoSubmitting(true);
          handleSubmit(true); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLimit, isSolutionMode, timeRemaining]);

  // Keyboard navigation
  useEffect(() => {
    if (isSolutionMode) return;

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) return; // Ignore if modifier keys are pressed
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault();
          const optionIndex = parseInt(e.key) - 1;
          if (question?.options?.[optionIndex]) {
            handleSelect(question.options[optionIndex]);
          }
          break;
        case 'Enter':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (isLast) {
              setShowSubmitConfirm(true);
            } else {
              handleNext();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, questions.length, isSolutionMode]);

  // Memoized calculations
  const safeCurrentIndex = Math.min(currentQuestionIndex, questions.length - 1);
  const question = questions[safeCurrentIndex];
  const isLast = safeCurrentIndex === questions.length - 1;
  const isFirst = safeCurrentIndex === 0;

  const selectedOption = isSolutionMode
    ? filledAnswers[safeCurrentIndex]
    : selectedAnswers[safeCurrentIndex];

  const progressStats = useMemo(() => {
    const answered = selectedAnswers.filter(Boolean).length;
    const total = questions.length;
    const percentage = (answered / total) * 100;
    return { answered, total, percentage };
  }, [selectedAnswers, questions.length]);

  const formatTime = useCallback((seconds) => {
    if (seconds === null) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleSelect = useCallback((option) => {
    if (isSolutionMode) return;
    const updated = [...selectedAnswers];
    updated[safeCurrentIndex] = option;
    setSelectedAnswers(updated);
  }, [isSolutionMode, selectedAnswers, safeCurrentIndex]);

  const handlePrevious = useCallback(() => {
    if (!isFirst) {
      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
    }
  }, [isFirst]);

  const handleNext = useCallback(() => {
    if (!isLast) {
      setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
    }
  }, [isLast, questions.length]);

  const handleSubmit = useCallback((isAutoSubmit = false) => {
    try {
      const correct = selectedAnswers.filter(
        (ans, idx) => ans === questions[idx]?.answer
      ).length;
      const attempted = selectedAnswers.filter(Boolean).length;

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      onNavigate("result", {
        correct,
        attempted,
        total: questions.length,
        selectedAnswers,
        isAutoSubmit,
        timeSpent: timeLimit ? (timeLimit * 60) - (timeRemaining || 0) : null,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setShowSubmitConfirm(false);
      setIsAutoSubmitting(false);
    }
  }, [selectedAnswers, questions, onNavigate, timeLimit, timeRemaining]);

  const handleBackToDashboard = useCallback(() => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onNavigate("dashboard");
    } catch (error) {
      console.error('Error navigating to dashboard:', error);
    }
  }, [onNavigate]);

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Question Not Found</h2>
            <p className="text-gray-600">The requested question could not be loaded.</p>
          </div>
          <Button
            click={handleBackToDashboard}
            content="Back to Dashboard"
            icon={Home}
            style="bg-blue-500 text-white hover:bg-blue-600"
            size="lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className="py-6 px-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSolutionMode
                  ? `Solution ${safeCurrentIndex + 1} of ${questions.length}`
                  : `Question ${safeCurrentIndex + 1} of ${questions.length}`}
              </h2>
              {!isSolutionMode && showProgress && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <CheckSquare className="w-4 h-4" />
                  {progressStats.answered}/{progressStats.total} answered
                </div>
              )}
            </div>
            
            {timeRemaining !== null && !isSolutionMode && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                timeRemaining < 300 // Less than 5 minutes
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : timeRemaining < 600 // Less than 10 minutes
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          
          {showProgress && (
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((safeCurrentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* Question Content */}
        <div className="flex-1 px-6 py-8">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Question */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  Q{safeCurrentIndex + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium leading-relaxed text-gray-900">
                    {question.question}
                  </h3>
                  {!isSolutionMode && (
                    <p className="text-sm text-gray-500 mt-2">
                      Select one answer • Use keys 1-4 for quick selection
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = question.answer === option;
                const optionKey = String.fromCharCode(65 + idx); // A, B, C, D

                let baseClasses = "group relative p-6 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-4 hover:shadow-md";
                let styleClasses = "";

                if (isSolutionMode) {
                  if (isCorrect) {
                    styleClasses = "bg-green-50 border-green-300 text-green-800 shadow-green-100";
                  } else if (isSelected && !isCorrect) {
                    styleClasses = "bg-red-50 border-red-300 text-red-800 shadow-red-100";
                  } else {
                    styleClasses = "bg-white border-gray-200 text-gray-700";
                  }
                } else {
                  styleClasses = isSelected
                    ? "bg-blue-50 border-blue-300 text-blue-800 shadow-blue-100 ring-1 ring-blue-200"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300";
                }

                return (
                  <label key={idx} className={`${baseClasses} ${styleClasses}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isSolutionMode && isCorrect
                          ? 'bg-green-200 text-green-800'
                          : isSolutionMode && isSelected && !isCorrect
                          ? 'bg-red-200 text-red-800'
                          : isSelected
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {optionKey}
                      </div>
                      <input
                        type="radio"
                        name={`question-${safeCurrentIndex}`}
                        value={option}
                        checked={isSelected}
                        disabled={isSolutionMode}
                        onChange={() => handleSelect(option)}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-base leading-relaxed">{option}</span>
                      <div className="text-xs text-gray-400 mt-1">Press {idx + 1} to select</div>
                    </div>
                    {isSolutionMode && isCorrect && (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                    {isSolutionMode && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Solution Details */}
            {isSolutionMode && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Solution Breakdown</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Correct Answer
                    </h5>
                    <p className="text-lg font-medium text-green-700 bg-green-50 p-3 rounded-lg">
                      {question.answer}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Your Result
                    </h5>
                    <div
                      className={`flex items-center gap-3 p-4 rounded-lg font-medium ${
                        filledAnswers[safeCurrentIndex] === question.answer
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {filledAnswers[safeCurrentIndex] === question.answer ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <div>Incorrect</div>
                            {filledAnswers[safeCurrentIndex] && (
                              <div className="text-sm font-normal text-red-600">
                                Your answer: {filledAnswers[safeCurrentIndex]}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {question.explanation && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Explanation
                    </h5>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-800 leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-6 bg-white border-t border-gray-200 shadow-sm">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Button
              click={handlePrevious}
              content="Previous"
              condition={!isFirst}
              icon={ChevronLeft}
              style="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100"
            />
            
            <div className="flex items-center gap-3">
              {isSolutionMode ? (
                <>
                  {!isLast && (
                    <Button
                      click={handleNext}
                      content="Next Solution"
                      icon={ChevronRight}
                      style="bg-blue-500 text-white hover:bg-blue-600"
                    />
                  )}
                  <Button
                    click={handleBackToDashboard}
                    content="Back to Dashboard"
                    icon={Home}
                    style="bg-gray-600 text-white hover:bg-gray-700"
                  />
                </>
              ) : isLast ? (
                <Button
                  click={() => setShowSubmitConfirm(true)}
                  content="Submit Quiz"
                  icon={Send}
                  style="bg-green-500 text-white hover:bg-green-600"
                  loading={isAutoSubmitting}
                />
              ) : (
                <Button
                  click={handleNext}
                  content="Next"
                  icon={ChevronRight}
                  style="bg-blue-500 text-white hover:bg-blue-600"
                />
              )}
            </div>
          </div>
          
          {!isSolutionMode && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Use arrow keys to navigate • Press Ctrl+Enter to submit
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Quiz?</h3>
              <p className="text-gray-600">
                You have answered {progressStats.answered} out of {progressStats.total} questions.
                {progressStats.answered < progressStats.total && (
                  <span className="block mt-2 text-yellow-600 font-medium">
                    {progressStats.total - progressStats.answered} questions remain unanswered.
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                click={() => setShowSubmitConfirm(false)}
                content="Continue Quiz"
                style="bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1"
              />
              <Button
                click={() => handleSubmit()}
                content="Submit Now"
                icon={Send}
                style="bg-green-500 text-white hover:bg-green-600 flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto-submit notification */}
      {isAutoSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Time's Up!</h3>
            <p className="text-gray-600">Automatically submitting your quiz...</p>
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;