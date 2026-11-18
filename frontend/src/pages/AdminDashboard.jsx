import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Award,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  CheckCheck,
  RefreshCw,
  Ban,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileQuestion,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ShieldAlert,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'config' | 'questions'
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, cleared, borderline, blocked, attempt2

  // Config Form State
  const [configForm, setConfigForm] = useState({
    round1DurationMinutes: 25,
    round1CutoffPercent: 60,
    round2DurationMinutes: 45,
    round2CutoffPercent: 70,
    round2BorderlinePercent: 60,
    round3DurationMinutes: 60,
    round3QuestionsCount: 4,
    scheduleStart: '',
    scheduleEnd: '',
    isScheduleActive: false
  });
  const [configSaving, setConfigSaving] = useState(false);

  // Question Modal State
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editingQId, setEditingQId] = useState(null);
  const [qForm, setQForm] = useState({
    round: 1,
    domain: 'common',
    questionText: '',
    category: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    title: '',
    scenario: '',
    description: '',
    sampleInput: '',
    sampleOutput: ''
  });
  const [qSaving, setQSaving] = useState(false);
  const [qFilterRound, setQFilterRound] = useState('1');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, studentsRes, configRes, questionsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminStudents(),
        api.getAdminConfig(),
        api.getAdminQuestions()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (studentsRes.success) setStudents(studentsRes.students);
      if (configRes.success && configRes.config) {
        setConfig(configRes.config);
        setConfigForm({
          round1DurationMinutes: configRes.config.round1DurationMinutes,
          round1CutoffPercent: configRes.config.round1CutoffPercent,
          round2DurationMinutes: configRes.config.round2DurationMinutes,
          round2CutoffPercent: configRes.config.round2CutoffPercent,
          round2BorderlinePercent: configRes.config.round2BorderlinePercent,
          round3DurationMinutes: configRes.config.round3DurationMinutes,
          round3QuestionsCount: configRes.config.round3QuestionsCount,
          scheduleStart: configRes.config.scheduleStart ? new Date(configRes.config.scheduleStart).toISOString().slice(0, 16) : '',
          scheduleEnd: configRes.config.scheduleEnd ? new Date(configRes.config.scheduleEnd).toISOString().slice(0, 16) : '',
          isScheduleActive: configRes.config.isScheduleActive || false
        });
      }
      if (questionsRes.success) setQuestions(questionsRes.questions);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Save Config (Durations, Cutoffs, Schedule)
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    try {
      const res = await api.updateAdminConfig(configForm);
      if (res.success) {
        alert('Assessment configuration, cutoffs, and scheduling saved successfully!');
        setConfig(res.config);
      }
    } catch (err) {
      alert(err.message || 'Failed to update configuration');
    } finally {
      setConfigSaving(false);
    }
  };

  // Save / Add Question (CRUD)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setQSaving(true);
    try {
      if (editingQId) {
        await api.updateAdminQuestion(editingQId, qForm);
        alert('Question updated successfully!');
      } else {
        await api.createAdminQuestion(qForm);
        alert('New question added to bank successfully!');
      }
      setQModalOpen(false);
      setEditingQId(null);
      const qRes = await api.getAdminQuestions();
      if (qRes.success) setQuestions(qRes.questions);
    } catch (err) {
      alert(err.message || 'Failed to save question');
    } finally {
      setQSaving(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question from question bank?')) return;
    try {
      await api.deleteAdminQuestion(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      alert('Question deleted');
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const openNewQModal = () => {
    setEditingQId(null);
    setQForm({
      round: Number(qFilterRound) || 1,
      domain: 'common',
      questionText: '',
      category: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      title: '',
      scenario: '',
      description: '',
      sampleInput: '',
      sampleOutput: ''
    });
    setQModalOpen(true);
  };

  const openEditQModal = (q) => {
    setEditingQId(q._id);
    setQForm({
      round: q.round,
      domain: q.domain || 'common',
      questionText: q.questionText || '',
      category: q.category || '',
      options: q.options?.length === 4 ? q.options : [q.options?.[0] || '', q.options?.[1] || '', q.options?.[2] || '', q.options?.[3] || ''],
      correctAnswer: q.correctAnswer || '',
      title: q.title || '',
      scenario: q.scenario || '',
      description: q.description || '',
      sampleInput: q.sampleInput || '',
      sampleOutput: q.sampleOutput || ''
    });
    setQModalOpen(true);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.college && s.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.interestedRole && s.interestedRole.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'cleared') return s.clearedAll;
    if (filterStatus === 'round2') return s.round2?.passed && !s.clearedAll;
    if (filterStatus === 'round1') return s.round1?.passed && !s.round2?.passed && !s.clearedAll;
    if (filterStatus === 'blocked') return s.reEntryBlocked || s.disqualified;

    return true;
  });

  const filteredQuestions = questions.filter((q) => {
    if (qFilterRound === 'all') return true;
    return q.round === Number(qFilterRound);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-800">
      {/* Admin Header with #2F2D7D Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xl shadow-slate-200/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20 text-xs font-bold mb-2">
            <Award className="w-4 h-4" />
            FIIT Administrator & Recruiter Control Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2D7D]">
            Job Fair Candidate Management & Test Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review candidate results, set test timing & cutoffs, schedule exam windows, manage questions, and oversee anti-cheat security.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#2F2D7D] font-bold border border-slate-300 rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Exit Administrator portal and return to login?')) {
                logout();
              }
            }}
            className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Portal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Candidates</span>
            <Users className="w-4 h-4 text-[#2F2D7D]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalStudents || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Registered applicants</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
            <span>Cleared All 3 Rounds</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats?.allCleared || 0}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Certified for Recruitment 🏆</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold mb-2">
            <span>Cleared Round 2</span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700">{students.filter(s => s.round2?.passed).length}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Eligible for Round 3 Coding</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Passed Round 1</span>
            <CheckCircle className="w-4 h-4 text-[#2F2D7D]" />
          </div>
          <div className="text-2xl font-extrabold text-[#2F2D7D]">{stats?.round1Passed || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cleared Computer Basics</div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-2">
            <span>Re-entry Blocked</span>
            <Ban className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700">{stats?.reEntryBlockedCount || 0}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">Left test midway without submitting</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-2 px-5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-[#2F2D7D] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Evaluations ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`py-2 px-5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'config'
              ? 'bg-[#2F2D7D] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Timing, Cutoffs & Exam Scheduling</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`py-2 px-5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-[#2F2D7D] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>Question Bank Management (CRUD)</span>
        </button>
      </div>

      {/* TAB 1: CANDIDATES ROSTER & EVALUATION */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search candidate by name, email, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8F9FD] border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F2D7D]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                  filterStatus === 'all'
                    ? 'bg-[#2F2D7D] text-white border-[#2F2D7D] shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#2F2D7D] hover:text-[#2F2D7D]'
                }`}
              >
                <span>All Candidates</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${filterStatus === 'all' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {students.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('cleared')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                  filterStatus === 'cleared'
                    ? 'bg-[#2F2D7D] text-white border-[#2F2D7D] shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#2F2D7D] hover:text-[#2F2D7D]'
                }`}
              >
                <span>Cleared 3 Rounds 🏆</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${filterStatus === 'cleared' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  {students.filter((s) => s.clearedAll).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('round2')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                  filterStatus === 'round2'
                    ? 'bg-[#2F2D7D] text-white border-[#2F2D7D] shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#2F2D7D] hover:text-[#2F2D7D]'
                }`}
              >
                <span>Round 2 Cleared (Ready for R3)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${filterStatus === 'round2' ? 'bg-white/25 text-white' : 'bg-blue-100 text-[#2F2D7D]'}`}>
                  {students.filter((s) => s.round2?.passed && !s.clearedAll).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('round1')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                  filterStatus === 'round1'
                    ? 'bg-[#2F2D7D] text-white border-[#2F2D7D] shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#2F2D7D] hover:text-[#2F2D7D]'
                }`}
              >
                <span>Round 1 Cleared</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${filterStatus === 'round1' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {students.filter((s) => s.round1?.passed && !s.round2?.passed && !s.clearedAll).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('blocked')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
                  filterStatus === 'blocked'
                    ? 'bg-[#2F2D7D] text-white border-[#2F2D7D] shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#2F2D7D] hover:text-[#2F2D7D]'
                }`}
              >
                <span>Anti-Cheat Blocked / Disqualified</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${filterStatus === 'blocked' ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-800'}`}>
                  {students.filter((s) => s.reEntryBlocked || s.disqualified).length}
                </span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#EEF0FA] border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-[#2F2D7D]">
                    <th className="py-4 px-5">Candidate Profile</th>
                    <th className="py-4 px-4">Degree & Academic</th>
                    <th className="py-4 px-4">Domain Mapped</th>
                    <th className="py-4 px-4">Round 1 (MCQ)</th>
                    <th className="py-4 px-4">Round 2 (Tech)</th>
                    <th className="py-4 px-4">Round 3 (Code)</th>
                    <th className="py-4 px-5">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No candidate records found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const isClearedAll = s.clearedAll;
                      const isBlocked = s.reEntryBlocked;
                      const isDisqualified = s.disqualified;

                      return (
                        <tr
                          key={s._id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isClearedAll ? 'bg-emerald-50/40' : isDisqualified ? 'bg-rose-50/60' : isBlocked ? 'bg-rose-50/30' : ''
                          }`}
                        >
                          {/* Candidate info */}
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                            <div className="text-slate-500 font-mono text-[11px]">{s.email}</div>
                            <div className="text-slate-400 text-[10px] mt-0.5">
                              {s.phone ? `📞 ${s.phone}` : ''}
                            </div>
                          </td>

                          {/* Degree & Academic info */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-800 text-xs">
                              {s.degree || 'Degree N/A'}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {s.specialization || s.department}
                            </div>
                            <div className="text-slate-400 text-[10px] mt-0.5">
                              {s.college} ({s.yearOfStudy || '3rd Year'})
                            </div>
                          </td>

                          {/* Domain */}
                          <td className="py-4 px-4">
                            <span className="font-semibold text-[#2F2D7D] text-[11px]">
                              {s.interestedRole || 'Full Stack'}
                            </span>
                          </td>

                          {/* Round 1 */}
                          <td className="py-4 px-4">
                            {s.round1?.completedAt ? (
                              <div className="space-y-0.5">
                                <span
                                  className={`font-mono font-bold text-xs ${
                                    s.round1.passed ? 'text-emerald-700' : 'text-rose-700'
                                  }`}
                                >
                                  {s.round1.score} / {s.round1.total} ({s.round1.percentage || Math.round(s.round1.score / s.round1.total * 100)}%)
                                </span>
                                <div>
                                  <span className={`text-[10px] font-bold ${s.round1.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {s.round1.passed ? 'Passed' : 'Failed'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">Not Attempted</span>
                            )}
                          </td>

                          {/* Round 2 */}
                          <td className="py-4 px-4">
                            {s.round2?.completedAt ? (
                              <div className="space-y-0.5">
                                <span
                                  className={`font-mono font-bold text-xs ${
                                    s.round2.passed ? 'text-emerald-700' : 'text-rose-700'
                                  }`}
                                >
                                  {s.round2.score} / {s.round2.total || 50} ({s.round2.percentage || Math.round(s.round2.score / (s.round2.total || 50) * 100)}%)
                                </span>
                                <div>
                                  {s.round2.passed ? (
                                    <span className="text-emerald-600 font-bold text-[10px]">Passed</span>
                                  ) : (
                                    <span className="text-rose-600 font-bold text-[10px]">Failed</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">Not Attempted</span>
                            )}
                          </td>

                          {/* Round 3 */}
                          <td className="py-4 px-4">
                            {s.round3?.completedAt ? (
                              <div className="space-y-0.5">
                                <span
                                  className={`font-mono font-bold text-xs ${
                                    s.round3.passed ? 'text-emerald-700' : 'text-amber-700'
                                  }`}
                                >
                                  {s.round3.score} / {s.round3.total || 4} Solved
                                </span>
                                <div>
                                  <span className={`text-[10px] font-bold ${s.round3.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {s.round3.passed ? 'Passed (4/4) 🏆' : 'Partial'}
                                  </span>
                                </div>
                              </div>
                            ) : s.round2?.passed ? (
                              <span className="text-[#2F2D7D] font-bold text-[11px]">Eligible</span>
                            ) : (
                              <span className="text-slate-400">Locked</span>
                            )}
                          </td>

                          {/* Status & Actions */}
                          <td className="py-4 px-5">
                            <div className="space-y-2">
                              {isClearedAll ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Cleared All 3 Rounds 🏆</span>
                                </div>
                              ) : isDisqualified ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700">
                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span>{s.disqualificationReason || s.blockReason || 'Disqualified: Proctoring Violation'}</span>
                                  </div>
                                  {s.violations && s.violations.length > 0 && (
                                    <div className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                                      Violation: {s.violations[s.violations.length - 1].reason}
                                    </div>
                                  )}
                                </div>
                              ) : isBlocked ? (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold text-rose-700 block">
                                    🚫 Re-entry Blocked ({s.email})
                                  </span>
                                </div>
                              ) : s.round2?.passed ? (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Round 2 Cleared (Ready for Round 3)</span>
                                </div>
                              ) : (
                                <span className="text-slate-600 font-medium text-xs">{s.clearedSummary || 'In Progress'}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMING, CUTOFFS & EXAM SCHEDULING */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#2F2D7D] mb-1">Assessment Timing, Cutoffs & Exam Window Scheduling</h2>
            <p className="text-xs text-slate-500">
              Customize round durations, passing percentage cutoffs, and scheduled active exam time window.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Round 1 Settings */}
            <div className="p-5 bg-[#F8F9FD] border border-slate-200 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-[#2F2D7D] flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Round 1 Controls
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration (Minutes):
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={configForm.round1DurationMinutes}
                  onChange={(e) => setConfigForm({ ...configForm, round1DurationMinutes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Passing Cutoff (%):
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={configForm.round1CutoffPercent}
                  onChange={(e) => setConfigForm({ ...configForm, round1CutoffPercent: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  e.g., 60% = {Math.ceil(25 * (configForm.round1CutoffPercent || 60) / 100)} / 25 marks to pass.
                </span>
              </div>
            </div>

            {/* Round 2 Settings */}
            <div className="p-5 bg-[#F8F9FD] border border-slate-200 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-[#2F2D7D] flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Round 2 Controls
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration (Minutes):
                </label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={configForm.round2DurationMinutes}
                  onChange={(e) => setConfigForm({ ...configForm, round2DurationMinutes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Standard Cutoff (%):
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={configForm.round2CutoffPercent}
                  onChange={(e) => setConfigForm({ ...configForm, round2CutoffPercent: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  e.g., 70% = {Math.ceil(50 * (configForm.round2CutoffPercent || 70) / 100)} / 50 marks.
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Borderline Review Floor (%):
                </label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  value={configForm.round2BorderlinePercent}
                  onChange={(e) => setConfigForm({ ...configForm, round2BorderlinePercent: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-amber-700 mt-1 block font-semibold">
                  Candidates scoring between this floor and standard cutoff qualify for Admin approval.
                </span>
              </div>
            </div>

            {/* Round 3 Settings */}
            <div className="p-5 bg-[#F8F9FD] border border-slate-200 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-[#2F2D7D] flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Round 3 Coding Controls
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration (Minutes):
                </label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={configForm.round3DurationMinutes}
                  onChange={(e) => setConfigForm({ ...configForm, round3DurationMinutes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Coding Problems:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={configForm.round3QuestionsCount}
                  onChange={(e) => setConfigForm({ ...configForm, round3QuestionsCount: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: 4 Coding Problems</span>
              </div>
            </div>
          </div>

          {/* Exam Scheduling Section */}
          <div className="p-5 bg-[#F8F9FD] border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2F2D7D] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Exam Window Scheduling
                </h3>
                <p className="text-xs text-slate-500">
                  Optionally restrict assessments to a fixed start and end time.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={configForm.isScheduleActive}
                  onChange={(e) => setConfigForm({ ...configForm, isScheduleActive: e.target.checked })}
                  className="w-4 h-4 text-[#2F2D7D] rounded focus:ring-[#2F2D7D]"
                />
                <span className="text-xs font-bold text-slate-700">Enforce Active Schedule Window</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Schedule Start Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={configForm.scheduleStart}
                  onChange={(e) => setConfigForm({ ...configForm, scheduleStart: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Schedule End Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={configForm.scheduleEnd}
                  onChange={(e) => setConfigForm({ ...configForm, scheduleEnd: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={configSaving}
              className="py-3 px-8 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-2xl text-xs shadow-md shadow-[#2F2D7D]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{configSaving ? 'Saving Settings...' : 'Save Configuration & Scheduling'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: QUESTION BANK MANAGEMENT (CRUD) */}
      {activeTab === 'questions' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#2F2D7D] mb-1">Question Bank Management</h2>
              <p className="text-xs text-slate-500">
                Add, edit, and organize questions across Round 1, Round 2 domains, and Round 3 coding challenges.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={qFilterRound}
                onChange={(e) => setQFilterRound(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Rounds</option>
                <option value="1">Round 1 (Common MCQs)</option>
                <option value="2">Round 2 (Domain MCQs)</option>
                <option value="3">Round 3 (Coding)</option>
              </select>

              <button
                onClick={openNewQModal}
                className="py-2 px-4 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Questions list */}
          <div className="divide-y divide-slate-100">
            {filteredQuestions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No questions found in this category. Click "Add Question" to seed custom questions into MongoDB!
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div key={q._id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] font-bold text-[10px] uppercase">
                        Round {q.round}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {q.domain || 'common'}
                      </span>
                      {q.category && (
                        <span className="text-[11px] text-slate-400">({q.category})</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      {q.questionText || q.title}
                    </div>
                    {q.options?.length > 0 && (
                      <div className="text-[11px] text-slate-500 font-medium">
                        Options: {q.options.join(' | ')} (Answer: <span className="font-bold text-emerald-700">{q.correctAnswer}</span>)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditQModal(q)}
                      title="Edit Question"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#2F2D7D] text-slate-600 hover:text-white transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      title="Delete Question"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* QUESTION MODAL (Add / Edit) */}
      {qModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#2F2D7D]">
                {editingQId ? 'Edit Question' : 'Add New Question to Bank'}
              </h3>
              <button onClick={() => setQModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Round</label>
                  <select
                    value={qForm.round}
                    onChange={(e) => setQForm({ ...qForm, round: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value={1}>Round 1 (MCQ)</option>
                    <option value={2}>Round 2 (Domain MCQ)</option>
                    <option value={3}>Round 3 (Coding)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Domain</label>
                  <select
                    value={qForm.domain}
                    onChange={(e) => setQForm({ ...qForm, domain: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="common">Common (Round 1)</option>
                    <option value="fullstack">Full Stack Developer</option>
                    <option value="data_analyst">Data Analyst / Scientist</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="python">Python Developer</option>
                    <option value="java">Java Developer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {qForm.round === 3 ? 'Problem Title' : 'Question Text'} *
                </label>
                <input
                  type="text"
                  required
                  value={qForm.round === 3 ? qForm.title : qForm.questionText}
                  onChange={(e) =>
                    qForm.round === 3
                      ? setQForm({ ...qForm, title: e.target.value })
                      : setQForm({ ...qForm, questionText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Memory, React, Java Collections, Algorithms"
                  value={qForm.category}
                  onChange={(e) => setQForm({ ...qForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              {qForm.round !== 3 ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">4 Multiple-Choice Options *</label>
                    {qForm.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...qForm.options];
                          newOpts[idx] = e.target.value;
                          setQForm({ ...qForm, options: newOpts });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correct Answer String *</label>
                    <input
                      type="text"
                      required
                      placeholder="Must match one of the 4 options exactly"
                      value={qForm.correctAnswer}
                      onChange={(e) => setQForm({ ...qForm, correctAnswer: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Scenario</label>
                    <textarea
                      rows={2}
                      value={qForm.scenario}
                      onChange={(e) => setQForm({ ...qForm, scenario: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description / Task</label>
                    <textarea
                      rows={3}
                      value={qForm.description}
                      onChange={(e) => setQForm({ ...qForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sample Input</label>
                      <input
                        type="text"
                        value={qForm.sampleInput}
                        onChange={(e) => setQForm({ ...qForm, sampleInput: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sample Output</label>
                      <input
                        type="text"
                        value={qForm.sampleOutput}
                        onChange={(e) => setQForm({ ...qForm, sampleOutput: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={qSaving}
                  className="py-2 px-6 bg-[#2F2D7D] hover:bg-[#252366] text-white font-bold rounded-xl text-xs shadow"
                >
                  {qSaving ? 'Saving...' : 'Save to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
