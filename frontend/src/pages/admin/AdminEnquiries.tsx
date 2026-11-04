import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Download, RefreshCw, Eye, Trash2, XCircle,
  ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2, FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Enquiry, EnquiryStatus } from '../../types';
import { exportEnquiriesPDF } from '../../utils/exportPDF';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';

const STATUS_OPTIONS: (EnquiryStatus | 'All')[] = ['All', 'Pending', 'Reviewing', 'Contacted', 'Responded', 'Approved', 'Closed'];

const STATUS_COLORS: Record<string, string> = {
  All:       'bg-slate-700 text-slate-200 border-slate-600',
  Pending:   'bg-amber-500/15 text-amber-400 border-amber-500/40',
  Reviewing: 'bg-violet-500/15 text-violet-400 border-violet-500/40',
  Contacted: 'bg-sky-500/15 text-sky-400 border-sky-500/40',
  Responded: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  Approved:  'bg-gold-500/15 text-gold-400 border-gold-500/40',
  Closed:    'bg-slate-700/40 text-slate-400 border-slate-700',
};

export const AdminEnquiries: React.FC = () => {
  const { user, sessionToken } = useAuth();
  const { showToast } = useToast();

  const [enquiries, setEnquiries]         = useState<Enquiry[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState<string>('All');
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage                       = 10;

  // Manage modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [newStatus, setNewStatus]             = useState<EnquiryStatus>('Pending');
  const [adminResponse, setAdminResponse]     = useState('');
  const [adminNotes, setAdminNotes]           = useState('');
  const [updating, setUpdating]               = useState(false);

  // Delete modal
  const [deleteConfirm, setDeleteConfirm] = useState<Enquiry | null>(null);
  const [deleting, setDeleting]           = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await api.getAdminEnquiries(undefined, sessionToken || undefined, user?.id);
    if (res.success && res.data) setEnquiries(res.data);
    setLoading(false);
  }, [user, sessionToken]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('Refreshed', 'Enquiries updated', 'success');
  };

  // ── Filtering & Pagination ─────────────────────────────────────────────────
  const filtered = enquiries.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      e.id.toLowerCase().includes(q) ||
      e.student_name.toLowerCase().includes(q) ||
      e.parent_name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.mobile_number.includes(q);
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changeFilter = (f: string) => { setStatusFilter(f); setCurrentPage(1); };
  const changeSearch = (v: string) => { setSearchTerm(v); setCurrentPage(1); };

  // ── Modal Handlers ─────────────────────────────────────────────────────────
  const openManage = (e: Enquiry) => {
    setSelectedEnquiry(e);
    setNewStatus(e.status);
    setAdminResponse(e.admin_response || '');
    setAdminNotes(e.admin_notes || '');
  };

  const handleSave = async () => {
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
          prev.map((e) =>
            e.id === selectedEnquiry.id
              ? { ...e, status: newStatus, admin_response: adminResponse, admin_notes: adminNotes }
              : e
          )
        );
        setSelectedEnquiry(null);
      } else {
        showToast('Failed', res.message || 'Update error', 'error');
      }
    } catch {
      showToast('Error', 'Could not update enquiry.', 'error');
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
        setDeleteConfirm(null);
      } else {
        showToast('Failed', 'Could not delete enquiry', 'error');
      }
    } catch {
      showToast('Error', 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    api.exportEnquiriesCSV(filtered);
    showToast('Export Ready', `${filtered.length} enquiries exported to CSV`, 'success');
  };

  const handleExportPDF = () => {
    exportEnquiriesPDF(filtered);
    showToast('Export Ready', `${filtered.length} enquiries exported to PDF`, 'success');
  };

  // ── Status count badges ────────────────────────────────────────────────────
  const countByStatus = (s: string) =>
    s === 'All' ? enquiries.length : enquiries.filter((e) => e.status === s).length;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
              All Admission Enquiries
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {filtered.length} enquiries · Filter, search and manage all applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-navy-800 border border-slate-700 hover:bg-navy-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
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
        </div>
      </div>

      {/* ── Status Filter Tabs ── */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => changeFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              statusFilter === s
                ? STATUS_COLORS[s]
                : 'bg-navy-900 text-slate-400 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            {s} ({countByStatus(s)})
          </button>
        ))}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search by ID, student, parent, email, mobile..."
          value={searchTerm}
          onChange={(e) => changeSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:border-gold-500 focus:outline-none transition-colors"
        />
      </div>

      {/* ── Table ── */}
      <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Enquiry ID</th>
                <th className="px-5 py-4">Student & Parent</th>
                <th className="px-5 py-4">Grade Interest</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Loading enquiries...
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No enquiries match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((e, i) => (
                  <AnimatePresence key={e.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-navy-800/40 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-gold-400">{e.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-navy-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-gold-400 shrink-0">
                            {e.student_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{e.student_name}</div>
                            <div className="text-slate-400 text-[11px]">👤 {e.parent_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-200">{e.interested_class}</div>
                        <div className="text-slate-500 text-[11px]">Age {e.student_age} · from {e.current_class}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-300">{e.email}</div>
                        <div className="text-slate-500 text-[11px]">{e.mobile_number}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(e.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={e.status} />
                        {e.admin_response && (
                          <span title="Response sent">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-1" />
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openManage(e)}
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
                      </td>
                    </motion.tr>
                  </AnimatePresence>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {paginated.length} of {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-navy-900 border border-slate-800 disabled:opacity-40 hover:bg-navy-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-navy-900 border border-slate-800 disabled:opacity-40 hover:bg-navy-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Manage Modal ── */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title={`Manage Enquiry — ${selectedEnquiry?.id}`}
      >
        {selectedEnquiry && (
          <div className="space-y-5 text-xs">
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
                <span><span className="text-slate-500">Applying For:</span> <span className="text-gold-400 font-semibold">{selectedEnquiry.interested_class}</span></span>
                <span><span className="text-slate-500">Preferred Contact:</span> {selectedEnquiry.preferred_contact_method}</span>
                <span><span className="text-slate-500">Submitted:</span> {new Date(selectedEnquiry.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">Parent's Message</label>
              <p className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 text-slate-300 italic leading-relaxed">
                "{selectedEnquiry.message}"
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-2">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-gold-500/40 text-white text-sm focus:outline-none"
              >
                <option value="Pending">⏳ Pending</option>
                <option value="Reviewing">🔍 Reviewing</option>
                <option value="Contacted">📞 Contacted</option>
                <option value="Responded">💬 Responded</option>
                <option value="Approved">✅ Approved</option>
                <option value="Closed">🔒 Closed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Official Response <span className="text-emerald-400 font-normal">(Visible to parent)</span>
              </label>
              <textarea
                rows={3}
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Type your official response to the parent..."
                className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Internal Notes <span className="text-rose-400 font-normal">(Admin only)</span>
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Scholarship eligibility, follow-up reminders..."
                className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs focus:border-gold-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setSelectedEnquiry(null); setDeleteConfirm(selectedEnquiry); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 border border-rose-500/30 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <div className="flex gap-2">
                <button onClick={() => setSelectedEnquiry(null)} className="px-4 py-2 rounded-xl text-slate-300 bg-navy-800 border border-slate-700 text-xs">Cancel</button>
                <button
                  disabled={updating}
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 disabled:opacity-50 text-xs"
                >
                  {updating ? 'Saving…' : 'Save & Publish'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal isOpen={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} title="Confirm Delete">
        {deleteConfirm && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Delete {deleteConfirm.id}?</p>
                <p className="text-xs text-slate-300 mt-0.5">{deleteConfirm.student_name} — {deleteConfirm.interested_class}. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl text-slate-300 bg-navy-800 text-xs border border-slate-700">Cancel</button>
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
