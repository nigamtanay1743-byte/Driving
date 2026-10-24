import argon2 from 'argon2';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

export async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  req.session.userId = user._id.toString();
  req.session.role = user.role;
  req.session.csrfToken = crypto.randomUUID();

  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    csrfToken: req.session.csrfToken,
  });
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
}

export async function me(req, res) {
  if (!req.session.userId) {
    return res.json({ success: true, user: null });
  }
  const user = await User.findById(req.session.userId).select('name email role');
  res.json({
    success: true,
    user: user ? { id: user._id, name: user.name, email: user.email, role: user.role } : null,
    csrfToken: req.session.csrfToken,
  });
}

export function csrfToken(req, res) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomUUID();
  }
  res.json({ success: true, csrfToken: req.session.csrfToken });
}

export async function getPublicConfig(_req, res) {
  res.json({
    success: true,
    whatsappNumber: env.whatsappNumber,
    timezone: env.timezone,
  });
}
