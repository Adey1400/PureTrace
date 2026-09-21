import React, { useState } from 'react';
import { 
  Droplet, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft,
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/useAuth.js';
import { DEMO_AUTH_EMAIL, DEMO_AUTH_PASSWORD } from '../../config/demoAuth.js';

export default function LoginPage({ onBackToHome, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Brief simulated micro-delay for smooth UI transition
    await new Promise((resolve) => setTimeout(resolve, 150));

    const result = login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_AUTH_EMAIL);
    setPassword(DEMO_AUTH_PASSWORD);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with Back to Landing Page Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between z-10">
        <button
          onClick={onBackToHome}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-950/60 border border-white/60 p-6 sm:p-8 relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-600/30">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Droplet className="w-7 h-7 text-blue-600 fill-blue-600" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              PureTrace
            </h1>
            <h2 className="text-lg font-bold text-slate-800 mt-1">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in to continue to PureTrace
            </p>
          </div>
        </div>

        {/* Credential Error Alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2.5 text-xs font-semibold shadow-xs"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 tracking-tight" htmlFor="email-input">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@puretrace.demo"
                autoComplete="email"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 tracking-tight" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isSubmitting}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info Box */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-950">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Account</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Demo credentials are configured for this environment.
              </p>
              <p className="text-[10px] font-mono text-blue-800 font-bold">
                {DEMO_AUTH_EMAIL}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1.5 rounded-xl bg-white text-blue-700 font-bold text-[11px] border border-blue-200 hover:bg-blue-100 transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              Fill Demo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
