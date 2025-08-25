import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Home,
} from "lucide-react";

const Button = ({
  click,
  content,
  condition = true,
  data = true,
  style,
  icon: Icon,
  loading = false,
}) => (
  <button
    onClick={click}
    disabled={!condition || !data || loading}
    className={`px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 rounded-xl ${style}`}
  >
    {loading ? (
      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
    ) : Icon ? (
      <Icon className="w-4 h-4" />
    ) : null}
    {content}
  </button>
);

const QuizQuestion = ({
  onNavigate,
  isSolutionMode = false,
  filledAnswers = [],
  questions = []
}) => {
  // Validation
  if (!onNavigate || typeof onNavigate !== 'function') {
    console.error('QuizQuestion: onNavigate prop is required and must be a function');
    return <div className="p-4 text-red-600">Navigation function not provided</div>;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">No Questions Available</h2>
          <Button
            click={() => onNavigate("dashboard")}
            content="Back to Dashboard"
            icon={Home}
            style="bg-blue-500 text-white hover:bg-blue-600"
          />
        </div>
      </div>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    () => Array(questions.length).fill(null)
  );

  // Reset state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(questions.length).fill(null));
  }, [questions.length]);

  // Ensure currentQuestionIndex is within bounds
  const safeCurrentIndex = Math.min(currentQuestionIndex, questions.length - 1);
  const question = questions[safeCurrentIndex];
  const isLast = safeCurrentIndex === questions.length - 1;
  const isFirst = safeCurrentIndex === 0;

  const selectedOption = isSolutionMode
    ? filledAnswers[safeCurrentIndex]
    : selectedAnswers[safeCurrentIndex];

  const handleSelect = (option) => {
    if (isSolutionMode) return;
    const updated = [...selectedAnswers];
    updated[safeCurrentIndex] = option;
    setSelectedAnswers(updated);
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
    }
  };

  const handleSubmit = () => {
    try {
      const correct = selectedAnswers.filter(
        (ans, idx) => ans === questions[idx]?.answer
      ).length;
      const attempted = selectedAnswers.filter(Boolean).length;

      onNavigate("result", {
        correct,
        attempted,
        total: questions.length,
        selectedAnswers,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const handleBackToDashboard = () => {
    try {
      onNavigate("dashboard");
    } catch (error) {
      console.error('Error navigating to dashboard:', error);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Question not found</h2>
          <Button
            click={handleBackToDashboard}
            content="Back to Dashboard"
            icon={Home}
            style="bg-blue-500 text-white hover:bg-blue-600"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-4xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <div className="py-6 px-6 border-b border-gray-300 text-center space-y-4">
          <h2 className="text-2xl font-bold">
            {isSolutionMode
              ? `Solution ${safeCurrentIndex + 1} / ${questions.length}`
              : `Question ${safeCurrentIndex + 1} / ${questions.length}`}
          </h2>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{
                width: `${((safeCurrentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 px-6 py-8">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="p-6 bg-gray-100 rounded-xl border border-gray-300 shadow-sm">
              <h3 className="text-lg font-medium">{question.question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = question.answer === option;

                let base =
                  "px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3";
                let style = "";

                if (isSolutionMode) {
                  if (isCorrect) {
                    style = "bg-green-100 border-green-300 text-green-700";
                  } else if (isSelected && !isCorrect) {
                    style = "bg-red-100 border-red-300 text-red-700";
                  } else {
                    style = "bg-white border-gray-300";
                  }
                } else {
                  style = isSelected
                    ? "bg-blue-100 border-blue-300"
                    : "bg-white border-gray-300 hover:bg-gray-100";
                }

                return (
                  <label key={idx} className={`${base} ${style}`}>
                    <input
                      type="radio"
                      name={`question-${safeCurrentIndex}`}
                      value={option}
                      checked={isSelected}
                      disabled={isSolutionMode}
                      onChange={() => handleSelect(option)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="flex-1">{option}</span>
                    {isSolutionMode && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Solution Details */}
            {isSolutionMode && (
              <div className="p-6 bg-gray-100 rounded-xl border border-gray-300 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600">
                    Correct Answer
                  </h4>
                  <p className="text-green-600 font-medium">
                    {question.answer}
                  </p>
                </div>
                {question.explanation && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600">
                      Explanation
                    </h4>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                )}
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl ${
                    filledAnswers[safeCurrentIndex] === question.answer
                      ? "bg-green-100 border border-green-300"
                      : "bg-red-100 border border-red-300"
                  }`}
                >
                  {filledAnswers[safeCurrentIndex] === question.answer ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">
                        Correct
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-600">
                        Incorrect
                        {filledAnswers[safeCurrentIndex] && 
                          ` - Your answer: ${filledAnswers[safeCurrentIndex]}`
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-6 border-t border-gray-300">
          <div className="flex justify-between max-w-3xl mx-auto">
            <Button
              click={handlePrevious}
              content="Previous"
              condition={!isFirst}
              style="bg-gray-200 text-gray-800 hover:bg-gray-300"
            />
            
            <div className="flex gap-3">
              {isSolutionMode ? (
                <>
                  {!isLast && (
                    <Button
                      click={handleNext}
                      content="Next Solution"
                      style="bg-blue-500 text-white hover:bg-blue-600"
                    />
                  )}
                  <Button
                    click={handleBackToDashboard}
                    content="Back to Dashboard"
                    icon={Home}
                    style="bg-gray-500 text-white hover:bg-gray-600"
                  />
                </>
              ) : isLast ? (
                <Button
                  click={handleSubmit}
                  content="Submit Quiz"
                  style="bg-green-500 text-white hover:bg-green-600"
                />
              ) : (
                <Button
                  click={handleNext}
                  content="Next"
                  condition={!isLast}
                  style="bg-blue-500 text-white hover:bg-blue-600"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;