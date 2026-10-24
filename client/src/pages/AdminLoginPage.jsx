import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border bg-ink-light p-8"
      >
        <h1 className="font-display text-2xl text-cream">Admin login</h1>
        <p className="mt-2 text-sm text-muted">Instructor dashboard — authorized access only.</p>
        <label className="mt-6 block text-sm">
          <span className="text-muted">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="text-muted">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-cream"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-gold mt-6 w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <a href="/" className="mt-4 block text-center text-sm text-muted hover:text-gold">← Back to site</a>
      </form>
    </div>
  );
}
