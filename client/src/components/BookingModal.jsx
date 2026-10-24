import { useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '../config/whatsapp';
import { formatBookingWhatsAppMessage } from '../utils/bookingWhatsAppMessage';

const PREFERRED_TIME_OPTIONS = [
  { value: '08:00', label: '8:00 AM – 10:00 AM' },
  { value: '10:00', label: '10:00 AM – 12:00 PM' },
  { value: '14:00', label: '2:00 PM – 4:00 PM' },
  { value: '16:00', label: '4:00 PM – 6:00 PM' },
];

const initialForm = {
  learnerName: '',
  learnerPhone: '',
  learnerEmail: '',
  lessonId: '',
  date: '',
  preferredTime: '',
  pickupLocation: '',
  notes: '',
};

export function BookingModal({ open, onClose, lessons, whatsappNumber, preselectedLessonId }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open && preselectedLessonId) {
      setForm((f) => ({ ...f, lessonId: preselectedLessonId }));
    }
  }, [open, preselectedLessonId]);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setSent(false);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const selectedLesson = lessons.find((l) => (l.id || l._id) === form.lessonId);
  const selectedTimeLabel =
    PREFERRED_TIME_OPTIONS.find((o) => o.value === form.preferredTime)?.label ||
    form.preferredTime;

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const url = buildWhatsAppUrl(
      whatsappNumber,
      formatBookingWhatsAppMessage(
        { ...form, preferredTime: selectedTimeLabel },
        selectedLesson
      )
    );

    if (!url) {
      setError('WhatsApp number is not configured. Set whatsappNumber in client/src/config/siteContent.js.');
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
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
              Choose a package, add your details, then send the message on WhatsApp so we can confirm your slot.
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

        {sent ? (
          <div className="space-y-4">
            <p className="rounded-lg border border-gold/30 bg-card p-4 text-cream">
              WhatsApp should open with your booking details. Tap <strong>Send</strong> in WhatsApp to
              complete your request.
            </p>
            <p className="text-sm text-muted">
              If WhatsApp did not open, check your pop-up blocker or use the button below.
            </p>
            <a
              href={buildWhatsAppUrl(
                whatsappNumber,
                formatBookingWhatsAppMessage(
                  { ...form, preferredTime: selectedTimeLabel },
                  selectedLesson
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold w-full text-center"
            >
              Open WhatsApp again
            </a>
            <button type="button" className="btn btn-outline w-full" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id || lesson._id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, lessonId: lesson.id || lesson._id }))}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    form.lessonId === (lesson.id || lesson._id)
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
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Preferred Time</span>
              <select
                required
                className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              >
                <option value="">Select a time</option>
                {PREFERRED_TIME_OPTIONS.map((slot) => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
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
              disabled={!form.lessonId}
              className="btn btn-gold w-full disabled:opacity-50"
            >
              Send booking on WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
