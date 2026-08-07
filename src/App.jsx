// src/App.jsx
// -----------
// Root component: wraps the app in AuthProvider and sets up React Router.
// Protected routes use ProtectedRoute which handles auth checks cleanly.

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";

// Route pages
import Home from "./routes/Home";
import Login from "./routes/Login";
import Courses from "./routes/Courses";
import CourseDetail from "./routes/CourseDetail";
import Quiz from "./routes/Quiz";
import Admin from "./routes/Admin";

/**
 * Inner app — uses useAuth so it can show the page loader while the
 * session is being restored from localStorage on mount.
 */
function AppInner() {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <>
      <Navbar />
      <Routes>
        {/* ── Public routes ────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ── Protected: must be logged in ─────────────────────── */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        {/* ── Admin only: must be logged in AND role === 'admin' ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ── 404 fallback ─────────────────────────────────────── */}
        <Route
          path="*"
          element={
            <div className="page flex items-center justify-center min-h-[60vh]">
              <div className="text-center px-4">
                <p className="font-heading text-6xl font-bold text-kahani-primary/30 mb-3">
                  404
                </p>
                <h1 className="font-heading text-2xl font-bold text-kahani-text mb-2">
                  Page not found
                </h1>
                <p className="text-kahani-text-muted text-sm">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}
