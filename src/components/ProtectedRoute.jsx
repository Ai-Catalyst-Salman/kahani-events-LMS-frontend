// src/components/ProtectedRoute.jsx
// ----------------------------------
// Wraps any route that requires authentication.
// - If auth is loading  → shows PageLoader (no flash of wrong content)
// - If not logged in    → redirects to /login, preserving the intended URL
// - If requireAdmin and not admin → redirects to / silently
// - Otherwise          → renders children

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "./PageLoader";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Still restoring session from localStorage — wait silently
  if (loading) return <PageLoader />;

  // Not logged in → send to login, remember where they wanted to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin, and admin is required → send home
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
