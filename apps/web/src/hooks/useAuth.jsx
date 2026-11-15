import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides auth state + actions.
 *
 * State:
 *   user  — null (logged out) or { id, name, email, role }
 *   loading — true while the initial token check is in progress
 *
 * Actions exposed via context:
 *   login(email, password)   — authenticates and stores the JWT
 *   register(name, email, password) — creates account and stores the JWT
 *   logout()                 — clears token and user state
 *   isAdmin                  — true when user?.role === 'ADMIN'
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists in localStorage, validate it via GET /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((data) => {
        setUser(data.user ?? data);
      })
      .catch(() => {
        // Token is invalid or expired — clear it silently
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — convenience hook to consume the AuthContext.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
