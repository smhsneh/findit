import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      login(data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md glass-card p-8 rounded-3xl">
        <h1 className="text-[32px] font-bold font-header text-text-main mb-2">create account.</h1>
        <p className="text-[15px] text-text-muted mb-8">build your personal knowledge base.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email address" 
            className="h-12 px-4 rounded-xl border border-black/[0.08] bg-white text-text-main text-[15px] outline-none focus:border-[#002855]/50 focus:shadow-[0_0_0_3px_rgba(0,40,85,0.1)] transition-all"
            required 
          />
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password" 
            className="h-12 px-4 rounded-xl border border-black/[0.08] bg-white text-text-main text-[15px] outline-none focus:border-[#002855]/50 focus:shadow-[0_0_0_3px_rgba(0,40,85,0.1)] transition-all"
            required 
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="h-12 mt-2 rounded-xl bg-[#002855] text-white font-semibold text-[15px] hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? 'creating account...' : 'sign up'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[13px] text-text-muted font-medium">
          already have an account? <Link to="/login" className="text-[#002855] hover:underline">log in here</Link>
        </p>
      </div>
    </div>
  );
}
