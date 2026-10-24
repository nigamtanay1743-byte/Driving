import { Lesson } from '../models/Lesson.js';
import { BlockedDate, WeeklyAvailability } from '../models/Availability.js';
import { getAvailableSlotsForDate } from '../services/availabilityService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getAvailability(req, res) {
  const { date, lessonId } = req.validated.query;
  const lesson = await Lesson.findOne({ _id: lessonId, isActive: true });
  if (!lesson) throw new AppError(400, 'Lesson not found');

  const slots = await getAvailableSlotsForDate({ date, lesson });
  res.json({ success: true, date, lessonId, slots });
}

export async function listWeeklyAvailability(_req, res) {
  const items = await WeeklyAvailability.find().sort({ dayOfWeek: 1 }).lean();
  res.json({ success: true, availability: items });
}

export async function upsertWeeklyAvailability(req, res) {
  const { dayOfWeek, slots, isActive } = req.validated.body;
  const item = await WeeklyAvailability.findOneAndUpdate(
    { dayOfWeek },
    { dayOfWeek, slots, isActive: isActive ?? true },
    { upsert: true, new: true, runValidators: true }
  );
  res.json({ success: true, availability: item });
}

export async function listBlockedDates(_req, res) {
  const items = await BlockedDate.find().sort({ date: 1 }).lean();
  res.json({ success: true, blockedDates: items });
}

export async function addBlockedDate(req, res) {
  const item = await BlockedDate.create(req.validated.body);
  res.status(201).json({ success: true, blockedDate: item });
}

export async function removeBlockedDate(req, res) {
  await BlockedDate.findOneAndDelete({ date: req.params.date });
  res.json({ success: true });
}
