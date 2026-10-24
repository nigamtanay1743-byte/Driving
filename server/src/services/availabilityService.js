import { BlockedDate, WeeklyAvailability } from '../models/Availability.js';
import { Booking, ACTIVE_BOOKING_STATUSES } from '../models/Booking.js';
import {
  addMinutes,
  dayOfWeekFromDateStr,
  formatLocalTime,
  isPastDate,
  localDateTimeToUtc,
} from '../utils/time.js';
import { AppError } from '../middleware/errorHandler.js';

function slotFitsLesson(slot, durationMinutes) {
  const [sh, sm] = slot.start.split(':').map(Number);
  const [eh, em] = slot.end.split(':').map(Number);
  const slotMinutes = eh * 60 + em - (sh * 60 + sm);
  return slotMinutes >= durationMinutes;
}

export async function getAvailableSlotsForDate({ date, lesson }) {
  if (isPastDate(date)) {
    return [];
  }

  const blocked = await BlockedDate.findOne({ date }).lean();
  if (blocked) {
    return [];
  }

  const dow = dayOfWeekFromDateStr(date);
  const weekly = await WeeklyAvailability.findOne({ dayOfWeek: dow, isActive: true }).lean();
  if (!weekly?.slots?.length) {
    return [];
  }

  const dayStart = localDateTimeToUtc(date, '00:00');
  const dayEnd = localDateTimeToUtc(date, '23:59');

  const bookings = await Booking.find({
    status: { $in: ACTIVE_BOOKING_STATUSES },
    startTime: { $gte: dayStart, $lte: dayEnd },
  })
    .select('startTime endTime')
    .lean();

  const now = new Date();
  const slots = [];

  for (const slot of weekly.slots) {
    if (!slotFitsLesson(slot, lesson.durationMinutes)) continue;

    const startTime = localDateTimeToUtc(date, slot.start);
    const endTime = addMinutes(startTime, lesson.durationMinutes);

    if (startTime <= now) continue;

    const overlaps = bookings.some(
      (b) => b.startTime < endTime && b.endTime > startTime
    );
    if (!overlaps) {
      slots.push({
        time: slot.start,
        label: slot.start,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
    }
  }

  return slots;
}

export async function assertSlotAvailable({ date, timeSlot, lesson, excludeBookingId }) {
  if (isPastDate(date)) {
    throw new AppError(400, 'Cannot book a date in the past');
  }

  const blocked = await BlockedDate.findOne({ date });
  if (blocked) {
    throw new AppError(400, 'Selected date is not available');
  }

  const dow = dayOfWeekFromDateStr(date);
  const weekly = await WeeklyAvailability.findOne({ dayOfWeek: dow, isActive: true });
  const matching = weekly?.slots?.find((s) => s.start === timeSlot);
  if (!matching || !slotFitsLesson(matching, lesson.durationMinutes)) {
    throw new AppError(400, 'Invalid or unavailable time slot');
  }

  const startTime = localDateTimeToUtc(date, timeSlot);
  const endTime = addMinutes(startTime, lesson.durationMinutes);

  if (startTime <= new Date()) {
    throw new AppError(400, 'Cannot book a time in the past');
  }

  const conflictQuery = {
    status: { $in: ACTIVE_BOOKING_STATUSES },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };
  if (excludeBookingId) {
    conflictQuery._id = { $ne: excludeBookingId };
  }
  const conflict = await Booking.findOne(conflictQuery);

  if (conflict) {
    throw new AppError(409, 'This time slot was just booked. Please choose another slot.');
  }

  return { startTime, endTime };
}

export async function seedDefaultAvailability() {
  const count = await WeeklyAvailability.countDocuments();
  if (count > 0) return;

  const defaultSlots = [
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' },
  ];

  await WeeklyAvailability.insertMany(
    [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
      dayOfWeek,
      slots: defaultSlots,
      isActive: true,
    }))
  );
}

export function normalizePhone(phone) {
  return phone.replace(/[\s-]/g, '');
}
