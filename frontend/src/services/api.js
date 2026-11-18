const API_BASE = '/api';

function getHeaders() {
  const token = sessionStorage.getItem('fiit_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.reEntryBlocked = data.reEntryBlocked;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => request('/auth/me'),

  acknowledgeInstructions: () =>
    request('/auth/acknowledge-instructions', {
      method: 'POST'
    }),

  updateProfile: (profileData) =>
    request('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    }),

  startRound1: () =>
    request('/auth/start-round1', {
      method: 'POST'
    }),

  startRound: (round) =>
    request('/auth/start-round', {
      method: 'POST',
      body: JSON.stringify({ round })
    }),

  abandonRound1: () =>
    request('/auth/abandon-round1', {
      method: 'POST'
    }),

  abandonRound: (round) =>
    request('/auth/abandon-round', {
      method: 'POST',
      body: JSON.stringify({ round })
    }),

  startNewAttempt: () =>
    request('/auth/start-new-attempt', {
      method: 'POST'
    }),

  // Assessment & Config
  getConfig: () => request('/assessment/config'),

  getRound1Questions: () => request('/assessment/round1/questions'),

  submitRound1: (answers) =>
    request('/assessment/round1/submit', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  getRound2Questions: () => request('/assessment/round2/questions'),

  submitRound2: (answers) =>
    request('/assessment/round2/submit', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  getRound3Questions: () => request('/assessment/round3/questions'),

  runRound3Code: (questionId, language, code) =>
    request('/assessment/round3/run', {
      method: 'POST',
      body: JSON.stringify({ questionId, language, code })
    }),

  submitRound3: (solutions) =>
    request('/assessment/round3/submit', {
      method: 'POST',
      body: JSON.stringify({ solutions })
    }),

  logViolation: (type, reason) =>
    request('/assessment/violation', {
      method: 'POST',
      body: JSON.stringify({ type, reason })
    }),

  // Admin
  getAdminStats: () => request('/admin/stats'),

  getAdminStudents: () => request('/admin/students'),

  getAdminConfig: () => request('/admin/config'),

  updateAdminConfig: (configData) =>
    request('/admin/config', {
      method: 'PUT',
      body: JSON.stringify(configData)
    }),

  getAdminQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/questions${query ? '?' + query : ''}`);
  },

  createAdminQuestion: (questionData) =>
    request('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    }),

  updateAdminQuestion: (id, questionData) =>
    request(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    }),

  deleteAdminQuestion: (id) =>
    request(`/admin/questions/${id}`, {
      method: 'DELETE'
    }),

  approveRound3: (studentId) =>
    request(`/admin/approve-round3/${studentId}`, {
      method: 'POST'
    }),

  resetReentry: (studentId) =>
    request(`/admin/reset-reentry/${studentId}`, {
      method: 'POST'
    }),

  resetDisqualification: (studentId) =>
    request(`/admin/reset-disqualification/${studentId}`, {
      method: 'POST'
    })
};
