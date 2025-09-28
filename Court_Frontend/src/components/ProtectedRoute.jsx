import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticate = true;
  if (!isAuthenticate) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

export default ProtectedRoute;
