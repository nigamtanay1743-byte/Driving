import { Router } from 'express';
import { requireAdmin, verifyCsrf } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  adminBookingsQuerySchema,
  blockedDateSchema,
  lessonCreateSchema,
  lessonUpdateSchema,
  rescheduleSchema,
  statusUpdateSchema,
  weeklyAvailabilitySchema,
} from '../validators/schemas.js';
import {
  getDashboard,
  getAdminBooking,
  listAdminBookings,
  patchBookingStatus,
  patchReschedule,
} from '../controllers/bookingController.js';
import {
  createLesson,
  deleteLesson,
  listAdminLessons,
  updateLesson,
} from '../controllers/lessonController.js';
import {
  addBlockedDate,
  listBlockedDates,
  listWeeklyAvailability,
  removeBlockedDate,
  upsertWeeklyAvailability,
} from '../controllers/availabilityController.js';

const router = Router();

router.use(requireAdmin);
router.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return verifyCsrf(req, res, next);
  }
  next();
});

router.get('/dashboard', getDashboard);
router.get('/bookings', validate(adminBookingsQuerySchema), listAdminBookings);
router.get('/bookings/:id', getAdminBooking);
router.patch('/bookings/:id/status', validate(statusUpdateSchema), patchBookingStatus);
router.patch('/bookings/:id/reschedule', validate(rescheduleSchema), patchReschedule);

router.get('/lessons', listAdminLessons);
router.post('/lessons', validate(lessonCreateSchema), createLesson);
router.patch('/lessons/:id', validate(lessonUpdateSchema), updateLesson);
router.delete('/lessons/:id', deleteLesson);

router.get('/availability', listWeeklyAvailability);
router.post('/availability', validate(weeklyAvailabilitySchema), upsertWeeklyAvailability);
router.get('/availability/blocked', listBlockedDates);
router.post('/availability/blocked', validate(blockedDateSchema), addBlockedDate);
router.delete('/availability/blocked/:date', removeBlockedDate);

export default router;
