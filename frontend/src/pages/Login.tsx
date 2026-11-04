import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, UserCheck, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rolePreference: z.enum(['user', 'admin']).optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rolePreference: 'user',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password, 'user');
      if (res.success) {
        showToast('Login Successful', 'Welcome back to Noventra School!', 'success');
        navigate('/dashboard');
      } else {
        showToast('Login Failed', res.error || 'Invalid credentials', 'error');
      }
    } catch (err: any) {
      showToast('Error', 'An unexpected error occurred during login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset loader for testing demo accounts
  const fillDemoAccount = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setValue('email', 'admin@noventra.edu');
      setValue('password', 'admin123');
      setValue('rolePreference', 'admin');
    } else {
      setValue('email', 'sarah.j@example.com');
      setValue('password', 'password123');
      setValue('rolePreference', 'user');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-md w-full p-8 md:p-10 rounded-3xl glass-panel border border-gold-500/30 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-gold-400 to-navy-800 w-14 h-14 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <img src="/logo.jpeg" alt="Noventra Logo" className="w-10 h-10 object-contain rounded-xl bg-navy-950 p-0.5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Welcome to Noventra
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sign in to access your admission dashboard and updates
          </p>
        </div>

        {/* Demo Quick Select Buttons */}
        <div className="mb-6 p-3 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo Login Preset:
          </div>
          <div>
            <button
              type="button"
              onClick={() => fillDemoAccount('user')}
              className="w-full py-2 px-3 rounded-xl bg-navy-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" /> Parent / Student Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-200">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Password Reset', 'Please contact support at admissions@noventra.edu to reset your password.', 'info');
                }}
                className="text-xs text-gold-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-gold-500 focus:outline-none transition-colors"
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
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-6 mt-6 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-gold-400 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
