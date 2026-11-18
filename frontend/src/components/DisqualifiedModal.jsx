import React from 'react';
import { Ban, LogOut, ArrowLeft } from 'lucide-react';

export default function DisqualifiedModal({ isOpen, onReturnToDashboard }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl max-w-lg w-full p-8 shadow-2xl shadow-rose-600/30 text-center">
        <div className="w-20 h-20 bg-rose-600/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-rose-500/50">
          <Ban className="w-10 h-10" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-3">
          Candidate Disqualified
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-3">Assessment Terminated</h2>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          You have reached <strong className="text-rose-400">2 Proctoring Strikes</strong> (e.g. exiting full-screen, switching tabs, copy/pasting, or screenshot attempts). In accordance with FIIT recruitment fair regulations, your test session has been terminated and logged with the recruiter.
        </p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 mb-6 text-left">
          <p className="font-semibold text-slate-200 mb-1">Notice:</p>
          <p>
            Your violation log has been saved to your candidate file. If you believe this was an error, please contact the Job Fair Invigilator / Admin Desk.
          </p>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit to Candidate Portal
        </button>
      </div>
    </div>
  );
}
