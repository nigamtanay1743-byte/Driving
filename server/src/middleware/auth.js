import { AppError } from './errorHandler.js';

export function requireAuth(req, _res, next) {
  if (!req.session?.userId) {
    return next(new AppError(401, 'Authentication required'));
  }
  next();
}

export function requireAdmin(req, _res, next) {
  if (!req.session?.userId || req.session.role !== 'admin') {
    return next(new AppError(403, 'Forbidden'));
  }
  next();
}

export function attachCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomUUID();
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

export function verifyCsrf(req, _res, next) {
  const token = req.get('x-csrf-token');
  if (!token || token !== req.session?.csrfToken) {
    return next(new AppError(403, 'Invalid CSRF token'));
  }
  next();
}
