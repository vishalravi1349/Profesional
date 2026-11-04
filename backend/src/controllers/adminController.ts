import { Response } from 'express';
import { AuthRequest } from '../types';
import { supabaseAdmin, isSupabaseConfigured, mockEnquiries, mockProfiles } from '../services/supabase';

export const getAllEnquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, sortBy = 'created_at', sortOrder = 'desc', limit = 50, page = 1 } = req.query;

    if (!isSupabaseConfigured || !supabaseAdmin) {
      let list = Array.from(mockEnquiries.values());

      if (status && status !== 'all') {
        list = list.filter((e) => e.status.toLowerCase() === (status as string).toLowerCase());
      }

      if (search) {
        const q = (search as string).toLowerCase();
        list = list.filter(
          (e) =>
            e.id.toLowerCase().includes(q) ||
            e.student_name.toLowerCase().includes(q) ||
            e.parent_name.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.mobile_number.includes(q)
        );
      }

      list.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

      res.status(200).json({
        success: true,
        count: list.length,
        data: list,
      });
      return;
    }

    let query = supabaseAdmin.from('enquiries').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      const q = `%${search}%`;
      query = query.or(`student_name.ilike.${q},parent_name.ilike.${q},email.ilike.${q},id.ilike.${q}`);
    }

    const { data, error } = await query
      .order((sortBy as string) || 'created_at', { ascending: sortOrder === 'asc' })
      .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch enquiries', error: error.message });
      return;
    }

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving enquiries', error: err.message });
  }
};

export const updateEnquiryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_response, admin_notes } = req.body;

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (admin_response !== undefined) updatePayload.admin_response = admin_response;
    if (admin_notes !== undefined) updatePayload.admin_notes = admin_notes;

    if (!isSupabaseConfigured || !supabaseAdmin) {
      const existing = mockEnquiries.get(id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
        return;
      }
      const updated = { ...existing, ...updatePayload };
      mockEnquiries.set(id, updated);

      res.status(200).json({
        success: true,
        message: 'Enquiry updated successfully!',
        data: updated,
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to update enquiry', error: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully!',
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error updating enquiry status', error: err.message });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      const usersList = Array.from(mockProfiles.values());
      res.status(200).json({ success: true, count: usersList.length, data: usersList });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
      return;
    }

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
  }
};

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      const enquiries = Array.from(mockEnquiries.values());
      const stats = {
        totalEnquiries: enquiries.length,
        pending: enquiries.filter((e) => e.status === 'Pending').length,
        reviewing: enquiries.filter((e) => e.status === 'Reviewing').length,
        contacted: enquiries.filter((e) => e.status === 'Contacted').length,
        responded: enquiries.filter((e) => e.status === 'Responded').length,
        approved: enquiries.filter((e) => e.status === 'Approved').length,
        closed: enquiries.filter((e) => e.status === 'Closed').length,
        totalUsers: mockProfiles.size,
      };
      res.status(200).json({ success: true, data: stats });
      return;
    }

    const { data: enquiries, error: enquiryError } = await supabaseAdmin
      .from('enquiries')
      .select('status');

    const { count: totalUsers, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (enquiryError) {
      res.status(500).json({ success: false, message: 'Error calculating stats' });
      return;
    }

    const items = enquiries || [];
    const stats = {
      totalEnquiries: items.length,
      pending: items.filter((e) => e.status === 'Pending').length,
      reviewing: items.filter((e) => e.status === 'Reviewing').length,
      contacted: items.filter((e) => e.status === 'Contacted').length,
      responded: items.filter((e) => e.status === 'Responded').length,
      approved: items.filter((e) => e.status === 'Approved').length,
      closed: items.filter((e) => e.status === 'Closed').length,
      totalUsers: totalUsers || 0,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving admin stats', error: err.message });
  }
};

export const deleteEnquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isSupabaseConfigured || !supabaseAdmin) {
      if (!mockEnquiries.has(id)) {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
        return;
      }
      mockEnquiries.delete(id);
      res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
      return;
    }

    const { error } = await supabaseAdmin.from('enquiries').delete().eq('id', id);

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to delete enquiry', error: error.message });
      return;
    }

    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error deleting enquiry', error: err.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role specified' });
      return;
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      const existing = mockProfiles.get(id);
      if (existing) {
        existing.role = role;
        existing.updated_at = new Date().toISOString();
        mockProfiles.set(id, existing);
      } else {
        // Create entry in mockProfiles
        mockProfiles.set(id, {
          id,
          full_name: 'User ' + id,
          email: `${id}@noventra.edu`,
          role,
          mobile_number: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      res.status(200).json({
        success: true,
        message: `User role updated to ${role} successfully!`,
        data: mockProfiles.get(id),
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to update user role', error: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully!`,
      data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error updating user role', error: err.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { full_name, email, mobile_number, role } = req.body;
    const newId = `usr-${Math.random().toString(36).substring(2, 9)}`;

    const newUser = {
      id: newId,
      full_name,
      email,
      mobile_number: mobile_number || '',
      role: role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured || !supabaseAdmin) {
      mockProfiles.set(newId, newUser);
      res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
      return;
    }

    const { data, error } = await supabaseAdmin.from('profiles').insert(newUser).select().single();

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
      return;
    }

    res.status(201).json({ success: true, message: 'User created successfully', data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error creating user', error: err.message });
  }
};

