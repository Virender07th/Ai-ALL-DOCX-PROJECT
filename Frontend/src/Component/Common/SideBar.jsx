// Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Video,
  Upload,
  HelpCircle,
  MessageCircle,
  LogOut,
  Settings,
  Menu,
  User,
} from "lucide-react";
import ConfirmationModal from "../../Component/Reusable/ConfirmationModal";
import { useDispatch } from "react-redux";
import { logout } from "../../Service/Operations/AuthAPI";

const sidebarNav = [
  {
    section: "Workspace",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: Home },
      // { name: "My Videos", path: "/my-videos", icon: Video },
      // { name: "My Uploads", path: "/my-uploads", icon: Upload },
    ],
  },
  {
    section: "AI Tools",
    items: [
      { name: "Quiz Generator", path: "/quiz", icon: HelpCircle },
      { name: "Interview Q&A", path: "/interview-question-generation", icon: HelpCircle },
      { name: "Chat with File", path: "/upload-file", icon: MessageCircle },
      // { name: "Generate Video", path: "/generate-video", icon: Video },
    ],
  },
  {
    section: "Settings",
    items: [
      { name: "Settings", path: "/settings", icon: Settings },
      { name: "Logout", path: "", icon: LogOut },
    ],
  },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const [showModal, setShowModal] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out z-40 ${
          collapsed ? "w-22" : "w-72"
        } bg-white border-r border-gray-200 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center transition-all duration-300 ${collapsed ? "justify-center" :""}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">LA</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">LearnAI</h1>
                <p className="text-xs text-gray-500">AI Learning Platform</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onToggle(!collapsed)}
            className="p-2 ml-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-sm"
          >
            <Menu className="w-2 h-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2">
          {sidebarNav.map((section, idx) => (
            <div key={idx} className="mb-8">
              {!collapsed && (
                <div className="px-4 mb-3">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.section}
                  </h2>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-1 rounded"></div>
                </div>
              )}

              <nav className="space-y-1">
                {section.items.map(({ name, path, icon: Icon }, itemIdx) => {
                  const isLogout = name.toLowerCase() === "logout";
                  const isActive = pathname === path;

                  return (
                    <div key={itemIdx} className="relative group">
                      {isLogout ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                            showModal
                              ? "bg-red-50 text-red-600 shadow-sm border border-red-200"
                              : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <div className="relative z-10 flex items-center gap-3 w-full">
                            <Icon className="w-5 h-5" />
                            {!collapsed && <span className="truncate">{name}</span>}
                          </div>
                        </button>
                      ) : (
                        <NavLink
                          to={path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                              isActive
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-200"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className="relative z-10 flex items-center gap-3 w-full">
                                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                                {!collapsed && <span className="truncate">{name}</span>}
                              </div>
                            </>
                          )}
                        </NavLink>
                      )}

                      {collapsed && (
                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-gray-700 z-50">
                          {name}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-700"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">Welcome back!</p>
                  <p className="text-xs text-gray-500">Ready to learn?</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
          <ConfirmationModal
            title="Are you sure you want to logout?"
            subtitle="You will be redirected to the login page."
            btnContent1="Cancel"
            btnContent2="Logout"
            onCancel={() => setShowModal(false)}
            onConfirm={handleLogout}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
