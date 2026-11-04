import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Send, Eye, Lock, RefreshCw, Layers, ShieldAlert } from 'lucide-react';

export const UserEnquiries: React.FC = () => {
  const { user, sessionToken } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pollingActive, setPollingActive] = useState(true);

  const loadData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const res = await api.getEnquiryQueue(sessionToken || undefined, user?.id);
    if (res.success && res.data) {
      setQueue(res.data);
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    loadData(true);
  }, [user, sessionToken]);

  // Set up polling interval to fetch data every 5 seconds for real-time updates
  useEffect(() => {
    if (!pollingActive) return;
    const interval = setInterval(() => {
      loadData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [user, sessionToken, pollingActive]);

  // Whether this user owns any enquiry in the queue
  const hasOwnEnquiry = queue.some((e) => e.is_owner);

  // Calculate my active queue items (only meaningful when hasOwnEnquiry is true)
  const myActiveEnquiries = queue.filter(
    (e) => e.is_owner && e.queue_position !== null && e.queue_position !== undefined
  );

  // Access-restricted gate view
  if (!loading && !hasOwnEnquiry) {
    return (
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 inline-flex">
          <ShieldAlert className="w-14 h-14 text-rose-400" />
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white">
          Access Restricted
        </h1>
        <p className="text-slate-300 text-sm max-w-md leading-relaxed">
          The <span className="text-gold-400 font-bold">Live Admission Queue</span> is only accessible to registered users who have submitted at least one enquiry to Noventra School.
        </p>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-left space-y-3 w-full max-w-md">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">To gain access:</p>
          <ol className="space-y-2 text-xs text-slate-300 list-none">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-400 text-[10px] font-bold flex items-center justify-center">1</span>
              Sign up or log in to your Noventra account.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-400 text-[10px] font-bold flex items-center justify-center">2</span>
              Submit an admission enquiry via the Enquiry form.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-400 text-[10px] font-bold flex items-center justify-center">3</span>
              Return here to track your live queue position and admin response.
            </li>
          </ol>
        </div>
        <Link
          to="/enquiry"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-2xl shadow-gold-500/25 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Send className="w-4 h-4" /> Submit Your Enquiry Now
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-gold-400 transition-colors"
        >
          ← Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-white">Live Admission Queue</h1>
          <p className="text-sm text-slate-300">
            View all current admission enquiries and track your live queue position.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-navy-900 border border-slate-800 hover:bg-navy-800 transition-colors"
            title="Refresh Queue"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload
          </button>
          <Link
            to="/enquiry"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors"
          >
            <Send className="w-4 h-4" /> New Enquiry
          </Link>
        </div>
      </div>

      {/* Queue Position Hero Alert Card */}
      {myActiveEnquiries.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-gold-500/20 via-gold-400/10 to-transparent border border-gold-400/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gold-400 text-navy-950">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Active Queue Position</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Your admission request is active in our processing queue. As admins respond and close preceding enquiries, your position updates automatically in real-time.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {myActiveEnquiries.map((e) => (
              <div
                key={e.id}
                className="px-5 py-3 rounded-2xl bg-navy-950/80 border border-gold-400/30 text-center min-w-[120px]"
              >
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {e.id}
                </div>
                <div className="text-2xl font-black text-gold-400 mt-0.5">
                  #{e.queue_position}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 bg-navy-900/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Global Enquiries Queue Flow
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Updates Active
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Queue Pos.</th>
                <th className="px-6 py-4">Enquiry ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Interested Class</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4 text-right">Action / Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading enquiries queue...
                  </td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No enquiries submitted yet.
                  </td>
                </tr>
              ) : (
                queue.map((e) => {
                  const isMine = e.is_owner;
                  return (
                    <tr
                      key={e.id}
                      className={`transition-colors ${
                        isMine
                          ? 'bg-gold-500/5 hover:bg-gold-500/10'
                          : 'hover:bg-navy-800/20'
                      }`}
                    >
                      <td className="px-6 py-4 font-bold">
                        {e.queue_position !== null && e.queue_position !== undefined ? (
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gold-400/10 text-gold-400 font-mono">
                            #{e.queue_position}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">Processed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-gold-400">{e.id}</td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {e.student_name}
                        {isMine && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-gold-400 text-navy-950 font-extrabold uppercase">
                            Mine
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{e.interested_class}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isMine ? (
                          <Link
                            to={`/dashboard/enquiries/${e.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-800 text-gold-400 font-bold hover:bg-gold-500 hover:text-navy-950 transition-colors border border-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Link>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-950 text-slate-500 font-bold border border-slate-900 cursor-not-allowed select-none"
                            title="Private Enquiry: Access is prohibited."
                          >
                            <Lock className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
