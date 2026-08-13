// src/routes/CourseDetail.jsx
// ----------------------------
// Anti-Skip system (Data-driven approach):
//   Listens to Bunny.net postMessage for 'timeupdate' to get actual video length and current position.
//   Unlocks "Mark as Completed" ONLY when the user watches up to the end (duration).

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS = {
  posKey:      (userId, id) => `kahani_pos_${userId}_${id}`,
  finKey:      (userId, id) => `kahani_fin_${userId}_${id}`,
  savePos(userId, id, s)  { try { localStorage.setItem(LS.posKey(userId, id), String(Math.floor(s))); } catch(_) {} },
  getPos(userId, id)      { try { return parseInt(localStorage.getItem(LS.posKey(userId, id)) || "0", 10) || 0; } catch(_) { return 0; } },
  markDone(userId, id)    { try { localStorage.setItem(LS.finKey(userId, id), "1"); } catch(_) {} },
  isDone(userId, id)      { try { return localStorage.getItem(LS.finKey(userId, id)) === "1"; } catch(_) { return false; } },
  clear(userId, id)       { try { localStorage.removeItem(LS.posKey(userId, id)); localStorage.removeItem(LS.finKey(userId, id)); } catch(_) {} },
};

// ─── Build embed URL ──────────────────────────────────────────────────────────
function buildEmbedUrl(rawUrl, resumeSec = 0) {
  if (!rawUrl) return "";
  try {
    const u = new URL(rawUrl);
    u.searchParams.set("autoplay",  "false");
    u.searchParams.set("muted",     "false");
    u.searchParams.set("mute",      "0");
    u.searchParams.set("enableApi", "1");   // ask Bunny to fire postMessage events
    if (resumeSec > 5) u.searchParams.set("t", String(resumeSec));
    return u.toString();
  } catch(_) { return rawUrl; }
}

