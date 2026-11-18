import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Purge any lingering legacy localStorage token
    try {
      localStorage.removeItem('fiit_token');
      localStorage.removeItem('fiit_camera_verified');
    } catch (e) {}

    const token = sessionStorage.getItem('fiit_token');
    if (token) {
      api
        .getMe()
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      sessionStorage.setItem('fiit_token', res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.success && res.token) {
      sessionStorage.setItem('fiit_token', res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    sessionStorage.removeItem('fiit_token');
    sessionStorage.removeItem('fiit_camera_verified');
    try {
      localStorage.removeItem('fiit_token');
      localStorage.removeItem('fiit_camera_verified');
    } catch (e) {}
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const acknowledgeInstructions = async () => {
    const res = await api.acknowledgeInstructions();
    if (res.success && res.user) {
      setUser(res.user);
      return res.user;
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const startRound = async (roundNumber) => {
    const res = await api.startRound(roundNumber);
    if (res.success && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || `Failed to initiate Round ${roundNumber}`);
  };

  const abandonRound = async (roundNumber) => {
    try {
      await api.abandonRound(roundNumber);
      await refreshUser();
    } catch (e) {}
  };

  const startRound1 = async () => {
    return startRound(1);
  };

  const abandonRound1 = async () => {
    return abandonRound(1);
  };

  const startNewAttempt = async () => {
    const res = await api.startNewAttempt();
    if (res.success && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Failed to start new attempt');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        refreshUser,
        acknowledgeInstructions,
        updateProfile,
        startRound,
        abandonRound,
        startRound1,
        abandonRound1,
        startNewAttempt
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
