import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle2,
  Send,
  User,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  MessageSquareQuote,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtimeEnquiries } from '../../contexts/RealtimeContext';
import { api } from '../../services/api';
import { Enquiry } from '../../types';
import { DashboardCard } from '../../components/DashboardCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Timeline } from '../../components/Timeline';

export const UserDashboard: React.FC = () => {
  const { user, sessionToken } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const { subscribeToEnquiries } = useRealtimeEnquiries();

  const fetchEnquiries = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const res = await api.getUserEnquiries(sessionToken || undefined, user?.id);
    if (res.success && res.data) {
      setEnquiries(res.data);
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries(true);

    // Subscribe to Supabase Realtime updates
    const unsubscribe = subscribeToEnquiries((updatedEnquiry) => {
      setEnquiries((prev) => {
        const index = prev.findIndex((e) => e.id === updatedEnquiry.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = updatedEnquiry;
          return next;
        } else {
          return [updatedEnquiry, ...prev];
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user, sessionToken]);

  // Polling every 5 seconds as fallback for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEnquiries(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [user, sessionToken]);

  const total = enquiries.length;
  const pending = enquiries.filter((e) => e.status === 'Pending' || e.status === 'Reviewing').length;
  const responded = enquiries.filter(
    (e) => e.status === 'Responded' || e.status === 'Approved' || e.status === 'Contacted'
  ).length;

  const activeEnquiry = enquiries.find((e) => e.id === selectedEnquiryId) || enquiries[0] || null;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-gold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Parent &amp; Student Portal
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white">
            Welcome Back, {user?.full_name}!
          </h1>
          <p className="text-sm text-slate-300">
            Track your admission enquiries and real-time responses from Noventra School administrators.
          </p>
        </div>

        <Link
          to="/enquiry"
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-xl shadow-gold-500/20 shrink-0"
        >
          <Send className="w-4 h-4" /> Submit New Enquiry
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Enquiries"
          value={total}
          subtitle="Submitted applications"
          icon={FileText}
          color="gold"
          delay={0.1}
        />
        <DashboardCard
          title="Pending / Reviewing"
          value={pending}
          subtitle="Under counselor evaluation"
          icon={Clock}
          color="amber"
          delay={0.2}
        />
        <DashboardCard
          title="Responded &amp; Approved"
          value={responded}
          subtitle="Official response received"
          icon={CheckCircle2}
          color="emerald"
          delay={0.3}
        />
      </div>

      {/* Profile & Enquiries Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COL: Profile + Enquiries List */}
        <div className="lg:col-span-1 space-y-6">

          {/* User Profile Card */}
          <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-lg font-heading font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-gold-400" /> Account Profile
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Full Name</span>
                <span className="font-semibold text-white text-sm">{user?.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email Address</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold-400" /> {user?.email}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mobile Contact</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" /> {user?.mobile_number || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Role Authorization</span>
                <span className="px-2.5 py-1 rounded-md bg-navy-950 text-gold-400 font-bold uppercase text-[10px] border border-gold-500/30">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Enquiries List */}
          {enquiries.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-sm font-heading font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold-400" /> My Enquiries ({enquiries.length})
              </h3>
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {enquiries.map((e) => {
                  const isSelected = activeEnquiry?.id === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEnquiryId(e.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-gold-500/10 border-gold-500/40 shadow-md shadow-gold-500/5'
                          : 'bg-navy-900/50 border-slate-800/80 hover:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-300">
                          {e.id}
                        </span>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {e.student_name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{e.interested_class}</span>
                        <span>{new Date(e.created_at).toLocaleDateString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COL: Active Enquiry Detail & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {activeEnquiry ? (
            <div className="p-8 rounded-3xl glass-panel border border-gold-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                    Enquiry Detail
                  </span>
                  <h3 className="text-xl font-heading font-bold text-white mt-0.5">
                    {activeEnquiry.student_name} — {activeEnquiry.interested_class}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-gold-400 bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-700">
                    {activeEnquiry.id}
                  </span>
                  <StatusBadge status={activeEnquiry.status} />
                </div>
              </div>

              {/* Animated Progress Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Live Enquiry Timeline Progression
                </h4>
                <Timeline currentStatus={activeEnquiry.status} />
              </div>

              {/* Official Admin Response Box */}
              {activeEnquiry.admin_response ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-2"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <MessageSquareQuote className="w-4 h-4" /> Official Noventra Admin Response:
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{activeEnquiry.admin_response}"
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Updated at: {new Date(activeEnquiry.updated_at).toLocaleString()}
                  </span>
                </motion.div>
              ) : (
                <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Awaiting admin review. Our admissions office will update status shortly.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card text-center border border-slate-800">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Enquiries Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                You have not submitted any admission enquiries yet.
              </p>
              <Link
                to="/enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-navy-950 bg-gold-400"
              >
                Submit Admission Enquiry <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
