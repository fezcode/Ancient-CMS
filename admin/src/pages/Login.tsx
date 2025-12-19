import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock, Mail, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const payload = isRegistering ? { name, email, password } : { email, password };
      
      const res = await api.post(endpoint, payload);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ancient-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ancient-800/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-5xl font-black text-ancient-50 tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">Ancient</span>
            <span className="text-ancient-200">CMS</span>
          </h1>
          <p className="text-ancient-400 font-medium">
            {isRegistering ? 'Begin your legacy.' : 'Welcome back, Guardian.'}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-ancient-900/60 border border-ancient-800/50 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center animate-pulse">
                {error}
              </div>
            )}
            
            {isRegistering && (
              <div className="group">
                <label className="block text-xs font-bold text-ancient-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ancient-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-ancient-950/50 border border-ancient-800 text-ancient-100 rounded-xl py-3.5 pl-11 pr-4 placeholder:text-ancient-600 focus:outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all"
                    placeholder="The Architect"
                    required
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-xs font-bold text-ancient-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ancient-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ancient-950/50 border border-ancient-800 text-ancient-100 rounded-xl py-3.5 pl-11 pr-4 placeholder:text-ancient-600 focus:outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all"
                  placeholder="guardian@ancient.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-ancient-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ancient-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ancient-950/50 border border-ancient-800 text-ancient-100 rounded-xl py-3.5 pl-11 pr-12 placeholder:text-ancient-600 focus:outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ancient-500 hover:text-gold-500 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-ancient-950 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>{isRegistering ? 'Create Account' : 'Enter Archives'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-ancient-800/50">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-ancient-400 text-sm font-medium hover:text-gold-500 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;