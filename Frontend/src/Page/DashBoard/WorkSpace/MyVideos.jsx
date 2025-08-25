import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  PlayCircle,
  Calendar,
  Share2,
  MoreVertical,
  Search,
  Filter,
  Eye,
} from "lucide-react";

const generatedVideos = [
  {
    id: 1,
    title: "AI in Education Transforms Learning",
    date: "2024-07-20",
    duration: "3:45",
    views: "1.2k",
    thumbnail: "gradient-1"
  },
  {
    id: 2,
    title: "Future of Classrooms with AI",
    date: "2024-07-21",
    duration: "5:20",
    views: "892",
    thumbnail: "gradient-2"
  },
  {
    id: 3,
    title: "Personalized Learning Using AI",
    date: "2024-07-22",
    duration: "4:15",
    views: "2.1k",
    thumbnail: "gradient-3"
  },
  {
    id: 4,
    title: "AI & Gamification in Learning",
    date: "2024-07-23",
    duration: "6:30",
    views: "756",
    thumbnail: "gradient-4"
  },
  {
    id: 5,
    title: "Ethics of AI in Education",
    date: "2024-07-24",
    duration: "8:12",
    views: "1.8k",
    thumbnail: "gradient-5"
  },
  {
    id: 6,
    title: "How AI Tutors Are Changing Study Habits",
    date: "2024-07-25",
    duration: "4:50",
    views: "1.5k",
    thumbnail: "gradient-6"
  },
];

const MyVideos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const getThumbnailGradient = (type) => {
    const gradients = {
      'gradient-1': 'from-purple-500 to-pink-500',
      'gradient-2': 'from-blue-500 to-cyan-500',
      'gradient-3': 'from-emerald-500 to-teal-500',
      'gradient-4': 'from-orange-500 to-red-500',
      'gradient-5': 'from-indigo-500 to-purple-500',
      'gradient-6': 'from-yellow-500 to-orange-500',
    };
    return gradients[type] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                🎥 My Videos
              </h1>
              <p className="text-gray-500 mt-1">Manage and explore your generated content</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button className="p-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 hover:text-blue-500 hover:border-blue-400 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generatedVideos.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/video")}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <div className={`w-full h-full bg-gradient-to-br ${getThumbnailGradient(video.thumbnail)} flex items-center justify-center`}>
                    <Video className="w-12 h-12 text-white/80" />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-gray-900 font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors">
                    {video.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVideos;
