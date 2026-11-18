import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useProctoring({ isActive, onDisqualified }) {
  const { user, refreshUser } = useAuth();
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [disqualifiedModalOpen, setDisqualifiedModalOpen] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  const [strike, setStrike] = useState(user?.violationCount || 0);

  // Keep callback references stable across re-renders
  const onDisqualifiedRef = useRef(onDisqualified);
  onDisqualifiedRef.current = onDisqualified;

  const refreshUserRef = useRef(refreshUser);
  refreshUserRef.current = refreshUser;

  // Track if fullscreen was genuinely entered
  const hasEnteredFullscreenRef = useRef(false);

  // Debounce ref to prevent duplicate triggers
  const lastViolationTime = useRef(0);

  const checkFullscreenActive = () => {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  const requestFullscreen = useCallback(async () => {
    try {
      if (!checkFullscreenActive()) {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        }
      }
      hasEnteredFullscreenRef.current = true;
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  }, []);

  const triggerViolation = useCallback(
    async (type, reason) => {
      if (!isActive) return;

      const now = Date.now();
      // Don't report another violation within 1.5 seconds of previous
      if (now - lastViolationTime.current < 1500) {
        return;
      }
      lastViolationTime.current = now;

      try {
        const res = await api.logViolation(type, reason);
        if (res.success) {
          const currentStrike = res.strike || res.violationCount;
          setStrike(currentStrike);
          setViolationReason(res.message || reason);

          if (res.disqualified || currentStrike >= 2) {
            setWarningModalOpen(false);
            setDisqualifiedModalOpen(true);
            if (onDisqualifiedRef.current) onDisqualifiedRef.current();
            if (refreshUserRef.current) refreshUserRef.current();
          } else {
            setWarningModalOpen(true);
          }
        }
      } catch (err) {
        console.error('Failed to report violation:', err);
      }
    },
    [isActive]
  );

  useEffect(() => {
    if (!isActive) return;

    // Check if browser was already in fullscreen
    if (checkFullscreenActive()) {
      hasEnteredFullscreenRef.current = true;
    }

    // 1. Fullscreen Change Handler
    const handleFullscreenChange = () => {
      const isFs = checkFullscreenActive();
      if (isFs) {
        hasEnteredFullscreenRef.current = true;
      } else if (hasEnteredFullscreenRef.current) {
        // Genuinely exited fullscreen
        hasEnteredFullscreenRef.current = false;
        triggerViolation(
          'fullscreen_exit',
          'You exited Full Screen Mode. Assessments must be completed strictly in Full Screen.'
        );
      }
    };

    // 2. Tab switch / Visibility Handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation(
          'tab_switch',
          'Tab switch or window minimized. You must not navigate away from the test tab.'
        );
      }
    };

    // 3. Window blur (only if entire window loses focus, not individual elements)
    const handleWindowBlur = () => {
      // Small timeout to confirm the blur wasn't an internal click or modal focus
      setTimeout(() => {
        if (!document.hasFocus() && !document.hidden) {
          triggerViolation(
            'window_blur',
            'Window lost focus or screenshot snipping tool detected.'
          );
        }
      }, 150);
    };

    // 4. Copy / Paste / Cut Prevention
    const handleCopy = (e) => {
      e.preventDefault();
      triggerViolation('copy_paste', 'Copying content from assessment is prohibited.');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      triggerViolation('copy_paste', 'Pasting external content into assessment is prohibited.');
    };

    const handleCut = (e) => {
      e.preventDefault();
      triggerViolation('copy_paste', 'Cutting content is prohibited.');
    };

    // 5. Right Click Prevention
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerViolation('right_click', 'Right-click context menu is disabled.');
    };

    // 6. Keyboard shortcuts & Screenshot Prevention
    const handleKeyDown = (e) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerViolation('screenshot', 'Screenshot attempt (PrintScreen) detected and prohibited.');
        return;
      }

      // Windows + Shift + S or similar
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.code === 'KeyS')) {
        e.preventDefault();
        triggerViolation('screenshot', 'Screenshot shortcut detected.');
        return;
      }

      // DevTools (Ctrl+Shift+I, F12, Ctrl+U)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        triggerViolation('devtools', 'Inspection tools and source viewing are prohibited.');
        return;
      }

      // Ctrl+C, Ctrl+V, Ctrl+X
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        triggerViolation('copy_paste', `Ctrl+${e.key.toUpperCase()} shortcut detected and blocked.`);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerViolation('screenshot', 'Screenshot attempt (PrintScreen key) detected and prohibited.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);

      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);

      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [isActive, triggerViolation]);

  const resumeAfterWarning = async () => {
    setWarningModalOpen(false);
    await requestFullscreen();
  };

  return {
    warningModalOpen,
    disqualifiedModalOpen,
    violationReason,
    strike,
    resumeAfterWarning,
    requestFullscreen,
    triggerViolation
  };
}
