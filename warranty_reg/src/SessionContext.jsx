// src/SessionContext.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from './useSessionTimeout';
import SessionModal from './components/SessionModal';

const SessionContext = createContext();

/**
 * Provides:
 * - showSessionModal      : boolean
 * - setShowSessionModal   : (flag) => void
 * - onRefresh             : () => Promise<void>
 * - onLogout              : () => void
 * - isLoading             : boolean
 */
export function SessionProvider({ children }) {
  const navigate    = useNavigate();
  const refreshRef  = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // -- Logout handler
  const onLogout = useCallback(() => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  }, [navigate]);

  // -- Refresh handler with loading state & toasts
  const onRefresh = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (!res.ok) {
        onLogout();
        return;
      }

      const { access } = await res.json();
      localStorage.setItem('session_token', access);

      // hide modal + restart timer
      refreshRef.current?.();
      console.log('Sesión extendida correctamente');
    } catch {
      console.log('Error al extender sesión');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onLogout]);

  // -- Hook for countdown & modal display
  const [showSessionModal, setShowSessionModal] =
    useSessionTimeout(onLogout, refreshRef);

  return (
    <SessionContext.Provider
      value={{
        showSessionModal,
        setShowSessionModal,
        onRefresh,
        onLogout,
        isLoading
      }}
    > 
    {/* Global session-expiry modal */}
      {showSessionModal && (
        <SessionModal
          onRefresh={onRefresh}
          onLogout={onLogout}
          onClose={() => setShowSessionModal(false)}
          isLoading={isLoading}
        />
      )}

      {children}
    </SessionContext.Provider>
  );
}

// Hook for consuming context
export function useSession() {
  return useContext(SessionContext);
}