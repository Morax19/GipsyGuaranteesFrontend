import { useEffect, useState, useRef, useCallback } from 'react';

const WARNING_THRESHOLD = 90;       // seconds before exp to show modal
const CHECK_INTERVAL   = 30 * 1000; // 30s polling

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json    = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useSessionTimeout(onLogout, refreshRef) {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const intervalRef = useRef(null);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem('session_token');
    if (!token) return;

    const decoded = parseJwt(token);
    // guard against malformed token
    if (!decoded || typeof decoded.exp !== 'number') {
      setShowSessionModal(false);
      return;
    }

    const now      = Date.now() / 1000;
    const timeLeft = decoded.exp - now;

    if (timeLeft <= 0) {
      setShowSessionModal(false);
      onLogout?.();
    } else if (timeLeft < WARNING_THRESHOLD) {
      setShowSessionModal(true);
    } else {
      setShowSessionModal(false);
    }
  }, [onLogout]);

  const resetSessionTimeout = useCallback(() => {
    setShowSessionModal(false);
    clearInterval(intervalRef.current);

    // re-run check immediately, then re-arm
    checkToken();
    intervalRef.current = setInterval(checkToken, CHECK_INTERVAL);
  }, [checkToken]);

  // wire the reset fn into your ref so your component can call it
  useEffect(() => {
    if (refreshRef && 'current' in refreshRef) {
      refreshRef.current = resetSessionTimeout;
    }
  }, [refreshRef, resetSessionTimeout]);

  // start the cycle on mount, clean up on unmount
  useEffect(() => {
    resetSessionTimeout();
    return () => clearInterval(intervalRef.current);
  }, [resetSessionTimeout]);

  // return the modal state + setter + explicit reset (if you ever need it)
  return [showSessionModal, setShowSessionModal, resetSessionTimeout];
}