// src/routes/Admin.jsx
// --------------------
// Full admin dashboard with tabs: Overview | Courses | Videos | Users
// Responsive: tabs scroll horizontally on mobile, table scrolls on mobile

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../lib/supabaseClient";

const DEPARTMENTS = ["Client Servicing", "Creative", "HR", "Production", "Finance", "Marketing", "System Creation"];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  videos: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  overview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  lock: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  quiz: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, colorClass }) {
  return (
    <div className="card-static p-6 flex items-center gap-5 animate-slide-up">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-kahani-text-muted mb-1">{label}</p>
        <p className="font-heading text-4xl font-bold text-kahani-text">{value ?? "—"}</p>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-800",
    error: "bg-red-50 border-red-300 text-red-800",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-kahani-md text-sm font-medium animate-slide-up ${colors[type]}`}>
      {type === "success" ? Icon.check : null}
      {msg}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-kahani-lg p-8 max-w-sm w-full mx-4 animate-slide-up">
        <h3 className="font-heading text-xl font-bold text-kahani-text mb-2">Are you sure?</h3>
        <p className="text-sm text-kahani-text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="btn-primary flex-1" style={{ background: "#dc2626" }}>
            Delete
          </button>
          <button onClick={onCancel} className="btn-outline flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState({
    courses: 0,
    videos: 0,
    completions: 0,
    users: 0,
    avgWatchTime: "0h 0m"
  });
  const [chartData, setChartData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch Users via the same endpoint as UsersTab to reliably get emails/metadata
        const usersRes = await api.get("/admin/users");
        if (!usersRes.ok) throw new Error("Failed to load users from backend API");
        const allUsers = usersRes.data || [];

        // 2. Parallel Queries for stats and top performers
        const [
          { count: coursesCount, error: coursesError },
          { count: videosCount, error: videosError },
          topPerformersRes,
          progressCountRes,
          // Placeholder for watch logs
          { data: watchTimeLogs }
        ] = await Promise.all([
          supabase.from("courses").select("*", { count: "exact", head: true }),
          supabase.from("videos").select("*", { count: "exact", head: true }),
          api.get("/admin/dashboard/top-performers"),
          supabase.from("progress").select("*", { count: "exact", head: true }),
          Promise.resolve({ data: null })
        ]);

        if (coursesError) console.error("Courses Fetch Error:", coursesError);
        if (videosError) console.error("Videos Fetch Error:", videosError);
        if (progressCountRes.error) console.error("Progress Fetch Error:", progressCountRes.error);

        // 3. Format Top Performers
        let sortedPerformers = [];
        if (topPerformersRes.ok && topPerformersRes.data) {
          sortedPerformers = topPerformersRes.data.map(user => ({
            id: user.user_id,
            name: user.name,
            initial: user.name.charAt(0).toUpperCase(),
            score: `${user.completed_modules} Modules`,
            completion_percentage: user.completion_percentage
          }));
        }

        // 4. Calculate Recently Joined
        const sortedRecent = [...allUsers]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4)
          .map((u) => {
            const days = Math.floor((new Date() - new Date(u.created_at)) / (1000 * 60 * 60 * 24));
            const nameOrEmail = u.email || "Unknown User";
            return {
              id: u.id,
              name: nameOrEmail.split("@")[0],
              date: days === 0 ? "Joined Today" : days === 1 ? "Joined Yesterday" : `Joined ${days} days ago`
            };
          });

        // Update State
        setStats({
          courses: coursesCount || 0,
          videos: videosCount || 0,
          completions: progressCountRes.count || 0,
          users: allUsers.length,
          avgWatchTime: "12h 30m" // Placeholder
        });

        setRecentUsers(sortedRecent);
        setTopPerformers(sortedPerformers);

        // Default chart data formatting
        setChartData([
          { day: "Mon", hours: 4.5 },
          { day: "Tue", hours: 5.2 },
          { day: "Wed", hours: 8.1 },
          { day: "Thu", hours: 6.4 },
          { day: "Fri", hours: 9.8 },
          { day: "Sat", hours: 11.2 },
          { day: "Sun", hours: 8.5 },
        ]);

      } catch (err) {
        console.error("Dashboard Fetch Exception:", err);
        setError("Failed to fetch dashboard analytics.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading analytics…" /></div>;
  if (error) return <div className="alert-error max-w-md">{error}</div>;

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={Icon.courses}  label="Total Courses"     value={stats.courses}     colorClass="bg-kahani-primary/10 text-kahani-primary" />
        <StatCard icon={Icon.videos}   label="Total Videos"      value={stats.videos}      colorClass="bg-kahani-secondary/10 text-kahani-secondary" />
        <StatCard icon={Icon.check}    label="Completions"       value={stats.completions} colorClass="bg-amber-100 text-amber-700" />
        <StatCard icon={Icon.users}    label="Total Users"       value={stats.users}       colorClass="bg-violet-100 text-violet-700" />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Section (Takes up 2 columns on lg) */}
        <div className="lg:col-span-2 card-static p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="section-heading mb-1 text-[#8C345C]">Watch Time Trends</h2>
            <p className="text-sm text-kahani-text-muted">Total hours watched across the platform over the last 7 days.</p>
          </div>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C345C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8C345C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DDD5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B5558', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B5558', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8DDD5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#8C345C', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="hours" stroke="#8C345C" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard & Activity (1 column on lg) */}
        <div className="flex flex-col gap-6">
          {/* Top Performers */}
          <div className="card-static p-6 flex-1">
            <h3 className="section-heading mb-4 text-[#8C345C]">Top Performers</h3>
            <div className="space-y-4">
              {topPerformers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FBF7F0] transition-colors border border-transparent hover:border-[#E8DDD5]">
                  <div className="w-10 h-10 rounded-full bg-[#8C345C]/10 text-[#8C345C] font-heading font-bold flex items-center justify-center shrink-0">
                    {user.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-kahani-text truncate">{user.name}</p>
                    <p className="text-xs text-kahani-text-muted">{user.score}</p>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-[#7A284A]">{user.completion_percentage || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Joined */}
          <div className="card-static p-6 flex-1">
            <h3 className="section-heading mb-4 text-[#8C345C]">Recently Joined</h3>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#CD9556] shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-kahani-text truncate">{user.name}</p>
                  </div>
                  <div className="text-xs text-kahani-text-muted whitespace-nowrap">
                    {user.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Courses Tab ──────────────────────────────────────────────────────────────
function CoursesTab({ toast }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [progressionMode, setProgressionMode] = useState("open");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await api.get("/admin/courses");
    if (ok) setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    const { ok, data } = await api.post("/admin/courses", { 
      title, 
      description: description || null,
      department,
      progression_mode: progressionMode,
    });
    if (ok) {
      toast("Course created!", "success");
      setTitle(""); setDescription(""); setDepartment(DEPARTMENTS[0]); setProgressionMode("open"); setShowForm(false);
      load();
    } else {
      toast(data?.detail || "Failed to create course", "error");
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    const { ok } = await api.delete(`/admin/courses/${id}`);
    if (ok) {
      toast("Course deleted", "success");
      load();
    } else {
      toast("Failed to delete course", "error");
    }
    setConfirm(null);
  }

  return (
    <div className="space-y-6">
      {confirm && (
        <ConfirmDialog
          message="This will permanently delete the course and ALL its videos. This cannot be undone."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Add Course Form */}
      <div className="card-static overflow-hidden">
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-kahani-cream/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kahani-primary/10 flex items-center justify-center text-kahani-primary">
              {Icon.plus}
            </div>
            <span className="font-heading font-bold text-kahani-text">Add New Course</span>
          </div>
          <svg className={`w-5 h-5 text-kahani-text-muted transition-transform duration-200 ${showForm ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showForm && (
          <form onSubmit={handleCreate} className="border-t border-kahani-border p-6 space-y-4 bg-kahani-cream/40">
            <div>
              <label className="input-label">Course Title *</label>
              <input
                className="input"
                placeholder="e.g. Event Photography Basics"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Description (optional)</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Brief overview of what learners will cover…"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Department *</label>
              <select
                className="input"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Module Progression</label>
              <select
                className="input"
                value={progressionMode}
                onChange={e => setProgressionMode(e.target.value)}
              >
                <option value="open">Open (All modules unlocked from start)</option>
                <option value="locked">Locked (Strict step-by-step completion)</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Creating…" : "Create Course"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Course List */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading courses…" /></div>
      ) : courses.length === 0 ? (
        <div className="card-static p-12 text-center text-kahani-text-muted text-sm">
          No courses yet. Add your first course above.
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="card-static p-5 flex items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-kahani-primary/10 flex items-center justify-center text-kahani-primary flex-shrink-0">
                  {Icon.courses}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-kahani-text truncate">{course.title}</p>
                  {course.description && (
                    <p className="text-xs text-kahani-text-muted truncate mt-0.5">{course.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="badge-accent">{course.video_count} video{course.video_count !== 1 ? "s" : ""}</span>
                <button
                  onClick={() => setConfirm(course.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete course"
                >
                  {Icon.trash}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Videos Tab ───────────────────────────────────────────────────────────────
function VideosTab({ toast }) {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [filterCourse, setFilterCourse] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const cRes = await api.get("/admin/courses");
    if (cRes.ok) {
      setCourses(cRes.data);
      const allVideos = [];
      for (const c of cRes.data) {
        const { ok, data } = await api.get(`/courses/${c.id}`);
        if (ok && data.videos) {
          data.videos.forEach(v => allVideos.push({ ...v, course_title: c.title }));
        }
      }
      setVideos(allVideos);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    const { ok, data } = await api.post("/admin/videos", {
      course_id: courseId,
      title,
      video_url: videoUrl,
      transcript: transcript || null,
    });
    if (ok) {
      toast("Video added!", "success");
      setTitle(""); setVideoUrl(""); setTranscript(""); setCourseId(""); setShowForm(false);
      load();
    } else {
      toast(data?.detail || "Failed to add video", "error");
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    const { ok } = await api.delete(`/admin/videos/${id}`);
    if (ok) {
      toast("Video deleted", "success");
      load();
    } else {
      toast("Failed to delete video", "error");
    }
    setConfirm(null);
  }

  const filteredVideos = filterCourse === "all"
    ? videos
    : videos.filter(v => v.course_id === filterCourse);

  return (
    <div className="space-y-6">
      {confirm && (
        <ConfirmDialog
          message="This will permanently delete the video and all related learner progress."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Add Video Form */}
      <div className="card-static overflow-hidden">
        <button
          onClick={() => setShowForm(v => !v)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-kahani-cream/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kahani-secondary/10 flex items-center justify-center text-kahani-secondary">
              {Icon.plus}
            </div>
            <span className="font-heading font-bold text-kahani-text">Add New Video</span>
          </div>
          <svg className={`w-5 h-5 text-kahani-text-muted transition-transform duration-200 ${showForm ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showForm && (
          <form onSubmit={handleCreate} className="border-t border-kahani-border p-6 space-y-4 bg-kahani-cream/40">
            <div>
              <label className="input-label">Select Course *</label>
              <select
                className="input"
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                required
              >
                <option value="">— choose a course —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Video Title *</label>
              <input
                className="input"
                placeholder="e.g. Introduction to Lighting"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Video URL *</label>
              <input
                className="input"
                type="url"
                placeholder="https://youtube.com/watch?v=…"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Video Transcription</label>
              <textarea
                className="input resize-none mt-1"
                rows={3}
                placeholder="Optional text transcription..."
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="btn-secondary disabled:opacity-60">
                {saving ? "Adding…" : "Add Video"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Filter */}
      {!loading && videos.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">Filter by course:</label>
          <select
            className="input max-w-xs py-2"
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      )}

      {/* Video List */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading videos…" /></div>
      ) : filteredVideos.length === 0 ? (
        <div className="card-static p-12 text-center text-kahani-text-muted text-sm">
          No videos yet. Add your first video above.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVideos.map(video => (
            <div key={video.id} className="card-static p-4 flex items-center gap-4 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-kahani-secondary/10 flex items-center justify-center text-kahani-secondary flex-shrink-0">
                {Icon.videos}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-kahani-text text-sm truncate">{video.title}</p>
                <p className="text-xs text-kahani-text-muted truncate mt-0.5">
                  <span className="text-kahani-primary font-medium">{video.course_title}</span>
                  {" · "}
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {video.video_url}
                  </a>
                </p>
              </div>
              <button
                onClick={() => setConfirm(video.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                title="Delete video"
              >
                {Icon.trash}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ toast, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null); // holds user obj for edit
  const [deleteUser, setDeleteUser] = useState(null); // holds user obj for delete
  const [dropdownOpen, setDropdownOpen] = useState(null); // holds user.id

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Watch History State
  const [selectedWatchUser, setSelectedWatchUser] = useState(null);
  const [watchHistoryData, setWatchHistoryData] = useState(null);
  const [watchHistoryLoading, setWatchHistoryLoading] = useState(false);
  const [watchHistoryError, setWatchHistoryError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await api.get("/admin/users");
    if (ok) setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleMouseUp = (e) => {
      if (!e.target.closest('.action-dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  async function handleAddUser(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const { ok, data } = await api.post("/admin/users", { email, password, role });
    if (ok) {
      toast("User created successfully", "success");
      setIsAddOpen(false);
      setEmail(""); setPassword(""); setRole("learner");
      load();
    } else {
      toast(data?.detail || "Failed to create user", "error");
    }
    setIsSubmitting(false);
  }

  async function handleEditUser(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {};
    if (email !== editUser.email) payload.email = email;
    if (password) payload.password = password;

    const { ok, data } = await api.patch(`/admin/users/${editUser.id}/credentials`, payload);
    if (ok) {
      toast("User updated successfully", "success");
      setEditUser(null);
      setEmail(""); setPassword("");
      load();
    } else {
      toast(data?.detail || "Failed to update user", "error");
    }
    setIsSubmitting(false);
  }

  async function handleDeleteUser() {
    setIsSubmitting(true);
    const { ok, data } = await api.delete(`/admin/users/${deleteUser.id}`);
    if (ok) {
      toast("User deleted", "success");
      setDeleteUser(null);
      load();
    } else {
      toast(data?.detail || "Failed to delete user", "error");
    }
    setIsSubmitting(false);
  }

  async function toggleRole(userId, currentRole) {
    const newRole = currentRole === "admin" ? "learner" : "admin";
    setUpdating(userId);
    const { ok, data } = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    if (ok) {
      toast(`Role updated to ${newRole}`, "success");
      load();
    } else {
      toast(data?.detail || "Failed to update role", "error");
    }
    setUpdating(null);
    setDropdownOpen(null);
  }

  function openEditModal(u) {
    setEditUser(u);
    setEmail(u.email);
    setPassword("");
    setDropdownOpen(null);
  }

  function openAddModal() {
    setIsAddOpen(true);
    setEmail("");
    setPassword("");
    setRole("learner");
  }

  async function openWatchHistory(user) {
    setSelectedWatchUser(user);
    setWatchHistoryLoading(true);
    setWatchHistoryError(null);
    setWatchHistoryData(null);

    const { ok, data } = await api.get(`/admin/users/${user.id}/watched-videos`);
    if (ok && data.success) {
      setWatchHistoryData(data);
    } else {
      setWatchHistoryError(data?.detail || "Failed to load watch history.");
    }
    setWatchHistoryLoading(false);
  }

  function closeWatchHistory() {
    setSelectedWatchUser(null);
    setWatchHistoryData(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-kahani-primary/5 p-4 rounded-xl border border-kahani-primary/20">
        <p className="text-xs text-kahani-primary font-medium max-w-2xl leading-relaxed">
          Full platform user registry. Create new profiles, reset credentials, update access roles, or permanently remove accounts.
        </p>
        <button onClick={openAddModal} className="btn-primary py-2 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path></svg>
          Add New User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading users…" /></div>
      ) : users.length === 0 ? (
        <div className="card-static p-12 text-center text-kahani-text-muted text-sm">No users found.</div>
      ) : (
        <div className="card-static overflow-visible">
          <div className="overflow-x-visible">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-kahani-cream border-b border-kahani-border">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">Role</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kahani-border">
                {users.map(u => (
                  <tr 
                    key={u.id} 
                    onClick={() => openWatchHistory(u)}
                    className="hover:bg-kahani-cream/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8C345C]/10 text-[#8C345C] flex items-center justify-center font-bold flex-shrink-0 border border-[#8C345C]/20 group-hover:bg-[#8C345C] group-hover:text-white transition-colors">
                          {u.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="text-kahani-text font-medium truncate max-w-[200px] group-hover:text-kahani-primary transition-colors">{u.email}</span>
                        {u.id === currentUserId && (
                          <span className="badge-primary text-[10px]">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={u.role === "admin" ? "badge-primary" : "badge-secondary"}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right relative action-dropdown-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(dropdownOpen === u.id ? null : u.id);
                        }}
                        disabled={updating === u.id}
                        className="p-1.5 text-kahani-text-muted hover:text-kahani-primary hover:bg-kahani-primary/10 rounded-lg transition-colors"
                      >
                        {updating === u.id ? (
                          <svg className="animate-spin w-5 h-5 text-kahani-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                        )}
                      </button>
                      
                      {dropdownOpen === u.id && (
                        <div className="absolute right-8 top-10 mt-1 w-40 bg-white border border-[#E8DDD5] rounded-lg shadow-xl z-10 py-1 overflow-hidden animate-fade-in text-left">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(u); }} className="w-full px-4 py-2 text-sm text-kahani-text hover:bg-[#FBF7F0] hover:text-[#8C345C] transition-colors text-left flex items-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                             Edit Email/Pass
                          </button>
                          <button 
                             onClick={(e) => { e.stopPropagation(); toggleRole(u.id, u.role); }} 
                             disabled={u.id === currentUserId}
                             className="w-full px-4 py-2 text-sm text-kahani-text hover:bg-[#FBF7F0] hover:text-[#8C345C] transition-colors text-left flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                             Make {u.role === 'admin' ? 'Learner' : 'Admin'}
                          </button>
                          <button 
                             onClick={(e) => { e.stopPropagation(); setDeleteUser(u); setDropdownOpen(null); }}
                             disabled={u.id === currentUserId}
                             className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                             Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add User Modal ── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E8DDD5]">
              <h2 className="font-heading text-xl font-bold text-[#8C345C]">Add New User</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-[#6B5558] hover:text-[#8C345C] transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kahani-text-muted mb-2">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E8DDD5] rounded-xl focus:outline-none focus:border-[#8C345C] focus:ring-1 focus:ring-[#8C345C] transition-all text-kahani-text" placeholder="user@kahanievents.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kahani-text-muted mb-2">Password (Min 6 chars)</label>
                <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E8DDD5] rounded-xl focus:outline-none focus:border-[#8C345C] focus:ring-1 focus:ring-[#8C345C] transition-all text-kahani-text" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kahani-text-muted mb-2">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E8DDD5] rounded-xl focus:outline-none focus:border-[#8C345C] focus:ring-1 focus:ring-[#8C345C] transition-all text-kahani-text cursor-pointer">
                  <option value="learner">Learner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2 text-kahani-text-muted hover:text-kahani-text font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                  {isSubmitting && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E8DDD5]">
              <h2 className="font-heading text-xl font-bold text-[#8C345C]">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="text-[#6B5558] hover:text-[#8C345C] transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kahani-text-muted mb-2">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E8DDD5] rounded-xl focus:outline-none focus:border-[#8C345C] focus:ring-1 focus:ring-[#8C345C] transition-all text-kahani-text" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-kahani-text-muted mb-2">New Password (Optional)</label>
                <input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E8DDD5] rounded-xl focus:outline-none focus:border-[#8C345C] focus:ring-1 focus:ring-[#8C345C] transition-all text-kahani-text" placeholder="Leave blank to keep unchanged" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditUser(null)} className="px-5 py-2 text-kahani-text-muted hover:text-kahani-text font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                  {isSubmitting && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">Delete User?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <strong>{deleteUser.email}</strong>? This action cannot be undone and will erase all their training progress.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteUser(null)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex-1">
                Cancel
              </button>
              <button onClick={handleDeleteUser} disabled={isSubmitting} className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex-1 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Watch History Modal ── */}
      {selectedWatchUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E8DDD5] bg-white">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#8C345C]">
                  {watchHistoryData?.user_name || selectedWatchUser.email.split("@")[0]}'s Watch History
                </h2>
                {watchHistoryData && (
                  <p className="text-sm text-kahani-text-muted mt-1 font-medium">
                    Total Videos Watched: <span className="text-[#8C345C]">{watchHistoryData.total_watched}</span>
                  </p>
                )}
              </div>
              <button 
                onClick={closeWatchHistory}
                className="text-[#6B5558] hover:text-[#8C345C] bg-[#FBF7F0] hover:bg-[#E8DDD5] rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-[#FAF7F2]">
              {watchHistoryLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-kahani-primary">
                  <svg className="animate-spin w-8 h-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-medium">Fetching watch logs...</p>
                </div>
              ) : watchHistoryError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
                  {watchHistoryError}
                </div>
              ) : watchHistoryData?.watched_videos?.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-[#E8DDD5] shadow-sm">
                  <div className="w-16 h-16 bg-[#FBF7F0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#8C345C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-[#6B5558] font-medium">No videos watched yet.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {watchHistoryData?.watched_videos.map((video) => (
                    <li key={video.video_id} className="p-4 bg-white border border-[#E8DDD5] rounded-xl flex justify-between items-center hover:shadow-md hover:border-[#8C345C]/30 transition-all">
                      <div>
                        <h4 className="font-bold text-[#2A2122] text-sm">{video.title}</h4>
                        <p className="text-xs text-kahani-primary font-medium uppercase tracking-wide mt-1.5">
                          Module: {video.module_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#CD9556] bg-[#FBF7F0] px-3 py-1.5 rounded-lg border border-[#E8DDD5]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {video.duration}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="px-6 py-4 bg-white border-t border-[#E8DDD5] flex justify-end">
              <button 
                onClick={closeWatchHistory}
                className="btn-primary py-2 px-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quizzes Tab ──────────────────────────────────────────────────────────────
function QuizzesTab({ toast }) {
  const [courses, setCourses] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  // New question form state
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("mcq"); // mcq, true_false, fill_in_blank
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // AI Generating state
  const [generatingAI, setGeneratingAI] = useState(false);

  // Load all courses + their videos
  const loadVideos = useCallback(async () => {
    setLoadingVideos(true);
    const cRes = await api.get("/admin/courses");
    if (cRes.ok) {
      setCourses(cRes.data);
      const vids = [];
      for (const c of cRes.data) {
        const { ok, data } = await api.get(`/courses/${c.id}`);
        if (ok && data.videos) {
          data.videos.forEach(v => vids.push({ ...v, course_title: c.title }));
        }
      }
      setAllVideos(vids);
    }
    setLoadingVideos(false);
  }, []);

  useEffect(() => { loadVideos(); }, [loadVideos]);

  async function loadQuestions(videoId) {
    setLoadingQuestions(true);
    const { ok, data } = await api.get(`/admin/videos/${videoId}/questions`);
    if (ok) setQuestions(data);
    else setQuestions([]);
    setLoadingQuestions(false);
  }

  function handleVideoChange(e) {
    const vid = e.target.value;
    setSelectedVideoId(vid);
    setShowForm(false);
    setEditingId(null);
    if (vid) loadQuestions(vid);
    else setQuestions([]);
  }

  function handleOptionChange(idx, val) {
    setOptions(prev => prev.map((o, i) => i === idx ? val : o));
  }

  async function handleAIGenerate() {
    if (!selectedVideoId) return;
    const selectedVideo = allVideos.find(v => v.id === selectedVideoId);
    if (!selectedVideo?.transcript) {
      toast("This video has no transcript. Please add a transcript first.", "error");
      return;
    }
    setGeneratingAI(true);
    const { ok, data } = await api.post(`/quizzes/video/${selectedVideoId}/generate-and-save-quiz`, {
      transcript: selectedVideo.transcript
    });
    if (ok) {
      toast("AI Generated Questions Successfully!", "success");
      loadQuestions(selectedVideoId);
    } else {
      toast(data?.detail || "Failed to generate AI questions", "error");
    }
    setGeneratingAI(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!selectedVideoId) return;
    
    let finalOptions = [];
    let finalCorrectIndex = 0;
    let finalCorrectAnswer = "";

    if (questionType === "mcq") {
      finalOptions = options.filter(o => o.trim());
      if (finalOptions.length < 2) { toast("Please provide at least 2 options", "error"); return; }
      if (correctIndex >= finalOptions.length) { toast("Correct answer index out of range", "error"); return; }
      finalCorrectIndex = correctIndex;
      finalCorrectAnswer = finalOptions[correctIndex];
    } else if (questionType === "true_false") {
      finalOptions = ["True", "False"];
      finalCorrectIndex = correctIndex; // 0 for True, 1 for False
      finalCorrectAnswer = finalOptions[correctIndex];
    } else if (questionType === "fill_in_blank") {
      if (!correctAnswer.trim()) { toast("Please provide correct answer", "error"); return; }
      finalOptions = [correctAnswer.trim()];
      finalCorrectIndex = 0;
      finalCorrectAnswer = correctAnswer.trim();
    }

    setSaving(true);
    
    const payload = {
      video_id: selectedVideoId,
      question: question.trim(),
      options: finalOptions,
      correct_option_index: finalCorrectIndex,
      question_type: questionType,
      correct_answer: finalCorrectAnswer,
      explanation: explanation.trim()
    };
    
    if (editingId) {
      const { ok, data } = await api.put(`/admin/questions/${editingId}`, payload);
      if (ok) {
        toast("Question updated!", "success");
        resetForm();
        loadQuestions(selectedVideoId);
      } else {
        toast(data?.detail || "Failed to update question", "error");
      }
    } else {
      const { ok, data } = await api.post("/admin/questions", payload);
      if (ok) {
        toast("Question added!", "success");
        resetForm();
        loadQuestions(selectedVideoId);
      } else {
        toast(data?.detail || "Failed to add question", "error");
      }
    }
    setSaving(false);
  }

  function resetForm() {
    setQuestion(""); 
    setQuestionType("mcq");
    setOptions(["", "", "", ""]); 
    setCorrectIndex(0); 
    setCorrectAnswer("");
    setExplanation("");
    setShowForm(false); 
    setEditingId(null);
  }

  function handleEditClick(q) {
    setEditingId(q.id);
    setQuestion(q.question);
    setQuestionType(q.question_type || "mcq");
    setExplanation(q.explanation || "");
    
    if (q.question_type === "fill_in_blank") {
      setCorrectAnswer(q.correct_answer || q.options[0]);
    } else if (q.question_type === "true_false") {
      setCorrectIndex(q.correct_option_index);
    } else {
      let paddedOptions = [...q.options];
      while(paddedOptions.length < 4) paddedOptions.push("");
      setOptions(paddedOptions);
      setCorrectIndex(q.correct_option_index);
    }
    setShowForm(true);
  }

  async function handleDelete(qId) {
    const { ok } = await api.delete(`/admin/questions/${qId}`);
    if (ok) { toast("Question deleted", "success"); loadQuestions(selectedVideoId); }
    else toast("Failed to delete question", "error");
    setConfirm(null);
  }

  const selectedVideo = allVideos.find(v => v.id === selectedVideoId);

  return (
    <div className="space-y-6">
      {confirm && (
        <ConfirmDialog
          message="Delete this question permanently? This cannot be undone."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Header & Video Picker ── */}
      <div className="card-static p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kahani-primary/10 flex items-center justify-center text-kahani-primary">
              {Icon.quiz}
            </div>
            <div>
              <h2 className="font-heading font-bold text-kahani-text text-xl">Quiz Manager</h2>
              <p className="text-xs text-kahani-text-muted">Add questions per video — learners must pass to progress</p>
            </div>
          </div>
          {selectedVideoId && (
            <div className="flex gap-2 self-start flex-wrap">
              <button
                onClick={handleAIGenerate}
                disabled={generatingAI}
                className="btn-outline flex items-center gap-2 text-sm border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 disabled:opacity-60"
              >
                {generatingAI ? <LoadingSpinner size="sm" /> : "✨"}
                {generatingAI ? "AI is Thinking..." : "Auto-Generate with AI"}
              </button>
              <button
                onClick={() => {
                  if(showForm) resetForm();
                  else setShowForm(true);
                }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {Icon.plus}
                {showForm ? "Cancel" : "Add Question"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="input-label">Select Video *</label>
            {loadingVideos ? (
              <div className="flex items-center gap-2 mt-2 text-sm text-kahani-text-muted">
                <LoadingSpinner size="sm" /> Loading videos…
              </div>
            ) : (
              <select className="input mt-1" value={selectedVideoId} onChange={handleVideoChange}>
                <option value="">— choose a video —</option>
                {courses.map(c => (
                  <optgroup key={c.id} label={`📁 ${c.title}`}>
                    {allVideos.filter(v => v.course_id === c.id).map(v => (
                      <option key={v.id} value={v.id}>🎬 {v.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>
          {selectedVideo && (
            <div className="flex flex-wrap gap-2">
              <span className="badge-primary text-xs">{selectedVideo.course_title}</span>
              <span className="badge-secondary text-xs">{selectedVideo.title}</span>
              <span className="text-xs bg-kahani-cream border border-kahani-border px-2 py-1 rounded-lg text-kahani-text-muted font-bold">
                {questions.length} Question{questions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Question Form ── */}
      {selectedVideoId && showForm && (
        <div className="card-static overflow-hidden border-l-4 border-l-kahani-primary animate-slide-up">
          <div className="bg-kahani-cream/50 px-6 py-4 border-b border-kahani-border flex items-center justify-between">
            <h3 className="font-heading font-bold text-kahani-text flex items-center gap-2">
              {Icon.plus} {editingId ? "Edit Question for:" : "New Question for:"} <span className="text-kahani-primary truncate max-w-[200px]">{selectedVideo?.title}</span>
            </h3>
          </div>
          <form onSubmit={handleCreate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Question Text *</label>
                <textarea
                  className="input resize-none mt-1"
                  rows={2}
                  placeholder="e.g. What is the primary rule for on-site event safety?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="input-label">Question Type *</label>
                <select className="input mt-1" value={questionType} onChange={e => setQuestionType(e.target.value)}>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="true_false">True / False</option>
                  <option value="fill_in_blank">Fill in the Blank</option>
                </select>
              </div>
            </div>

            {questionType === "mcq" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="input-label">Answer Options *</label>
                  <span className="text-xs text-kahani-text-muted bg-kahani-cream border border-kahani-border px-2 py-1 rounded">
                    🔘 Select radio = Correct Answer
                  </span>
                </div>
                <div className="space-y-3">
                  {options.map((opt, i) => {
                    const isCorrect = correctIndex === i;
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isCorrect ? "border-kahani-secondary/40 bg-kahani-secondary/5" : "border-kahani-border bg-white"}`}>
                        <input
                          type="radio"
                          name="correct"
                          checked={isCorrect}
                          onChange={() => setCorrectIndex(i)}
                          className="w-4 h-4 flex-shrink-0 cursor-pointer"
                          style={{ accentColor: "#1E544A" }}
                          title="Mark as correct answer"
                        />
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCorrect ? "bg-kahani-secondary text-white" : "bg-kahani-cream text-kahani-text-muted border border-kahani-border"}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <input
                          className="input flex-1 py-2"
                          placeholder={`Option ${String.fromCharCode(65 + i)}${i >= 2 ? " (optional)" : " (required)"}`}
                          value={opt}
                          onChange={e => handleOptionChange(i, e.target.value)}
                          required={i < 2}
                        />
                        {isCorrect && (
                          <span className="text-xs font-bold text-kahani-secondary flex-shrink-0 flex items-center gap-1">
                            ✅ Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {questionType === "true_false" && (
              <div>
                <label className="input-label mb-3 block">Correct Answer *</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${correctIndex === 0 ? "border-kahani-secondary/40 bg-kahani-secondary/5" : "border-kahani-border bg-white hover:bg-kahani-cream"}`}>
                    <input type="radio" name="tf_correct" checked={correctIndex === 0} onChange={() => setCorrectIndex(0)} className="w-5 h-5" style={{ accentColor: "#1E544A" }} />
                    <span className="font-bold text-kahani-text">True</span>
                  </label>
                  <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${correctIndex === 1 ? "border-kahani-secondary/40 bg-kahani-secondary/5" : "border-kahani-border bg-white hover:bg-kahani-cream"}`}>
                    <input type="radio" name="tf_correct" checked={correctIndex === 1} onChange={() => setCorrectIndex(1)} className="w-5 h-5" style={{ accentColor: "#1E544A" }} />
                    <span className="font-bold text-kahani-text">False</span>
                  </label>
                </div>
              </div>
            )}
            
            {questionType === "fill_in_blank" && (
              <div>
                <label className="input-label">Correct Answer *</label>
                <input
                  type="text"
                  className="input mt-1"
                  placeholder="e.g. Safety Helmet"
                  value={correctAnswer}
                  onChange={e => setCorrectAnswer(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="input-label">Explanation (Optional)</label>
              <textarea
                className="input resize-none mt-1"
                rows={2}
                placeholder="Explain why this answer is correct..."
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-kahani-border">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving…" : (editingId ? "💾 Update Question" : "💾 Save Question")}
              </button>
              <button type="button" onClick={resetForm} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Questions Table ── */}
      {selectedVideoId && (
        <div className="card-static overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-kahani-border bg-kahani-cream/50 flex items-center justify-between">
            <h3 className="font-heading font-bold text-kahani-text">
              Questions Table
              <span className="ml-2 text-sm font-normal text-kahani-text-muted">
                ({questions.length} {questions.length === 1 ? "question" : "questions"})
              </span>
            </h3>
            {questions.length > 0 && (
              <span className="text-xs text-kahani-secondary font-bold bg-kahani-secondary/10 border border-kahani-secondary/20 px-2 py-1 rounded-lg">
                ✅ Correct answer highlighted in green
              </span>
            )}
          </div>

          {loadingQuestions ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" label="Loading questions…" />
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-kahani-primary/10 flex items-center justify-center text-kahani-primary mb-4">
                {Icon.quiz}
              </div>
              <p className="font-semibold text-kahani-text mb-1">No questions yet</p>
              <p className="text-sm text-kahani-text-muted mb-4">
                Add your first question using the "Add Question" button above.
              </p>
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
                {Icon.plus} Add First Question
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-kahani-cream border-b border-kahani-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted w-10">#</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted">Question</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted">Options & Answer</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted">Explanation</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kahani-border">
                  {questions.map((q, qi) => (
                    <tr key={q.id} className="hover:bg-kahani-cream/40 transition-colors align-top">
                      {/* # */}
                      <td className="px-4 py-4">
                        <div className="w-7 h-7 rounded-lg bg-kahani-primary/10 text-kahani-primary flex items-center justify-center text-xs font-bold">
                          {qi + 1}
                        </div>
                      </td>

                      {/* Question Text */}
                      <td className="px-4 py-4 max-w-[220px]">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-kahani-text-muted bg-kahani-cream border border-kahani-border px-1.5 py-0.5 rounded w-max">
                            {q.question_type === "mcq" ? "MCQ" : q.question_type === "true_false" ? "True/False" : "Fill-in-blank"}
                          </span>
                          <p className="font-semibold text-kahani-text text-sm leading-relaxed line-clamp-3">
                            {q.question}
                          </p>
                        </div>
                      </td>

                      {/* Options & Answer */}
                      <td className="px-4 py-4">
                        {q.question_type === "fill_in_blank" ? (
                           <div className="flex items-start gap-2">
                             <span className="text-lg">✅</span>
                             <span className="text-sm font-bold text-kahani-secondary leading-snug">
                               {q.correct_answer || q.options[0]}
                             </span>
                           </div>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                  oi === q.correct_option_index
                                    ? "bg-kahani-secondary/10 border-kahani-secondary/30 text-kahani-secondary"
                                    : "bg-white border-kahani-border text-kahani-text-muted"
                                }`}
                              >
                                {q.question_type === "mcq" && <span className="font-bold w-4">{String.fromCharCode(65 + oi)}.</span>}
                                <span className="truncate max-w-[140px]">{opt}</span>
                                {oi === q.correct_option_index && <span>✅</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Explanation */}
                      <td className="px-4 py-4 max-w-[200px]">
                        <p className="text-xs text-gray-500 italic line-clamp-3">
                          {q.explanation || "No explanation"}
                        </p>
                      </td>

                      {/* Edit & Delete */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(q)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Edit question"
                          >
                            {Icon.edit}
                          </button>
                          <button
                            onClick={() => setConfirm(q.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete question"
                          >
                            {Icon.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-kahani-border bg-kahani-cream/30">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-xs text-kahani-text-muted">
                      Total: <strong>{questions.length}</strong> question{questions.length !== 1 ? "s" : ""} · Pass threshold for learners: <strong>{Math.max(1, Math.round(questions.length * 0.67))}</strong> correct
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: Icon.overview },
  { id: "courses",  label: "Courses",  icon: Icon.courses  },
  { id: "videos",   label: "Videos",   icon: Icon.videos   },
  { id: "quizzes",  label: "Quizzes",  icon: Icon.quiz     },
  { id: "users",    label: "Users",    icon: Icon.users    },
];

// ─── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin() {
  const { user, role, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [toast, setToast] = useState(null);

  const isAdmin = role === "admin";

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  useEffect(() => {
    if (authLoading || !isAdmin) return;
    api.get("/admin/overview").then(({ ok, data }) => {
      if (ok) setStats(data);
      else setStatsError(data?.detail || "Failed to load stats");
      setStatsLoading(false);
    });
  }, [isAdmin, authLoading]);

  // Still loading auth
  if (authLoading) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Verifying access…" />
      </div>
    );
  }

  // Access denied (ProtectedRoute also handles this, but keep as fallback)
  if (!user || !isAdmin) {
    return (
      <div className="page">
        <div className="max-w-2xl mx-auto px-4 py-24">
          <div className="card-static p-12 text-center animate-slide-up overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-kahani-gradient rounded-t-2xl" />
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6 text-red-400">
              {Icon.lock}
            </div>
            <h1 className="font-heading text-3xl font-bold text-kahani-text mb-3">Access Denied</h1>
            <p className="text-kahani-text-muted text-sm leading-relaxed max-w-xs mx-auto mb-8">
              {!user
                ? "You need to be logged in with an admin account to view this page."
                : "Your account does not have administrator access."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {!user && <Link to="/login" className="btn-primary">Log in</Link>}
              <Link to="/" className="btn-outline">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Toast notification */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-kahani-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src="/logo.png"
              alt="Kahani Events"
              className="h-12 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="badge-primary">Admin</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-kahani-text">
                Admin Dashboard
              </h1>
            </div>
          </div>

          {/* Tabs — scrollable on mobile */}
          <div className="flex gap-1 mt-6 border-b border-kahani-border -mb-px overflow-x-auto">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold",
                    "border-b-2 transition-all duration-200 -mb-px whitespace-nowrap flex-shrink-0",
                    isActive
                      ? "border-kahani-primary text-kahani-primary"
                      : "border-transparent text-kahani-text-muted hover:text-kahani-text hover:border-kahani-border",
                  ].join(" ")}
                >
                  <span className={isActive ? "text-kahani-primary" : "text-kahani-text-muted"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewTab />
        )}
        {activeTab === "courses" && <CoursesTab toast={showToast} />}
        {activeTab === "videos"  && <VideosTab  toast={showToast} />}
        {activeTab === "quizzes" && <QuizzesTab toast={showToast} />}
        {activeTab === "users"   && <UsersTab   toast={showToast} currentUserId={user?.id} />}
      </div>
    </div>
  );
}
