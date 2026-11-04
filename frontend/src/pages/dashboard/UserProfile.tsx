import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-heading font-extrabold text-white">Profile Details</h1>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-navy-800 flex items-center justify-center text-xl font-bold text-navy-950 shadow-lg">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white">{user?.full_name}</h2>
            <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-wider border border-gold-500/30">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Full Name</span>
            <span className="font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-gold-400" /> {user?.full_name}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Email Address</span>
            <span className="font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-400" /> {user?.email}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Mobile Number</span>
            <span className="font-semibold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400" /> {user?.mobile_number || 'Not provided'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Member Since</span>
            <span className="font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />{' '}
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
