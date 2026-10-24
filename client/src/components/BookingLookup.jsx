import { useState } from 'react';
import api from '../services/api';

export function BookingLookup() {
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/bookings/lookup', {
        reference,
        learnerPhone: phone,
      });
      setResult(data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-pad border-t border-border/40">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-2xl text-cream">Check your booking</h2>
        <p className="mt-2 text-sm text-muted">Enter your booking reference and phone number.</p>
        <form onSubmit={handleLookup} className="mt-6 space-y-3">
          <input
            required
            placeholder="Booking reference"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn btn-outline w-full">
            {loading ? 'Looking up…' : 'Look up booking'}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {result && (
          <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted">
            <p><strong className="text-cream">{result.reference}</strong> — {result.status}</p>
            <p>{result.lesson?.name} on {result.date} at {result.time}</p>
          </div>
        )}
      </div>
    </section>
  );
}
