import React, { useMemo, useEffect, useState } from "react";
import { 
  BookOpen, 
  RotateCw, 
  Home, 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Award,
  Star,
  Download,
  Share2
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
  variant = "default",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    default: style || "bg-gray-200 text-gray-800 hover:bg-gray-300",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={click}
      disabled={!condition || !data || loading}
      className={`${sizeClasses[size]} font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${variantClasses[variant]}`}
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

const StatCard = ({ title, value, color, icon: Icon, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      {trend && (
        <div className={`text-xs px-2 py-1 rounded-full ${
          trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
    <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
    {subtitle && (
      <p className="text-xs text-gray-500">{subtitle}</p>
    )}
  </div>
);

const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = "#3B82F6" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>
    </div>
  );
};

const QuizResult = ({ onNavigate, resultData = {} }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Validate onNavigate prop
  if (!onNavigate || typeof onNavigate !== 'function') {
    console.error('QuizResult: onNavigate prop is required and must be a function');
    return <div className="p-4 text-red-600">Navigation function not provided</div>;
  }

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const total = Math.max(resultData?.total || 10, 1);
  const attempted = Math.min(resultData?.attempted || 8, total);
  const correct = Math.min(resultData?.correct || 6, attempted);
  const selectedAnswers = resultData?.selectedAnswers || [];
  const isAutoSubmit = resultData?.isAutoSubmit || false;
  const timeSpent = resultData?.timeSpent || null;

  const wrong = attempted - correct;
  const unanswered = total - attempted;
  const percentage = Math.round((correct / total) * 100);
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  const performanceLevel = useMemo(() => {
    if (percentage >= 90) return { level: "Excellent", color: "text-emerald-600", bgColor: "bg-emerald-50", icon: Trophy };
    if (percentage >= 80) return { level: "Very Good", color: "text-green-600", bgColor: "bg-green-50", icon: Award };
    if (percentage >= 70) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50", icon: Star };
    if (percentage >= 60) return { level: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Target };
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50", icon: TrendingUp };
  }, [percentage]);

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "#10B981"; // Green
    if (percentage >= 60) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const resultStats = useMemo(
    () => [
      { 
        title: "Total Questions", 
        value: total, 
        color: "text-slate-600", 
        icon: BookOpen,
        subtitle: "Questions available"
      },
      { 
        title: "Attempted", 
        value: attempted, 
        color: "text-blue-600", 
        icon: Target,
        subtitle: `${Math.round((attempted/total)*100)}% completion`
      },
      { 
        title: "Correct", 
        value: correct, 
        color: "text-green-600", 
        icon: CheckCircle,
        subtitle: `${accuracy}% accuracy`
      },
      { 
        title: "Wrong", 
        value: wrong, 
        color: "text-red-600", 
        icon: XCircle,
        subtitle: wrong > 0 ? "Review needed" : "Perfect!"
      },
    ],
    [total, attempted, correct, wrong, accuracy]
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quiz Result',
          text: `I scored ${percentage}% on this quiz! ${correct} out of ${total} correct.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`I scored ${percentage}% on this quiz! ${correct} out of ${total} correct.`);
    }
  };

  const handleDownload = () => {
    const resultText = `
Quiz Results
============
Score: ${percentage}%
Total Questions: ${total}
Attempted: ${attempted}
Correct: ${correct}
Wrong: ${wrong}
${unanswered > 0 ? `Unanswered: ${unanswered}` : ''}
${timeSpent ? `Time Spent: ${formatTime(timeSpent)}` : ''}
Performance: ${performanceLevel.level}
    `.trim();

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-result-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${performanceLevel.bgColor} border border-opacity-20`}>
            <performanceLevel.icon className={`w-6 h-6 ${performanceLevel.color}`} />
            <span className={`font-semibold ${performanceLevel.color}`}>
              {performanceLevel.level}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Quiz Results</h1>
          {isAutoSubmit && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Auto-submitted due to time limit</span>
            </div>
          )}
        </div>

        {/* Main Score Display */}
        <div className="flex justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <div className="text-center space-y-6">
              <ProgressRing 
                progress={isAnimating ? percentage : 0} 
                color={getProgressColor(percentage)}
                size={160}
                strokeWidth={12}
              />
              <div>
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Your Score
                </p>
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  {correct}/{total}
                </p>
                <p className="text-gray-500">
                  {percentage}% overall • {accuracy}% accuracy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {resultStats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              icon={stat.icon}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Performance Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Questions Attempted</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: isAnimating ? `${(attempted/total)*100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{attempted}/{total}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Correct Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: isAnimating ? `${accuracy}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{accuracy}%</span>
                </div>
              </div>
              
              {unanswered > 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    {unanswered} question{unanswered !== 1 ? 's' : ''} left unanswered
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Quick Insights
            </h3>
            <div className="space-y-3">
              {timeSpent && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Time Spent</span>
                  </div>
                  <span className="text-sm text-blue-700 font-medium">{formatTime(timeSpent)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">Average per Question</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {timeSpent ? `${Math.round(timeSpent/attempted)}s` : 'N/A'}
                </span>
              </div>

              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <performanceLevel.icon className={`w-4 h-4 ${performanceLevel.color}`} />
                  <span className="text-sm font-medium text-gray-800">Performance Level</span>
                </div>
                <p className={`text-sm font-semibold ${performanceLevel.color}`}>
                  {performanceLevel.level}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">What's Next?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              content="Back to Dashboard"
              icon={Home}
              click={() => handleNavigation("dashboard")}
              variant="default"
              size="lg"
            />
            
            <Button
              content="View Solutions"
              icon={BookOpen}
              click={handleSolution}
              variant="primary"
              size="lg"
            />
            
            <Button
              content="Retake Quiz"
              icon={RotateCw}
              click={() => handleNavigation("question")}
              variant="success"
              size="lg"
            />
            
            <Button
              content="Share Result"
              icon={Share2}
              click={handleShare}
              variant="default"
              size="lg"
            />
            
            <Button
              content="Download Report"
              icon={Download}
              click={handleDownload}
              variant="default"
              size="lg"
            />
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <p className="text-gray-700 font-medium">
              {percentage >= 90 ? "Outstanding work! You've mastered this topic! 🎉" :
               percentage >= 80 ? "Great job! You're doing really well! 👏" :
               percentage >= 70 ? "Good effort! Keep practicing to improve! 💪" :
               percentage >= 60 ? "You're on the right track! Review and try again! 📚" :
               "Don't give up! Learning is a journey. Keep practicing! 🌟"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;