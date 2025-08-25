import { useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiSun, FiMoon, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import avatar from "../../assets/bg1.jpg";
import { MdArrowBack } from "react-icons/md";


const formatBreadcrumb = (pathname) => {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" > ") || "Dashboard";
};

const Header = ({ title, breadcrumbs }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const formattedBreadcrumb = breadcrumbs?.join(" > ") || formatBreadcrumb(location.pathname);
  const pageTitle = title || formattedBreadcrumb.split(" > ").slice(-1)[0];

  return (
    <header className="fixed top-0 left-24 md:left-72 right-4 h-20 
      bg-white/60 backdrop-blur-sm
      border border-white/60 
      shadow-2xl 
      rounded-2xl 
      z-50 
      flex items-center justify-between 
      px-4 md:px-8 
      transition-all 
      ring-1 ring-blue-100/30"
    >
      {/* Left: Page Title */}
      <div className="flex flex-row gap-3 items-center truncate max-w-[60%]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-blue-50 transition"
          aria-label="Go Back"
        >
          <MdArrowBack size={24} className="text-blue-600" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold truncate text-gray-800 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-500 hover:text-blue-600 transition hidden sm:block p-2 rounded-full hover:bg-blue-50"
          aria-label="Toggle Theme"
        >
          {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>

        {/* Notifications */}
        <button
          className="relative text-gray-500 hover:text-blue-600 transition hidden sm:block p-2 rounded-full hover:bg-blue-50"
          aria-label="Notifications"
        >
          <FiBell className="text-xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Avatar (always visible) */}
        <div className="relative group">
          <div
            onClick={() => navigate("profile")}
            className="flex items-center gap-2 cursor-pointer select-none hover:bg-blue-50 px-2 py-1 rounded-full transition"
          >
            <img
              src={avatar}
              alt="User"
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-100 shadow"
            />
            <p className="px-2 text-gray-800 font-semibold hidden sm:block">Harsh Singh</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
