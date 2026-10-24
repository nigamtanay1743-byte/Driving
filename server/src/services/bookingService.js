import { Booking } from '../models/Booking.js';
import { Lesson } from '../models/Lesson.js';
import { generateBookingReference } from '../utils/bookingReference.js';
import { assertSlotAvailable, normalizePhone } from './availabilityService.js';
import { canTransition } from '../utils/statusTransitions.js';
import { AppError } from '../middleware/errorHandler.js';
import { formatLocalDate, formatLocalTime } from '../utils/time.js';

export async function createBooking(payload) {
  const lesson = await Lesson.findOne({ _id: payload.lessonId, isActive: true });
  if (!lesson) {
    throw new AppError(400, 'Selected lesson is not available');
  }

  const { startTime, endTime } = await assertSlotAvailable({
    date: payload.date,
    timeSlot: payload.timeSlot,
    lesson,
  });

  const reference = generateBookingReference();

  try {
    const booking = await Booking.create({
      reference,
      learnerName: payload.learnerName,
      learnerPhone: normalizePhone(payload.learnerPhone),
      learnerEmail: payload.learnerEmail || '',
      lesson: lesson._id,
      startTime,
      endTime,
      pickupLocation: payload.pickupLocation || '',
      notes: payload.notes || '',
      status: 'pending',
    });
    return formatBookingResponse(booking, lesson);
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(409, 'This time slot was just booked. Please choose another slot.');
    }
    const conflict = await Booking.findOne({
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (conflict) {
      throw new AppError(409, 'This time slot was just booked. Please choose another slot.');
    }
    throw err;
  }
}

export function formatBookingResponse(booking, lesson) {
  return {
    id: booking._id?.toString(),
    reference: booking.reference,
    status: booking.status,
    learnerName: booking.learnerName,
    lesson: lesson
      ? { id: lesson._id, name: lesson.name, price: lesson.price, durationMinutes: lesson.durationMinutes }
      : undefined,
    date: formatLocalDate(booking.startTime),
    time: formatLocalTime(booking.startTime),
    startTime: booking.startTime,
    endTime: booking.endTime,
    createdAt: booking.createdAt,
  };
}

export async function lookupBooking({ reference, learnerPhone }) {
  const booking = await Booking.findOne({
    reference: reference.toUpperCase(),
    learnerPhone: normalizePhone(learnerPhone),
  }).populate('lesson', 'name price durationMinutes');

  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  return formatBookingResponse(booking, booking.lesson);
}

export async function updateBookingStatus(id, status) {
  const booking = await Booking.findById(id).populate('lesson', 'name price durationMinutes');
  if (!booking) throw new AppError(404, 'Booking not found');

  if (!canTransition(booking.status, status)) {
    throw new AppError(400, `Cannot change status from ${booking.status} to ${status}`);
  }

  booking.status = status;
  await booking.save();
  return formatBookingResponse(booking, booking.lesson);
}

export async function rescheduleBooking(id, { date, timeSlot }) {
  const booking = await Booking.findById(id).populate('lesson');
  if (!booking) throw new AppError(404, 'Booking not found');

  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw new AppError(400, 'Only pending or confirmed bookings can be rescheduled');
  }

  const lesson = booking.lesson;
  const { startTime, endTime } = await assertSlotAvailable({
    date,
    timeSlot,
    lesson,
    excludeBookingId: booking._id,
  });

  booking.startTime = startTime;
  booking.endTime = endTime;

  try {
    await booking.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(409, 'This time slot was just booked. Please choose another slot.');
    }
    throw err;
  }

  return formatBookingResponse(booking, lesson);
}
