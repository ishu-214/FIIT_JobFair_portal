import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, ShieldAlert } from 'lucide-react';

export default function WebcamMonitor({ onCameraError, initialPosition = 'bottom-right' }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dockPos, setDockPos] = useState(initialPosition);

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 } },
          audio: false
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        setErrorMsg('');
      } catch (err) {
        console.warn('Webcam access error:', err);
        if (mounted) {
          setHasPermission(false);
          setErrorMsg('Webcam required for proctoring. Please allow camera access.');
          if (onCameraError) onCameraError(err.message);
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const positionClasses = dockPos === 'bottom-left'
    ? 'bottom-4 left-4 sm:bottom-6 sm:left-6'
    : dockPos === 'top-right'
    ? 'top-20 right-4 sm:right-6'
    : 'bottom-4 right-4 sm:bottom-6 sm:right-6';

  const toggleDock = () => {
    setDockPos((prev) => (prev === 'bottom-right' ? 'bottom-left' : 'bottom-right'));
  };

  return (
    <div className={`fixed ${positionClasses} z-30 bg-white/95 backdrop-blur border border-[#2F2D7D]/25 rounded-2xl shadow-xl shadow-[#2F2D7D]/10 p-2 w-44 sm:w-48 flex flex-col items-center select-none transition-all`}>
      <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
        {hasPermission ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center text-rose-500">
            <Camera className="w-5 h-5 mb-1 opacity-70 animate-pulse" />
            <span className="text-[9px] leading-tight font-medium">
              {errorMsg || 'Starting proctor camera...'}
            </span>
          </div>
        )}

        {/* Pulsing Live indicator */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-emerald-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[9px] font-bold text-emerald-400 tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1 text-[#2F2D7D] font-bold">
          <ShieldAlert className="w-3 h-3 text-[#2F2D7D]" />
          Proctor Active
        </span>
        <button
          type="button"
          onClick={toggleDock}
          title="Toggle camera position (Left / Right)"
          className="text-[9px] text-slate-400 hover:text-[#2F2D7D] font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
        >
          ⇄ Move
        </button>
      </div>
    </div>
  );
}
