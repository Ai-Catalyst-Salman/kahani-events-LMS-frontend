// src/routes/Quiz.jsx
// -------------------
// Quiz page for a specific video — /quiz/:videoId
// Fetches real questions from the backend and grades answers server-side.

import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Quiz() {
  const { id: videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const backLink = courseId ? `/courses/${courseId}` : "/courses";

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});     // { questionId: selectedIndex }
  const [status, setStatus] = useState("loading"); // loading | locked | ready | submitting | result | noqs | error
  const [result, setResult] = useState(null);

  // Psychological Proctoring State
  const [cameraStatus, setCameraStatus] = useState("idle"); // idle | requesting | granted | denied
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraStatus, status]);

  async function startCamera() {
    setCameraStatus("requesting");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(s);
      setCameraStatus("granted");
    } catch (err) {
      setCameraStatus("denied");
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/quiz/${videoId}` } }, replace: true });
      return;
    }

    api.get(`/quizzes/video/${videoId}/questions`).then(({ ok, status: httpStatus, data }) => {
      if (ok) {
        if (!data || data.length === 0) {
          setStatus("noqs");
        } else {
          setQuestions(data);
          setStatus("ready");
        }
      } else if (httpStatus === 403) {
        setStatus("locked");
      } else if (httpStatus === 401) {
        navigate("/login", { replace: true });
      } else {
        setStatus("error");
      }
    });
  }, [videoId, user, navigate]);

  function handleSelect(questionId, optionIndex) {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  }

  async function handleSubmit() {
    const unanswered = questions.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }
    setStatus("submitting");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    const { ok, data } = await api.post(`/quizzes/video/${videoId}/submit`, { answers });
    if (ok) {
      // Force completion via API in case backend quiz endpoint didn't save it
      if (data.passed) {
        await api.post("/progress/complete", { video_id: videoId });
      }
      setResult(data);
      setStatus("result");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="page bg-[#FBF7F0] min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <Link to={backLink} className="inline-flex items-center gap-1 text-xs text-[#1E544A]/70 hover:text-[#8C345C] transition-colors font-bold uppercase tracking-wider mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Course
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C345C]/10 flex items-center justify-center text-[#8C345C]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-[#1E544A]">Knowledge Quiz</h1>
              <p className="text-sm text-[#1E544A]/60">Score at least 67% to pass</p>
            </div>
          </div>
        </div>

        {/* ── LOADING ── */}
        {status === "loading" && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" label="Loading quiz…" />
          </div>
        )}

        {/* ── LOCKED ── */}
        {status === "locked" && (
          <div className="bg-white border border-[#E8DDD5] rounded-2xl p-10 text-center animate-slide-up shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#8C345C]/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#8C345C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1E544A] mb-3">Quiz Locked</h2>
            <p className="text-[#1E544A]/70 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              This quiz is currently locked.
            </p>
            <Link to={backLink} className="inline-block px-6 py-3 bg-[#8C345C] text-white rounded-xl font-bold hover:bg-[#6b2646] transition-colors">
              Go Back
            </Link>
          </div>
        )}

        {/* ── NO QUESTIONS ── */}
        {status === "noqs" && (
          <div className="bg-white border border-[#E8DDD5] rounded-2xl p-10 text-center animate-slide-up shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#CD9556]/15 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#CD9556]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1E544A] mb-3">No Questions Yet</h2>
            <p className="text-[#1E544A]/70 text-sm mb-6">There are no quiz questions for this video. You can just mark it as completed.</p>
            <div className="flex justify-center gap-4">
              <Link to={backLink} className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                Go Back
              </Link>
              <button 
                onClick={async () => {
                  setStatus("submitting");
                  const { ok } = await api.post("/progress/complete", { video_id: videoId });
                  if (ok) navigate(backLink, { replace: true });
                  else setStatus("error");
                }}
                className="inline-block px-6 py-3 bg-[#1E544A] text-white rounded-xl font-bold hover:bg-[#164038] transition-colors shadow-md">
                Complete Video
              </button>
            </div>
          </div>
        )}

        {/* ── VERIFICATION GATE ── */}
        {status === "ready" && cameraStatus !== "granted" && (
          <div className="bg-white border border-[#E8DDD5] rounded-2xl p-10 text-center shadow-sm animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-[#8C345C]/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#8C345C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1E544A] mb-3">Psychological Proctoring</h2>
            <p className="text-[#1E544A]/70 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Camera access is mandatory to ensure fairness. You will be monitored during the quiz.
            </p>
            {cameraStatus === "denied" && (
              <p className="text-[#8C345C] font-bold text-sm mb-4">
                Access Denied. You must allow camera permissions to unlock the quiz.
              </p>
            )}
            <button
              onClick={startCamera}
              disabled={cameraStatus === "requesting"}
              className="inline-block px-8 py-3 bg-[#1E544A] text-white rounded-xl font-bold hover:bg-[#164038] transition-colors shadow-md disabled:opacity-50"
            >
              {cameraStatus === "requesting" ? "Requesting..." : "Allow Camera & Start"}
            </button>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {status === "ready" && cameraStatus === "granted" && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-white border border-[#E8DDD5] rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <span className="text-sm font-bold text-[#1E544A]">{questions.length} Question{questions.length > 1 ? "s" : ""}</span>
              <span className="text-xs bg-[#8C345C]/10 text-[#8C345C] px-3 py-1.5 rounded-full font-bold border border-[#8C345C]/20">
                Pass: {Math.round(questions.length * 0.67)} / {questions.length} correct
              </span>
            </div>

            {questions.map((q, qi) => (
              <div key={q.id} className="bg-white border border-[#E8DDD5] rounded-2xl p-6 shadow-sm">
                <p className="text-sm font-bold text-[#1E544A] mb-1 uppercase tracking-wider">Question {qi + 1}</p>
                <p className="text-base font-semibold text-[#2C1B1E] mb-5 leading-relaxed">{q.question}</p>
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(q.id, oi)}
                        className={`text-left px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selected
                            ? "border-[#8C345C] bg-[#8C345C]/8 text-[#8C345C] font-bold"
                            : "border-[#E8DDD5] text-[#6B5558] hover:border-[#CE9FA6] hover:bg-[#FBF7F0]"
                        }`}
                      >
                        <span className={`inline-flex w-6 h-6 rounded-full mr-3 items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-[#8C345C] text-white" : "bg-[#FBF7F0] text-[#6B5558] border border-[#E8DDD5]"}`}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-[#1E544A] text-white rounded-xl font-bold text-lg hover:bg-[#164038] transition-colors shadow-md"
            >
              Submit Quiz →
            </button>
          </div>
        )}

        {/* ── SUBMITTING ── */}
        {status === "submitting" && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" label="Grading your answers…" />
          </div>
        )}

        {/* ── RESULT ── */}
        {status === "result" && result && (
          <div className="animate-slide-up space-y-6">
            <div className={`rounded-2xl p-8 text-center shadow-sm border-2 ${result.passed ? "bg-[#1E544A]/5 border-[#1E544A]/30" : "bg-red-50 border-red-300"}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${result.passed ? "bg-[#1E544A] text-white" : "bg-red-100 text-red-500"}`}>
                {result.passed ? (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <h2 className={`font-heading text-3xl font-bold mb-2 ${result.passed ? "text-[#1E544A]" : "text-red-700"}`}>
                {result.passed ? "🎉 Quiz Passed!" : "Quiz Failed"}
              </h2>
              <p className={`text-lg font-bold mb-1 ${result.passed ? "text-[#1E544A]" : "text-red-600"}`}>
                {result.score} / {result.total} correct
              </p>
              <p className={`text-sm ${result.passed ? "text-[#1E544A]/70" : "text-red-600/80"}`}>
                {result.passed
                  ? "Excellent! You've demonstrated strong understanding of this module."
                  : `You need at least ${result.pass_threshold} correct answers to pass. Review the video and try again.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={backLink} className="flex-1 text-center py-3 bg-[#8C345C] text-white rounded-xl font-bold hover:bg-[#6b2646] transition-colors">
                Continue Curriculum
              </Link>
              {!result.passed && (
                <button
                  onClick={() => { 
                    setStatus("ready"); 
                    setAnswers({}); 
                    // Need to go through verification again if they retry
                    setCameraStatus("idle");
                  }}
                  className="flex-1 py-3 bg-white border-2 border-[#1E544A] text-[#1E544A] rounded-xl font-bold hover:bg-[#1E544A]/5 transition-colors"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-bold mb-4">Something went wrong. Please try again.</p>
            <Link to={backLink} className="inline-block px-6 py-3 bg-[#8C345C] text-white rounded-xl font-bold hover:bg-[#6b2646] transition-colors">
              Go Back
            </Link>
          </div>
        )}

      </div>

      {/* ── CAMERA WIDGET ── */}
      {stream && status === "ready" && cameraStatus === "granted" && (
        <div className="fixed bottom-6 right-6 w-48 rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-black z-50">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-md z-10">
            <div className="w-2 h-2 rounded-full bg-[#8C345C] animate-pulse"></div>
            <span className="text-[10px] text-white font-bold tracking-wider uppercase">Live</span>
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto object-cover transform -scale-x-100"
          />
        </div>
      )}
    </div>
  );
}
