import React from "react";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token");
  return !isLoggedIn ? children : <Navigate to="/dashboard" />;
};

export default OpenRoute;