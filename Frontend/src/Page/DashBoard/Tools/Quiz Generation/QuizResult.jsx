import React, { useMemo } from "react";
import { BookOpen, RotateCw, Home } from "lucide-react";

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

const QuizResult = ({ onNavigate, resultData = {} }) => {
  // Validate onNavigate prop
  if (!onNavigate || typeof onNavigate !== 'function') {
    console.error('QuizResult: onNavigate prop is required and must be a function');
    return <div className="p-4 text-red-600">Navigation function not provided</div>;
  }

  const total = Math.max(resultData?.total || 10, 1); // Ensure at least 1
  const attempted = Math.min(resultData?.attempted || 8, total); // Can't exceed total
  const correct = Math.min(resultData?.correct || 6, attempted); // Can't exceed attempted
  const selectedAnswers = resultData?.selectedAnswers || [];

  const wrong = attempted - correct;

  const resultStats = useMemo(
    () => [
      { title: "Total Questions", value: total, color: "text-blue-600" },
      { title: "Attempted", value: attempted, color: "text-yellow-600" },
      { title: "Correct", value: correct, color: "text-green-600" },
      { title: "Wrong", value: wrong, color: "text-red-600" },
    ],
    [total, attempted, correct, wrong]
  );

  const handleSolution = () => {
    try {
      onNavigate("solution", { selectedAnswers });
    } catch (error) {
      console.error('Error navigating to solution:', error);
    }
  };

  const handleNavigation = (route, data = null) => {
    try {
      onNavigate(route, data);
    } catch (error) {
      console.error(`Error navigating to ${route}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">Quiz Summary</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {resultStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-4 rounded-xl border border-gray-300 shadow-sm"
            >
              <h4 className="text-sm text-gray-500">{item.title}</h4>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg font-medium">
            You scored{" "}
            <span className="text-blue-600 font-bold">
              {Math.round((correct / total) * 100)}%
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              content="Back to Dashboard"
              icon={Home}
              click={() => handleNavigation("dashboard")}
              style="bg-gray-200 text-gray-800 hover:bg-gray-300"
            />
            <Button
              content="View Solutions"
              icon={BookOpen}
              click={handleSolution}
              style="bg-gray-200 text-gray-800 hover:bg-gray-300"
            />
            <Button
              content="Retake Quiz"
              icon={RotateCw}
              click={() => handleNavigation("question")}
              style="bg-blue-500 text-white hover:bg-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;