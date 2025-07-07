import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/auth/login" replace />;
  }

  if (!roles.includes(currentUser.role)) {
    // No permission, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
} 