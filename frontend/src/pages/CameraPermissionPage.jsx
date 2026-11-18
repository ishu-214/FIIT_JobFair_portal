import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function CameraPermissionPage({ onProceed }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const requestCameraAccess = async () => {
    setLoading(true);
    setError('');

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setError('');
    } catch (err) {
      console.warn('Webcam permission error:', err);
      setHasPermission(false);
      setError(
        'Camera permission was denied or not detected. Please click the camera icon in your browser address bar, allow camera access, and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleContinue = () => {
    if (!hasPermission) return;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onProceed();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in text-slate-800">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#2F2D7D] text-white flex items-center justify-center shadow-lg shadow-[#2F2D7D]/25 mx-auto mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-[#2F2D7D]/10 text-[#2F2D7D] border border-[#2F2D7D]/20 text-xs font-bold uppercase tracking-wide mb-2">
          Step 3: Proctoring Webcam Readiness Check
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2D7D]">
          Enable Your Web Camera
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          In accordance with FIIT Job Fair AI Proctoring regulations, candidate assessments require continuous webcam verification. Please grant camera permission to ensure readiness.
        </p>
      </div>

      {/* Video Preview Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="relative aspect-video max-w-lg mx-auto bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-200 shadow-inner">
          {hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Camera className="w-12 h-12 mb-3 text-slate-500 opacity-60" />
              <p className="text-sm font-semibold text-slate-300">Camera preview will appear here</p>
              <p className="text-xs text-slate-500 mt-1">Click the button below to grant permission</p>
            </div>
          )}

          {hasPermission && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>Camera Verified & Active</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {!hasPermission ? (
            <button
              onClick={requestCameraAccess}
              disabled={loading}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-white bg-[#2F2D7D] hover:bg-[#252366] transition-all shadow-md shadow-[#2F2D7D]/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Requesting Access...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Allow Camera Permission</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Camera Ready • Enter Assessment Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
