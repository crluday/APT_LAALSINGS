import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
