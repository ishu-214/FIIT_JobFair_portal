import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial Registration requires ONLY name, email, password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login' || mode === 'admin') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchTab = (newMode) => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#F8F9FD] text-slate-800 relative">
      {/* Subtle brand styling */}
      <div className="max-w-md w-full text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#2F2D7D] flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-[#2F2D7D]/25">
          <Award className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#2F2D7D] tracking-tight">
          FIIT Job Fair 2026
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Candidate Selection & Multi-Round Assessment Portal
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 bg-[#EEF0FA] p-1.5 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleSwitchTab('login')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-[#2F2D7D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#2F2D7D]'
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('register')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-[#2F2D7D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#2F2D7D]'
            }`}
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('admin')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'admin'
                ? 'bg-[#2F2D7D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#2F2D7D]'
            }`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Candidate Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F2D7D] focus:ring-1 focus:ring-[#2F2D7D] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                autoComplete="off"
                placeholder={mode === 'admin' ? 'administrator@domain.com' : 'candidate@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F2D7D] focus:ring-1 focus:ring-[#2F2D7D] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                name={mode === 'register' ? 'user-new-pwd' : 'current-password'}
                id="user-pwd-input"
                autoComplete={mode === 'register' ? 'off' : 'current-password'}
                data-lpignore="true"
                data-form-type="other"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F2D7D] focus:ring-1 focus:ring-[#2F2D7D] transition-colors"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="p-3 bg-[#EEF0FA] rounded-xl text-[11px] text-[#2F2D7D] font-medium leading-relaxed">
              ℹ️ Quick Register: After account creation, you will read the assessment instructions and complete your profile (Phone, College, Department, Interested Role) before beginning the test.
            </div>
          )}

          {mode === 'admin' && (
            <div className="p-3 bg-[#EEF0FA] rounded-xl text-[11px] text-[#2F2D7D] font-medium leading-relaxed">
              ⚡ Recruiter Access: Enter your registered Administrator credentials to access candidate evaluations, exam scheduling, cutoffs, and question bank management.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#2F2D7D] hover:bg-[#252366] transition-all shadow-md shadow-[#2F2D7D]/25 flex items-center justify-center gap-2 mt-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'register' ? (
              <>
                Create Candidate Account <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'admin' ? (
              <>
                Enter Admin Portal <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Login to Assessment <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              New Candidate?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#2F2D7D] font-bold hover:underline"
              >
                Register here (Name, Email & Password)
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2F2D7D] font-bold hover:underline"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-md w-full mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#2F2D7D]" />
        FIIT AI Proctoring: Fullscreen lock, live webcam feed & anti-cheat monitoring.
      </div>
    </div>
  );
}
