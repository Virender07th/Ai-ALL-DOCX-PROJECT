import React from "react";

// Check if the icon is pre-colored (like FcIcons from 'react-icons/fc')
const CardWithIcon = ({ icon: Icon, color = "", heading, content }) => {
  return (
    <div className="group w-full max-w-[280px] min-h-[300px] p-6 rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-start items-center gap-5 text-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-cyan-50/0 group-hover:from-blue-50/40 group-hover:via-purple-50/20 group-hover:to-cyan-50/40 transition-all duration-700 rounded-2xl"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Enhanced Icon Container */}
      <div className="relative z-10 w-18 h-18 flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-white group-hover:to-gray-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
        <Icon className={`w-10 h-10 ${color} group-hover:scale-110 transition-transform duration-300`} />
      </div>

      {/* Enhanced Title */}
      <h3 className="relative z-10 text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 group-hover:scale-105">
        {heading}
      </h3>

      {/* Enhanced Description */}
      <p className="relative z-10 text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-grow">
        {content}
      </p>
    </div>
  );
};

export default CardWithIcon;
