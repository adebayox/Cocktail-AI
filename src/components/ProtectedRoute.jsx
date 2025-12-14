import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  
  // Check if user has a token (is authenticated)
  const isAuthenticated = user?.token;

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

