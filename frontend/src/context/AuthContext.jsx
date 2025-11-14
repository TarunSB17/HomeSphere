import { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only force logout when explicitly requested via env flag
    const forceLogout = String(import.meta.env.VITE_FORCE_LOGOUT_ON_LOAD || '').toLowerCase() === 'true';

    // Clear saved login ONLY on the first open of this tab/session.
    // Applies to localhost by default, and to any host when VITE_LOGOUT_ON_FIRST_VISIT=true.
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const logoutOnFirstVisit = String(import.meta.env.VITE_LOGOUT_ON_FIRST_VISIT || '').toLowerCase() === 'true';
    const firstVisitFlag = 'hs_first_visit';
    const isFirstVisit = !sessionStorage.getItem(firstVisitFlag);

    if (forceLogout || (isFirstVisit && (isLocal || logoutOnFirstVisit))) {
      try {
        localStorage.removeItem('userInfo');
      } catch {}
    }

    // Mark session as initialized so future refreshes in this tab don't clear login
    try { sessionStorage.setItem(firstVisitFlag, '1'); } catch {}

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo && !forceLogout) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password, role, phone) => {
    try {
      const { data } = await axios.post('/auth/register', { name, email, password, role, phone });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
