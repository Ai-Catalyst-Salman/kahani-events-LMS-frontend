// src/components/Navbar.jsx
// -------------------------
// Responsive top navigation bar with Kahani branding.
// Security: no external links without rel="noopener noreferrer"
// UX: mobile menu closes on outside click, shows role badge

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const navRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSignOut() {
    setShowSignOutConfirm(true);
    setMobileOpen(false);
  }

  async function confirmSignOut() {
    await signOut();
    navigate("/");
    setShowSignOutConfirm(false);
  }

  const navLinkClass = ({ isActive }) =>
    [
      "relative px-1 py-0.5 text-sm font-medium transition-colors duration-200",
      "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200",
      isActive
        ? "text-kahani-primary after:w-full after:bg-kahani-primary"
        : "text-kahani-text-muted hover:text-kahani-primary after:w-0 hover:after:w-full after:bg-kahani-primary",
    ].join(" ");

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-kahani-primary/10 text-kahani-primary"
        : "text-kahani-text-muted hover:bg-kahani-primary/5 hover:text-kahani-primary"
    }`;

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-kahani-border shadow-kahani-sm"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand ─────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="/logo.png"
              alt="Kahani Events"
              className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity duration-200"
            />
          </Link>

          {/* ── Desktop nav links ──────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            {user && (
              <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
            )}
            {user && role === "admin" && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>

          {/* ── Desktop auth actions ───────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Truncate long emails */}
                <span
                  className="text-xs text-kahani-text-muted font-medium max-w-[160px] truncate"
                  title={user.email}
                >
                  {user.email}
                </span>
                {role && (
                  <span className={role === "admin" ? "badge-primary" : "badge-secondary"}>
                    {role}
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="btn-ghost text-xs"
                  id="navbar-signout"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-xs px-4 py-2" id="navbar-login">
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile menu toggle ─────────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-lg text-kahani-text-muted hover:text-kahani-primary hover:bg-kahani-primary/10 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            id="navbar-mobile-toggle"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-kahani-border animate-slide-up shadow-kahani-md"
        >
          <div className="px-4 py-3 space-y-1">
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
              Home
            </NavLink>
            {user && (
              <NavLink to="/courses" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
                Courses
              </NavLink>
            )}
            {user && role === "admin" && (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass}>
                Admin
              </NavLink>
            )}

            {/* User info section */}
            <div className="pt-2 mt-2 border-t border-kahani-border">
              {user ? (
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-kahani-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span
                        className="text-xs text-kahani-text-muted truncate max-w-[160px]"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>
                    {role && (
                      <span className={`flex-shrink-0 ${role === "admin" ? "badge-primary" : "badge-secondary"}`}>
                        {role}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left text-xs text-red-500 hover:text-red-700 font-medium px-0 py-1 transition-colors"
                    id="mobile-signout"
                  >
                    Sign out →
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold text-kahani-primary hover:bg-kahani-primary/5 rounded-lg transition-colors"
                  id="mobile-login"
                >
                  Login →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      </header>

      {/* ── Sign Out Confirmation Modal ──────────────────────────── */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-kahani-lg p-8 max-w-sm w-full mx-4 animate-slide-up">
            <h3 className="font-heading text-xl font-bold text-kahani-text mb-2">Sign Out</h3>
            <p className="text-sm text-kahani-text-muted mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button onClick={confirmSignOut} className="btn-primary flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600 border-none">
                Sign out
              </button>
              <button onClick={() => setShowSignOutConfirm(false)} className="btn-outline flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
