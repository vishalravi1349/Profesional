import { Enquiry, UserProfile, AdminStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getHeaders = (token?: string, userId?: string, role?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['x-user-id'] = userId;
  if (role) headers['x-user-role'] = role;
  return headers;
};

// ─── API Services ────────────────────────────────────────────────────────────
export const api = {

  // ── Submit new admission enquiry ──────────────────────────────────────────
  submitEnquiry: async (
    enquiryData: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>,
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data?: Enquiry; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: getHeaders(token, userId),
        body: JSON.stringify(enquiryData),
      });
      return await res.json();
    } catch {
      const mockId = `ENQ-${Math.floor(10000 + Math.random() * 90000)}`;
      const created: Enquiry = {
        ...enquiryData,
        id: mockId,
        user_id: userId || 'demo-user-id',
        status: 'Pending',
        admin_response: null,
        admin_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { success: true, data: created, message: 'Enquiry submitted (Demo Mode)!' };
    }
  },

  // ── Fetch enquiries for logged-in user ────────────────────────────────────
  getUserEnquiries: async (
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data: Enquiry[] }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        headers: getHeaders(token, userId),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'ENQ-89210',
            user_id: userId || 'demo-user-id',
            student_name: 'Alex Jenkins',
            parent_name: 'Sarah Jenkins',
            mobile_number: '+1 (555) 987-6543',
            email: 'sarah.j@example.com',
            student_age: 14,
            current_class: 'Grade 8',
            interested_class: 'Grade 9 - STEM Track',
            preferred_contact_method: 'Email',
            message: 'Interested in the Advanced Robotics and AI program for the upcoming academic year.',
            status: 'Responded',
            admin_response: 'Dear Sarah, thank you for your enquiry. We would be delighted to host you for a private campus tour this Thursday at 10 AM.',
            admin_notes: 'High potential applicant for STEM scholarship. Priority follow-up.',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: 'ENQ-44129',
            user_id: userId || 'demo-user-id',
            student_name: 'Maya Jenkins',
            parent_name: 'Sarah Jenkins',
            mobile_number: '+1 (555) 987-6543',
            email: 'sarah.j@example.com',
            student_age: 10,
            current_class: 'Grade 4',
            interested_class: 'Grade 5',
            preferred_contact_method: 'Phone',
            message: 'Looking for details on extracurricular arts and coding workshops for grade 5 students.',
            status: 'Pending',
            admin_response: null,
            admin_notes: null,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
        ],
      };
    }
  },

  // ── Fetch the public enquiries queue (includes positions & anonymized entries) ──
  getEnquiryQueue: async (
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data: any[] }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/queue`, {
        headers: getHeaders(token, userId),
      });
      return await res.json();
    } catch {
      // Mock queue fallback
      return {
        success: true,
        data: [
          {
            id: 'ENQ-89210',
            student_name: 'Alex Jenkins',
            parent_name: 'Sarah Jenkins',
            interested_class: 'Grade 9 - STEM Track',
            status: 'Responded',
            admin_response: 'Response sent',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            queue_position: null,
            is_owner: true,
          },
          {
            id: 'ENQ-72183',
            student_name: 'Anonymous Student',
            parent_name: '***',
            interested_class: 'Grade 7 - Science Honors',
            status: 'Reviewing',
            admin_response: null,
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            queue_position: 1,
            is_owner: false,
          },
          {
            id: 'ENQ-44129',
            student_name: 'Maya Jenkins',
            parent_name: 'Sarah Jenkins',
            interested_class: 'Grade 5',
            status: 'Pending',
            admin_response: null,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            queue_position: 2,
            is_owner: true,
          },
          {
            id: 'ENQ-58732',
            student_name: 'Anonymous Student',
            parent_name: '***',
            interested_class: 'Grade 3',
            status: 'Contacted',
            admin_response: null,
            created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
            queue_position: 3,
            is_owner: false,
          },
        ],
      };
    }
  },

  // ── Fetch single enquiry details ──────────────────────────────────────────
  getEnquiryById: async (
    id: string,
    token?: string,
    userId?: string,
    role?: string
  ): Promise<{ success: boolean; data?: Enquiry }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        headers: getHeaders(token, userId, role),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        data: {
          id,
          user_id: userId || 'demo-user-id',
          student_name: 'Alex Jenkins',
          parent_name: 'Sarah Jenkins',
          mobile_number: '+1 (555) 987-6543',
          email: 'sarah.j@example.com',
          student_age: 14,
          current_class: 'Grade 8',
          interested_class: 'Grade 9 - STEM Track',
          preferred_contact_method: 'Email',
          message: 'Interested in the Advanced Robotics and AI program for the upcoming academic year.',
          status: 'Responded',
          admin_response: 'Dear Sarah, thank you for your enquiry. We would be delighted to host you on Thursday at 10 AM.',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      };
    }
  },

  // ── Admin: Get overview stats ─────────────────────────────────────────────
  getAdminStats: async (
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data: AdminStats }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: getHeaders(token, userId, 'admin'),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        data: { totalEnquiries: 18, pending: 5, reviewing: 3, contacted: 4, responded: 4, approved: 2, closed: 0, totalUsers: 14 },
      };
    }
  },

  // ── Admin: Get all enquiries ──────────────────────────────────────────────
  getAdminEnquiries: async (
    params?: { status?: string; search?: string },
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data: Enquiry[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      const res = await fetch(`${API_BASE_URL}/api/admin/enquiries?${queryParams.toString()}`, {
        headers: getHeaders(token, userId, 'admin'),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'ENQ-89210', user_id: 'demo-user-id', student_name: 'Alex Jenkins',
            parent_name: 'Sarah Jenkins', mobile_number: '+1 (555) 987-6543', email: 'sarah.j@example.com',
            student_age: 14, current_class: 'Grade 8', interested_class: 'Grade 9 - STEM Track',
            preferred_contact_method: 'Email', message: 'Interested in the Advanced Robotics and AI program.',
            status: 'Responded', admin_response: 'Dear Sarah, thank you. We look forward to meeting you Thursday.',
            admin_notes: 'Scholarship applicant.', created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: 'ENQ-44129', user_id: 'demo-user-id', student_name: 'Maya Jenkins',
            parent_name: 'Sarah Jenkins', mobile_number: '+1 (555) 987-6543', email: 'sarah.j@example.com',
            student_age: 10, current_class: 'Grade 4', interested_class: 'Grade 5',
            preferred_contact_method: 'Phone', message: 'Looking for details on extracurricular arts.',
            status: 'Pending', admin_response: null, admin_notes: null,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(), updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
          {
            id: 'ENQ-72183', user_id: 'demo-user-id', student_name: 'Rohan Mehta',
            parent_name: 'Priya Mehta', mobile_number: '+91 98765 43210', email: 'priya.m@example.com',
            student_age: 12, current_class: 'Grade 6', interested_class: 'Grade 7 - Science Honors',
            preferred_contact_method: 'WhatsApp', message: 'We are very impressed with the school curriculum. Would like to get admission details.',
            status: 'Reviewing', admin_response: null, admin_notes: 'Promising candidate. Schedule interview.',
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(), updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'ENQ-31904', user_id: 'demo-user-id', student_name: 'Ananya Sharma',
            parent_name: 'Deepak Sharma', mobile_number: '+91 91234 56789', email: 'deepak.s@example.com',
            student_age: 16, current_class: 'Grade 10', interested_class: 'Grade 11 - Commerce Stream',
            preferred_contact_method: 'Phone', message: 'Looking for details on commerce stream with Economics and Accounts.',
            status: 'Approved', admin_response: 'Congratulations! Your admission has been approved. Please visit the office with documents.',
            admin_notes: 'Merit scholarship eligible.', created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
          },
          {
            id: 'ENQ-58732', user_id: 'demo-user-id', student_name: 'Arjun Patel',
            parent_name: 'Kavita Patel', mobile_number: '+1 (555) 321-7654', email: 'kavita.p@example.com',
            student_age: 8, current_class: 'Grade 2', interested_class: 'Grade 3',
            preferred_contact_method: 'Email', message: 'We recently moved to this area and are looking for a school with strong foundational programs.',
            status: 'Contacted', admin_response: null, admin_notes: 'Called parent. Scheduled campus tour for next week.',
            created_at: new Date(Date.now() - 3600000 * 8).toISOString(), updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
          },
        ],
      };
    }
  },

  // ── Admin: Update enquiry status & response ───────────────────────────────
  updateEnquiryStatus: async (
    id: string,
    payload: { status?: string; admin_response?: string; admin_notes?: string },
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data?: Enquiry; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: getHeaders(token, userId, 'admin'),
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        message: 'Enquiry updated (Demo Mode)',
        data: {
          id, user_id: 'demo-user-id', student_name: 'Demo Student', parent_name: 'Demo Parent',
          mobile_number: '', email: '', student_age: 12, current_class: 'Grade 6', interested_class: 'Grade 7',
          preferred_contact_method: 'Email', message: '',
          status: (payload.status as any) || 'Responded',
          admin_response: payload.admin_response || '',
          admin_notes: payload.admin_notes || '',
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        },
      };
    }
  },

  // ── Admin: Delete enquiry ─────────────────────────────────────────────────
  deleteEnquiry: async (
    id: string,
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token, userId, 'admin'),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Enquiry deleted (Demo Mode)' };
    }
  },

  // ── Admin: Get users list ─────────────────────────────────────────────────
  getAdminUsers: async (
    token?: string,
    userId?: string
  ): Promise<{ success: boolean; data: UserProfile[] }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: getHeaders(token, userId, 'admin'),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'demo-admin-id', full_name: 'Noventra Administrator', mobile_number: '+1 (555) 019-2834',
            email: 'admin@noventra.edu', role: 'admin',
            created_at: new Date(Date.now() - 86400000 * 30).toISOString(), updated_at: new Date().toISOString(),
          },
          {
            id: 'demo-user-id', full_name: 'Sarah Jenkins', mobile_number: '+1 (555) 987-6543',
            email: 'sarah.j@example.com', role: 'user',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(), updated_at: new Date().toISOString(),
          },
          {
            id: 'usr-priya001', full_name: 'Priya Mehta', mobile_number: '+91 98765 43210',
            email: 'priya.m@example.com', role: 'user',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date().toISOString(),
          },
          {
            id: 'usr-deepak02', full_name: 'Deepak Sharma', mobile_number: '+91 91234 56789',
            email: 'deepak.s@example.com', role: 'user',
            created_at: new Date(Date.now() - 86400000 * 4).toISOString(), updated_at: new Date().toISOString(),
          },
        ],
      };
    }
  },

  // ── Admin: Update user role ───────────────────────────────────────────────
  updateUserRole: async (
    targetUserId: string,
    role: 'admin' | 'user',
    token?: string,
    adminId?: string
  ): Promise<{ success: boolean; data?: UserProfile; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${targetUserId}/role`, {
        method: 'PATCH',
        headers: getHeaders(token, adminId, 'admin'),
        body: JSON.stringify({ role }),
      });
      return await res.json();
    } catch {
      return { success: true, message: `Role updated to ${role} (Demo Mode)` };
    }
  },

  // ── Admin: Create new user account ───────────────────────────────────────
  createAdminUser: async (
    userData: { full_name: string; email: string; mobile_number?: string; role: 'user' | 'admin' },
    token?: string,
    adminId?: string
  ): Promise<{ success: boolean; data?: UserProfile; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: getHeaders(token, adminId, 'admin'),
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch {
      const newUser: UserProfile = {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        full_name: userData.full_name,
        email: userData.email,
        mobile_number: userData.mobile_number || '',
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { success: true, data: newUser, message: 'User created (Demo Mode)' };
    }
  },

  // ── Admin: Export enquiries as CSV (client-side) ──────────────────────────
  exportEnquiriesCSV: (enquiries: Enquiry[]): void => {
    const headers = [
      'Enquiry ID', 'Student Name', 'Parent Name', 'Email', 'Mobile',
      'Age', 'Current Class', 'Interested Class', 'Contact Preference',
      'Status', 'Message', 'Admin Response', 'Date Submitted', 'Last Updated',
    ];
    const rows = enquiries.map((e) => [
      e.id, e.student_name, e.parent_name, e.email, e.mobile_number,
      e.student_age, e.current_class, e.interested_class, e.preferred_contact_method,
      e.status,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${(e.admin_response || '').replace(/"/g, '""')}"`,
      new Date(e.created_at).toLocaleDateString(),
      new Date(e.updated_at).toLocaleDateString(),
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `noventra-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },
};
