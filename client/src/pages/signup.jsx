import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import GlassSurface from '../components/GlassSurface';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen font-body relative flex items-center justify-center overflow-hidden bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <div className="relative w-full shadow-2xl rounded-[30px]">
          <GlassSurface width="100%" height="100%" borderRadius={30} backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20}>
            <div className="p-10 flex flex-col w-full text-white relative z-20">
              <h1 className="text-[36px] font-bold font-header mb-2 leading-tight">create account.</h1>
              <p className="text-[15px] text-white/70 mb-8 font-sans">build your personal knowledge base.</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email address" 
                  className="h-14 px-5 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/50 text-[15px] outline-none focus:border-white/40 focus:bg-white/20 transition-all font-sans"
                  required 
                />
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="password" 
                    className="h-14 px-5 pr-12 w-full rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/50 text-[15px] outline-none focus:border-white/40 focus:bg-white/20 transition-all font-sans"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-14 mt-2 rounded-2xl bg-white text-black font-bold text-[16px] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0 font-header"
                >
                  {isLoading ? 'creating account...' : 'sign up'}
                </button>
              </form>
              
              <p className="mt-8 text-center text-[14px] text-white/60 font-medium font-sans">
                already have an account? <Link to="/login" className="text-white hover:underline ml-1 font-semibold">log in here</Link>
              </p>
            </div>
          </GlassSurface>
        </div>
      </motion.div>
    </div>
  );
}
