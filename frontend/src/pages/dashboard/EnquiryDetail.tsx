import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtimeEnquiries } from '../../contexts/RealtimeContext';
import { Enquiry } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Timeline } from '../../components/Timeline';
import { ArrowLeft, FileText, User, Mail, Phone, Calendar, GraduationCap, MessageSquareQuote } from 'lucide-react';

export const EnquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, sessionToken } = useAuth();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const { subscribeToEnquiries } = useRealtimeEnquiries();

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      setLoading(true);
      const res = await api.getEnquiryById(id, sessionToken || undefined, user?.id, user?.role);
      if (res.success && res.data) {
        setEnquiry(res.data);
      }
      setLoading(false);
    };
    loadDetail();

    const unsubscribe = subscribeToEnquiries((updated) => {
      if (updated.id === id) {
        setEnquiry(updated);
      }
    });

    return () => unsubscribe();
  }, [id, user, sessionToken]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 text-center text-slate-400">
        Loading enquiry details...
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Enquiry Not Found</h2>
        <Link to="/dashboard/enquiries" className="text-gold-400 font-bold hover:underline">
          Back to Enquiries List
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        to="/dashboard/enquiries"
        className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Enquiries
      </Link>

      <div className="p-8 rounded-3xl glass-panel border border-gold-500/30 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-gold-400">{enquiry.id}</span>
            <h1 className="text-2xl font-heading font-extrabold text-white mt-1">
              Admission Enquiry: {enquiry.student_name}
            </h1>
            <p className="text-xs text-slate-400">Submitted on {new Date(enquiry.created_at).toLocaleString()}</p>
          </div>
          <StatusBadge status={enquiry.status} />
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Status Timeline Progression
          </h3>
          <Timeline currentStatus={enquiry.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-navy-900/80 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Parent / Guardian</span>
            <span className="font-semibold text-white text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-gold-400" /> {enquiry.parent_name}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Email & Phone</span>
            <span className="font-semibold text-white flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold-400" /> {enquiry.email}
            </span>
            <span className="text-slate-300 block mt-0.5">{enquiry.mobile_number}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Student Age & Current Class</span>
            <span className="font-semibold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" /> {enquiry.student_age} Yrs old • {enquiry.current_class}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Interested Grade / Program</span>
            <span className="font-semibold text-gold-400 text-sm">{enquiry.interested_class}</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Message / Request</h4>
          <p className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 text-slate-300 text-xs leading-relaxed">
            {enquiry.message}
          </p>
        </div>

        {/* Admin Response */}
        {enquiry.admin_response && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <MessageSquareQuote className="w-4 h-4" /> Official Noventra Admin Response:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "{enquiry.admin_response}"
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">
              Response updated on {new Date(enquiry.updated_at).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
