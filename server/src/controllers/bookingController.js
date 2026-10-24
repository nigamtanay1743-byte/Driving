import { Booking } from '../models/Booking.js';
import {
  createBooking,
  lookupBooking,
  rescheduleBooking,
  updateBookingStatus,
  formatBookingResponse,
} from '../services/bookingService.js';
import { AppError } from '../middleware/errorHandler.js';
import { formatLocalDate } from '../utils/time.js';

export async function postBooking(req, res) {
  const { body } = req.validated;
  const booking = await createBooking({
    lessonId: body.lessonId,
    learnerName: body.learnerName,
    learnerPhone: body.learnerPhone,
    learnerEmail: body.learnerEmail,
    date: body.date,
    timeSlot: body.timeSlot,
    pickupLocation: body.pickupLocation,
    notes: body.notes,
  });
  res.status(201).json({ success: true, booking });
}

export async function postBookingLookup(req, res) {
  const booking = await lookupBooking(req.validated.body);
  res.json({ success: true, booking });
}

export async function listAdminBookings(req, res) {
  const { page, limit, status, search, date } = req.validated.query;
  const filter = {};
  if (status) filter.status = status;
  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    filter.startTime = { $gte: start, $lte: end };
  }
  if (search) {
    filter.$or = [
      { learnerName: { $regex: search, $options: 'i' } },
      { learnerPhone: { $regex: search.replace(/\s/g, ''), $options: 'i' } },
      { reference: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('lesson', 'name price durationMinutes')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    bookings: bookings.map((b) => formatBookingResponse(b, b.lesson)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function getAdminBooking(req, res) {
  const booking = await Booking.findById(req.params.id).populate(
    'lesson',
    'name price durationMinutes'
  );
  if (!booking) throw new AppError(404, 'Booking not found');
  res.json({
    success: true,
    booking: {
      ...formatBookingResponse(booking, booking.lesson),
      pickupLocation: booking.pickupLocation,
      notes: booking.notes,
      learnerPhone: booking.learnerPhone,
      learnerEmail: booking.learnerEmail,
    },
  });
}

export async function patchBookingStatus(req, res) {
  const booking = await updateBookingStatus(req.validated.params.id, req.validated.body.status);
  res.json({ success: true, booking });
}

export async function patchReschedule(req, res) {
  const booking = await rescheduleBooking(req.validated.params.id, req.validated.body);
  res.json({ success: true, booking });
}

export async function getDashboard(_req, res) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [total, pending, confirmed, todayCount, upcoming] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ startTime: { $gte: startOfToday } }),
    Booking.find({ startTime: { $gte: now }, status: { $in: ['pending', 'confirmed'] } })
      .populate('lesson', 'name')
      .sort({ startTime: 1 })
      .limit(5)
      .lean(),
  ]);

  res.json({
    success: true,
    stats: { total, pending, confirmed, todayCount },
    upcoming: upcoming.map((b) => ({
      reference: b.reference,
      learnerName: b.learnerName,
      status: b.status,
      date: formatLocalDate(b.startTime),
      lesson: b.lesson?.name,
    })),
  });
}
