// src/routes/Courses.jsx
// ----------------------
// Course listing page — public read, no auth required.
// Fetches GET /courses and displays cards.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className="card p-6 flex flex-col gap-4 group">
      {/* Decorative header strip */}
      <div className="h-2 -mx-6 -mt-6 mb-0 rounded-t-2xl bg-kahani-gradient" />

      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-kahani-primary/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-kahani-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <svg
          className="w-4 h-4 text-kahani-text-muted group-hover:text-kahani-primary group-hover:translate-x-1 transition-all duration-200 mt-1 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div>
        <h2 className="font-heading text-lg font-bold text-kahani-text group-hover:text-kahani-primary transition-colors duration-200 mb-1.5">
          {course.title}
        </h2>
        {course.description && (
          <p className="text-sm text-kahani-text-muted leading-relaxed line-clamp-2">
            {course.description}
          </p>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-kahani-border flex items-center justify-between">
        <span className="badge-accent">Course</span>
        <span className="text-xs text-kahani-primary font-semibold group-hover:underline">
          View course →
        </span>
      </div>
    </Link>
  );
}

function DepartmentCard({ department, onClick }) {
  return (
    <div onClick={onClick} className="card p-6 flex flex-col gap-4 cursor-pointer group hover:-translate-y-1 transition-all duration-300">
      <div className="h-2 -mx-6 -mt-6 mb-0 rounded-t-2xl bg-kahani-secondary/50 group-hover:bg-kahani-primary transition-colors" />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-kahani-primary/10 flex items-center justify-center flex-shrink-0 text-kahani-primary">
          {/* Folder Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-lg font-bold text-kahani-text group-hover:text-kahani-primary transition-colors duration-200">
            {department}
          </h2>
          <p className="text-xs text-kahani-text-muted mt-0.5">Explore courses</p>
        </div>
        <svg className="w-5 h-5 text-kahani-text-muted group-hover:text-kahani-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    api.get("/courses").then(({ ok, data }) => {
      if (ok) {
        setCourses(data);
      } else {
        setError("Failed to load courses. Please try again.");
      }
      setLoading(false);
    });
  }, []);

  const activeDepartments = [...new Set(courses.map(c => c.department || "General"))].sort();
  const filteredCourses = selectedDepartment 
    ? courses.filter(c => (c.department || "General") === selectedDepartment)
    : [];

  return (
    <div className="page">
      {/* Page header */}
      <div className="bg-white border-b border-kahani-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-kahani-accent3 mb-2">
            Learning Library
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-kahani-text">
            All Courses
          </h1>
          <p className="text-kahani-text-muted text-sm mt-2 max-w-xl">
            Explore the full Kahani Events training library. Select a department to view its courses and start learning.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex justify-center py-24">
            <LoadingSpinner size="lg" label="Loading courses…" />
          </div>
        )}

        {error && (
          <div className="alert-error max-w-md mx-auto">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-kahani-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-kahani-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="font-heading text-xl font-bold text-kahani-text mb-2">
              No courses yet
            </h2>
            <p className="text-kahani-text-muted text-sm">
              Courses will appear here once they are added by an admin.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            {selectedDepartment === null ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                {activeDepartments.map(dept => (
                  <DepartmentCard 
                    key={dept} 
                    department={dept} 
                    onClick={() => setSelectedDepartment(dept)} 
                  />
                ))}
              </div>
            ) : (
              <div className="animate-slide-up">
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setSelectedDepartment(null)}
                    className="btn-ghost flex items-center gap-2 -ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Departments
                  </button>
                  <div className="h-6 w-px bg-kahani-border" />
                  <h2 className="font-heading text-2xl font-bold text-kahani-text">
                    {selectedDepartment}
                  </h2>
                </div>
                
                {filteredCourses.length === 0 ? (
                  <p className="text-kahani-text-muted">No courses found in this department.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
