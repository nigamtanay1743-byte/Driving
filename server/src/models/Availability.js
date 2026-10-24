import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    start: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    end: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slots: { type: [timeSlotSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

availabilitySchema.index({ dayOfWeek: 1 }, { unique: true });

const blockedDateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    reason: { type: String, trim: true, maxlength: 300, default: '' },
  },
  { timestamps: true }
);

blockedDateSchema.index({ date: 1 }, { unique: true });

export const WeeklyAvailability = mongoose.model('WeeklyAvailability', availabilitySchema);
export const BlockedDate = mongoose.model('BlockedDate', blockedDateSchema);
