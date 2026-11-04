import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Enquiry, EnquiryStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { ArrowLeft, User, Mail, Phone, Calendar, GraduationCap, Save } from 'lucide-react';

export const AdminEnquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, sessionToken } = useAuth();
  const { showToast } = useToast();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  const [newStatus, setNewStatus] = useState<EnquiryStatus>('Pending');
  const [adminResponse, setAdminResponse] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      setLoading(true);
      const res = await api.getEnquiryById(id, sessionToken || undefined, user?.id, 'admin');
      if (res.success && res.data) {
        setEnquiry(res.data);
        setNewStatus(res.data.status);
        setAdminResponse(res.data.admin_response || '');
        setAdminNotes(res.data.admin_notes || '');
      }
      setLoading(false);
    };
    loadDetail();
  }, [id, user, sessionToken]);

  const handleSave = async () => {
    if (!id) return;
    setUpdating(true);
    const res = await api.updateEnquiryStatus(
      id,
      { status: newStatus, admin_response: adminResponse, admin_notes: adminNotes },
      sessionToken || undefined,
      user?.id
    );
    if (res.success && res.data) {
      showToast('Success', 'Enquiry updated and pushed to Supabase Realtime', 'success');
      setEnquiry(res.data);
    } else {
      showToast('Error', 'Failed to update enquiry', 'error');
    }
    setUpdating(false);
  };

  if (loading) return <div className="pt-28 pb-20 text-center text-slate-400">Loading details...</div>;
  if (!enquiry) return <div className="pt-28 pb-20 text-center text-slate-400">Enquiry not found.</div>;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link to="/admin/enquiries" className="inline-flex items-center gap-2 text-xs font-bold text-gold-400">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Enquiries
      </Link>

      <div className="p-8 rounded-3xl glass-panel border border-gold-500/30 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-gold-400">{enquiry.id}</span>
            <h1 className="text-2xl font-heading font-bold text-white mt-1">{enquiry.student_name}</h1>
          </div>
          <StatusBadge status={enquiry.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Parent / Guardian</span>
            <span className="font-semibold text-white text-sm">{enquiry.parent_name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Email & Mobile</span>
            <span className="font-semibold text-white">{enquiry.email} • {enquiry.mobile_number}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="block font-bold text-slate-200 mb-2">Update Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as EnquiryStatus)}
              className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Contacted">Contacted</option>
              <option value="Responded">Responded</option>
              <option value="Approved">Approved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Official Response (Realtime Sync)</label>
            <textarea
              rows={3}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="w-full p-3 rounded-xl bg-navy-900 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1">Internal Admin Notes</label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-navy-900 border border-slate-700 text-white"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={updating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-navy-950 bg-gold-400 hover:bg-gold-300"
          >
            <Save className="w-4 h-4" /> {updating ? 'Saving...' : 'Save & Publish Response'}
          </button>
        </div>
      </div>
    </div>
  );
};
