import { z } from 'zod';
import { BOOKING_STATUSES } from '../models/Booking.js';

const phoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(/^\+?[0-9][0-9\s-]{7,18}$/, 'Invalid phone number');

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(128),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    learnerName: z.string().trim().min(2).max(120),
    learnerPhone: phoneSchema,
    learnerEmail: z.string().trim().email().max(254).optional().or(z.literal('')),
    lessonId: z.string().regex(/^[a-f\d]{24}$/i),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeSlot: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    pickupLocation: z.string().trim().max(300).optional(),
    notes: z.string().trim().max(1000).optional(),
  }),
});

export const bookingLookupSchema = z.object({
  body: z.object({
    reference: z.string().trim().min(8).max(32),
    learnerPhone: phoneSchema,
  }),
});

export const availabilityQuerySchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    lessonId: z.string().regex(/^[a-f\d]{24}$/i),
  }),
});

export const adminBookingsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).max(500).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    status: z.enum(BOOKING_STATUSES).optional(),
    search: z.string().trim().max(120).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
});

export const statusUpdateSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    status: z.enum(BOOKING_STATUSES),
  }),
});

export const rescheduleSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeSlot: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  }),
});

export const lessonCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(160),
    slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
    description: z.string().trim().max(2000).optional(),
    badge: z.string().trim().max(80).optional(),
    subtitle: z.string().trim().max(200).optional(),
    price: z.number().min(0),
    durationMinutes: z.number().int().min(30).max(480),
    durationLabel: z.string().trim().max(80).optional(),
    features: z.array(z.string().trim().max(300)).max(20).optional(),
    sortOrder: z.number().int().min(0).max(999).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const lessonUpdateSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }),
  body: lessonCreateSchema.shape.body.partial(),
});

export const weeklyAvailabilitySchema = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    slots: z
      .array(
        z.object({
          start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
          end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
        })
      )
      .max(24),
    isActive: z.boolean().optional(),
  }),
});

export const blockedDateSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reason: z.string().trim().max(300).optional(),
  }),
});

export const siteSettingsSchema = z.object({
  body: z.object({
    businessName: z.string().trim().min(2).max(160).optional(),
    tagline: z.string().trim().max(300).optional(),
    address: z.string().trim().max(300).optional(),
    phoneDisplay: z.string().trim().max(40).optional(),
    mapUrl: z.string().url().max(500).optional(),
    whatsappDefaultMessage: z.string().trim().max(500).optional(),
  }),
});
