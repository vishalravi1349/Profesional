import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, User } from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin',          exact: true  },
  { icon: FileText,        label: 'Enquiries', path: '/admin/enquiries',exact: false },
  { icon: Users,           label: 'Users',     path: '/admin/users',    exact: false },
  { icon: User,            label: 'Profile',   path: '/admin/profile',  exact: false },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Sidebar — visible on xl+ screens */}
      <AdminSidebar />

      {/* Main Content — offset by sidebar width on xl */}
      <div className="xl:pl-56">
        <Outlet />
      </div>

      {/* Bottom Mobile Tab Bar — visible below xl */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-xl border-t border-slate-800/70 flex items-center justify-around px-2 py-2 safe-bottom">
        {mobileNavItems.map(({ icon: Icon, label, path, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-[10px] font-semibold ${
                isActive
                  ? 'text-gold-400 bg-gold-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Spacer so page content is not hidden by bottom nav on mobile */}
      <div className="xl:hidden h-20" />
    </div>
  );
};
