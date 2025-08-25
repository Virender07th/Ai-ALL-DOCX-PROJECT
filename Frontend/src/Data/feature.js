// import { CiFileOn, CiGlobe, CiMemoPad } from "react-icons/ci";
// import { FcIdea, FcSettings } from "react-icons/fc";
// import { MdOutlineSummarize, MdUploadFile } from "react-icons/md";
// import { BsRobot } from "react-icons/bs";
// import { IoMdHelpCircleOutline } from "react-icons/io";
// import { RiVideoAddLine } from "react-icons/ri";
// import { FaRegQuestionCircle } from "react-icons/fa";
import UseCase1 from "../assets/UseCase1.png"
import UseCase2 from "../assets/UseCase2.png"
import UseCase3 from "../assets/UseCase3.png"
import AIImage1 from "../assets/AIImage1.png";
import AIImage2 from "../assets/AIImage2.png";
import AIImage3 from "../assets/AIImage3.png";
import {
  Upload,
  HelpCircle,
  Video,
  CircleHelp,
  FileText,
  Globe,
  FileBarChart,
  Bot,
  File,
  Lightbulb,
  Settings,
} from "lucide-react";

// Your actual feature data with Lucide icons
export const featuresOne = [
  {
    icon: Upload,
    color: "text-blue-600",
    heading: "Upload Content",
    content:
      "Upload any educational or technical file — PDFs, code files, or slides — to begin learning.",
  },
  {
    icon: HelpCircle,
    color: "text-green-600",
    heading: "Ask Anything",
    content:
      "Ask questions from uploaded content and receive context-aware answers powered by AI.",
  },
  {
    icon: Video,
    color: "text-pink-500",
    heading: "Generate Study Video",
    content:
      "Turn documents into animated study videos with step-by-step narration and visuals.",
  },
  {
    icon: CircleHelp,
    color: "text-purple-600",
    heading: "Generate Quiz",
    content:
      "Automatically generate multiple-choice quizzes based on the content to reinforce learning.",
  },
];
export const featuresTwo = [
  {
    icon: FileText,
    color: "text-indigo-500",
    heading: "Document Q&A",
    content:
      "Ask natural language questions directly from your PDFs, Word, or Excel files.",
  },
  {
    icon: Globe,
    color: "text-green-500",
    heading: "Web + Wiki QA",
    content:
      "Input URLs or topics to fetch instant summaries and answers from websites or Wikipedia.",
  },
  {
    icon: FileBarChart,
    color: "text-red-500",
    heading: "YouTube Summarizer",
    content:
      "Paste any video link to extract its transcript and get concise, AI-generated summaries.",
  },
  {
    icon: Bot,
    color: "text-purple-500",
    heading: "Agent-Powered Intelligence",
    content:
      "Run tasks through intelligent agents built with LangChain, CrewAI, LangGraph, and AutoGen.",
  },
];

export const featuresThree = [
  {
    icon: File,
    color: "text-blue-500",
    heading: "Supports Docs/Wiki/YT",
    content:
      "Easily interact with documents, Wikipedia content, and YouTube videos using AI-driven tools.",
  },
  {
    icon: Lightbulb,
    color: "text-yellow-500",
    heading: "Powered by GenAI",
    content:
      "Experience the power of Generative AI for creating, summarizing, and understanding any content.",
  },
  {
    icon: Settings,
    color: "text-gray-700",
    heading: "Built using RAG & Agents",
    content:
      "Leverages Retrieval-Augmented Generation and autonomous AI agents for smarter responses.",
  },
];

export const featuresforUserCase = [
  {
    image: UseCase1,
    heading: "Students",
    content:
      "Enhance your study sessions with AI-generated videos from your notes and textbooks.",
  },
  {
    image: UseCase2,
    heading: "Developers",
    content:
      "Learn new codebases faster by converting documentation into video tutorials.",
  },
  {
    image: UseCase3,
    heading: "Researchers",
    content:
      "Summarize research papers and data into digestible video formats.",
  },
];

// Image Sliding
export const ImageSlidingData = [
  {
    id: 0,
    image: AIImage1,
    heading: "Talk to Any File. Any Page. Any Video.",
    content:
      "Upload files, paste URLs, or explore Wikipedia and YouTube — powered by GenAI and multi-agent systems.",
  },
  {
    id: 1,
    image: AIImage2,
    heading: "Revolutionize Your Learning with AI-Powered Study Videos",
    content:
      "Transform your documents and code into engaging study videos with AI. Upload your materials, ask questions, and let our AI generate personalized learning experiences.",
  },
  {
    id: 2,
    image: AIImage3,
    heading: "Chat with Anything",
    content:
      "Upload a file or paste a link to start talking to your data. Experience futuristic animation effects that subtly highlight key features and interactions.",
  },
];
