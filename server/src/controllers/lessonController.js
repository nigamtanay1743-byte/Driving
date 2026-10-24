import { Lesson } from '../models/Lesson.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listPublicLessons(_req, res) {
  const lessons = await Lesson.find({ isActive: true }).sort({ sortOrder: 1, price: 1 }).lean();
  res.json({ success: true, lessons });
}

export async function createLesson(req, res) {
  const lesson = await Lesson.create(req.validated.body);
  res.status(201).json({ success: true, lesson });
}

export async function updateLesson(req, res) {
  const lesson = await Lesson.findByIdAndUpdate(req.validated.params.id, req.validated.body, {
    new: true,
    runValidators: true,
  });
  if (!lesson) throw new AppError(404, 'Lesson not found');
  res.json({ success: true, lesson });
}

export async function deleteLesson(req, res) {
  const lesson = await Lesson.findByIdAndUpdate(
    req.validated.params.id,
    { isActive: false },
    { new: true }
  );
  if (!lesson) throw new AppError(404, 'Lesson not found');
  res.json({ success: true, lesson });
}

export async function listAdminLessons(_req, res) {
  const lessons = await Lesson.find().sort({ sortOrder: 1 }).lean();
  res.json({ success: true, lessons });
}
