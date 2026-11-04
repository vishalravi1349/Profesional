import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Academics } from './pages/Academics';
import { Programs } from './pages/Programs';
import { Facilities } from './pages/Facilities';
import { Achievements } from './pages/Achievements';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Enquiry } from './pages/Enquiry';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// User Dashboard Pages
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { UserEnquiries } from './pages/dashboard/UserEnquiries';
import { EnquiryDetail } from './pages/dashboard/EnquiryDetail';
import { UserProfile } from './pages/dashboard/UserProfile';

// Admin Dashboard Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminEnquiryDetail } from './pages/admin/AdminEnquiryDetail';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminLogin } from './pages/admin/AdminLogin';

export const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col relative bg-navy-950 text-slate-100">
      {/* Animated Glowing & Floating Shape Background */}
      <AnimatedBackground />

      {/* Global Brand Navbar — hidden on admin pages (sidebar handles nav) */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content Viewport */}
      <main className="flex-1 relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected User Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/enquiries" element={<UserEnquiries />} />
            <Route path="/dashboard/enquiries/:id" element={<EnquiryDetail />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />
          </Route>

          {/* Protected Admin Routes — wrapped in AdminLayout (sidebar + mobile nav) */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/enquiries" element={<AdminEnquiries />} />
              <Route path="/admin/enquiries/:id" element={<AdminEnquiryDetail />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Footer — hidden on admin pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};
