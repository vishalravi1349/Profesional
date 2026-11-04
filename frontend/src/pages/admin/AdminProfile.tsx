import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, Calendar, ArrowLeft, FileText, Users, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/');
  };

  const quickLinks = [
    { icon: FileText, label: 'All Enquiries',    path: '/admin/enquiries', color: 'text-gold-400',    bg: 'bg-gold-500/10',    border: 'border-gold-500/30'    },
    { icon: Users,    label: 'User Management',  path: '/admin/users',     color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/30'     },
    { icon: Settings, label: 'Admin Dashboard',  path: '/admin',           color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/30'  },
  ];

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      {/* Back */}
      <div className="flex items-center gap-2">
        <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
          Administrator Profile
        </h1>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl glass-panel border border-gold-500/30 space-y-6 relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar Row */}
        <div className="flex items-center gap-5 border-b border-slate-800/80 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl shadow-gold-500/20 shrink-0">
            <Shield className="w-9 h-9 text-navy-950" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white">{user?.full_name}</h2>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-500/40">
              System Administrator
            </span>
            <p className="text-xs text-slate-400 mt-2">Full access to all admin panel features and controls.</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email Address
            </span>
            <span className="font-semibold text-white">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Contact Number
            </span>
            <span className="font-semibold text-white">{user?.mobile_number || 'Not set'}</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Role & Permissions
            </span>
            <span className="font-semibold text-gold-400">Administrator — Full Access</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Account Created
            </span>
            <span className="font-semibold text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Permissions */}
        <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Granted Permissions</p>
          <div className="flex flex-wrap gap-2">
            {[
              'View All Enquiries', 'Manage Enquiry Status', 'Publish Official Responses',
              'Delete Enquiries', 'View All Users', 'Promote / Revoke Admin',
              'Create User Accounts', 'Export Data CSV', 'Access Admin Dashboard',
            ].map((perm) => (
              <span key={perm} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/30">
                ✓ {perm}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map(({ icon: Icon, label, path, color, bg, border }, i) => (
          <motion.div key={path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link
              to={path}
              className={`flex items-center gap-3 p-4 rounded-2xl ${bg} border ${border} hover:opacity-90 transition-all group`}
            >
              <div className={`p-2 rounded-xl bg-navy-900/60`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className={`text-sm font-semibold ${color} group-hover:underline`}>{label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {loggingOut ? 'Signing Out...' : 'Sign Out of Admin Session'}
        </button>
      </motion.div>
    </div>
  );
};
