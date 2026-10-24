import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.issues?.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: env.isProd ? 'Internal server error' : err.message,
  });
}
