import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import InstructionsPage from './pages/InstructionsPage';
import ProfileUpdatePage from './pages/ProfileUpdatePage';
import CameraPermissionPage from './pages/CameraPermissionPage';
import Dashboard from './pages/Dashboard';
import Round1Assessment from './pages/Round1Assessment';
import Round2Assessment from './pages/Round2Assessment';
import Round3Assessment from './pages/Round3Assessment';
import AdminDashboard from './pages/AdminDashboard';

function MainApp() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'round1', 'round2', 'round3'
  const [cameraVerified, setCameraVerified] = useState(
    () => sessionStorage.getItem('fiit_camera_verified') === 'true'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] text-slate-800">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#2F2D7D] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading FIIT Recruitment Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Admin View
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-slate-800">
        <Navbar currentPage="admin" onNavigate={() => {}} />
        <AdminDashboard />
      </div>
    );
  }

  // Student Step 1: Mandatory Instructions Acknowledgment
  if (!user.hasReadInstructions) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col">
        <Navbar currentPage="instructions" onNavigate={() => {}} />
        <div className="flex-1 py-4">
          <InstructionsPage onProceed={() => {}} />
        </div>
      </div>
    );
  }

  // Student Step 2: Mandatory Candidate Profile Update
  if (!user.isProfileCompleted) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col">
        <Navbar currentPage="profile" onNavigate={() => {}} />
        <div className="flex-1 py-4">
          <ProfileUpdatePage onComplete={() => {}} />
        </div>
      </div>
    );
  }

  // Student Step 3: Mandatory Camera Permission Prompt (immediately after profile update)
  if (!cameraVerified) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col">
        <Navbar currentPage="camera" onNavigate={() => {}} />
        <div className="flex-1 py-4">
          <CameraPermissionPage
            onProceed={() => {
              setCameraVerified(true);
              sessionStorage.setItem('fiit_camera_verified', 'true');
            }}
          />
        </div>
      </div>
    );
  }

  // Student Assessment & Dashboard Views
  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col">
      {/* Show navbar only on dashboard */}
      {currentPage === 'dashboard' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}

      <div className="flex-1">
        {currentPage === 'dashboard' && (
          <Dashboard
            onStartRound={(roundNum) => {
              if (roundNum === 1) setCurrentPage('round1');
              else if (roundNum === 2) setCurrentPage('round2');
              else if (roundNum === 3) setCurrentPage('round3');
            }}
          />
        )}

        {currentPage === 'round1' && (
          <Round1Assessment
            onFinish={() => setCurrentPage('dashboard')}
            onProceedNextRound={() => setCurrentPage('round2')}
          />
        )}

        {currentPage === 'round2' && (
          <Round2Assessment
            onFinish={() => setCurrentPage('dashboard')}
            onProceedNextRound={() => setCurrentPage('round3')}
          />
        )}

        {currentPage === 'round3' && (
          <Round3Assessment
            onFinish={() => setCurrentPage('dashboard')}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
