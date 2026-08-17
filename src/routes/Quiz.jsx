// src/routes/Quiz.jsx
// -------------------
// Dynamic AI Quiz page for a specific video — /quiz/:videoId

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
  
  // Data passed from CourseDetail.jsx AI Generation
  const quizAttemptId = location.state?.quizAttemptId;
  const initialQuestions = location.state?.generatedQuestions;

  const [questions, setQuestions] = useState(initialQuestions || []);
  const [answers, setAnswers] = useState({});     // { questionIndex: selectedValue (string or index) }
  const [status, setStatus] = useState(initialQuestions ? "ready" : "locked"); // ready | submitting | result | error | locked
  const [result, setResult] = useState(null);

  // Psychological Proctoring State
  const [cameraStatus, setCameraStatus] = useState("idle"); // idle | requesting | granted | denied
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

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
    // If we landed here without an AI quiz attempt, it means they didn't click "Take Quiz" properly.
    if (!quizAttemptId || !initialQuestions) {
      setStatus("locked");
    }
  }, [videoId, user, navigate, quizAttemptId, initialQuestions]);

  function handleSelect(questionIndex, answerValue) {
    setAnswers(prev => ({ ...prev, [questionIndex]: answerValue }));
  }

  async function handleSubmit() {
    const unanswered = questions.filter((_, i) => answers[i] === undefined || answers[i] === "");
    if (unanswered.length > 0) {
      alert(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }
    
    setStatus("submitting");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    const { ok, data } = await api.post(`/quizzes/submit-attempt`, { 
      quiz_attempt_id: quizAttemptId,
      student_answers: answers
    });
    
    if (ok) {
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
              <h1 className="font-heading text-2xl font-bold text-[#1E544A]">Dynamic AI Quiz</h1>
              <p className="text-sm text-[#1E544A]/60">You must score at least 80% to pass this module.</p>
            </div>
          </div>
        </div>

        {/* ── LOCKED / MISSING DATA ── */}
        {status === "locked" && (
          <div className="bg-white border border-[#E8DDD5] rounded-2xl p-10 text-center animate-slide-up shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#8C345C]/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#8C345C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1E544A] mb-3">Quiz Not Initialized</h2>
            <p className="text-[#1E544A]/70 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Please go back to the course page and click "Take Quiz" to generate your unique questions.
            </p>
            <Link to={backLink} className="inline-block px-6 py-3 bg-[#8C345C] text-white rounded-xl font-bold hover:bg-[#6b2646] transition-colors">
              Go Back
            </Link>
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
                Pass: {Math.ceil(questions.length * 0.80)} / {questions.length} correct
              </span>
            </div>

            {questions.map((q, qi) => {
              const qType = q.question_type || "mcq";
              
              return (
                <div key={qi} className="bg-white border border-[#E8DDD5] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-[#1E544A] uppercase tracking-wider">Question {qi + 1}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {qType === "mcq" ? "Multiple Choice" : qType === "true_false" ? "True / False" : "Fill in the blank"}
                    </span>
                  </div>
                  
                  <p className="text-base font-semibold text-[#2C1B1E] mb-5 leading-relaxed">{q.question}</p>
                  
                  <div className="flex flex-col gap-3">
                    {qType === "mcq" && q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => handleSelect(qi, oi)}
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

                    {qType === "true_false" && (
                      <div className="flex gap-4">
                        {["True", "False"].map((opt, oi) => {
                          // we pass the index of the option (0 for True, 1 for False), since correct_option_index is used in backend
                          const selected = answers[qi] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => handleSelect(qi, oi)}
                              className={`flex-1 text-center px-5 py-4 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                                selected
                                  ? "border-[#8C345C] bg-[#8C345C]/8 text-[#8C345C]"
                                  : "border-[#E8DDD5] text-[#6B5558] hover:border-[#CE9FA6] hover:bg-[#FBF7F0]"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {qType === "fill_in_blank" && (
                      <div>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#E8DDD5] focus:border-[#8C345C] outline-none transition-colors"
                          placeholder="Type your answer here..."
                          value={answers[qi] || ""}
                          onChange={(e) => handleSelect(qi, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

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
                  : `Score: ${Math.round((result.score / result.total) * 100)}%. You need 80% to pass. Please review the video and try again.`}
              </p>
            </div>

            {/* Detailed Results Review */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8DDD5] space-y-4">
              <h3 className="font-heading font-bold text-lg text-[#1E544A] mb-4">Detailed Review</h3>
              {result.results?.map((res, i) => {
                const q = questions[i];
                const qType = q?.question_type || "mcq";
                let userAnswer = answers[i];
                if (qType === "mcq" && userAnswer !== undefined && userAnswer !== "") {
                   userAnswer = q.options[userAnswer];
                } else if (qType === "true_false" && userAnswer !== undefined && userAnswer !== "") {
                   userAnswer = ["True", "False"][userAnswer];
                }

                return (
                  <div key={i} className={`p-5 rounded-xl border-l-4 shadow-sm ${res.is_correct ? "border-l-green-500 bg-green-50/50" : "border-l-red-500 bg-red-50/50"}`}>
                    <div className="flex items-start justify-between gap-4 mb-3 border-b border-black/5 pb-3">
                      <p className="font-bold text-sm text-gray-800 leading-relaxed">
                        <span className="mr-1.5 text-gray-500">Q{i + 1}.</span> {q?.question}
                      </p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap shadow-sm ${res.is_correct ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                        {res.is_correct ? "✅ Correct" : "❌ Incorrect"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm bg-white p-2.5 rounded-lg border border-gray-100">
                        <span className="font-semibold text-gray-500 text-xs uppercase tracking-wider block mb-1">Your Answer</span>
                        <span className={`text-base ${res.is_correct ? "text-green-700 font-bold" : "text-red-600 font-medium line-through"}`}>
                          {userAnswer || "(No answer provided)"}
                        </span>
                      </div>
                      
                      {!res.is_correct && res.correct_answer && (
                        <div className="text-sm bg-white p-2.5 rounded-lg border border-green-100 bg-green-50/30">
                          <span className="font-semibold text-green-700/70 text-xs uppercase tracking-wider block mb-1">Correct Answer</span>
                          <span className="text-green-700 font-bold text-base">{res.correct_answer}</span>
                        </div>
                      )}
                    </div>
                    
                    {res.explanation && (
                      <div className="bg-white p-3.5 rounded-lg text-sm text-gray-700 border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8C345C]/30"></div>
                        <p className="font-bold text-[#8C345C] text-xs uppercase tracking-wider mb-1">AI Explanation</p>
                        <p className="leading-relaxed">{res.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={backLink} className="flex-1 text-center py-3 bg-[#8C345C] text-white rounded-xl font-bold hover:bg-[#6b2646] transition-colors">
                Continue Curriculum
              </Link>
              {!result.passed && (
                <Link to={backLink} className="flex-1 text-center py-3 bg-white border-2 border-[#1E544A] text-[#1E544A] rounded-xl font-bold hover:bg-[#1E544A]/5 transition-colors">
                  Back to Video
                </Link>
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
