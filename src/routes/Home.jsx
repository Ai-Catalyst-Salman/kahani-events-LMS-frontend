// src/routes/Home.jsx
// -------------------
// Landing page: "Kahani Events Training Hub"
// Clean, bright, and highly professional modern design.
// Uses theme colors: #8C345C (Primary), #8C345C (Headings), #CE9FA6, #CD9556, #C77F2A.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-body selection:bg-[#8C345C] selection:text-white">
      
      {/* ── Minimalist Hero ───────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C345C]/10 text-[#8C345C] text-sm font-bold tracking-widest uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-[#8C345C] animate-pulse"></span>
                Internal Training Portal
              </div>

              <h1 className="font-heading text-5xl lg:text-7xl font-bold text-[#8C345C] leading-[1.1] mb-6">
                Perform with
                <br />
                Kahani Events
              </h1>

              <p className="text-2xl text-[#C77F2A] font-semibold mb-6">
                Master the Art of Event Production
              </p>

              <p className="text-[#6B5558] text-lg leading-relaxed mb-10">
                A streamlined, professional learning management system designed exclusively for the Kahani Events team. Enhance your skills with curated video modules and strict knowledge checks.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {user ? (
                  <Link 
                    to="/courses" 
                    className="px-8 py-4 bg-[#8C345C] text-white rounded-xl font-semibold text-lg hover:bg-[#6b2646] transition-colors shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="px-8 py-4 bg-[#8C345C] text-white rounded-xl font-semibold text-lg hover:bg-[#6b2646] transition-colors shadow-lg hover:shadow-xl"
                    >
                      Login to Access
                    </Link>
                    <a 
                      href="#features" 
                      className="px-8 py-4 bg-white text-[#8C345C] border border-[#E8DDD5] rounded-xl font-semibold text-lg hover:border-[#8C345C] hover:text-[#8C345C] transition-colors"
                    >
                      View Features
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="relative hidden lg:block">
              {/* Decorative accent squares */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#CE9FA6]/30 rounded-3xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#CD9556]/20 rounded-3xl -z-10"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop" 
                alt="Event Production" 
                className="rounded-3xl shadow-2xl object-cover w-full h-[600px] border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white border-y border-[#E8DDD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-[#8C345C] mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-[#6B5558] max-w-2xl mx-auto text-lg">
              Our training methodology combines high-quality video content with strict validation gates to ensure absolute competency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#FBF7F0] p-8 rounded-2xl border border-[#E8DDD5] hover:border-[#CE9FA6] transition-colors">
              <div className="w-12 h-12 bg-[#8C345C]/10 rounded-xl flex items-center justify-center text-[#8C345C] text-2xl mb-6">
                🎥
              </div>
              <h3 className="font-heading text-xl font-bold text-[#8C345C] mb-3">
                Video Modules
              </h3>
              <p className="text-[#6B5558] leading-relaxed text-sm">
                Watch detailed, step-by-step video courses covering every aspect of live event production and management.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FBF7F0] p-8 rounded-2xl border border-[#E8DDD5] hover:border-[#CD9556] transition-colors">
              <div className="w-12 h-12 bg-[#CD9556]/10 rounded-xl flex items-center justify-center text-[#C77F2A] text-2xl mb-6">
                🔒
              </div>
              <h3 className="font-heading text-xl font-bold text-[#8C345C] mb-3">
                Sequential Learning
              </h3>
              <p className="text-[#6B5558] leading-relaxed text-sm">
                Videos are locked in a strict sequence. You must complete a module entirely before the next one unlocks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FBF7F0] p-8 rounded-2xl border border-[#E8DDD5] hover:border-[#8C345C] transition-colors">
              <div className="w-12 h-12 bg-[#8C345C]/10 rounded-xl flex items-center justify-center text-[#8C345C] text-2xl mb-6">
                📝
              </div>
              <h3 className="font-heading text-xl font-bold text-[#8C345C] mb-3">
                Knowledge Quizzes
              </h3>
              <p className="text-[#6B5558] leading-relaxed text-sm">
                Pass interactive quizzes with a minimum score after each video to prove your understanding and advance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum Highlights ─────────────────────────────────────── */}
      <section className="py-24 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold text-[#8C345C] mb-6">
                Our Core Curriculum
              </h2>
              <p className="text-[#6B5558] text-lg leading-relaxed mb-8">
                The Kahani standard demands excellence. Our curriculum covers four critical pillars of event execution.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-1.5 h-auto bg-[#8C345C] rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-[#8C345C] text-lg">Production & Rigging</h4>
                    <p className="text-sm text-[#6B5558] mt-1">Stage plots, safety limits, and show calling.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-1.5 h-auto bg-[#8C345C] rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-[#8C345C] text-lg">Audio & Visual Engineering</h4>
                    <p className="text-sm text-[#6B5558] mt-1">Lighting design, acoustic mapping, and routing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-1.5 h-auto bg-[#CD9556] rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-[#8C345C] text-lg">Client Relations</h4>
                    <p className="text-sm text-[#6B5558] mt-1">VIP handling and high-stress de-escalation.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop" alt="Stage" className="rounded-2xl h-64 w-full object-cover shadow-md" />
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop" alt="Crowd" className="rounded-2xl h-64 w-full object-cover shadow-md mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-kahani-primary text-kahani-cream pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top CTA Banner inside Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-14 border-b border-white/10">
            <div className="text-center md:text-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-white">Ready to elevate your skills?</h2>
              <p className="text-[#FBF7F0]/70 text-sm font-medium">Access is restricted to authorized Kahani personnel.</p>
            </div>
            <div>
              {!user ? (
                <Link to="/login" className="px-8 py-3.5 border border-[#CD9556] text-[#CD9556] rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-[#CD9556] hover:text-[#2C1B1E] transition-all duration-300 shadow-[0_0_15px_rgba(205,149,86,0.1)] hover:shadow-[0_0_20px_rgba(205,149,86,0.3)] inline-block transform hover:-translate-y-0.5">
                  Login to Platform
                </Link>
              ) : (
                <Link to="/courses" className="px-8 py-3.5 border border-[#CD9556] text-[#CD9556] rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-[#CD9556] hover:text-[#2C1B1E] transition-all duration-300 shadow-[0_0_15px_rgba(205,149,86,0.1)] hover:shadow-[0_0_20px_rgba(205,149,86,0.3)] inline-block transform hover:-translate-y-0.5">
                  Resume Training
                </Link>
              )}
            </div>
          </div>

          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-14 border-b border-white/10">
            <div className="md:col-span-2">
              <img src="/logo.png" alt="Kahani Events Logo" className="h-10 w-auto mb-6 brightness-0 invert opacity-90 drop-shadow-md" />
              <p className="text-sm text-[#FBF7F0]/70 leading-relaxed max-w-sm">
                Kahani Events Training Hub is the premier internal platform for mastering live event production, client relations, and seamless execution.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-sm tracking-[0.2em] uppercase mb-6 text-[#CD9556]">Platform</h3>
              <ul className="space-y-4 text-sm text-[#FBF7F0]/70">
                <li><Link to="/" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center group"><span className="w-0 h-[1px] bg-[#CD9556] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>Home</Link></li>
                <li><Link to="/courses" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center group"><span className="w-0 h-[1px] bg-[#CD9556] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>Course Library</Link></li>
                {!user && (
                  <li><Link to="/login" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center group"><span className="w-0 h-[1px] bg-[#CD9556] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>Portal Login</Link></li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold text-sm tracking-[0.2em] uppercase mb-6 text-[#CD9556]">Legal</h3>
              <ul className="space-y-4 text-sm text-[#FBF7F0]/70">
                <li><button onClick={() => setIsGuidelinesOpen(true)} className="hover:text-[#CD9556] transition-colors duration-300 flex items-center group cursor-pointer text-left"><span className="w-0 h-[1px] bg-[#CD9556] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>Platform Guidelines</button></li>
                <li><button onClick={() => setIsPrivacyOpen(true)} className="hover:text-[#CD9556] transition-colors duration-300 flex items-center group cursor-pointer text-left"><span className="w-0 h-[1px] bg-[#CD9556] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>Privacy Policy</button></li>
                <li><button onClick={() => setIsTermsOpen(true)} className="hover:text-[#CD9556] transition-colors duration-300 flex items-center group cursor-pointer text-left"><span className="w-0 h-[1px] bg-[#CD9556] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>Internal Usage Terms</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold text-sm tracking-[0.2em] uppercase mb-6 text-[#CD9556]">Connect</h3>
              <ul className="space-y-5 text-sm text-[#FBF7F0]/70">
                <li>
                  <a href="https://www.instagram.com/kahani_events.co/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center gap-3 group">
                    <svg className="w-[18px] h-[18px] text-[#FBF7F0]/70 group-hover:text-[#CD9556] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram (Official)
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/kahani.corporate.events/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center gap-3 group">
                    <svg className="w-[18px] h-[18px] text-[#FBF7F0]/70 group-hover:text-[#CD9556] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram (Corporate)
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/i2cevents/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center gap-3 group">
                    <svg className="w-[18px] h-[18px] text-[#FBF7F0]/70 group-hover:text-[#CD9556] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://in.pinterest.com/kahanibyi2cevents/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center gap-3 group">
                    <svg className="w-[18px] h-[18px] text-[#FBF7F0]/70 group-hover:text-[#CD9556] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.602 0 12.017 0z"/></svg>
                    Pinterest
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/kahani-i2cevents/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center gap-3 group">
                    <svg className="w-[18px] h-[18px] text-[#FBF7F0]/70 group-hover:text-[#CD9556] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://kahanibyi2c.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CD9556] transition-colors duration-300 flex items-center gap-3 group">
                    <svg className="w-[18px] h-[18px] text-[#FBF7F0]/70 group-hover:text-[#CD9556] transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    Main Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Sub Footer */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4 font-medium">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span>&copy; {new Date().getFullYear()} Kahani Events. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span>Internal Training System v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#CD9556] animate-pulse"></div>
              <span className="tracking-[0.15em] uppercase text-[10px]">System Operational</span>
            </div>
          </div>

        </div>
      </footer>
      {/* ── Guidelines Modal ──────────────────────────────────────────── */}
      {isGuidelinesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8DDD5]">
              <h2 className="font-heading text-xl font-bold text-[#8C345C]">Kahani Events Platform Guidelines</h2>
              <button onClick={() => setIsGuidelinesOpen(false)} className="text-[#6B5558] hover:text-[#8C345C] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
              <div className="prose prose-sm sm:prose-base prose-kahani">
                <h3 className="text-[#8C345C] font-bold mb-2">1. Confidentiality</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">All training materials, including videos, documents, and quizzes, are strictly confidential. Do not share, record, or distribute any content outside of the Kahani Events internal network.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">2. Completion Requirements</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">Modules must be completed sequentially. You cannot skip ahead. A minimum score of 80% is required on all knowledge checks to proceed to the next section.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">3. Professional Conduct</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">When interacting within the platform or discussing materials with peers, maintain the highest standard of professionalism reflective of the Kahani brand.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">4. Support & Technical Issues</h3>
                <p className="text-[#6B5558] leading-relaxed">If you encounter any technical difficulties or bugs while using the platform, please report them immediately to the internal IT support team via the official channels.</p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DDD5] bg-white flex justify-end">
              <button onClick={() => setIsGuidelinesOpen(false)} className="px-6 py-2 bg-[#8C345C] text-white rounded-lg font-semibold hover:bg-[#6b2646] transition-colors shadow-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Privacy Policy Modal ──────────────────────────────────────── */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8DDD5]">
              <h2 className="font-heading text-xl font-bold text-[#8C345C]">Kahani Events Privacy Policy</h2>
              <button onClick={() => setIsPrivacyOpen(false)} className="text-[#6B5558] hover:text-[#8C345C] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
              <div className="prose prose-sm sm:prose-base prose-kahani">
                <h3 className="text-[#8C345C] font-bold mb-2">1. Data Collection</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">Kahani Events collects internal training data, including quiz scores, module progress, and active session times, strictly to measure competency and ensure operational readiness.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">2. User Rights</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">You have the right to request a summary of your training progress. All internal profiles are linked directly to your official Kahani employee profile and are non-transferable.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">3. Third-Party Sharing</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">Kahani Events does not sell or share your training data with any external agencies, sponsors, or third-party organizers. Data is siloed exclusively for our HR and operational logistics teams.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">4. Security Measures</h3>
                <p className="text-[#6B5558] leading-relaxed">We employ enterprise-grade encryption for all database connections and internal portal access. Your sessions are securely handled to prevent unauthorized access.</p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DDD5] bg-white flex justify-end">
              <button onClick={() => setIsPrivacyOpen(false)} className="px-6 py-2 bg-[#8C345C] text-white rounded-lg font-semibold hover:bg-[#6b2646] transition-colors shadow-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Internal Usage Terms Modal ────────────────────────────────── */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8DDD5]">
              <h2 className="font-heading text-xl font-bold text-[#8C345C]">Kahani Events Internal Usage Terms</h2>
              <button onClick={() => setIsTermsOpen(false)} className="text-[#6B5558] hover:text-[#8C345C] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
              <div className="prose prose-sm sm:prose-base prose-kahani">
                <h3 className="text-[#8C345C] font-bold mb-2">1. Confidentiality of Training Material</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">All proprietary training modules, documentation, internal event plots, and organizational strategies shared on this portal are strictly classified as confidential corporate IP. Distribution of this content beyond internal staff channels is strictly prohibited.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">2. Account Security & Sharing</h3>
                <p className="text-[#6B5558] mb-6 leading-relaxed">Your assigned credentials represent your digital identity at Kahani Events. Sharing your account access, intentionally or otherwise, is a violation of our security protocol and may lead to immediate suspension of portal access.</p>
                
                <h3 className="text-[#8C345C] font-bold mb-2">3. Acceptable Use Policy</h3>
                <ul className="text-[#6B5558] mb-6 leading-relaxed space-y-2 list-disc list-inside">
                  <li>Use the portal strictly for personal career development and training objectives.</li>
                  <li>Refrain from attempting to bypass quiz validation requirements or sequential locks.</li>
                  <li>Report any suspicious activity or unauthorized access directly to system administrators.</li>
                </ul>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DDD5] bg-white flex justify-end">
              <button onClick={() => setIsTermsOpen(false)} className="px-6 py-2 bg-[#8C345C] text-white rounded-lg font-semibold hover:bg-[#6b2646] transition-colors shadow-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
