import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-supabase'));

console.log(`🔌 Supabase Database Connection Status: ${isSupabaseConfigured ? '⚡ CONFIGURED (Connected)' : '📝 IN-MEMORY FALLBACK'}`);

export const supabaseAdmin: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// In-Memory Storage Fallback for immediate out-of-the-box demo functionality
export const mockProfiles = new Map<string, any>([
  [
    'demo-admin-id',
    {
      id: 'demo-admin-id',
      full_name: 'Noventra Administrator',
      mobile_number: '+1 (555) 019-2834',
      email: 'admin@noventra.edu',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  [
    'demo-user-id',
    {
      id: 'demo-user-id',
      full_name: 'Sarah Jenkins',
      mobile_number: '+1 (555) 987-6543',
      email: 'sarah.j@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
]);

export const mockEnquiries = new Map<string, any>([
  [
    'ENQ-89210',
    {
      id: 'ENQ-89210',
      user_id: 'demo-user-id',
      student_name: 'Alex Jenkins',
      parent_name: 'Sarah Jenkins',
      mobile_number: '+1 (555) 987-6543',
      email: 'sarah.j@example.com',
      student_age: 14,
      current_class: 'Grade 8',
      interested_class: 'Grade 9 - STEM Track',
      preferred_contact_method: 'Email',
      message: 'Interested in the Advanced Robotics and AI program for the upcoming academic year. Would like to schedule a campus tour.',
      status: 'Responded',
      admin_response: 'Dear Sarah, thank you for your enquiry. We would be delighted to host you for a private campus tour this Thursday at 10 AM. Our STEM coordinator will meet with Alex.',
      admin_notes: 'High potential applicant for STEM scholarship. Priority follow-up.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
  [
    'ENQ-44129',
    {
      id: 'ENQ-44129',
      user_id: 'demo-user-id',
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
]);
