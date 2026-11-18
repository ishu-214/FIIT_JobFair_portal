import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProctoring } from '../hooks/useProctoring';
import WebcamMonitor from '../components/WebcamMonitor';
import ViolationWarningModal from '../components/ViolationWarningModal';
import DisqualifiedModal from '../components/DisqualifiedModal';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Clock,
  AlertTriangle,
  Code2
} from 'lucide-react';

export default function Round2Assessment({ onFinish, onProceedNextRound }) {
  const { user, refreshUser, abandonRound } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [domainName, setDomainName] = useState(user?.interestedRole || 'Full Stack Developer');
  const [cutoffPercent, setCutoffPercent] = useState(70);
  const [borderlinePercent, setBorderlinePercent] = useState(60);

  const isAssessmentActive = !result && !user?.disqualified && !user?.reEntryBlocked && questions.length > 0;

  const checkFsActive = () => Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  const [isFullscreen, setIsFullscreen] = useState(() => checkFsActive());

  useEffect(() => {
    const checkFs = () => {
      setIsFullscreen(checkFsActive());
    };
    document.addEventListener('fullscreenchange', checkFs);
    document.addEventListener('webkitfullscreenchange', checkFs);
    return () => {
      document.removeEventListener('fullscreenchange', checkFs);
      document.removeEventListener('webkitfullscreenchange', checkFs);
    };
  }, []);

  const handleDisqualified = React.useCallback(() => {
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  const {
    warningModalOpen,
    disqualifiedModalOpen,
    violationReason,
    strike,
    resumeAfterWarning,
    requestFullscreen
  } = useProctoring({
    isActive: isAssessmentActive,
    onDisqualified: handleDisqualified
  });

  // Track page abandon
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAssessmentActive) {
        if (abandonRound) abandonRound(2);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAssessmentActive, abandonRound]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const res = await api.getRound2Questions();
        if (res.success && res.questions) {
          setQuestions(res.questions);
          if (res.domain) setDomainName(res.domain);
          if (res.durationMinutes) setTimeLeft(res.durationMinutes * 60);
          if (res.cutoffPercent) setCutoffPercent(res.cutoffPercent);
          if (res.borderlinePercent) setBorderlinePercent(res.borderlinePercent);
        } else {
          setError(res.message || 'Failed to fetch Round 2 questions');
        }
      } catch (err) {
        setError(err.message || 'Error loading Round 2 questions');
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  // Timer
  useEffect(() => {
    if (!isAssessmentActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAssessmentActive, timeLeft]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitRound2(answers);
      setResult(res);
      if (res.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      if (refreshUser) refreshUser();
    } catch (err) {
      alert(err.message || 'Error submitting assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] text-slate-800">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#2F2D7D] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-sm text-[#2F2D7D]">Loading Round 2 ({domainName}) questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FD]">
        <div className="bg-white border border-rose-200 p-8 rounded-3xl max-w-md w-full text-center shadow-lg">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Round 2 Locked</h2>
          <p className="text-xs text-rose-700 mb-6">{error}</p>
          <button
            onClick={onFinish}
            className="py-2.5 px-6 bg-[#2F2D7D] text-white font-bold rounded-xl text-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (result) {
    const passed = result.passed;
    const borderline = result.borderline;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F8F9FD] text-slate-800">
        <div
          className={`max-w-xl w-full p-8 sm:p-10 rounded-3xl border-2 text-center shadow-xl bg-white relative ${
            passed ? 'border-emerald-400' : borderline ? 'border-amber-400' : 'border-rose-400'
          }`}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 ${
              passed
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                : borderline
                ? 'bg-amber-50 text-amber-600 border-amber-300'
                : 'bg-rose-50 text-rose-600 border-rose-300'
            }`}
          >
            {passed ? (
              <Award className="w-10 h-10 animate-pulse" />
            ) : borderline ? (
              <Clock className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>

          <div
            className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border ${
              passed
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : borderline
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {passed
              ? 'Technical Round Cleared'
              : borderline
              ? 'Borderline Score - Admin Review'
              : 'Assessment Not Cleared'}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2D7D] mb-2">
            {passed ? 'Congratulations!' : borderline ? 'Under Recruiter Review' : 'Result Announcement'}
          </h1>

          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {result.message}
          </p>

          <div className="bg-[#F8F9FD] rounded-2xl p-5 border border-slate-200 max-w-sm mx-auto mb-8 text-left space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Domain:</span>
              <span className="font-bold text-[#2F2D7D]">{domainName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Your Score:</span>
              <span
                className={`font-bold text-sm ${
                  passed ? 'text-emerald-700' : borderline ? 'text-amber-700' : 'text-rose-700'
                }`}
              >
                {result.score} / {result.total} ({result.percentage}%)
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Standard Cutoff:</span>
              <span className="font-bold text-slate-800">{cutoffPercent}% ({Math.ceil(50 * cutoffPercent / 100)} marks)</span>
            </div>
            {borderline && (
              <div className="pt-2 border-t border-slate-200 text-xs text-amber-800 font-medium">
                ⚡ Because you scored &ge; {borderlinePercent}%, your profile has been highlighted for Admin override. Once the admin clicks "Approve for Round 3", you can proceed.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {passed ? (
              <button
                onClick={onProceedNextRound}
                className="w-full sm:w-auto py-3.5 px-8 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-2xl shadow-md shadow-[#2F2D7D]/25 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <span>Take Next Round Test (Round 3 Coding)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="w-full sm:w-auto py-3 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-300 transition-all text-xs"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const currentAnswer = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col proctor-protected select-none">
      <WebcamMonitor initialPosition="bottom-right" />

      <ViolationWarningModal
        isOpen={warningModalOpen}
        reason={violationReason}
        strike={strike}
        maxStrikes={2}
        onResume={resumeAfterWarning}
      />
      <DisqualifiedModal
        isOpen={disqualifiedModalOpen}
        onReturnToDashboard={onFinish}
      />

      {/* Fullscreen Enforced Overlay */}
      {!isFullscreen && isAssessmentActive && !disqualifiedModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2F2D7D]/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF0FA] flex items-center justify-center text-[#2F2D7D] mx-auto shadow-inner font-extrabold text-3xl">
              ⛶
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#2F2D7D]">Fullscreen Mode Required</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Round 2 Domain Technical Assessment must be completed strictly in Fullscreen Mode. Exiting full screen or switching windows triggers proctoring strikes.
              </p>
            </div>
            <button
              onClick={async () => {
                await requestFullscreen();
                setIsFullscreen(true);
              }}
              className="w-full py-3.5 px-6 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-2xl text-sm shadow-lg shadow-[#2F2D7D]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Click to Enter Fullscreen Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2F2D7D] flex items-center justify-center text-white font-bold text-xs">
            R2
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2F2D7D]">
              Round 2: {domainName} Assessment
            </h2>
            <p className="text-[11px] text-slate-500">
              Question {currentIndex + 1} of {questions.length} • Cutoff: {cutoffPercent}% (Borderline: {borderlinePercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#EEF0FA] border border-[#2F2D7D]/20 px-3.5 py-1.5 rounded-xl">
            <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-[#2F2D7D]'}`} />
            <span className={`font-mono text-sm font-bold ${timeLeft < 300 ? 'text-rose-600' : 'text-[#2F2D7D]'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => {
              if (window.confirm(`You answered ${answeredCount} of 50 questions. Submit technical assessment?`)) {
                handleSubmitAnswers();
              }
            }}
            disabled={submitting}
            className="flex items-center gap-2 py-2 px-4 bg-[#2F2D7D] hover:bg-[#252366] text-white rounded-xl font-bold text-xs shadow-md shadow-[#2F2D7D]/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2F2D7D] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20">
                {currentQ.topic || domainName}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Answered: {answeredCount} / {questions.length}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6 leading-relaxed">
              {currentIndex + 1}. {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options?.map((option, idx) => {
                const isSelected = currentAnswer === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, option)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 text-xs sm:text-sm ${
                      isSelected
                        ? 'bg-[#2F2D7D] border-[#2F2D7D] text-white font-bold shadow-md ring-2 ring-[#2F2D7D]/30'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-[#EEF0FA] hover:border-[#2F2D7D]/40 shadow-sm'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-white text-[#2F2D7D] border-white font-black'
                          : 'bg-[#EEF0FA] text-[#2F2D7D] border-[#2F2D7D]/20 font-bold'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`py-2 px-5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                currentIndex === 0
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                  : 'border-slate-300 text-[#2F2D7D] bg-white hover:bg-[#EEF0FA]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="py-2.5 px-6 rounded-xl bg-[#2F2D7D] hover:bg-[#252366] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#2F2D7D]/25 transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAnswers}
                disabled={submitting}
                className="py-2.5 px-6 rounded-xl bg-[#2F2D7D] hover:bg-[#252366] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#2F2D7D]/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Technical Round</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-h-24 overflow-y-auto">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#2F2D7D] text-white ring-2 ring-[#2F2D7D]/40 shadow-sm'
                      : isAnswered
                      ? 'bg-[#EEF0FA] text-[#2F2D7D] border-2 border-[#2F2D7D] font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-[#EEF0FA]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
