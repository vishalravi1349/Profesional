export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 
  | 'Pending'
  | 'Reviewing'
  | 'Contacted'
  | 'Responded'
  | 'Approved'
  | 'Closed';

export interface Enquiry {
  id: string;
  user_id?: string | null;
  student_name: string;
  parent_name: string;
  mobile_number: string;
  email: string;
  student_age: number;
  current_class: string;
  interested_class: string;
  preferred_contact_method: 'Email' | 'Phone' | 'WhatsApp';
  message: string;
  status: EnquiryStatus;
  admin_response?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalEnquiries: number;
  pending: number;
  reviewing: number;
  contacted: number;
  responded: number;
  approved: number;
  closed: number;
  totalUsers: number;
}
