import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: number; 
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRoleString = localStorage.getItem("role");

 
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== undefined) {
    const userRole = Number(userRoleString);
    if (userRole !== role) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
