// Register.jsx
import React, { useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import LoginImage from "../../assets/LoginImage.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Button from "../../Component/Reusable/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Register = () => {
  const [loginTypeForm, setLoginTypeForm] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token); // save token
    toast.success("Login successful");
    navigate("/dashboard"); // now PrivateRoute will allow access
  }
}, [navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans flex flex-col">
      <div className="flex flex-grow flex-col items-center justify-center px-6 py-6 w-full max-w-7xl mx-auto">
        {/* Logo + Title */}
        {/* <div className="flex items-center justify-center -mt-8 mb-10 space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg select-none">LA</span>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight leading-tight">LearnAI</h1>
            <p className="text-sm text-gray-500 mt-1">AI Learning Platform</p>
          </div>
        </div> */}

        {/* Main grid: form + image */}
        <div className="grid grid-cols-1 lg:grid-cols- gap-12 items-center w-full">
          {/* Form Section */}
          <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
            {loginTypeForm ? (
              <SignupForm setLoginTypeForm={setLoginTypeForm} />
            ) : (
              <LoginForm setLoginTypeForm={setLoginTypeForm} />
            )}

            {/* Divider */}
            <div className="relative flex items-center w-full max-w-md">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-xs font-semibold text-gray-400 uppercase select-none">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Buttons */}
            {/* Social Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <a
                href="http://localhost:8000/api/v1/auth/google"
                className="flex-1 flex items-center justify-center gap-3 h-12 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-300 bg-white text-gray-700 font-medium text-sm"
              >
                <FcGoogle className="w-5 h-5" />
                Google
              </a>

              <a
                href="http://localhost:8000/api/v1/auth/facebook"
                className="flex-1 flex items-center justify-center gap-3 h-12 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-colors duration-300 text-white font-medium text-sm shadow-sm hover:shadow-md"
              >
                <FaFacebook className="w-5 h-5" />
                Facebook
              </a>
            </div>

            {/* Footer Links */}
            <div className="text-center w-full max-w-md pt-4">
              <div className="text-sm text-gray-600 mb-2">
                {loginTypeForm
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  onClick={() => setLoginTypeForm(!loginTypeForm)}
                  className="ml-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 inline-flex items-center gap-1"
                >
                  {loginTypeForm ? "Sign In" : "Sign Up"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Image Section */}
          {/* <div className="hidden lg:flex justify-center items-center relative ">
            <div className="relative group max-w-lg w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-3xl blur-3xl transition-all duration-1000 group-hover:blur-4xl"></div>
              <img
                src={LoginImage}
                alt="AI Learning Platform"
                className="relative w-full h-[700px] object-cover rounded-3xl shadow-2xl border border-white/20 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-10 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">10,000+</p>
                    <p className="text-xs text-gray-600">Active Learners</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Smart Features</p>
                    <p className="text-xs text-gray-600">AI Powered</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export  default  Register;
