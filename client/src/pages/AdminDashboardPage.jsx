import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState('bookings');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user, statusFilter]);

  async function loadDashboard() {
    const [dash, bookingsRes, lessonsRes, availRes] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/bookings', { params: { status: statusFilter || undefined, limit: 50 } }),
      api.get('/admin/lessons'),
      api.get('/admin/availability'),
    ]);
    setStats(dash.data.stats);
    setBookings(bookingsRes.data.bookings);
    setLessons(lessonsRes.data.lessons);
    setAvailability(availRes.data.availability);
  }

  async function updateStatus(id, status) {
    await api.patch(`/admin/bookings/${id}/status`, { status });
    setMessage(`Booking updated to ${status}`);
    loadDashboard();
  }

  if (loading) return <div className="p-8 text-cream">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl">Instructor dashboard</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <a href="/" className="btn btn-outline text-xs">View site</a>
          <button type="button" className="btn btn-outline text-xs" onClick={() => logout()}>
            Log out
          </button>
        </div>
      </header>

      {stats && (
        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs uppercase text-muted">{k}</p>
              <p className="text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 border-b border-border px-6">
        {['bookings', 'lessons', 'availability'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize ${tab === t ? 'border-b-2 border-gold text-gold' : 'text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {message && <p className="mb-4 text-sm text-gold">{message}</p>}

        {tab === 'bookings' && (
          <>
            <select
              className="mb-4 rounded border border-border bg-card px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {['pending', 'confirmed', 'rejected', 'cancelled', 'completed'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-muted">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Learner</th>
                    <th className="p-3">Lesson</th>
                    <th className="p-3">When</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.reference} className="border-t border-border">
                      <td className="p-3 font-mono text-xs">{b.reference}</td>
                      <td className="p-3">{b.learnerName}</td>
                      <td className="p-3">{b.lesson?.name}</td>
                      <td className="p-3">{b.date} {b.time}</td>
                      <td className="p-3 capitalize">{b.status}</td>
                      <td className="p-3 space-x-1">
                        {b.status === 'pending' && (
                          <>
                            <button type="button" className="text-gold text-xs" onClick={() => updateStatus(b.id, 'confirmed')}>Confirm</button>
                            <button type="button" className="text-red-400 text-xs" onClick={() => updateStatus(b.id, 'rejected')}>Reject</button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button type="button" className="text-xs text-muted" onClick={() => updateStatus(b.id, 'completed')}>Complete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'lessons' && (
          <ul className="space-y-3">
            {lessons.map((l) => (
              <li key={l._id} className="rounded-lg border border-border bg-card p-4 flex justify-between">
                <div>
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-sm text-muted">₹{l.price} · {l.durationMinutes} min · {l.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tab === 'availability' && (
          <div className="space-y-4">
            {availability.map((a) => (
              <div key={a.dayOfWeek} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold">{DAYS[a.dayOfWeek]}</p>
                <p className="text-sm text-muted mt-1">
                  {(a.slots || []).map((s) => `${s.start}-${s.end}`).join(', ') || 'No slots'}
                </p>
              </div>
            ))}
            <p className="text-xs text-muted">Use API or extend this UI to edit weekly slots and blocked dates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
