import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './api';

/**
 * AuthContext - Manages user authentication state
 */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  console.log("AuthProvider rendering...");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("AuthProvider state:", { user, loading, error });

  // Check if user is already logged in (on app load)
  useEffect(() => {
    console.log("AuthProvider useEffect running...");
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token ? "exists" : "null");

    if (token) {
      // You could validate token here by calling a /me endpoint
      const storedUser = localStorage.getItem('user');
      console.log("User from localStorage:", storedUser ? "exists" : "null");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      }
    }
    setLoading(false);
    console.log("AuthProvider loading set to false");
  }, []);

  const login = async (email, password) => {
    console.log("Login function called with:", email);
    setError(null);
    setLoading(true);
    try {
      const response = await auth.login(email, password);
      console.log("Login response:", response);
      setUser(response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (err) {
      console.log("Login error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    console.log("Register function called with:", name, email);
    setError(null);
    setLoading(true);
    try {
      const response = await auth.register(name, email, password);
      console.log("Register response:", response);
      setUser(response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (err) {
      console.log("Register error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logout called");
    auth.logout();
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  console.log("AuthProvider value:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use Auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
