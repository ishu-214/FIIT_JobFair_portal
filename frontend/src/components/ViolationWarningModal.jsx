import React from 'react';
import { AlertTriangle, ShieldAlert, Maximize2 } from 'lucide-react';

export default function ViolationWarningModal({ isOpen, reason, strike, maxStrikes = 2, onResume }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-amber-500/20 text-center">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/40 animate-bounce">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold tracking-wide uppercase mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          Proctoring Violation (Strike {strike} of {maxStrikes})
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Attention Required!</h2>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {reason || 'A proctoring policy violation was detected on your browser session.'}
        </p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-left text-xs text-slate-300 space-y-2 mb-6">
          <p className="font-semibold text-amber-300">Rules strictly enforced:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Assessment must remain in <strong className="text-white">Full Screen Mode</strong>.</li>
            <li>No tab switching, window minimization, or background application use.</li>
            <li>Copy, Paste, Right Click, and Screenshots (PrintScreen) are disabled.</li>
            <li>Live camera stream must remain unobstructed.</li>
          </ul>
          <p className="text-rose-400 font-semibold pt-1">
            ⚠️ WARNING: If you commit 1 more violation, you will be permanently disqualified and ejected from the assessment!
          </p>
        </div>

        <button
          onClick={onResume}
          className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          I Understand & Return to Full Screen
        </button>
      </div>
    </div>
  );
}
