import { Router } from 'express';
import { listPublicLessons } from '../controllers/lessonController.js';
import { getAvailability } from '../controllers/availabilityController.js';
import { postBooking, postBookingLookup } from '../controllers/bookingController.js';
import { getPublicConfig } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import {
  availabilityQuerySchema,
  bookingLookupSchema,
  createBookingSchema,
} from '../validators/schemas.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many booking attempts. Please try again later.' },
});

router.get('/config', getPublicConfig);
router.get('/lessons', listPublicLessons);
router.get('/availability', validate(availabilityQuerySchema), getAvailability);
router.post('/bookings', bookingLimiter, validate(createBookingSchema), postBooking);
router.post('/bookings/lookup', bookingLimiter, validate(bookingLookupSchema), postBookingLookup);

export default router;
