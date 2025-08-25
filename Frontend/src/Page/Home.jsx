import React from "react";
import Navbar from "../Component/Common/Navbar";
import ImagePart from "./LandingPage/ImagePart";
import HeroSection from "./LandingPage/HeroSection";
import ContactUs from "../Component/Common/ContactUs";
import Footer from "../Component/Common/Footer";

// Basic Home Landing Page Component
const Home = ({ isLoggedIn }) => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <div className="w-full mb-15">
        <Navbar isLoggedIn={isLoggedIn} />
      </div>

      {/* Landing Image or Banner */}
      <div className="w-full">
        <ImagePart />
      </div>

      {/* Main Sections */}
      <div className="w-full space-y-2 ">
        <HeroSection />
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
