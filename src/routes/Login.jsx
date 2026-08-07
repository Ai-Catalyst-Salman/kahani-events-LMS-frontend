// src/routes/Login.jsx
// --------------------
// Login page with email/password form.
// Uses Supabase signInWithPassword via AuthContext.
// Shows rate-limit error from backend on 429.

import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to the page they were trying to access, or /courses by default.
  const from = location.state?.from?.pathname || "/courses";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(email, password);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  }

  if (!authLoading && user) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="page min-h-screen flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-kahani-gradient" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col justify-center px-16 py-12">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <img
              src="/logo.png"
              alt="Kahani Events"
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-snug">
            Welcome back to
            <br />
            <span className="text-kahani-accent1">Training Hub</span>
          </h2>
          <p className="text-white/75 text-sm leading-relaxed max-w-xs">
            Log in to access your courses, track progress, and unlock quizzes
            across the Kahani Events training library.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            {[
              { icon: "🎬", label: "Video courses" },
              { icon: "✅", label: "Progress tracking" },
              { icon: "🔓", label: "Quiz unlocks" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img
              src="/logo.png"
              alt="Kahani Events"
              className="h-10 w-auto object-contain"
            />
          </div>

          <h1 className="font-heading text-3xl font-bold text-kahani-text mb-1">
            Sign in
          </h1>
          <p className="text-kahani-text-muted text-sm mb-8">
            Use your Kahani Events account credentials.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="login-form">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="input-label">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@kahaniEvents.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="input-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-kahani-text-muted hover:text-kahani-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert-error" role="alert">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-kahani-text-muted mt-6">
            <Link to="/" className="hover:text-kahani-primary transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
