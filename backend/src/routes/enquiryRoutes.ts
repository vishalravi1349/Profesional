import { Router } from 'express';
import { createEnquiry, getUserEnquiries, getEnquiryById, getPublicEnquiryQueue } from '../controllers/enquiryController';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const enquiryCreateSchema = z.object({
  student_name: z.string().min(2, 'Student name is required'),
  parent_name: z.string().min(2, 'Parent name is required'),
  mobile_number: z.string().min(7, 'Mobile number must be valid'),
  email: z.string().email('Invalid email address'),
  student_age: z.number().min(3, 'Age must be at least 3').max(20, 'Age must be at most 20'),
  current_class: z.string().min(1, 'Current class is required'),
  interested_class: z.string().min(1, 'Interested class is required'),
  preferred_contact_method: z.enum(['Email', 'Phone', 'WhatsApp']).default('Email'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

router.post('/', optionalAuth, validateRequest(enquiryCreateSchema), createEnquiry);
router.get('/queue', requireAuth, getPublicEnquiryQueue);
router.get('/', requireAuth, getUserEnquiries);
router.get('/:id', requireAuth, getEnquiryById);

export default router;
