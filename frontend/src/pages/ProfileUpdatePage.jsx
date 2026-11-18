import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, GraduationCap, Building, Lock, ArrowRight, AlertCircle, BookOpen } from 'lucide-react';

export default function ProfileUpdatePage({ onComplete }) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [degree, setDegree] = useState(user?.degree || '');
  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [interestedRole, setInterestedRole] = useState(user?.interestedRole || 'Java Full Stack Developer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const degrees = [
    'B.E. (Bachelor of Engineering)',
    'B.Tech (Bachelor of Technology)',
    'B.Sc (Bachelor of Science)',
    'BCA (Bachelor of Computer Applications)',
    'M.E. (Master of Engineering)',
    'M.Tech (Master of Technology)',
    'MCA (Master of Computer Applications)',
    'M.Sc (Master of Science)'
  ];

  const branches = [
    'Computer Science and Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Artificial Intelligence & Data Science (AI & DS)',
    'Computer Science',
    'Mechanical Engineering',
    'Civil Engineering',
    'Other Engineering / Science Branch'
  ];

  const roles = [
    { id: 'Java Full Stack Developer', label: 'Java Full Stack Developer', desc: 'Core Java, HTML5, CSS3, JavaScript, React.js, SQL & Full Stack Architecture' },
    { id: 'Data Analyst / Data Scientist', label: 'Data Analyst / Data Scientist', desc: 'Python, Power BI, SQL, Pandas, NumPy, Data Analytics & Business Intelligence' },
    { id: 'Frontend Developer', label: 'Frontend Developer', desc: 'HTML5, CSS3, JavaScript ES6+, React.js & Responsive Web UI' },
    { id: 'Backend Developer', label: 'Backend Developer', desc: 'Node.js, Express, Java/Python, REST APIs & SQL Database Architecture' },
    { id: 'Python Developer', label: 'Python Developer', desc: 'Core Python, OOP, Data Structures, Algorithms & SQL' },
    { id: 'Java Developer', label: 'Java Developer', desc: 'Core Java, OOP, Collections, Multithreading, JVM & SQL' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Validation for all fields
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      setError('Phone number is required.');
      return;
    }
    if (/[^0-9]/.test(cleanPhone)) {
      setError('Phone number must contain only numeric digits (no letters, spaces, or symbols).');
      return;
    }
    if (cleanPhone.startsWith('0')) {
      setError('Phone number cannot start with 0.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError(`Phone number must be exactly 10 digits (currently ${cleanPhone.length} digits).`);
      return;
    }

    if (!collegeName.trim()) {
      setError('Please provide your college / university name.');
      return;
    }
    if (!degree) {
      setError('Please select your degree.');
      return;
    }
    if (!department.trim()) {
      setError('Please select your branch.');
      return;
    }
    if (!yearOfStudy) {
      setError('Please select your year of study.');
      return;
    }
    if (!interestedRole) {
      setError('Please select your interested technical domain.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        phoneNumber: cleanPhone,
        degree,
        yearOfStudy,
        department: department.trim(),
        specialization: department.trim(),
        collegeName: collegeName.trim(),
        interestedRole
      });
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2F2D7D] text-white flex items-center justify-center shadow-md shadow-[#2F2D7D]/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20 text-[11px] font-bold uppercase tracking-wide">
              Step 2: Mandatory Candidate Profile
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2D7D]">
              Complete Your Candidate Profile
            </h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Please fill in all mandatory academic details and technical domain choice below.
          <strong className="text-[#2F2D7D]"> All fields are mandatory to proceed to the assessment.</strong>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic & Academic Information */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#2F2D7D] border-b border-slate-100 pb-2">
            1. Personal & Academic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2F2D7D]"
                />
              </div>
            </div>

            {/* Email (DISABLED / READ-ONLY) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address (Permanent ID)
                </label>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Read Only
                </span>
              </div>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed select-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Note: Email and Password cannot be modified on this page.
              </p>
            </div>

            {/* Phone Number (Strict 10 Digits, No 0 start, No letters) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number (10 Digits) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPhoneNumber(val);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2F2D7D]"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Must be exactly 10 numeric digits and cannot start with 0.
              </p>
            </div>

            {/* College Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College / University Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Madras Institute of Technology"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2F2D7D]"
                />
              </div>
            </div>

            {/* Degree Dropdown (B.E, B.Tech, B.Sc, BCA, etc.) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Degree *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2F2D7D]"
                >
                  <option value="">-- Select Degree --</option>
                  {degrees.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Branch (Not prefilled) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Branch *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2F2D7D]"
                >
                  <option value="">-- Select Branch --</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year of Study */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Year of Study *
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2F2D7D]"
              >
                <option value="">-- Select Year of Study --</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year / Final Year">4th Year / Final Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interested Domain Selection (Determines Round 2 & Round 3 Questions) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-[#2F2D7D]">
                2. Select Your Interested Technical Domain *
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your technical assessments will be aligned with this choice.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {roles.map((r) => {
              const isSelected = interestedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setInterestedRole(r.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#2F2D7D] bg-[#2F2D7D]/5 shadow-sm ring-1 ring-[#2F2D7D]'
                      : 'border-slate-200 bg-[#F8F9FD] hover:bg-slate-100/70'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-[#2F2D7D] bg-[#2F2D7D] text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{r.label}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">{r.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-white bg-[#2F2D7D] hover:bg-[#252366] transition-all shadow-md shadow-[#2F2D7D]/30 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Saving Profile...' : 'Save Profile & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
