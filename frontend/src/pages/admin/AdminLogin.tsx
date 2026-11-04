import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password, 'admin');
      if (res.success) {
        showToast('System Authenticated', 'Access granted to Noventra Administrator portal.', 'success');
        navigate('/admin');
      } else {
        showToast('Authentication Failed', res.error || 'Invalid administrator credentials', 'error');
      }
    } catch (err: any) {
      showToast('Error', 'An unexpected error occurred during admin authentication.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminPreset = () => {
    setValue('email', 'admin@noventra.edu');
    setValue('password', 'admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 text-slate-100 px-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gold-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gold-400/5 blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full p-8 md:p-10 rounded-3xl glass-panel border border-gold-500/20 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-gold-400 to-navy-900 w-16 h-16 mx-auto mb-4 shadow-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
            Admin Console
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest font-semibold">
            Noventra School Portal
          </p>
        </div>

        {/* Demo Quick Select Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-navy-900/90 border border-slate-800/80 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo Admin Access:
          </div>
          <div>
            <button
              type="button"
              onClick={fillAdminPreset}
              className="w-full py-2 px-3 rounded-xl bg-navy-800 hover:bg-slate-700 text-xs font-bold text-gold-400 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" /> Auto-Fill Administrator Login
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                {...register('email')}
                type="email"
                placeholder="admin@noventra.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
          </button>
        </form>

        <div className="text-center pt-5 mt-6 border-t border-slate-800/85 text-xs text-slate-400">
          <a
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};
