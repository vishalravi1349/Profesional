import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, UserPlus, ArrowLeft, Shield, UserCheck, RefreshCw,
  Mail, Phone, Calendar, MoreHorizontal, X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UserProfile, UserRole } from '../../types';
import { Modal } from '../../components/Modal';

export const AdminUsers: React.FC = () => {
  const { user, sessionToken } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers]           = useState<UserProfile[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  // Role change modal
  const [roleTarget, setRoleTarget]   = useState<UserProfile | null>(null);
  const [targetRole, setTargetRole]   = useState<UserRole>('user');
  const [changingRole, setChangingRole] = useState(false);

  // Create user modal
  const [showCreate, setShowCreate]   = useState(false);
  const [newName, setNewName]         = useState('');
  const [newEmail, setNewEmail]       = useState('');
  const [newMobile, setNewMobile]     = useState('');
  const [newRole, setNewRole]         = useState<UserRole>('user');
  const [creating, setCreating]       = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await api.getAdminUsers(sessionToken || undefined, user?.id);
    if (res.success && res.data) setUsers(res.data);
    setLoading(false);
  }, [user, sessionToken]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
    showToast('Refreshed', 'User list updated', 'success');
  };

  // Filtering
  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.mobile_number || '').includes(q);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Role change
  const openRoleChange = (u: UserProfile) => {
    setRoleTarget(u);
    setTargetRole(u.role === 'admin' ? 'user' : 'admin');
  };

  const confirmRoleChange = async () => {
    if (!roleTarget) return;
    setChangingRole(true);
    try {
      const res = await api.updateUserRole(roleTarget.id, targetRole, sessionToken || undefined, user?.id);
      if (res.success) {
        showToast('Role Updated', `${roleTarget.full_name} is now ${targetRole}`, 'success');
        setUsers((prev) => prev.map((u) => u.id === roleTarget.id ? { ...u, role: targetRole } : u));
        setRoleTarget(null);
      } else {
        showToast('Failed', res.message || 'Role update failed', 'error');
      }
    } catch {
      showToast('Error', 'Role update failed', 'error');
    } finally {
      setChangingRole(false);
    }
  };

  // Create user
  const handleCreateUser = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Validation', 'Name and email are required', 'error');
      return;
    }
    setCreating(true);
    try {
      const res = await api.createAdminUser(
        { full_name: newName, email: newEmail, mobile_number: newMobile, role: newRole },
        sessionToken || undefined, user?.id
      );
      if (res.success && res.data) {
        showToast('Created!', `${res.data.full_name} added successfully`, 'success');
        setUsers((prev) => [res.data!, ...prev]);
        setShowCreate(false);
        setNewName(''); setNewEmail(''); setNewMobile(''); setNewRole('user');
      } else {
        showToast('Failed', res.message || 'Could not create user', 'error');
      }
    } catch {
      showToast('Error', 'User creation failed', 'error');
    } finally {
      setCreating(false);
    }
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount  = users.filter((u) => u.role === 'user').length;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">User Management</h1>
          </div>
          <p className="text-sm text-slate-400">
            {users.length} total accounts · {adminCount} admin{adminCount !== 1 ? 's' : ''} · {userCount} parent{userCount !== 1 ? 's' : ''}
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
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all shadow-lg"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Account
          </button>
        </div>
      </div>

      {/* ── Stat Chips ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-semibold text-gold-400">
          <Shield className="w-3.5 h-3.5 inline mr-1.5" />
          {adminCount} Admin{adminCount !== 1 ? 's' : ''}
        </div>
        <div className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs font-semibold text-sky-400">
          <UserCheck className="w-3.5 h-3.5 inline mr-1.5" />
          {userCount} Parent / Student{userCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'admin', 'user'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                roleFilter === r
                  ? r === 'admin'
                    ? 'bg-gold-500/15 text-gold-400 border-gold-500/40'
                    : r === 'user'
                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                    : 'bg-slate-700 text-slate-200 border-slate-600'
                  : 'bg-navy-900 text-slate-400 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {r === 'all' ? 'All Roles' : r === 'admin' ? '🛡 Admin' : '👤 User'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Users Table ── */}
      <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">User Profile</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Loading accounts...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No users match your search.</td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-navy-800/40 transition-colors"
                  >
                    {/* Profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold border shadow-md ${
                          u.role === 'admin'
                            ? 'bg-gold-500/20 border-gold-500/40 text-gold-400'
                            : 'bg-navy-800 border-slate-700 text-sky-400'
                        }`}>
                          {u.role === 'admin' ? <Shield className="w-4 h-4" /> : u.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.full_name}</div>
                          <div className="text-slate-500 text-[11px] font-mono">{u.id.slice(0, 12)}…</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3 h-3 text-slate-500" /> {u.email}
                      </div>
                      {u.mobile_number && (
                        <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" /> {u.mobile_number}
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        u.role === 'admin'
                          ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                          : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      }`}>
                        {u.role === 'admin' ? '🛡 Admin' : '👤 User'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      {u.id !== user?.id ? (
                        <button
                          onClick={() => openRoleChange(u)}
                          className={`flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                            u.role === 'admin'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white'
                              : 'bg-gold-500/10 text-gold-400 border-gold-500/30 hover:bg-gold-500 hover:text-navy-950'
                          }`}
                        >
                          {u.role === 'admin' ? <X className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {u.role === 'admin' ? 'Revoke Admin' : 'Promote to Admin'}
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[10px] italic">You (current session)</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Role Change Modal ── */}
      <Modal
        isOpen={Boolean(roleTarget)}
        onClose={() => setRoleTarget(null)}
        title={`Change Role — ${roleTarget?.full_name}`}
      >
        {roleTarget && (
          <div className="space-y-5">
            <div className={`p-4 rounded-2xl border ${
              targetRole === 'admin'
                ? 'bg-gold-500/10 border-gold-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}>
              <p className="text-sm font-semibold text-white mb-1">
                {targetRole === 'admin' ? '🛡 Promote to Admin?' : '⬇️ Revoke Admin Privileges?'}
              </p>
              <p className="text-xs text-slate-300">
                <strong>{roleTarget.full_name}</strong> ({roleTarget.email}) will be set to <strong className={targetRole === 'admin' ? 'text-gold-400' : 'text-sky-400'}>{targetRole}</strong>.
                {targetRole === 'admin' ? ' They will gain full admin panel access.' : ' They will lose all admin panel access.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setRoleTarget(null)} className="px-4 py-2 rounded-xl text-slate-300 bg-navy-800 border border-slate-700 text-xs">
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                disabled={changingRole}
                className={`px-5 py-2 rounded-xl font-bold text-xs disabled:opacity-50 transition-all ${
                  targetRole === 'admin'
                    ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 hover:from-gold-300'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {changingRole ? 'Updating…' : targetRole === 'admin' ? 'Confirm Promotion' : 'Confirm Revoke'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Create User Modal ── */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add New Account">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Full Name *</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Email Address *</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Mobile Number</label>
            <input
              type="text"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-200 mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {(['user', 'admin'] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all font-bold ${
                    newRole === r
                      ? r === 'admin'
                        ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                        : 'bg-sky-500/10 border-sky-500 text-sky-400'
                      : 'bg-navy-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="newRole"
                    value={r}
                    checked={newRole === r}
                    onChange={() => setNewRole(r)}
                    className="sr-only"
                  />
                  {r === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  {r === 'admin' ? 'Administrator' : 'Parent / User'}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-slate-300 bg-navy-800 border border-slate-700">Cancel</button>
            <button
              onClick={handleCreateUser}
              disabled={creating}
              className="px-5 py-2.5 rounded-xl font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
