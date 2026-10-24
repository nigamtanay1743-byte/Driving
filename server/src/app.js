import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  app.use(
    session({
      name: 'sid',
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: env.mongoUri,
        ttl: 60 * 60 * 24 * 7,
      }),
      cookie: {
        httpOnly: true,
        secure: env.cookieSecure,
        sameSite: env.isProd ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok' });
  });

  app.use('/api', publicRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(errorHandler);

  return app;
}
