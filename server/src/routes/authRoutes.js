import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { csrfToken, login, logout, me } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/schemas.js';
import { requireAuth, verifyCsrf } from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

router.get('/csrf-token', csrfToken);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', requireAuth, verifyCsrf, logout);
router.get('/me', me);

export default router;
