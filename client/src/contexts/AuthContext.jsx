/**
 * Auth Context
 * ------------
 * Manages authentication state across the application.
 * Provides login, register, and logout functions.
 * Stores JWT token in localStorage and auto-loads user on mount.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('interviewx-token'));
  const [loading, setLoading] = useState(true);

  // On mount, verify the stored token and load user data
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        // Token is invalid or expired — clear it
        console.error('Auto-login failed:', error);
        localStorage.removeItem('interviewx-token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  /**
   * Register a new user account
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('interviewx-token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  /**
   * Log in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('interviewx-token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  /**
   * Log out the current user
   * Clears token from localStorage and resets state
   */
  const logout = () => {
    localStorage.removeItem('interviewx-token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
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
