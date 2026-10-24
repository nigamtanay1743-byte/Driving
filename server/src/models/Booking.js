import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'];

export const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed'];

const bookingSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, uppercase: true, trim: true },
    learnerName: { type: String, required: true, trim: true, maxlength: 120 },
    learnerPhone: { type: String, required: true, trim: true, maxlength: 20 },
    learnerEmail: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    pickupLocation: { type: String, trim: true, maxlength: 300, default: '' },
    notes: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'pending',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, startTime: 1 });
bookingSchema.index({ learnerPhone: 1, reference: 1 });
bookingSchema.index({ startTime: 1, endTime: 1, status: 1 });
bookingSchema.index(
  { startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
