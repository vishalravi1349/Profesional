import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { supabaseAdmin, isSupabaseConfigured, mockProfiles } from '../services/supabase';

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fallback for development/testing if header contains mock user header
      const mockUserId = req.headers['x-user-id'] as string;
      const mockUserRole = (req.headers['x-user-role'] as string) || 'user';
      if (mockUserId) {
        const profile = mockProfiles.get(mockUserId);
        req.user = {
          id: mockUserId,
          email: profile?.email || 'user@noventra.edu',
          role: profile?.role || (mockUserRole as any),
        };
        return next();
      }

      res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!isSupabaseConfigured || !supabaseAdmin) {
      // Mock auth decoding for demo
      const mockUserId = (req.headers['x-user-id'] as string) || 'demo-user-id';
      const mockRole = (req.headers['x-user-role'] as string) || (mockUserId.includes('admin') ? 'admin' : 'user');
      const profile = mockProfiles.get(mockUserId);
      
      req.user = {
        id: mockUserId,
        email: profile?.email || (mockRole === 'admin' ? 'admin@noventra.edu' : 'sarah.j@example.com'),
        role: profile?.role || mockRole,
      };
      return next();
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ success: false, message: 'Invalid or expired token.' });
      return;
    }

    // Fetch user profile to get role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, email')
      .eq('id', data.user.id)
      .single();

    req.user = {
      id: data.user.id,
      email: data.user.email || profile?.email || '',
      role: profile?.role || 'user',
    };

    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Authentication failed', error: err.message });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const mockUserId = req.headers['x-user-id'] as string;

    if (!authHeader && !mockUserId) {
      return next();
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (!isSupabaseConfigured || !supabaseAdmin) {
        const mockId = (req.headers['x-user-id'] as string) || 'demo-user-id';
        const mockRole = (req.headers['x-user-role'] as string) || 'user';
        const profile = mockProfiles.get(mockId);
        
        req.user = {
          id: mockId,
          email: profile?.email || 'sarah.j@example.com',
          role: profile?.role || mockRole,
        };
        return next();
      }

      const { data, error } = await supabaseAdmin.auth.getUser(token);

      if (!error && data.user) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('role, email')
          .eq('id', data.user.id)
          .single();

        req.user = {
          id: data.user.id,
          email: data.user.email || profile?.email || '',
          role: profile?.role || 'user',
        };
      }
    } else if (mockUserId) {
      const mockUserRole = (req.headers['x-user-role'] as string) || 'user';
      const profile = mockProfiles.get(mockUserId);
      req.user = {
        id: mockUserId,
        email: profile?.email || 'user@noventra.edu',
        role: profile?.role || (mockUserRole as any),
      };
    }
    next();
  } catch {
    next();
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
    return;
  }
  next();
};
