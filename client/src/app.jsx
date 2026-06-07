import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/home';
import Landing from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!token) return <Navigate to="/login" replace />;
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <div className="w-full h-full min-h-screen">
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0a1128',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif'
          }
        }} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
