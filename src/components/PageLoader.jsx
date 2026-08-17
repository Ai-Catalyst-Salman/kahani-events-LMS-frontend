// src/components/PageLoader.jsx
// -------------------------------
// Ultra-luxurious full-page loading state.

import React from "react";

export default function PageLoader() {
  return (
    <>
      <style>{`
        @keyframes breathScale {
          0%, 100% { transform: scale(0.97); }
          50% { transform: scale(1.03); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-breath-scale {
          animation: breathScale 3s ease-in-out infinite;
        }
        .animate-glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }
        .animate-shimmer-line {
          animation: shimmerLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-text-pulse {
          animation: textPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center animate-fade-in w-full max-w-sm">
          
          {/* Logo Section */}
          <div className="relative flex items-center justify-center mb-10 w-32 h-32">
            {/* Subtle soft radial glow */}
            <div className="absolute inset-0 rounded-full bg-[#CD9556]/15 blur-2xl animate-glow-pulse"></div>
            
            {/* Breathing logo */}
            <img
              src="/logo.png"
              alt="Kahani Events"
              className="relative z-10 h-11 w-auto object-contain animate-breath-scale"
            />
          </div>
          
          {/* Progress & Text Section */}
          <div className="flex flex-col items-center gap-6">
            {/* Luxury Minimal Progress Line */}
            <div className="w-16 h-[2px] rounded-full bg-black/5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#CD9556] to-transparent w-full h-full animate-shimmer-line"></div>
            </div>
            
            {/* Typography */}
            <div role="status">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium animate-text-pulse">
                Experiencing Kahani...
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
