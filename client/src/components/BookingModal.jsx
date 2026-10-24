import { useEffect, useState } from 'react';
import api from '../services/api';
import { WhatsAppLink } from './WhatsAppButton';

const initialForm = {
  learnerName: '',
  learnerPhone: '',
  learnerEmail: '',
  lessonId: '',
  date: '',
  timeSlot: '',
  pickupLocation: '',
  notes: '',
};

export function BookingModal({ open, onClose, lessons, whatsappNumber, preselectedLessonId }) {
  const [form, setForm] = useState(initialForm);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (open && preselectedLessonId) {
      setForm((f) => ({ ...f, lessonId: preselectedLessonId }));
    }
  }, [open, preselectedLessonId]);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setConfirmation(null);
      setError('');
      setSlots([]);
    }
  }, [open]);

  useEffect(() => {
    async function loadSlots() {
      if (!form.lessonId || !form.date) {
        setSlots([]);
        return;
      }
      setLoadingSlots(true);
      setError('');
      try {
        const { data } = await api.get('/availability', {
          params: { lessonId: form.lessonId, date: form.date },
        });
        setSlots(data.slots || []);
      } catch {
        setError('Could not load time slots. Please try again.');
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [form.lessonId, form.date]);

  if (!open) return null;

  const selectedLesson = lessons.find((l) => l._id === form.lessonId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/bookings', form);
      setConfirmation(data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-ink-light p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="booking-title" className="font-display text-2xl text-cream">Book Your Slot</h2>
            <p className="mt-1 text-sm text-muted">
              Choose a package, add your details, then confirm your booking. Pay in person or via UPI as arranged with your instructor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border px-2 py-1 text-muted hover:text-cream"
            aria-label="Close booking form"
          >
            ✕
          </button>
        </div>

        {confirmation ? (
          <div className="space-y-4">
            <p className="rounded-lg border border-gold/30 bg-card p-4 text-cream">
              Booking received! Reference: <strong>{confirmation.reference}</strong>
              <br />
              Status: <span className="capitalize">{confirmation.status}</span>
              <br />
              {confirmation.date} at {confirmation.time}
            </p>
            <p className="text-sm text-muted">
              Save your reference and phone number to check status later. You can also message us on WhatsApp with your reference.
            </p>
            <WhatsAppLink
              phoneNumber={whatsappNumber}
              message={`Hi, I booked a lesson. Reference: ${confirmation.reference}`}
              className="btn btn-gold w-full"
            >
              Confirm on WhatsApp
            </WhatsAppLink>
            <button type="button" className="btn btn-outline w-full" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson._id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, lessonId: lesson._id, timeSlot: '' }))}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    form.lessonId === lesson._id
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-border text-muted hover:border-gold/50'
                  }`}
                >
                  {lesson.durationLabel || lesson.name} · ₹{lesson.price.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <label className="block text-sm">
              <span className="text-muted">Full Name</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.learnerName}
                onChange={(e) => setForm({ ...form, learnerName: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Phone Number</span>
              <input
                required
                type="tel"
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.learnerPhone}
                onChange={(e) => setForm({ ...form, learnerPhone: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Email (optional)</span>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.learnerEmail}
                onChange={(e) => setForm({ ...form, learnerEmail: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Preferred Start Date</span>
              <input
                required
                type="date"
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: '' })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Time Slot</span>
              <select
                required
                disabled={!form.date || !form.lessonId || loadingSlots}
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream disabled:opacity-50"
                value={form.timeSlot}
                onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              >
                <option value="">
                  {loadingSlots ? 'Loading slots…' : slots.length ? 'Select a slot' : 'No slots available'}
                </option>
                {slots.map((s) => (
                  <option key={s.time} value={s.time}>{s.label}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="text-muted">Pickup location (optional)</span>
              <input
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Notes (optional)</span>
              <textarea
                rows={2}
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>

            {selectedLesson && (
              <p className="text-xs text-muted">
                Selected: {selectedLesson.name} — ₹{selectedLesson.price.toLocaleString('en-IN')}
              </p>
            )}

            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !form.lessonId}
              className="btn btn-gold w-full disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Booking Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
