import React from "react";
import {
  FaBookOpen,
  FaVideo,
  FaRegQuestionCircle,
  FaFileAlt,
  FaMicroscope,
  FaChartLine,
  FaRegLightbulb,
  FaGlobe,
  FaCogs,
  FaHandsHelping,
  FaUserGraduate, FaChalkboardTeacher, FaBriefcase
} from "react-icons/fa";

// 1. Content Transformation Tools
const contentFeatures = [
  {
    title: "AI-Powered Video Creation",
    description:
      "Convert documents like PDFs or slide decks into narrated video lessons with visuals and animations.",
    icon: <FaVideo />,
  },
  {
    title: "Smart Quiz Builder",
    description:
      "Instantly generate customized quizzes based on your documents to boost engagement and retention.",
    icon: <FaRegQuestionCircle />,
  },
  {
    title: "Insightful Summaries",
    description:
      "Get concise and meaningful summaries of large documents to understand key points at a glance.",
    icon: <FaFileAlt />,
  },
];

// 2. Interaction & Analysis Tools
const analysisFeatures = [
  {
    title: "Deep Content Understanding",
    description:
      "Leverage AI to extract key concepts, structure, and contextual information from complex files.",
    icon: <FaMicroscope />,
  },
  {
    title: "Instant Learning Insights",
    description:
      "Receive real-time AI-powered insights, helping you identify strengths and focus areas.",
    icon: <FaChartLine />,
  },
  {
    title: "Adaptive Learning Engine",
    description:
      "Personalized learning workflows tailored to your pace, knowledge gaps, and performance trends.",
    icon: <FaRegLightbulb />,
  },
];

// 3. General Platform Capabilities
const generalFeatures = [
  {
    title: "Multi-Source Integration",
    description:
      "Interact with various sources like PDFs, YouTube videos, websites, and Wikipedia—all in one place.",
    icon: <FaGlobe />,
  },
  {
    title: "Intuitive User Experience",
    description:
      "Built with a clean and minimal interface, designed for clarity, speed, and distraction-free learning.",
    icon: <FaCogs />,
  },
];

// 4. Target Users

const targetUsers = [
  {
    title: "Students & Learners",
    description:
      "Convert textbooks and notes into bite-sized videos, quizzes, and summaries for exam prep and understanding.",
    icon: <FaUserGraduate />,
  },
  {
    title: "Teachers & Educators",
    description:
      "Design multimedia-rich content, generate assessments, and track student performance with intelligent feedback.",
    icon: <FaChalkboardTeacher />,
  },
  {
    title: "Working Professionals",
    description:
      "Accelerate skill-building using AI to dissect research papers, manuals, and reports into actionable knowledge.",
    icon: <FaBriefcase />,
  },
];


const LearnAIDocs = () => {
  return (
    <div className="bg-white text-[#111418] min-h-screen font-[Inter,sans-serif]">
     

      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-4 bg-slate-50">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold" id="features">Platform Features</h2>
          <p className="text-[#4b5563] mt-2 text-lg">Explore the core functionalities of LearnAI.</p>
        </section>

        {/* Content Transformation */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 border-b border-[#e5e7eb] pb-2">Content Transformation</h3>
          <div className="space-y-6">
            {contentFeatures.map((item, index) => (
              <div key={index} className="flex items-start gap-5 bg-white p-4 rounded-lg shadow-sm hover:shadow-md">
                <div className="text-[#3d98f4] bg-[#f0f2f5] size-12 flex items-center justify-center rounded-xl text-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#111418] mb-1">{item.title}</p>
                  <p className="text-sm text-[#4b5563] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interaction & Analysis */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 border-b border-[#e5e7eb] pb-2">Interaction & Analysis</h3>
          <div className="space-y-6">
            {analysisFeatures.map((item, index) => (
              <div key={index} className="flex items-start gap-5 bg-white p-4 rounded-lg shadow-sm hover:shadow-md">
                <div className="text-[#3d98f4] bg-[#f0f2f5] size-12 flex items-center justify-center rounded-xl text-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#111418] mb-1">{item.title}</p>
                  <p className="text-sm text-[#4b5563] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* General Capabilities */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 border-b border-[#e5e7eb] pb-2">General Capabilities</h3>
          <div className="space-y-6">
            {generalFeatures.map((item, index) => (
              <div key={index} className="flex items-start gap-5 bg-white p-4 rounded-lg shadow-sm hover:shadow-md">
                <div className="text-[#3d98f4] bg-[#f0f2f5] size-12 flex items-center justify-center rounded-xl text-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#111418] mb-1">{item.title}</p>
                  <p className="text-sm text-[#4b5563] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Target Users */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 border-b border-[#e5e7eb] pb-2">Target Users</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {targetUsers.map((user, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md">
                <div className="text-[#3d98f4] bg-[#f0f2f5] size-12 flex items-center justify-center rounded-xl mb-3 text-xl">
                  {user.icon}
                </div>
                <p className="text-lg font-semibold text-[#111418] mb-1">{user.title}</p>
                <p className="text-sm text-[#4b5563] leading-relaxed">{user.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearnAIDocs;
