import React, { useState } from "react";
import {
  Download,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import {
  FaRegFilePdf,
  FaRegFileAlt,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFile,
} from 'react-icons/fa';

const files = [
  { title: "AI in Education.pdf", date: "2024-07-21", size: "2.4 MB", type: "pdf" },
  { title: "Notes.txt", date: "2024-07-21", size: "45 KB", type: "txt" },
  { title: "Student Data.xlsx", date: "2024-07-21", size: "1.8 MB", type: "xlsx" },
  { title: "Presentation.pptx", date: "2024-07-21", size: "5.2 MB", type: "pptx" },
  { title: "Classroom.jpg", date: "2024-07-21", size: "892 KB", type: "jpg" },
  { title: "Research.docx", date: "2024-07-21", size: "756 KB", type: "docx" },
];

const UploadedFiles = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getFileIcon = (type) => {
    const iconProps = { className: "text-6xl mb-4" };

    switch (type) {
      case 'pdf':
        return <FaRegFilePdf {...iconProps} className="text-red-400 text-6xl mb-4" />;
      case 'txt':
        return <FaRegFileAlt {...iconProps} className="text-yellow-400 text-6xl mb-4" />;
      case 'xlsx':
      case 'xls':
        return <FaFileExcel {...iconProps} className="text-emerald-400 text-6xl mb-4" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint {...iconProps} className="text-orange-400 text-6xl mb-4" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage {...iconProps} className="text-blue-400 text-6xl mb-4" />;
      default:
        return <FaFile {...iconProps} className="text-slate-400 text-6xl mb-4" />;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'pdf': return 'from-red-500 to-red-600';
      case 'txt': return 'from-yellow-500 to-yellow-600';
      case 'xlsx': return 'from-emerald-500 to-emerald-600';
      case 'pptx': return 'from-orange-500 to-orange-600';
      case 'jpg': return 'from-blue-500 to-blue-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
   <div className="min-h-screen bg-white text-slate-900">
  <div className="flex flex-col w-full h-full">
    {/* Header */}
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📁 Uploaded Files
          </h1>
          <p className="text-slate-500 mt-1">Manage your uploaded documents and media</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button className="p-2 bg-white border border-slate-300 rounded-xl text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    {/* Files Grid */}
    <div className="flex-1 px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {files.map((file, index) => (
          <div
            key={index}
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {/* File Icon */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {getFileIcon(file.type)}
                <div className={`absolute inset-0 bg-gradient-to-r ${getFileColor(file.type)} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
              </div>

              {/* File Info */}
              <div className="space-y-2 w-full">
                <h3 className="text-slate-900 font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {file.title}
                </h3>

                <div className="space-y-1 text-xs text-slate-500">
                  <p>{file.date}</p>
                  <p className="font-medium">{file.size}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
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

export default UploadedFiles;
