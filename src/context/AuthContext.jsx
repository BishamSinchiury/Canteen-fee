import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export function AuthProvider({ children }) {
  // Initialize from localStorage so a refresh or dev-server restart won't force a logout
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch {}
    } catch (error) {
      // If the backend explicitly says unauthenticated, clear local state.
      // Otherwise (network error, server down), keep any locally cached user so
      // the UI doesn't bounce back to login on every refresh or while server is down.
      const stored = (() => {
        try {
          const raw = localStorage.getItem("user");
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })();

      // Prefer a locally cached user if available. This keeps the UI logged-in
      // across refreshes and temporary backend outages until the user explicitly
      // logs out. If there's no cached user, then clear state on 401/403.
      if (stored) {
        setUser(stored);
      } else if (error && (error.status === 401 || error.status === 403)) {
        setUser(null);
        try {
          localStorage.removeItem("user");
        } catch {}
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.login(email, password);
    // expected response to include `user`
    setUser(response.user);
    try {
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch {}
    return response;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore network errors during logout but still clear client state
      // eslint-disable-next-line no-console
      console.warn("Logout request failed, clearing local session anyway", e);
    }
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch {}
  };

  const register = async (email, name, password) => {
    await api.register(email, name, password);
    return login(email, password);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
