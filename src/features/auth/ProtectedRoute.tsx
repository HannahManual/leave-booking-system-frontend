import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: number; // optional: restrict to specific role (e.g. admin = 2)
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRoleString = localStorage.getItem("role");

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required, check it
  if (role !== undefined) {
    const userRole = Number(userRoleString);
    if (userRole !== role) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
