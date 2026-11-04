import { Router } from 'express';
import { syncProfile, getCurrentUser } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const profileSyncSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  mobile_number: z.string().min(7, 'Mobile number must be valid'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin']).optional(),
});

router.post('/profile', validateRequest(profileSyncSchema), syncProfile);
router.get('/me', requireAuth, getCurrentUser);

export default router;
