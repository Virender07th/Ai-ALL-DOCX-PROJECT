import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Edit3, Eye, Calendar, Phone, MapPin, Mail, User ,Info } from "lucide-react";
import Button from "../../../Component/Reusable/Button";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileDetaile } from "../../../Service/Operations/ProfileAPI";


const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.profile);
  const { activities, stats } = useSelector((state) => state.dashboard);

  const { token } = useSelector((state) => state.auth);
  const tokenFromStorage = token || localStorage.getItem("token")
  useEffect(() => {
    if(tokenFromStorage) {
      dispatch(getUserProfileDetaile(tokenFromStorage));
    }
}, [dispatch , tokenFromStorage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
        Loading profile...
      </div>
    );
  }

  if (!user) return <div className="p-8 text-center">No user data found.</div>;

 const profileData = [
  { label: "Full Name", value: user.userName, icon: User, color: "from-blue-500 to-cyan-500" },
  { label: "Email", value: user.email, icon: Mail, color: "from-emerald-500 to-teal-500" },
  { label: "Phone", value: user.contactNumber || "-", icon: Phone, color: "from-purple-500 to-indigo-500" },
  { label: "Address", value: user.location || "-", icon: MapPin, color: "from-orange-500 to-red-500" },
  { label: "Bio", value: user.bio || "-", icon: Info, color: "from-yellow-500 to-orange-500" },
  { label: "Gender", value: user.gender || "-", icon: User, color: "from-pink-500 to-rose-500" },
  { label: "Joined", value: new Date(user.createdAt).toLocaleDateString(), icon: Calendar, color: "from-indigo-500 to-purple-500" },
];


  const quickActions = [
    { icon: Edit3, content: "Edit Profile", variant: "primary", click: () => navigate("/edit-profile") },
    { icon: Eye, content: "View Activity", variant: "secondary" },
  ];

  const statss = [
    { value: stats.interviewQuestions || 0, label: "Interview Question", color: "text-blue-600" },
    { value: stats.filesUploaded || 0, label: "Files", color: "text-emerald-600" },
    { value: stats.quizzesCreated || 0, label: "Quizzes", color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            👤 My Profile
          </h1>
          <p className="text-gray-600 text-lg">View and manage your personal details</p>
        </header>

        {/* Profile Overview */}
        <section className="bg-gray-100 rounded-2xl border border-gray-200 p-8 flex flex-col lg:flex-row gap-8">
          {/* Left: Image & Basic Info */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold">{user.userName}</h2>
              <p className="text-gray-500 text-lg">Premium Member</p>
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Active Now</span>
              </div>
            </div>
          </div>

          {/* Right: Actions & Stats */}
          <div className="flex-1">
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {quickActions.map((btn, i) => (
                <Button key={i} {...btn} size="lg" />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {statss.map((s, i) => (
                <div key={i} className="bg-gray-200 rounded-xl p-4 text-center border border-gray-300">
                  <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profileData.map((item, i) => (
            <div key={i} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-md`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase">{item.label}</p>
                  <p className="text-gray-800 text-lg font-medium break-words">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
