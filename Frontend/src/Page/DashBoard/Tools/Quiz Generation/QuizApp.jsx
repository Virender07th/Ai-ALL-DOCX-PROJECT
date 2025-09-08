import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";


const Button = ({
  click,
  content,
  condition,
  data,
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





const QuizApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionsFromNavigate = location.state?.questions || [];

  const [questions, setQuestions] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (questionsFromNavigate.length > 0) {
      setQuestions(questionsFromNavigate);
      setCurrentView("question");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [questionsFromNavigate]);

  const handleNavigate = (view, data) => {
    setCurrentView(view);
    if (data) setQuizData(data);
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  switch (currentView) {
    case "dashboard":
      return <QuizGenerator />;
    case "result":
      return <QuizResult onNavigate={handleNavigate} resultData={quizData} />;
    case "solution":
      return (
        <QuizQuestion
          onNavigate={handleNavigate}
          isSolutionMode={true}
          filledAnswers={quizData?.selectedAnswers || []}
          questions={questions}
        />
      );
    default:
      return <QuizQuestion onNavigate={handleNavigate} questions={questions} />;
  }
};

export default QuizApp;
