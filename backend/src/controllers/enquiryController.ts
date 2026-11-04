import { Response } from 'express';
import { AuthRequest } from '../types';
import { supabaseAdmin, isSupabaseConfigured, mockEnquiries } from '../services/supabase';

// Generate unique custom Enquiry ID: ENQ-XXXXX
const generateEnquiryId = (): string => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ENQ-${randomNum}`;
};

export const createEnquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      student_name,
      parent_name,
      mobile_number,
      email,
      student_age,
      current_class,
      interested_class,
      preferred_contact_method,
      message,
    } = req.body;

    const enquiryId = generateEnquiryId();
    const userId = req.user?.id || null;

    const enquiryPayload = {
      id: enquiryId,
      user_id: userId,
      student_name,
      parent_name,
      mobile_number,
      email,
      student_age: Number(student_age),
      current_class,
      interested_class,
      preferred_contact_method: preferred_contact_method || 'Email',
      message,
      status: 'Pending',
      admin_response: null,
      admin_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured || !supabaseAdmin) {
      mockEnquiries.set(enquiryId, enquiryPayload);
      res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully!',
        data: enquiryPayload,
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert(enquiryPayload)
      .select()
      .single();

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to save enquiry', error: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully!',
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error submitting enquiry', error: err.message });
  }
};

export const getUserEnquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;

    if (!userId && !email) {
      res.status(400).json({ success: false, message: 'User identifier missing' });
      return;
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      const userEnquiries = Array.from(mockEnquiries.values()).filter(
        (e) => e.user_id === userId || (email && e.email === email)
      );
      res.status(200).json({ success: true, count: userEnquiries.length, data: userEnquiries });
      return;
    }

    let query = supabaseAdmin.from('enquiries').select('*');
    if (userId) {
      query = query.or(`user_id.eq.${userId},email.eq.${email}`);
    } else {
      query = query.eq('email', email);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch enquiries', error: error.message });
      return;
    }

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching user enquiries', error: err.message });
  }
};

export const getEnquiryById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!isSupabaseConfigured || !supabaseAdmin) {
      const enquiry = mockEnquiries.get(id);
      if (!enquiry) {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
        return;
      }

      // Check ownership if not admin
      if (role !== 'admin' && enquiry.user_id !== userId && enquiry.email !== req.user?.email) {
        res.status(403).json({ success: false, message: 'Unauthorized access to enquiry' });
        return;
      }

      res.status(200).json({ success: true, data: enquiry });
      return;
    }

    const { data: enquiry, error } = await supabaseAdmin
      .from('enquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    if (role !== 'admin' && enquiry.user_id !== userId && enquiry.email !== req.user?.email) {
      res.status(403).json({ success: false, message: 'Unauthorized access to enquiry' });
      return;
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching enquiry details', error: err.message });
  }
};

export const getPublicEnquiryQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;

    let allEnquiries: any[] = [];

    if (!isSupabaseConfigured || !supabaseAdmin) {
      allEnquiries = Array.from(mockEnquiries.values());
    } else {
      const { data, error } = await supabaseAdmin
        .from('enquiries')
        .select('*');

      if (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch enquiries queue', error: error.message });
        return;
      }
      allEnquiries = data || [];
    }

    // Sort by created_at ascending (oldest first)
    allEnquiries.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    // Calculate queue positions for active/unresolved enquiries (status: Pending, Reviewing, Contacted)
    const activeStatuses = ['Pending', 'Reviewing', 'Contacted'];
    let activeQueueIndex = 1;

    const mappedQueue = allEnquiries.map((enquiry) => {
      const isOwner = (userId && enquiry.user_id === userId) || (email && enquiry.email === email);
      
      const isActive = activeStatuses.includes(enquiry.status);
      const position = isActive ? activeQueueIndex++ : null;

      if (isOwner) {
        return {
          ...enquiry,
          queue_position: position,
          is_owner: true
        };
      } else {
        // Mask the other users' data
        return {
          id: enquiry.id,
          student_name: 'Anonymous Student',
          parent_name: '***',
          mobile_number: '***',
          email: '***',
          student_age: 0,
          current_class: '***',
          interested_class: enquiry.interested_class,
          preferred_contact_method: 'Email',
          message: 'Details are private',
          status: enquiry.status,
          admin_response: enquiry.admin_response ? 'Response sent' : null,
          created_at: enquiry.created_at,
          updated_at: enquiry.updated_at,
          queue_position: position,
          is_owner: false
        };
      }
    });

    res.status(200).json({ success: true, count: mappedQueue.length, data: mappedQueue });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching queue', error: err.message });
  }
};
