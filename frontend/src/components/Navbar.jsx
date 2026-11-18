import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, LogOut, User, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with #2F2D7D Theme */}
        <div
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2F2D7D] flex items-center justify-center text-white shadow-md shadow-[#2F2D7D]/30 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#2F2D7D]">
                FIIT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20">
                Job Fair 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Candidate Assessment & Selection Portal</p>
          </div>
        </div>

        {/* User Profile & Actions */}
        {user && (
          <div className="flex items-center gap-4">
            {user.role === 'student' && user.interestedRole && (
              <div className="hidden lg:flex items-center gap-1.5 bg-[#2F2D7D]/5 border border-[#2F2D7D]/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2F2D7D]">
                <span>Domain:</span>
                <span className="font-bold">{user.interestedRole}</span>
              </div>
            )}

            {user.role === 'student' && user.round3?.passed && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cleared All Rounds 🏆</span>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2F2D7D] text-white flex items-center justify-center font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800">{user.name}</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {user.role === 'admin' ? (
                    <span className="text-[#2F2D7D] font-bold">Administrator / Recruiter</span>
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
