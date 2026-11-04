import { Response } from 'express';
import { AuthRequest } from '../types';
import { supabaseAdmin, isSupabaseConfigured, mockProfiles } from '../services/supabase';

export const syncProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, full_name, mobile_number, email, role } = req.body;
    const userId = req.user?.id || id;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const profileData = {
      id: userId,
      full_name: full_name || '',
      mobile_number: mobile_number || '',
      email: email || req.user?.email || '',
      role: role || 'user',
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured || !supabaseAdmin) {
      const existing = mockProfiles.get(userId) || {};
      const updated = {
        created_at: existing.created_at || new Date().toISOString(),
        ...existing,
        ...profileData,
      };
      mockProfiles.set(userId, updated);
      res.status(200).json({ success: true, data: updated });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      res.status(500).json({ success: false, message: 'Failed to sync profile', error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error during profile sync', error: err.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      const profile = mockProfiles.get(userId) || {
        id: userId,
        full_name: 'Noventra Student/Parent',
        mobile_number: '+1 (555) 000-0000',
        email: req.user?.email || 'user@noventra.edu',
        role: req.user?.role || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      res.status(200).json({ success: true, data: profile });
      return;
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: err.message });
  }
};
