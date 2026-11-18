import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Camera,
  Monitor,
  Ban,
  Building,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function Dashboard({ onStartRound }) {
  const { user, refreshUser, startRound, startRound1 } = useAuth();
  const [config, setConfig] = useState(null);
  const [initiating, setInitiating] = useState(false);

  useEffect(() => {
    api.getConfig().then((res) => {
      if (res.success) setConfig(res.config);
    }).catch(() => {});
  }, []);

  const round1 = user?.round1 || {};
  const round2 = user?.round2 || {};
  const round3 = user?.round3 || {};

  const isRound1Passed = round1.passed === true;
  const isRound2Passed = round2.passed === true;
  const isRound2AdminApproved = round2.adminApproved === true;
  const isRound2Borderline = round2.borderline === true && !isRound2AdminApproved;
  const isRound3Allowed = isRound2Passed || isRound2AdminApproved;
  const isRound3Passed = round3.passed === true;

  // Re-entry restriction check by email across ALL rounds (Strict single-chance rule)
  const isReEntryBlocked = Boolean(
    user?.reEntryBlocked ||
    (user?.round1Started && !round1.completedAt) ||
    (user?.round2Started && !round2.completedAt) ||
    (user?.round3Started && !round3.completedAt)
  );

  const isFailed =
    user?.disqualified ||
    (!isRound1Passed && round1.completedAt) ||
    (!isRound2Passed && !isRound2AdminApproved && !isRound2Borderline && round2.completedAt);

  const handleStartRound1 = async () => {
    if (isReEntryBlocked || user?.disqualified) {
      alert(`Assessment re-entry blocked for ${user?.email}. Only one chance is allocated per candidate.`);
      return;
    }

    if (
      !window.confirm(
        'Are you ready to begin Round 1? You have strictly 1 CHANCE. Once started, you must complete the test in Fullscreen without exiting. Leaving midway will permanently lock your assessment.'
      )
    ) {
      return;
    }

    setInitiating(true);
    try {
      await (startRound ? startRound(1) : startRound1());
      onStartRound(1);
    } catch (err) {
      alert(err.message || 'Failed to initiate assessment');
      await refreshUser();
    } finally {
      setInitiating(false);
    }
  };

  const handleStartRound2 = async () => {
    if (isReEntryBlocked || user?.disqualified) {
      alert(`Assessment re-entry blocked for ${user?.email}. Only one chance is allocated per candidate.`);
      return;
    }

    if (
      !window.confirm(
        'Are you ready to begin Round 2? You have strictly 1 CHANCE. Once started, you must complete the test in Fullscreen without exiting. Leaving midway will permanently lock your assessment.'
      )
    ) {
      return;
    }

    setInitiating(true);
    try {
      if (startRound) await startRound(2);
      onStartRound(2);
    } catch (err) {
      alert(err.message || 'Failed to initiate Round 2');
      await refreshUser();
    } finally {
      setInitiating(false);
    }
  };

  const handleStartRound3 = async () => {
    if (isReEntryBlocked || user?.disqualified) {
      alert(`Assessment re-entry blocked for ${user?.email}. Only one chance is allocated per candidate.`);
      return;
    }

    if (
      !window.confirm(
        'Are you ready to begin Round 3 Coding Assessment? You have strictly 1 CHANCE. Once started, you must complete the test in Fullscreen without exiting. Leaving midway will permanently lock your assessment.'
      )
    ) {
      return;
    }

    setInitiating(true);
    try {
      if (startRound) await startRound(3);
      onStartRound(3);
    } catch (err) {
      alert(err.message || 'Failed to initiate Round 3');
      await refreshUser();
    } finally {
      setInitiating(false);
    }
  };

  const r1Cutoff = config?.round1CutoffPercent || 60;
  const r2Cutoff = config?.round2CutoffPercent || 70;
  const r2Borderline = config?.round2BorderlinePercent || 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-800">
      {/* Welcome Banner (#2F2D7D Theme) */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              FIIT Job Fair 2026 • Single-Attempt Assessment Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2F2D7D] tracking-tight mb-2">
              Welcome, {user?.name}!
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {user?.collegeName || 'College N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {user?.degree ? `${user.degree} • ` : ''}{user?.department} ({user?.yearOfStudy || 'Undergraduate'})
              </span>
              <span className="flex items-center gap-1.5 text-[#2F2D7D] font-bold">
                <Briefcase className="w-3.5 h-3.5" />
                {user?.interestedRole || 'Full Stack Developer'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isRound3Passed ? (
              <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Cleared All 3 Rounds! 🏆</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* RE-ENTRY RESTRICTION ALERT (BY EMAIL) */}
      {isReEntryBlocked && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-rose-900">
                Assessment Locked for {user?.email}
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                Single Attempt Enforced
              </span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed mb-2">
              You initiated the assessment earlier and left the test window midway without completing the submission. In accordance with the <strong>Strict Single-Attempt Policy</strong>, your assessment button has been permanently disabled to prevent unmonitored re-entry.
            </p>
            <p className="text-xs font-semibold text-rose-800">
              Only the FIIT Recruitment Administrator can unblock your email address via the Admin Portal if clearance is granted.
            </p>
          </div>
        </div>
      )}

      {/* Disqualification Banner */}
      {user?.disqualified && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 mb-1">
              Assessment Disqualified: Proctoring Violation Detected
            </h3>
            <p className="text-xs text-rose-700 mb-1 font-semibold">
              Violation Reason: {user?.disqualificationReason || user?.blockReason || 'Proctoring violation limit reached (Copy-paste / Fullscreen exit)'}
            </p>
            <p className="text-xs text-slate-500">
              In accordance with FIIT regulations, candidates are given strictly one attempt. This session is concluded and reported to recruiters.
            </p>
          </div>
        </div>
      )}

      {/* All Cleared Congratulations Banner */}
      {isRound3Passed && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-emerald-950 mb-1">
                🎉 Congratulations, {user?.name}!
              </h2>
              <p className="text-sm text-emerald-800">
                You have passed all 3 rounds of the FIIT Job Fair Assessment! Your complete evaluation has been forwarded to hiring managers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3-Round Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ROUND 1 */}
        <div
          className={`relative rounded-3xl p-6 border transition-all ${
            isRound1Passed
              ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100'
              : round1.completedAt
              ? 'bg-white border-rose-300 shadow-md shadow-rose-100'
              : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20">
              Round 1
            </span>
            {isRound1Passed ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Passed ({round1.score}/25)
              </span>
            ) : round1.completedAt ? (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                <XCircle className="w-4 h-4" /> Failed ({round1.score}/25)
              </span>
            ) : (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {config?.round1DurationMinutes || 25} Mins
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">Basic Computer Knowledge</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Common questions evaluating CPU, Operating Systems, Memory, Hardware & Core Computer Fundamentals.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-600 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Questions:</span>
              <span className="font-bold text-slate-800">25 MCQs (Common)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pass Cutoff:</span>
              <span className="font-bold text-[#2F2D7D]">{r1Cutoff}% ({Math.ceil(25 * r1Cutoff / 100)} marks)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Anti-Cheat:</span>
              <span className="font-bold text-slate-800">Fullscreen + Live Cam</span>
            </div>
          </div>

          {isReEntryBlocked && !round1.completedAt ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
            >
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Take Assessment (Disabled by Email)</span>
            </button>
          ) : !round1.completedAt && !user?.disqualified ? (
            <button
              onClick={handleStartRound1}
              disabled={initiating}
              className="w-full py-3 px-4 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-2xl text-xs shadow-md shadow-[#2F2D7D]/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{initiating ? 'Starting...' : 'Take Round 1 Test'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : isRound1Passed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-800 font-bold">
              ✅ Cleared with {round1.score}/25 ({round1.percentage}%). Proceed below.
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs text-rose-800 font-bold">
              ❌ Score: {round1.score}/25 (Cutoff: {r1Cutoff}%). Assessment not cleared.
            </div>
          )}
        </div>

        {/* ROUND 2 */}
        <div
          className={`relative rounded-3xl p-6 border transition-all ${
            isRound2Passed || isRound2AdminApproved
              ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100'
              : isRound2Borderline
              ? 'bg-white border-amber-300 shadow-md shadow-amber-100'
              : round2.completedAt
              ? 'bg-white border-rose-300 shadow-md shadow-rose-100'
              : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20">
              Round 2
            </span>
            {isRound2Passed ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Passed ({round2.score}/50)
              </span>
            ) : isRound2AdminApproved ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Admin Approved
              </span>
            ) : isRound2Borderline ? (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Clock className="w-4 h-4" /> Admin Review ({round2.score}/50)
              </span>
            ) : round2.completedAt ? (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                <XCircle className="w-4 h-4" /> Failed ({round2.score}/50)
              </span>
            ) : !isRound1Passed ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            ) : (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {config?.round2DurationMinutes || 45} Mins
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">Technical Domain Assessment</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Customized based on your domain: <strong className="text-[#2F2D7D]">{user?.interestedRole || 'Full Stack'}</strong>.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-600 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Domain:</span>
              <span className="font-bold text-[#2F2D7D]">{user?.interestedRole || 'Full Stack'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Questions:</span>
              <span className="font-bold text-slate-800">50 MCQs (Domain Mapped)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cutoff / Borderline:</span>
              <span className="font-bold text-[#2F2D7D]">{r2Cutoff}% / {r2Borderline}%</span>
            </div>
          </div>

          {isReEntryBlocked && !round2.completedAt ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
            >
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Assessment Re-entry Blocked ({user?.email})</span>
            </button>
          ) : !isRound1Passed ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
            >
              <Lock className="w-4 h-4" />
              <span>Locked (Clear Round 1 First)</span>
            </button>
          ) : !round2.completedAt && !user?.disqualified ? (
            <button
              onClick={handleStartRound2}
              disabled={initiating}
              className="w-full py-3 px-4 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-2xl text-xs shadow-md shadow-[#2F2D7D]/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{initiating ? 'Starting...' : `Take Round 2 Test (${user?.interestedRole})`}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : isRound2Passed || isRound2AdminApproved ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-800 font-bold">
              ✅ Cleared! Proceed to Round 3 Coding below.
            </div>
          ) : isRound2Borderline ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-900 font-medium space-y-1">
              <p className="font-bold">⚠️ Borderline Score: {round2.score}/50 ({round2.percentage}%)</p>
              <p className="text-[11px] text-amber-800">
                Standard cutoff is {r2Cutoff}%. Your score qualifies for Admin review. Once the recruiter clicks "Approve for Round 3", it will automatically unlock here.
              </p>
              <button
                onClick={refreshUser}
                className="mt-2 px-3 py-1 bg-[#2F2D7D] text-white font-bold rounded-lg text-[10px]"
              >
                Refresh Approval Status
              </button>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs text-rose-800 font-bold">
              ❌ Score {round2.score}/50 ({round2.percentage}%). Round 3 disabled.
            </div>
          )}
        </div>

        {/* ROUND 3 */}
        <div
          className={`relative rounded-3xl p-6 border transition-all ${
            isRound3Passed
              ? 'bg-white border-emerald-300 shadow-md shadow-emerald-100'
              : round3.completedAt
              ? 'bg-white border-amber-300 shadow-md shadow-amber-100'
              : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20">
              Round 3
            </span>
            {isRound3Passed ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle className="w-4 h-4" /> Solved 4/4 🏆
              </span>
            ) : !isRound3Allowed ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            ) : (
              <span className="text-xs text-[#2F2D7D] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 4 Coding Challenges
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">Technical Coding Assessment</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Side-by-side scenario, sample inputs & outputs, and 5 test cases per problem in Python / Java.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-600 bg-[#F8F9FD] p-3.5 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Questions:</span>
              <span className="font-bold text-slate-800">4 Problems (Medium Range)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Runtimes:</span>
              <span className="font-bold text-[#2F2D7D]">Python 3 / Java (JDK 26)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Passing Criteria:</span>
              <span className="font-bold text-emerald-700">4/4 Solved with 5/5 Test Cases</span>
            </div>
          </div>

          {isReEntryBlocked && !round3.completedAt ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
            >
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Assessment Re-entry Blocked ({user?.email})</span>
            </button>
          ) : !isRound3Allowed ? (
            <button
              disabled
              className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
            >
              <Lock className="w-4 h-4" />
              <span>Locked (Pass Round 2 or Admin Approval)</span>
            </button>
          ) : isRound3Passed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-800 font-bold">
              🏆 All 4 Problems Solved! Fully Certified.
            </div>
          ) : (
            <button
              onClick={handleStartRound3}
              disabled={initiating}
              className="w-full py-3 px-4 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-2xl text-xs shadow-md shadow-[#2F2D7D]/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{initiating ? 'Starting...' : 'Launch Coding Environment (4 Problems)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
