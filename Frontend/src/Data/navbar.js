import {
  FiHome,
  FiVideo,
  FiUpload,
  FiClock,
  FiPlayCircle,
  FiHelpCircle,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";


export const landingNav = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Features",
    path: "/features", // scroll to section in landing
  },
  {
    name: "Contact Us",
    path: "/contact", // scroll to section in landing
  },
  {
    name: "About Us",
    path: "/about",
  },
];


export const sidebarNav = [
  {
    section: "Workspace",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: "FiHome" },
      // { name: "My Videos", path: "/my-videos", icon: "FiVideo" },
      // { name: "My Uploads", path: "/my-uploads", icon: "FiUpload" },
    ],
  },
  {
    section: "AI Tools",
    items: [
      { name: "Chat with Docs", path: "/uploadfile", icon: "FiMessageSquare" },
      { name: "Quiz Generator", path: "/quiz", icon: "FiHelpCircle" },
      { name: "Interview Q&A", path: "/interview-question-generation", icon: "FiHelpCircle" },
      { name: "Ask Anything", path: "/ask-any-thing", icon: "FiMessageCircle" },
      // { name: "Generate Video", path: "/generate-video", icon: "FiVideo" },
    ],
  },
  // {
  //   section: "Settings",
  //   items: [
  //     { name: "Settings", path: "/settings", icon: "FiSettings" },
  //     { name: "Logout", path: "/logout", icon: "FiLogOut" },
  //   ],
  // },
];