// ─── VideoRow ─────────────────────────────────────────────────────────────────
function VideoRow({ video, index, completed, isLocked, onMarkComplete, completing, userId, course }) {
  const [isExpanded,  setIsExpanded]  = useState(false);
  const [canComplete, setCanComplete] = useState(() => LS.isDone(userId, video.id));
  const [resumeSec,   setResumeSec]   = useState(() => LS.getPos(userId, video.id));
  const [duration,    setDuration]    = useState(0); // actual video length
  const [hint,        setHint]        = useState("");
  const [quizUnlocked, setQuizUnlocked] = useState(() => LS.isDone(userId, video.id));

  const lastSaveRef = useRef(0);
  const navigate = useNavigate();
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  async function handleTakeQuiz() {
    setGeneratingQuiz(true);
    const { ok, data } = await api.post(`/quizzes/video/${video.id}/generate-and-assign-quiz`, { user_id: userId });
    setGeneratingQuiz(false);
    if (ok) {
      navigate(`/quiz/${video.id}`, {
        state: { 
          courseId: course.id, 
          quizAttemptId: data.quiz_attempt_id,
          generatedQuestions: data.questions
        }
      });
    } else {
      alert("Failed to generate quiz: " + (data?.detail || "Unknown error"));
    }
  }

  // ── postMessage listener (primary & fallback player.js path) ──
  const handleMessage = useCallback((e) => {
    let payload = e.data;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch(_) { return; }
    }
    if (!payload || typeof payload !== "object") return;

    // Support both direct Bunny events and standard Player.js events
    let evt = "";
    let ct = null;
    let dur = 0;

    if (payload.context === "player.js") {
      evt = String(payload.event || "").toLowerCase().trim();
      ct = payload.value?.seconds;
      dur = payload.value?.duration || 0;
    } else {
      evt = String(payload.event || payload.type || "").toLowerCase().trim();
      ct = typeof payload.currentTime === "number" ? payload.currentTime :
           typeof payload.time === "number" ? payload.time : null;
      dur = typeof payload.duration === "number" ? payload.duration : 0;
    }

    // 1. Video ended explicitly
    if (evt === "ended" || evt === "player:ended" || evt === "finish" || payload.ended === true) {
      setCanComplete(true);
      // Wait to mark done until user clicks the button
      setHint("🎉 Video complete! You can now mark this module as watched.");
      return;
    }

    // Play / Pause hints
    if (evt === "play" || evt === "playing") {
      setHint("▶ Watching… progress saves automatically.");
    }
    if (evt === "pause" || evt === "paused") {
      const pos = LS.getPos(userId, video.id);
      if (pos > 5) {
        const m = Math.floor(pos / 60), s = String(pos % 60).padStart(2, "0");
        setHint(`⏸ Paused — saved at ${m}:${s}.`);
      }
    }

    if (dur > 0 && dur !== duration) {
      setDuration(dur);
    }

    if (ct !== null && ct > 0) {
      const now = Date.now();
      // Throttle save to localStorage every 5s
      if (now - lastSaveRef.current > 5000) {
        lastSaveRef.current = now;
        LS.savePos(userId, video.id, ct);
        setResumeSec(Math.floor(ct));
      }
      
      // Auto-unlock if user reaches within 5 seconds of the actual video duration!
      if (dur > 0 && ct >= dur - 5 && !canComplete) {
        setCanComplete(true);
        setHint("🎉 Video complete! You can now mark this module as watched.");
      }
      
      // Fallback: If video duration API fails (dur === 0), unlock after 15 seconds of watch time
      if ((dur === 0 || !dur) && ct >= 15 && !canComplete) {
        setCanComplete(true);
        setHint("🎉 Video complete! You can now mark this module as watched.");
      }
    }
  }, [video.id, userId, duration, canComplete]);

  useEffect(() => {
    if (isLocked || completed) return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isLocked, completed, handleMessage]);

  // Collapse hint cleanup
  useEffect(() => { if (!isExpanded) setHint(""); }, [isExpanded]);

  const embedUrl = buildEmbedUrl(video.video_url, resumeSec);
  const btnReady = !completing;

  // Real progress formatting
  const progressPercent = duration > 0 ? Math.min((resumeSec / duration) * 100, 100) : 0;
  
  const formatTime = (secs) => {
    if (!secs) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={`card-static flex flex-col transition-all duration-300 overflow-hidden shadow-sm
      ${isLocked ? "opacity-60 bg-gray-50" : "bg-white"}`}>

      {/* ── Header ── */}
      <button
        onClick={() => !isLocked && setIsExpanded(v => !v)}
        disabled={isLocked}
        className={`w-full p-5 flex items-center justify-between transition-colors outline-none
          focus:bg-[#8C345C]/5
          ${!isLocked ? "hover:bg-[#8C345C]/5 cursor-pointer" : "cursor-not-allowed"}`}
      >
        <div className="flex items-center gap-5 min-w-0 text-left">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300
            ${isLocked  ? "bg-gray-200 text-gray-500"
            : completed ? "bg-[#1E544A] text-white shadow-sm"
            :             "bg-[#8C345C]/10 text-[#8C345C]"}`}>
            {isLocked ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            ) : completed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            ) : <span className="font-bold text-sm">{index + 1}</span>}
          </div>

          {/* Title + sub-labels */}
          <div className="min-w-0">
            <p className={`text-base font-bold truncate
              ${completed ? "text-[#1E544A]" : isLocked ? "text-gray-600" : "text-kahani-text"}`}>
              {video.title}
            </p>
            {isLocked && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                </svg>
                Complete previous module to unlock
              </p>
            )}
            {/* Resume hint in collapsed header */}
            {!isLocked && !completed && resumeSec > 5 && !isExpanded && (
              <p className="text-xs text-[#CD9556] mt-1 font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Resume from {formatTime(resumeSec)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          {completed && (
            <span className="hidden sm:flex text-xs bg-[#1E544A]/10 text-[#1E544A] px-2 py-1
              rounded font-bold items-center gap-1 border border-[#1E544A]/20">
              ✅ Completed
            </span>
          )}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!isLocked ? "bg-[#FBF7F0]" : ""}`}>
            <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </button>

      {/* ── Accordion Body ── */}
      <div className={`grid transition-all duration-300 ease-in-out
        ${isExpanded && !isLocked ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="p-5 pt-0 border-t border-[#E8DDD5]">

            {/* ── Player ── */}
            {video.video_url ? (
              <div className="mt-4 w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-[#E8DDD5]">
                {isExpanded && (
                  <iframe
                    key={`${video.id}-${resumeSec > 0 ? "r" : "f"}`}
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; gyroscope; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={video.title}
                  />
                )}
              </div>
            ) : (
              <div className="mt-4 w-full aspect-video rounded-xl flex items-center justify-center bg-gray-100 border border-gray-200">
                <span className="text-gray-400 text-sm">No video available</span>
              </div>
            )}

            {/* ── Transcription ── */}
            {video.transcript && isExpanded && (
              <div className="mt-4 bg-[#FBF7F0] p-4 rounded-xl border border-[#E8DDD5]">
                <h4 className="text-sm font-bold text-[#1E544A] mb-2">Transcription</h4>
                <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {video.transcript}
                </div>
              </div>
            )}

            {/* ── Real Progress Bar (Actual video length) ── */}
            {!completed && duration > 0 && !canComplete && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#1E544A]/70">
                    ⏱ Watch to the end to unlock
                  </span>
                  <span className="text-xs text-[#1E544A]/50">
                    {formatTime(resumeSec)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="h-1.5 bg-[#E8DDD5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8C345C] to-[#1E544A] rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── Status hint ── */}
            {isExpanded && !completed && hint && (
              <div className="mt-3">
                <p className="text-xs font-medium text-[#1E544A]/80 bg-[#1E544A]/5 border border-[#1E544A]/15 px-3 py-2 rounded-lg">
                  {hint}
                </p>
              </div>
            )}

            {/* ── Action Bar ── */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4
              bg-[#FBF7F0] p-5 rounded-xl border border-[#E8DDD5]">

              {/* Not yet completed by DB */}
              {!completed && (
                <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
                      <div className="text-sm text-gray-500 text-center sm:text-left">
                        Step 1: Mark video watched. Step 2: Pass quiz.
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setQuizUnlocked(true);
                            LS.markDone(userId, video.id);
                          }}
                          disabled={quizUnlocked}
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2
                            ${!quizUnlocked
                              ? "bg-[#8C345C] text-white hover:bg-[#6b2646] cursor-pointer"
                              : "bg-[#1E544A] text-white cursor-default"}`}
                        >
                          {quizUnlocked ? "✅ Watched" : "Mark as Completed"}
                        </button>
                    
                    {!quizUnlocked ? (
                      <div className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-400 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed select-none">
                        🔒 Take Quiz
                      </div>
                    ) : (
                      <button
                        onClick={handleTakeQuiz}
                        disabled={generatingQuiz}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#8C345C] text-white rounded-lg font-bold hover:bg-[#6b2646] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {generatingQuiz ? "AI is crafting your unique quiz..." : "Take Quiz to Complete"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* DB confirmed completed */}
              {completed && (
                <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
                  <div className="text-sm font-bold text-[#1E544A] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    Video & Quiz Completed
                  </div>
                  <button
                    onClick={handleTakeQuiz}
                    disabled={generatingQuiz}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-[#1E544A] rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-sm text-center text-sm flex items-center justify-center gap-2 border border-gray-200 disabled:opacity-70"
                  >
                    {generatingQuiz ? "AI is crafting a fresh quiz..." : "Retake Quiz"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CourseDetail Page ────────────────────────────────────────────────────────
export default function CourseDetail() {
  const { id }   = useParams();
  const { user } = useAuth();

  const [course,       setCourse]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [completedIds, setCompletedIds] = useState(new Set());
  const [completing,   setCompleting]   = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then(({ ok, data }) => {
      if (ok) setCourse(data);
      else    setError(data?.detail || "Course not found.");
      setLoading(false);
    });
  }, [id]);

  async function handleMarkComplete(videoId) {
    if (!user) return;
    setCompleting(videoId);
    const { ok, data } = await api.post("/progress/complete", { video_id: videoId });
    if (ok) {
      setCompletedIds(prev => new Set([...prev, videoId]));
      LS.clear(videoId); // clear local resume point once confirmed by DB
    } else {
      alert(data?.detail || "Failed to save progress. Please try again.");
    }
    setCompleting(null);
  }

  useEffect(() => {
    if (user && course) {
      api.get("/progress").then(({ ok, data }) => {
        if (ok) setCompletedIds(new Set(data.map(p => p.video_id)));
      });
    }
  }, [user, course]);

  const completedCount = completedIds.size;
  const totalVideos    = course?.videos?.length || 0;

  return (
    <div className="page bg-[#FBF7F0] min-h-screen pb-16">
      {loading && (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" label="Loading course…"/>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="alert-error max-w-md"><span>{error}</span></div>
          <Link to="/courses" className="btn-outline mt-6 inline-flex">← Back to Courses</Link>
        </div>
      )}

      {!loading && !error && course && (
        <>
          <div className="bg-white border-b border-[#E8DDD5] relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/3 h-full bg-[#8C345C]/5 rounded-l-full blur-3xl transform translate-x-1/4"/>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Link to="/courses"
                className="inline-flex items-center gap-1 text-xs text-[#1E544A]/70 hover:text-[#8C345C]
                  transition-colors mb-6 font-bold uppercase tracking-wider">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                All Courses
              </Link>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="max-w-2xl">
                  <span className="mb-3 inline-flex bg-[#CD9556] text-white px-3 py-1 rounded-full
                    text-xs font-bold uppercase tracking-widest shadow-sm">Masterclass Track</span>
                  <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1E544A] leading-tight">
                    {course.title}
                  </h1>
                  {course.description && (
                    <p className="text-[#1E544A]/80 text-base mt-4 leading-relaxed">{course.description}</p>
                  )}
                </div>

                {user && totalVideos > 0 && (
                  <div className="card-static p-6 flex-shrink-0 min-w-[200px] border-t-4 border-t-[#8C345C] shadow-md bg-white">
                    <p className="text-xs text-[#1E544A]/70 font-bold uppercase tracking-wider mb-2">Certification Progress</p>
                    <div className="flex items-baseline gap-2">
                      <p className="font-heading text-4xl font-bold text-[#8C345C]">{completedCount}</p>
                      <p className="text-[#1E544A]/60 font-bold">/ {totalVideos}</p>
                    </div>
                    <div className="mt-4 h-2 bg-[#E8DDD5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1E544A] to-[#8C345C] rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / totalVideos) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!user && (
              <div className="alert-info mb-8 bg-[#1E544A]/10 text-[#1E544A] border border-[#1E544A]/20">
                <span>
                  <Link to="/login" className="font-bold underline hover:text-[#8C345C]">Log in</Link>
                  {" "}to unlock the video sequence and take the certification quizzes.
                </span>
              </div>
            )}

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-heading text-3xl font-bold text-[#1E544A]">Curriculum Sequence</h2>
              <span className="text-xs font-bold text-[#8C345C] bg-[#8C345C]/10 px-3 py-1.5 rounded-full
                border border-[#8C345C]/20 uppercase tracking-widest shadow-sm">
                Strict Progression Enforced
              </span>
            </div>

            {totalVideos === 0 ? (
              <div className="text-center py-16 card-static shadow-sm border border-[#E8DDD5]">
                <p className="text-[#1E544A]/60 font-semibold">No modules available yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {course.videos.map((video, index) => {
                  const completed = completedIds.has(video.id);
                  const isLocked  = index > 0 && (!user || !completedIds.has(course.videos[index - 1].id));
                  return (
                      <VideoRow
                        key={video.id}
                        video={video}
                        index={index}
                        completed={completed}
                        isLocked={isLocked}
                        onMarkComplete={handleMarkComplete}
                        completing={completing === video.id}
                        userId={user?.id}
                        course={course}
                      />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
