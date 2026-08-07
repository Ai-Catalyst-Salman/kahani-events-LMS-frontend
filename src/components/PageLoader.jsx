// src/components/PageLoader.jsx
// -------------------------------
// Full-page loading state shown while the auth session is being restored.

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-kahani-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-kahani-gradient flex items-center justify-center shadow-kahani-md">
          <span className="font-heading text-white text-xl font-bold">K</span>
        </div>
        <LoadingSpinner size="md" label="Loading Kahani Events…" />
      </div>
    </div>
  );
}
