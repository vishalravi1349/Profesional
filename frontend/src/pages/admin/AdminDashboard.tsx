import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, Clock, CheckCircle2, Shield, TrendingUp,
  Download, RefreshCw, Eye, Trash2, MessageSquare,
  ChevronRight, XCircle, BarChart3, ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { AdminStats, Enquiry, EnquiryStatus } from '../../types';
import { exportEnquiriesPDF } from '../../utils/exportPDF';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  title: string; value: number | string; subtitle: string;
  icon: React.ElementType; color: string; delay?: number;
}> = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => {
  const colorMap: Record<string, { border: string; glow: string; icon: string; bg: string }> = {
    gold:    { border: 'border-gold-500/30',   glow: 'shadow-gold-500/10',   icon: 'text-gold-400',    bg: 'bg-gold-500/10'    },
    sky:     { border: 'border-sky-500/30',    glow: 'shadow-sky-500/10',    icon: 'text-sky-400',     bg: 'bg-sky-500/10'     },
    amber:   { border: 'border-amber-500/30',  glow: 'shadow-amber-500/10',  icon: 'text-amber-400',   bg: 'bg-amber-500/10'   },
    emerald: { border: 'border-emerald-500/30',glow: 'shadow-emerald-500/10',icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    rose:    { border: 'border-rose-500/30',   glow: 'shadow-rose-500/10',   icon: 'text-rose-400',    bg: 'bg-rose-500/10'    },
    violet:  { border: 'border-violet-500/30', glow: 'shadow-violet-500/10', icon: 'text-violet-400',  bg: 'bg-violet-500/10'  },
  };
  const c = colorMap[color] || colorMap.gold;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`p-5 rounded-2xl bg-navy-900/80 border ${c.border} shadow-lg ${c.glow} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
      <div className={`text-3xl font-extrabold ${c.icon} mb-0.5`}>{value}</div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
    </motion.div>
  );
};

// ─── Status Progress Bar ──────────────────────────────────────────────────────
const StatusBar: React.FC<{ label: string; count: number; total: number; color: string }> = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-semibold w-20 shrink-0 ${color}`}>{label}</span>
      <div className="flex-1 h-1.5 bg-navy-900 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
      <span className="text-xs font-bold text-slate-300 w-8 text-right">{count}</span>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const { user, sessionToken } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Enquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [newStatus, setNewStatus] = useState<EnquiryStatus>('Pending');
  const [adminResponse, setAdminResponse] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [statsRes, enquiriesRes] = await Promise.all([
      api.getAdminStats(sessionToken || undefined, user?.id),
      api.getAdminEnquiries(undefined, sessionToken || undefined, user?.id),
    ]);
    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    if (enquiriesRes.success && enquiriesRes.data) setEnquiries(enquiriesRes.data);
    setLoading(false);
  }, [user, sessionToken]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('Refreshed', 'Data updated successfully', 'success');
  };

  const handleOpenManage = (e: Enquiry) => {
    setSelectedEnquiry(e);
    setNewStatus(e.status);
    setAdminResponse(e.admin_response || '');
    setAdminNotes(e.admin_notes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await api.updateEnquiryStatus(
        selectedEnquiry.id,
        { status: newStatus, admin_response: adminResponse, admin_notes: adminNotes },
        sessionToken || undefined, user?.id
      );
      if (res.success) {
        showToast('Updated!', `Status → ${newStatus}`, 'success');
        setEnquiries((prev) =>
          prev.map((e) => e.id === selectedEnquiry.id ? { ...e, status: newStatus, admin_response: adminResponse, admin_notes: adminNotes } : e)
        );
        if (stats) {
          const statusCounts: Record<string, number> = {};
          enquiries.forEach((e) => {
            const s = e.id === selectedEnquiry.id ? newStatus : e.status;
            statusCounts[s] = (statusCounts[s] || 0) + 1;
          });
          setStats({ ...stats, pending: statusCounts['Pending'] || 0, reviewing: statusCounts['Reviewing'] || 0, contacted: statusCounts['Contacted'] || 0, responded: statusCounts['Responded'] || 0, approved: statusCounts['Approved'] || 0, closed: statusCounts['Closed'] || 0 });
        }
        setSelectedEnquiry(null);
      } else {
        showToast('Failed', res.message || 'Error updating status', 'error');
      }
    } catch {
      showToast('Error', 'Unable to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const res = await api.deleteEnquiry(deleteConfirm.id, sessionToken || undefined, user?.id);
      if (res.success) {
        showToast('Deleted', `Enquiry ${deleteConfirm.id} removed`, 'success');
        setEnquiries((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
        if (stats) setStats({ ...stats, totalEnquiries: stats.totalEnquiries - 1 });
        setDeleteConfirm(null);
      } else {
        showToast('Failed', 'Could not delete enquiry', 'error');
      }
    } catch {
      showToast('Error', 'Delete operation failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    api.exportEnquiriesCSV(enquiries);
    showToast('Export Ready', `${enquiries.length} enquiries exported to CSV`, 'success');
  };

  const handleExportPDF = () => {
    exportEnquiriesPDF(enquiries);
    showToast('Export Ready', `${enquiries.length} enquiries exported to PDF`, 'success');
  };

  const recentEnquiries = enquiries.slice(0, 6);
  const totalForBar = stats?.totalEnquiries || 1;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* ── Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl glass-panel border border-gold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Shield className="w-4 h-4" /> Admin Command Center
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Noventra Administration Portal
          </h1>
          <p className="text-sm text-slate-300">
            Welcome back, <span className="text-gold-400 font-semibold">{user?.full_name}</span>. 
            Manage admissions, users and school operations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-navy-800 border border-slate-700 hover:bg-navy-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>
          <Link
            to="/admin/enquiries"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all"
          >
            All Enquiries <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-navy-800 border border-slate-700 hover:bg-navy-700 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" /> Users
          </Link>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Users" value={stats?.totalUsers ?? '—'} subtitle="Registered" icon={Users} color="gold" delay={0.05} />
        <StatCard title="Total Enquiries" value={stats?.totalEnquiries ?? '—'} subtitle="All time" icon={FileText} color="sky" delay={0.1} />
        <StatCard title="Pending" value={stats?.pending ?? '—'} subtitle="Need action" icon={Clock} color="amber" delay={0.15} />
        <StatCard title="Reviewing" value={stats?.reviewing ?? '—'} subtitle="In progress" icon={TrendingUp} color="violet" delay={0.2} />
        <StatCard title="Responded" value={(stats?.responded ?? 0) + (stats?.contacted ?? 0)} subtitle="Active replies" icon={MessageSquare} color="emerald" delay={0.25} />
        <StatCard title="Approved" value={stats?.approved ?? '—'} subtitle="Admissions" icon={CheckCircle2} color="rose" delay={0.3} />
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-gold-400" />
            <h2 className="text-sm font-bold text-white">Status Distribution</h2>
          </div>
          <div className="space-y-3">
            <StatusBar label="Pending"   count={stats?.pending    ?? 0} total={totalForBar} color="text-amber-400"   />
            <StatusBar label="Reviewing" count={stats?.reviewing  ?? 0} total={totalForBar} color="text-violet-400"  />
            <StatusBar label="Contacted" count={stats?.contacted  ?? 0} total={totalForBar} color="text-sky-400"     />
            <StatusBar label="Responded" count={stats?.responded  ?? 0} total={totalForBar} color="text-emerald-400" />
            <StatusBar label="Approved"  count={stats?.approved   ?? 0} total={totalForBar} color="text-gold-400"    />
            <StatusBar label="Closed"    count={stats?.closed     ?? 0} total={totalForBar} color="text-slate-400"   />
          </div>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Total</span>
            <span className="text-white font-bold">{stats?.totalEnquiries ?? 0} enquiries</span>
          </div>
        </motion.div>

        {/* Quick Actions + Recent */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 flex flex-col"
        >
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading enquiries...</div>
            ) : recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No enquiries found.</div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {recentEnquiries.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-navy-800/40 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-navy-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-gold-400 shrink-0">
                      {e.student_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{e.student_name}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {e.interested_class} · {e.parent_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={e.status} />
                      <button
                        onClick={() => handleOpenManage(e)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-gold-400 border border-slate-700 hover:border-gold-400 transition-all"
                        title="Manage"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(e)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-500 hover:text-white text-slate-400 border border-slate-700 hover:border-rose-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Manage Modal ── */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title={`Manage Enquiry — ${selectedEnquiry?.id}`}
      >
        {selectedEnquiry && (
          <div className="space-y-5 text-xs">
            {/* Header Info */}
            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-sm font-bold text-white">{selectedEnquiry.student_name}</h4>
                <StatusBadge status={selectedEnquiry.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <span><span className="text-slate-500">Parent:</span> <strong className="text-white">{selectedEnquiry.parent_name}</strong></span>
                <span><span className="text-slate-500">Age:</span> {selectedEnquiry.student_age}</span>
                <span><span className="text-slate-500">Email:</span> {selectedEnquiry.email}</span>
                <span><span className="text-slate-500">Mobile:</span> {selectedEnquiry.mobile_number}</span>
                <span><span className="text-slate-500">Current Class:</span> {selectedEnquiry.current_class}</span>
                <span><span className="text-slate-500">Interested In:</span> <span className="text-gold-400 font-semibold">{selectedEnquiry.interested_class}</span></span>
                <span><span className="text-slate-500">Contact Via:</span> {selectedEnquiry.preferred_contact_method}</span>
                <span><span className="text-slate-500">Submitted:</span> {new Date(selectedEnquiry.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Original Message */}
            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">Parent's Message</label>
              <p className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 text-slate-300 italic leading-relaxed">
                "{selectedEnquiry.message}"
              </p>
            </div>

            {/* Change Status */}
            <div>
              <label className="block font-bold text-slate-200 mb-2">Change Enquiry Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              >
                <option value="Pending">⏳ Pending (Received, not yet reviewed)</option>
                <option value="Reviewing">🔍 Reviewing (Under evaluation)</option>
                <option value="Contacted">📞 Contacted (Spoken to parent)</option>
                <option value="Responded">💬 Responded (Official reply sent)</option>
                <option value="Approved">✅ Approved (Seat / Interview confirmed)</option>
                <option value="Closed">🔒 Closed (Archived)</option>
              </select>
            </div>

            {/* Official Response */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Official Response <span className="text-emerald-400 font-normal">(Visible to parent in real-time)</span>
              </label>
              <textarea
                rows={3}
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="e.g. Thank you for your interest! We invite you to visit our campus on Thursday at 10 AM..."
                className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
              />
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Internal Admin Notes <span className="text-rose-400 font-normal">(Private — admins only)</span>
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Scholarship eligibility, follow-up reminders, counsellor notes..."
                className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setSelectedEnquiry(null); setDeleteConfirm(selectedEnquiry); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 border border-rose-500/30 transition-all text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Enquiry
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-navy-800 border border-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleSaveStatus}
                  className="px-5 py-2 rounded-xl font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 disabled:opacity-50 text-xs"
                >
                  {updating ? 'Saving…' : 'Save & Publish'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        {deleteConfirm && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Delete Enquiry {deleteConfirm.id}?</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong>{deleteConfirm.student_name}</strong> — {deleteConfirm.interested_class}. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-slate-300 bg-navy-800 text-xs border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-xs"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
