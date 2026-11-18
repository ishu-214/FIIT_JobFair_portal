import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, ShieldAlert, Monitor, Camera, Ban, CheckSquare, Square, ArrowRight, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function InstructionsPage({ onProceed }) {
  const { acknowledgeInstructions } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!agreed) return;
    setLoading(true);
    try {
      await acknowledgeInstructions();
      if (onProceed) onProceed();
    } catch (e) {
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-slate-800">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2F2D7D] text-white flex items-center justify-center shadow-md shadow-[#2F2D7D]/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20 text-[11px] font-bold uppercase tracking-wide">
              Step 1 of 2: Candidate Briefing
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2D7D]">
              Assessment Instructions & Code of Conduct
            </h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Welcome to the <strong>FIIT Job Fair 2026 Assessment Platform</strong>. Before commencing the assessment, you must carefully read and acknowledge all assessment rules, proctoring protocols, and anti-cheating regulations.
        </p>
      </div>

      {/* Rules Breakdown */}
      <div className="space-y-4 mb-6">
        {/* Section 1: 3-Stage Assessment Workflow */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#2F2D7D] mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2F2D7D]" />
            1. Three-Stage Assessment Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="p-4 bg-[#F8F9FD] rounded-xl border border-slate-200">
              <span className="font-bold text-[#2F2D7D] block mb-1 text-sm">Round 1: Computer Based Assessment</span>
              Candidates must clear Round 1 by achieving the required qualifying mark to advance to Round 2.
            </div>
            <div className="p-4 bg-[#F8F9FD] rounded-xl border border-slate-200">
              <span className="font-bold text-[#2F2D7D] block mb-1 text-sm">Round 2: Technical MCQ Assessment</span>
              Candidates who clear Round 1 will proceed to Round 2. Clearing Round 2 unlocks the final round.
            </div>
            <div className="p-4 bg-[#F8F9FD] rounded-xl border border-slate-200">
              <span className="font-bold text-[#2F2D7D] block mb-1 text-sm">Round 3: Technical Coding Round</span>
              Live programming evaluation with automated test cases for candidates who successfully cleared Round 2.
            </div>
          </div>
        </div>

        {/* Section 2: AI Proctoring & 2-Strike Enforcement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#2F2D7D] mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#2F2D7D]" />
            2. Anti-Cheating & AI Proctoring Regulations (Strict 2-Strike Policy)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="p-3.5 bg-[#F8F9FD] rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Monitor className="w-4 h-4 text-[#2F2D7D] mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-800 block">Mandatory Fullscreen:</strong>
                The assessment will automatically enter fullscreen mode. Exiting fullscreen will record a security violation strike.
              </div>
            </div>
            <div className="p-3.5 bg-[#F8F9FD] rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Camera className="w-4 h-4 text-[#2F2D7D] mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-800 block">Webcam Active at all Times:</strong>
                Your camera stream must remain running and visible in the live proctoring bubble. Covering the camera is prohibited.
              </div>
            </div>
            <div className="p-3.5 bg-[#F8F9FD] rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Ban className="w-4 h-4 text-[#2F2D7D] mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-800 block">No Copy, Paste or Shortcuts:</strong>
                Ctrl+C, Ctrl+V, Ctrl+X, and right-click context menus are completely disabled. External code pasting is prohibited.
              </div>
            </div>
            <div className="p-3.5 bg-[#F8F9FD] rounded-xl border border-slate-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#2F2D7D] mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-800 block">No Screenshots (PrintScreen):</strong>
                PrintScreen and screen-capture shortcuts are trapped and reported as violation strikes.
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Two-Strike Rule:</strong> Strike 1 results in a prominent warning modal. Strike 2 results in <strong>immediate and permanent disqualification</strong> from the assessment!
            </div>
          </div>
        </div>

        {/* Section 3: Single-Initiation & Re-entry Restriction */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#2F2D7D] mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2F2D7D]" />
            3. Strict Single-Attempt Assessment Policy
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every candidate is allocated <strong>strictly one attempt</strong>. Once you click <strong>"Take Assessment"</strong>, your session commences and is locked to your email address. If you exit, close the tab, or navigate away midway without submitting, <strong>your assessment will be permanently locked</strong> and you cannot restart.
          </p>
        </div>
      </div>

      {/* Confirmation Checkbox & Continue Button */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <label
          onClick={() => setAgreed(!agreed)}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {agreed ? (
            <CheckSquare className="w-6 h-6 text-[#2F2D7D]" />
          ) : (
            <Square className="w-6 h-6 text-slate-400" />
          )}
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            I confirm that I have read, understood, and agree to abide by all the assessment guidelines.
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!agreed || loading}
          className={`py-3 px-6 rounded-xl font-bold text-sm text-white bg-[#2F2D7D] hover:bg-[#252366] transition-all flex items-center gap-2 shadow-md shadow-[#2F2D7D]/25 whitespace-nowrap ${
            !agreed || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>{loading ? 'Processing...' : 'Proceed to Profile Updation'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
