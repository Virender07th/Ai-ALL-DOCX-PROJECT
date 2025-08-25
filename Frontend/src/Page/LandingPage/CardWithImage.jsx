import React from "react";

const CardwithImage = ({ image, heading, content }) => {
  return (
    <div className="group w-full max-w-[300px] min-h-[350px] p-5 rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center gap-5 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 via-cyan-50/0 to-blue-50/0 group-hover:from-teal-50/30 group-hover:via-cyan-50/20 group-hover:to-blue-50/30 transition-all duration-700 rounded-2xl"></div>
      
      {/* Enhanced Image with overlay effect */}
      <div className="relative z-10 w-full h-48 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-md group-hover:shadow-lg">
        <img
          src={image}
          alt={heading}
          className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/10 group-hover:to-transparent transition-all duration-500"></div>
      </div>

      {/* Enhanced Title */}
      <h3 className="relative z-10 text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
        {heading}
      </h3>

      {/* Enhanced Description */}
      <p className="relative z-10 text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-grow">
        {content}
      </p>
    </div>
  );
};

export default CardwithImage;
