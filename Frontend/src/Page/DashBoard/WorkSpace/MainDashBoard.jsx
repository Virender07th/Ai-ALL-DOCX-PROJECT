import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Clock, ClipboardList, TrendingUp } from "lucide-react";
import { getUserProfileDetaile } from "../../../Service/Operations/ProfileAPI";
import { toast } from "react-hot-toast";
import { recordStats } from "framer-motion";
// import apiConnector from "../../Service/apiConnector"; // adjust import
// import { USER_ACTIVITY_API, USER_STATS_API } from "../../Service/ApiEndpoints";
// Data
const recentActivity = [
  { title: "AI in Education.pdf", date: "2024-07-21", type: "upload", status: "completed" },
  { title: "Notes.txt", date: "2024-07-21", type: "upload", status: "completed" },
  { title: "Student Data.xlsx", date: "2024-07-21", type: "upload", status: "processing" },
  { title: "Presentation.pptx", date: "2024-07-21", type: "upload", status: "completed" },
  { title: "Classroom.jpg", date: "2024-07-21", type: "upload", status: "completed" },
  { title: "Research.docx", date: "2024-07-21", type: "upload", status: "failed" },
];

const detailCard = [
  { 
    title: "Interview Question", 
    number: "10", 
    icon: <ClipboardList className="w-6 h-6" />, 
    color: "from-purple-500 to-indigo-600",
    change: "+12%",
    trend: "up"
  },
  { 
    title: "Files Uploaded", 
    number: "5", 
    icon: <FileText className="w-6 h-6" />, 
    color: "from-blue-500 to-cyan-600",
    change: "+8%",
    trend: "up"
  },
  { 
    title: "Quizzes Created", 
    number: "12", 
    icon: <ClipboardList className="w-6 h-6" />, 
    color: "from-emerald-500 to-teal-600",
    change: "+15%",
    trend: "up"
  },
  { 
    title: "Time Spent", 
    number: "4h 30m", 
    icon: <Clock className="w-6 h-6" />, 
    color: "from-orange-500 to-red-600",
    change: "+5%",
    trend: "up"
  },
];


const MainDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  // const [recentActivity, setRecentActivity] = useState( recentActivity || []);
  // const [detailCard, setDetailCard] = useState(detailCard || []);
  const [loading, setLoading] = useState(true);

  // Fetch user details on mount
  useEffect(() => {
    dispatch(getUserProfileDetaile());
  }, [dispatch]);

  // Fetch activity and stats
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // const [activityRes, statsRes] = await Promise.all([
        //   apiConnector("GET", USER_ACTIVITY_API),
        //   apiConnector("GET", USER_STATS_API),
        // ]);

        // setRecentActivity(activityRes.data.activities || []);
        // const stats = statsRes.data.stats || [];

        // Map API stats to your card structure
        // setDetailCard([
        //   {
        //     title: "Interview Questions",
        //     number: stats.interviewQuestions || 0,
        //     icon: <ClipboardList />,
        //     color: "from-purple-500 to-indigo-600",
        //     change: "+12%",
        //     trend: "up",
        //   },
        //   {
        //     title: "Files Uploaded",
        //     number: stats.filesUploaded || 0,
        //     icon: <FileText />,
        //     color: "from-blue-500 to-cyan-600",
        //     change: "+8%",
        //     trend: "up",
        //   },
        //   {
        //     title: "Quizzes Created",
        //     number: stats.quizzesCreated || 0,
        //     icon: <ClipboardList />,
        //     color: "from-emerald-500 to-teal-600",
        //     change: "+15%",
        //     trend: "up",
        //   },
        //   {
        //     title: "Time Spent",
        //     number: stats.timeSpent || "0h 0m",
        //     icon: <Clock />,
        //     color: "from-orange-500 to-red-600",
        //     change: "+5%",
        //     trend: "up",
        //   },
        // ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: "bg-emerald-100 text-emerald-600",
      processing: "bg-yellow-100 text-yellow-600",
      failed: "bg-red-100 text-red-600",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex flex-col w-full h-full px-6 py-8 gap-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome back, {user?.userName || "User"} 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your recent activity and insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {detailCard.map((card, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-2xl border border-gray-300 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                  {React.cloneElement(card.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {card.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.number}</p>
              </div>
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-100 rounded-2xl border border-gray-300 overflow-hidden">
          <div className="p-6 border-b border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-gray-500 mt-1">
              Track your latest uploads and generations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-4 text-gray-700 font-semibold">Activity</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Date</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-900 font-medium">{activity.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{activity.date}</td>
                    <td className="p-4">{getStatusBadge(activity.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
