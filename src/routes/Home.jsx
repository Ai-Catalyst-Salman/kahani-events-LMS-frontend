// src/routes/Home.jsx
// -------------------
// Landing page: "Kahani Events Training Hub"
// Clean, bright, and highly professional modern design.
// Uses theme colors: #8C345C (Primary), #8C345C (Headings), #CE9FA6, #CD9556, #C77F2A.

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-body selection:bg-[#8C345C] selection:text-white">
      
      {/* ── Minimalist Hero ───────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C345C]/10 text-[#8C345C] text-sm font-bold tracking-widest uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-[#8C345C] animate-pulse"></span>
                Internal Training Portal
              </div>

              <h1 className="font-heading text-5xl lg:text-7xl font-bold text-[#8C345C] leading-[1.1] mb-6">
                Sikho with
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
      <footer className="bg-[#8C345C] text-[#FBF7F0] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top CTA Banner inside Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#CE9FA6]/20">
            <div className="text-center md:text-left">
              <h2 className="font-heading text-3xl font-bold mb-2">Ready to elevate your skills?</h2>
              <p className="text-[#CE9FA6] text-sm">Access is restricted to authorized Kahani personnel.</p>
            </div>
            <div>
              {!user ? (
                <Link to="/login" className="px-8 py-4 bg-[#CE9FA6] text-[#1E544A] rounded-xl font-bold hover:bg-white transition-colors shadow-lg inline-block">
                  Login to Platform
                </Link>
              ) : (
                <Link to="/courses" className="px-8 py-4 bg-[#CE9FA6] text-[#C77F2A] rounded-xl font-bold hover:bg-white transition-colors shadow-lg inline-block">
                  Resume Training
                </Link>
              )}
            </div>
          </div>

          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-[#CE9FA6]/20">
            <div className="md:col-span-2">
              <img src="/logo.png" alt="Kahani Events Logo" className="h-8 w-auto mb-4 brightness-0 invert opacity-90" />
              <p className="text-sm text-[#E8DDD5]/80 leading-relaxed max-w-sm">
                Kahani Events Training Hub is the premier internal platform for mastering live event production, client relations, and seamless execution.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-base mb-4 text-[#CD9556]">Platform</h3>
              <ul className="space-y-3 text-sm text-[#E8DDD5]/80">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">Course Library</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base mb-4 text-[#CD9556]">Legal</h3>
              <ul className="space-y-3 text-sm text-[#E8DDD5]/80">
                <li><a href="#" className="hover:text-white transition-colors">Platform Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Internal Usage Terms</a></li>
              </ul>
            </div>
          </div>
          
          {/* Sub Footer */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#E8DDD5]/60 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span>&copy; {new Date().getFullYear()} Kahani Events. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span>Internal Training System v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#CD9556] animate-pulse"></div>
              <span>System Operational</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
