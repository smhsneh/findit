import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have a token, we could optionally verify it with the backend here.
    // For now, we trust it until an API call fails with 401.
    if (token) {
      localStorage.setItem('token', token);
      setUser({ token });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
