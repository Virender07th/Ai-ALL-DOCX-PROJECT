import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Button from "../Reusable/Button";
import { landingNav } from "../../Data/navbar";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

const Navbar = ({ isLoggedIn }) => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = landingNav;

  return (
    <nav className="w-full bg-gray-100 shadow-xl  top-0 z-50 fixed  left-0">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[65px]  ">
        
        {/* Logo */}
        <div className="text-xl font-bold text-gray-900">
          <Link to="/">LearnAI</Link>
        </div>

        <div className="flex justify-between gap-5">
          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-8">
            {navItems.map((item) =>
              item.path.startsWith("/#") ? (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-sm font-medium text-gray-700 hover:text-blue-500 transition duration-200"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition duration-200 ${
                    location.pathname === item.path
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="flex items-center">
            {isLoggedIn && (
              <Link to="/register">
                <Button
                  content="Get Started"
                  variant="primary"
                  size="md"
                  fullWidth={false}
                />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden mt-1">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div className="sm:hidden bg-white shadow-inner">
          <div className="flex flex-col items-start px-4 py-4 gap-3">
            {navItems.map((item) =>
              item.path.startsWith("/#") ? (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-500 w-full"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`text-sm font-medium w-full transition duration-200 ${
                    location.pathname === item.path
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}

            {/* Mobile CTA */}
            {isLoggedIn && (
              <Link to="/register" className="w-full">
                <Button
                  content="Get Started"
                  variant="primary"
                  size="md"
                  fullWidth={true}
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
