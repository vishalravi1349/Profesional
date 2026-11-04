import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, User, LogOut, Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminSidebarProps {
  collapsed?: boolean;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin',           exact: true  },
  { icon: FileText,        label: 'Enquiries',   path: '/admin/enquiries', exact: false },
  { icon: Users,           label: 'Users',       path: '/admin/users',     exact: false },
  { icon: User,            label: 'My Profile',  path: '/admin/profile',   exact: false },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full w-56 z-30 bg-navy-950/95 border-r border-slate-800/70 backdrop-blur-xl pt-24 pb-6">
      {/* Admin Brand */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-navy-950" />
          </div>
          <div>
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">Admin</div>
            <div className="text-[10px] text-slate-400 truncate max-w-[90px]">{user?.full_name}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, path, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
