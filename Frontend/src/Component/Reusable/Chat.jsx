import React, { useRef, useState } from "react";
import { FiLink } from "react-icons/fi";
import bg1 from "../../assets/bg1.jpg"; // user image
import bg2 from "../../assets/bg2.jpg"; // bot image
import Button from "../../Component/Reusable/Button";



// Chat Bubble Component
const ChatBubble = ({ isUser = false, userName, content, profileImage }) => (
  <div
    className={`flex w-full gap-3 px-2 py-2 ${
      isUser ? "justify-end" : "justify-start"
    } animate-fadeIn`}
  >
    {/* Left Profile */}
    {!isUser && (
      <div className="min-w-10 min-h-10">
        <img
          src={profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
        />
      </div>
    )}

    {/* Message Box */}
    <div
      className={`flex flex-col max-w-[80%] sm:max-w-[500px] ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <span className="text-sm px-2 font-semibold text-blue-400 mb-1">
        {userName}
      </span>

      <div
        className={`px-4 py-2 rounded-2xl border text-sm sm:text-base whitespace-pre-wrap break-words ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400 hover:shadow-md"
            : "bg-[#EBEDF2] text-gray-900 border-gray-300 hover:shadow-md"
        }`}
      >
        {content}
      </div>
    </div>

    {/* Right Profile */}
    {isUser && (
      <div className="min-w-10 min-h-10">
        <img
          src={profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
        />
      </div>
    )}
  </div>
);

export default ChatBubble;
