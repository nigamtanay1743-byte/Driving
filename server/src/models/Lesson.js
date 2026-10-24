import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    badge: { type: String, trim: true, maxlength: 80, default: '' },
    subtitle: { type: String, trim: true, maxlength: 200, default: '' },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 30, max: 480 },
    durationLabel: { type: String, trim: true, maxlength: 80, default: '' },
    features: [{ type: String, trim: true, maxlength: 300 }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

lessonSchema.index({ isActive: 1, sortOrder: 1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);
