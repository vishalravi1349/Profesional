import { Router } from 'express';
import {
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getUsers,
  updateUserRole,
  createUser,
  getAdminStats,
} from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const statusUpdateSchema = z.object({
  status: z
    .enum(['Pending', 'Reviewing', 'Contacted', 'Responded', 'Approved', 'Closed'])
    .optional(),
  admin_response: z.string().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
});

router.use(requireAuth);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/enquiries', getAllEnquiries);
router.patch('/enquiries/:id', validateRequest(statusUpdateSchema), updateEnquiryStatus);
router.delete('/enquiries/:id', deleteEnquiry);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/users', createUser);

export default router;
