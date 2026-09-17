/**
 * OVERCLOCK — Authentication Context
 * Manages Google OAuth2 authentication state across the application.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export type AuthState = 'loading' | 'unauthenticated' | 'authenticated' | 'error';

export interface AuthContextValue {
  state: AuthState;
  user: UserProfile | null;
  isNewUser: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Determine the auth server URL
function getAuthServerUrl(): string {
  // In development, auth server runs on port 3001
  // In production, same origin
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return 'http://localhost:3001';
  }
  return '';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkedRef = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const serverUrl = getAuthServerUrl();
      const res = await fetch(`${serverUrl}/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsNewUser(data.isNewUser || false);
        setState('authenticated');
      } else {
        setUser(null);
        setIsNewUser(false);
        setState('unauthenticated');
      }
    } catch (err) {
      // Server might be unreachable — treat as unauthenticated
      console.warn('Auth check failed:', err);
      setUser(null);
      setState('unauthenticated');
    }
  }, []);

  // Handle OAuth callback redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get('auth');

    if (authResult === 'success' || authResult === 'error') {
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('auth');
      url.searchParams.delete('reason');
      window.history.replaceState({}, '', url.toString());

      if (authResult === 'error') {
        const reason = params.get('reason') || 'unknown';
        setError(`Authentication failed: ${reason}`);
        setState('error');
        return;
      }
    }

    // Check current auth status
    if (!checkedRef.current) {
      checkedRef.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  const login = useCallback(() => {
    const serverUrl = getAuthServerUrl();
    window.location.href = `${serverUrl}/auth/google`;
  }, []);

  const logout = useCallback(async () => {
    try {
      const serverUrl = getAuthServerUrl();
      await fetch(`${serverUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
    setUser(null);
    setIsNewUser(false);
    setState('unauthenticated');
  }, []);

  const markOnboardingComplete = useCallback(async () => {
    try {
      const serverUrl = getAuthServerUrl();
      await fetch(`${serverUrl}/auth/onboarding-complete`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsNewUser(false);
    } catch (err) {
      console.warn('Failed to mark onboarding complete:', err);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        state,
        user,
        isNewUser,
        error,
        login,
        logout,
        markOnboardingComplete,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
