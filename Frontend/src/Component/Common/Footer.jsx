import React from 'react';
import { Github, Twitter, Linkedin, Lightbulb, Heart } from "lucide-react";

const Footer = () => {
  const navLinks = [
    { label: "About", href: "#about" },
    { label: "API Docs", href: "#api" },
    { label: "GitHub", href: "#github" },
    { label: "Privacy Policy", href: "#privacy" }
  ];

  const socialLinks = [
    { icon: Github, href: "#github", label: "GitHub", color: "hover:text-gray-900" },
    { icon: Twitter, href: "#twitter", label: "Twitter", color: "hover:text-blue-500" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn", color: "hover:text-blue-600" }
  ];

  return (
    <footer className="w-full bg-gradient-to-t from-gray-100 via-gray-50 to-white border-t border-gray-200">
      <div className="w-full max-w-6xl mx-auto px-6 py-10">
        
        {/* Main footer content */}
        <div className="flex flex-col space-y-8">
          
          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium text-base transition-all duration-300 hover:scale-105 hover:underline decoration-blue-600 decoration-2 underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Decorative divider */}
          <div className="flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center gap-6">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`group p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color} border border-gray-200 hover:border-gray-300`}
                >
                  <IconComponent className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                </a>
              );
            })}
          </div>

          {/* Enhanced Footer Attribution */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-medium">Built with</span>
              <div className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-yellow-500 animate-pulse" />
                <Heart className="w-4 h-4 text-red-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <span className="text-sm font-medium">by</span>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-base">
              Virender Singh
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>© 2025 AI Learning Platform. All rights reserved.</p>
          </div>

        </div>
      </div>

      {/* Subtle background pattern */}
      {/* <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100"></div>
      </div> */}
    </footer>
  );
};

export default Footer;