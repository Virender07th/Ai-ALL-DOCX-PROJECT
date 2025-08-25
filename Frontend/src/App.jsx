import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Auth Pages
import Register from "./Page/Auth/Register";
import ForgetPassword from "./Page/Auth/ForgetPassword";
import OTPVerification from "./Page/Auth/OTPVerification";
import UpdatePassword from "./Page/Auth/UpdatePassword";
import ResetPassword from "./Page/Auth/ResetPassword";

// Reusable Components
import OpenRoute from "./Component/Reusable/OpenRoute";
import PrivateRoute from "./Component/Reusable/PrivateRoute";
import PageNotFound from "./Component/Reusable/PageNotFound";

// Common Pages
import Home from "./Page/Home";
import ContactUs from "./Component/Common/ContactUs";
import AboutUs from "./Component/Common/AboutUs";
import FeaturesDocs from "./Component/Common/FeaturesDocs";

// Dashboard and Nested Pages
import Dashboard from "./Page/DashBoard";
import MainDashBoard from "./Page/DashBoard/WorkSpace/MainDashBoard";
import QuizGenerator from "./Page/DashBoard/Tools/Quiz Generation/QuizGenerator";
import Profile from "./Page/DashBoard/Settings/Profile";
import UpdateProfile from "./Page/DashBoard/Settings/UpdateProfile";
import Settings from "./Page/DashBoard/Settings/Settings";
import InterviewQuestionGeneration from "./Page/DashBoard/Tools/InterviewQuestion/InterviewQuestionGeneration";
import InterviewQuestion from "./Page/DashBoard/Tools/InterviewQuestion/InterviewQuestion";
import QuizApp from "./Page/DashBoard/Tools/Quiz Generation/QuizApp";
import ChatWithFile from "./Page/DashBoard/Tools/ChatOnFile/ChatWithFile";
import UploadFile from "./Page/DashBoard/Tools/ChatOnFile/UploadFile";
import CheckEmailPage from "./Page/Auth/CheckEmail";


function App() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className=" min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/features" element={<FeaturesDocs />} />

        {/* Auth Routes */}
        <Route path="register" element={<OpenRoute><Register/></OpenRoute>} />
        <Route path="forgot-password" element={<OpenRoute><ForgetPassword /></OpenRoute>} />
        <Route path="check-email" element={<OpenRoute><CheckEmailPage /></OpenRoute>} />
        
        <Route path="verify-otp" element={<OpenRoute><OTPVerification /></OpenRoute>} />
        
        <Route path="reset-password/:token" element={<OpenRoute><ResetPassword /></OpenRoute>} />

        {/* Protected Dashboard Routes */}
        <Route element={ <PrivateRoute><Dashboard /></PrivateRoute>}>

          {/* Workspace */}
          <Route path="dashboard" element={<MainDashBoard />} />


          {/* Tools */}
          
          <Route path="upload-file" element={<UploadFile />} />
          <Route path="chat-with-file" element={<ChatWithFile />} />

          <Route path="quiz" element={<QuizGenerator />} />

          <Route path="questions" element={<QuizApp />} />

          {/* <Route path="result" element={<QuizApp />}/> */}

          <Route path="interview-question-generation" element={<InterviewQuestionGeneration/>} />
          <Route path="interview-question" element={<InterviewQuestion/>} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<UpdateProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
