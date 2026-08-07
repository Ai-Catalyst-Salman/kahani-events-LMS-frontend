// src/routes/Admin.jsx
// --------------------
// Full admin dashboard with tabs: Overview | Courses | Videos | Users
// Responsive: tabs scroll horizontally on mobile, table scrolls on mobile

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

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
function OverviewTab({ stats, loading, error }) {
  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading stats…" /></div>;
  if (error) return <div className="alert-error max-w-md">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={Icon.courses}  label="Total Courses"     value={stats.total_courses}     colorClass="bg-kahani-primary/10 text-kahani-primary" />
        <StatCard icon={Icon.videos}   label="Total Videos"      value={stats.total_videos}      colorClass="bg-kahani-secondary/10 text-kahani-secondary" />
        <StatCard icon={Icon.check}    label="Completions"       value={stats.total_completions} colorClass="bg-amber-100 text-amber-700" />
        <StatCard icon={Icon.users}    label="Total Users"       value={stats.total_users}       colorClass="bg-violet-100 text-violet-700" />
      </div>
      <div className="card-static p-6">
        <h2 className="section-heading mb-2">About this dashboard</h2>
        <p className="text-sm text-kahani-text-muted leading-relaxed">
          Manage courses, videos, and learners from the tabs above. Use <strong>Courses</strong> to add or remove
          training modules, <strong>Videos</strong> to attach content to a course, and <strong>Users</strong> to
          promote or manage platform members.
        </p>
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
    const { ok, data } = await api.post("/admin/courses", { title, description: description || null });
    if (ok) {
      toast("Course created!", "success");
      setTitle(""); setDescription(""); setShowForm(false);
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
            <div className="flex flex-wrap gap-3">
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
    });
    if (ok) {
      toast("Video added!", "success");
      setTitle(""); setVideoUrl(""); setCourseId(""); setShowForm(false);
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

  const load = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await api.get("/admin/users");
    if (ok) setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
  }

  return (
    <div className="space-y-4">
      <div className="card-static p-4 bg-kahani-primary/5 border border-kahani-primary/20">
        <p className="text-xs text-kahani-primary font-medium">
          All users registered on this platform are listed below. You can promote or demote their role.
          You cannot change your own role.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" label="Loading users…" /></div>
      ) : users.length === 0 ? (
        <div className="card-static p-12 text-center text-kahani-text-muted text-sm">No users found.</div>
      ) : (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-kahani-cream border-b border-kahani-border">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">Role</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-kahani-text-muted">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kahani-border">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-kahani-cream/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-kahani-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="text-kahani-text font-medium truncate max-w-[200px]">{user.email}</span>
                        {user.id === currentUserId && (
                          <span className="badge-primary text-[10px]">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={user.role === "admin" ? "badge-primary" : "badge-secondary"}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {user.id !== currentUserId ? (
                        <button
                          onClick={() => toggleRole(user.id, user.role)}
                          disabled={updating === user.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-kahani-border text-kahani-text-muted hover:border-kahani-primary hover:text-kahani-primary transition-colors disabled:opacity-50"
                        >
                          {updating === user.id ? "Updating…" : user.role === "admin" ? "Make Learner" : "Make Admin"}
                        </button>
                      ) : (
                        <span className="text-xs text-kahani-text-muted italic">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  async function handleCreate(e) {
    e.preventDefault();
    if (!selectedVideoId) return;
    const validOptions = options.filter(o => o.trim());
    if (validOptions.length < 2) {
      toast("Please provide at least 2 options", "error"); return;
    }
    if (correctIndex >= validOptions.length) {
      toast("Correct answer index out of range", "error"); return;
    }
    setSaving(true);
    
    if (editingId) {
      const { ok, data } = await api.put(`/admin/questions/${editingId}`, {
        question: question.trim(),
        options: validOptions,
        correct_option_index: correctIndex,
      });
      if (ok) {
        toast("Question updated!", "success");
        setQuestion(""); setOptions(["", "", "", ""]); setCorrectIndex(0); setShowForm(false); setEditingId(null);
        loadQuestions(selectedVideoId);
      } else {
        toast(data?.detail || "Failed to update question", "error");
      }
    } else {
      const { ok, data } = await api.post("/admin/questions", {
        video_id: selectedVideoId,
        question: question.trim(),
        options: validOptions,
        correct_option_index: correctIndex,
      });
      if (ok) {
        toast("Question added!", "success");
        setQuestion(""); setOptions(["", "", "", ""]); setCorrectIndex(0); setShowForm(false);
        loadQuestions(selectedVideoId);
      } else {
        toast(data?.detail || "Failed to add question", "error");
      }
    }
    setSaving(false);
  }

  function handleEditClick(q) {
    setEditingId(q.id);
    setQuestion(q.question);
    let paddedOptions = [...q.options];
    while(paddedOptions.length < 4) paddedOptions.push("");
    setOptions(paddedOptions);
    setCorrectIndex(q.correct_option_index);
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
            <button
              onClick={() => setShowForm(v => !v)}
              className="btn-primary flex items-center gap-2 text-sm self-start"
            >
              {Icon.plus}
              {showForm ? "Cancel" : "Add Question"}
            </button>
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
            <div>
              <label className="input-label">Question Text *</label>
              <textarea
                className="input resize-none mt-1"
                rows={3}
                placeholder="e.g. What is the primary rule for on-site event safety?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                required
              />
            </div>

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

            <div className="flex flex-wrap gap-3 pt-2 border-t border-kahani-border">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving…" : (editingId ? "💾 Update Question" : "💾 Save Question")}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setQuestion(""); setOptions(["","","",""]); setCorrectIndex(0); setEditingId(null); }} className="btn-ghost">
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
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted">Options</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-kahani-text-muted">Correct Answer</th>
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
                        <p className="font-semibold text-kahani-text text-sm leading-relaxed line-clamp-3">
                          {q.question}
                        </p>
                      </td>

                      {/* All Options */}
                      <td className="px-4 py-4">
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
                              <span className="font-bold w-4">{String.fromCharCode(65 + oi)}.</span>
                              <span className="truncate max-w-[140px]">{opt}</span>
                              {oi === q.correct_option_index && <span>✅</span>}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Correct Answer highlight */}
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">✅</span>
                          <span className="text-sm font-bold text-kahani-secondary leading-snug">
                            {String.fromCharCode(65 + q.correct_option_index)}. {q.options[q.correct_option_index]}
                          </span>
                        </div>
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
          <OverviewTab stats={stats} loading={statsLoading} error={statsError} />
        )}
        {activeTab === "courses" && <CoursesTab toast={showToast} />}
        {activeTab === "videos"  && <VideosTab  toast={showToast} />}
        {activeTab === "quizzes" && <QuizzesTab toast={showToast} />}
        {activeTab === "users"   && <UsersTab   toast={showToast} currentUserId={user?.id} />}
      </div>
    </div>
  );
}
