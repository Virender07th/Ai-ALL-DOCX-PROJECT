import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";

// const questions = [
//   {
//     question: "What is the time complexity of binary search?",
//     options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
//     answer: "O(log n)",
//     explanation:
//       "Binary search divides the search space in half each step, resulting in logarithmic time.",
//   },
//   {
//     question: "Which data structure uses LIFO?",
//     options: ["Queue", "Stack", "Array", "Linked List"],
//     answer: "Stack",
//     explanation:
//       "Stack (Last In, First Out) is used where the last inserted element is removed first.",
//   },
//   {
//     question: "What is the output of typeof null in JavaScript?",
//     options: ["object", "null", "undefined", "number"],
//     answer: "object",
//     explanation:
//       "Due to a historical bug, typeof null returns 'object' in JavaScript.",
//   },
//   {
//     question: "Which algorithm is used to find the shortest path in a graph?",
//     options: ["DFS", "BFS", "Dijkstra's Algorithm", "Prim's Algorithm"],
//     answer: "Dijkstra's Algorithm",
//     explanation:
//       "Dijkstra's algorithm is widely used for finding the shortest path in weighted graphs.",
//   },
//   {
//     question: "What is the default port for HTTP?",
//     options: ["443", "21", "80", "8080"],
//     answer: "80",
//     explanation: "Port 80 is the default for HTTP; HTTPS uses 443.",
//   },
//   {
//     question: "Which one is NOT a primitive data type in Java?",
//     options: ["int", "String", "char", "boolean"],
//     answer: "String",
//     explanation: "String is an object, not a primitive type in Java.",
//   },
//   {
//     question: "What does AI stand for?",
//     options: [
//       "Automated Input",
//       "Artificial Intelligence",
//       "Analytical Integration",
//       "Automatic Interface",
//     ],
//     answer: "Artificial Intelligence",
//     explanation: "AI refers to machines simulating human intelligence.",
//   },
//   {
//     question: "Which SQL clause is used to filter rows?",
//     options: ["SELECT", "FROM", "WHERE", "GROUP BY"],
//     answer: "WHERE",
//     explanation:
//       "WHERE is used to filter records that meet a specified condition.",
//   },
//   {
//     question: "Which programming language is primarily used for data analysis?",
//     options: ["Java", "C++", "R", "Swift"],
//     answer: "R",
//     explanation:
//       "R is designed for statistical computing and data visualization.",
//   },
//   {
//     question: "Which HTTP method is idempotent?",
//     options: ["POST", "GET", "PUT", "PATCH"],
//     answer: "PUT",
//     explanation:
//       "PUT is idempotent, meaning repeated requests have the same effect.",
//   },
// ];

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
