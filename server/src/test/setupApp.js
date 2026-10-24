import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import argon2 from 'argon2';

let mongo;

export async function setupTestApp() {
  process.env.NODE_ENV = 'test';
  process.env.SESSION_SECRET = 'test-session-secret-min-32-characters-long';
  process.env.CLIENT_ORIGIN = 'http://localhost:5173';
  process.env.BUSINESS_WHATSAPP_NUMBER = '919882051705';

  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();

  const { Lesson } = await import('../models/Lesson.js');
  const { WeeklyAvailability } = await import('../models/Availability.js');
  const { User } = await import('../models/User.js');
  const { createApp } = await import('../app.js');

  await mongoose.connect(process.env.MONGODB_URI);

  const lesson = await Lesson.create({
    name: 'Trial Demo Ride',
    slug: 'trial-demo-test',
    price: 400,
    durationMinutes: 60,
    durationLabel: '1 Day',
    features: ['One session'],
    isActive: true,
  });

  await WeeklyAvailability.create({
    dayOfWeek: 1,
    slots: [{ start: '10:00', end: '12:00' }],
    isActive: true,
  });

  const passwordHash = await argon2.hash('TestPassword123!', { type: argon2.argon2id });
  await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    passwordHash,
    role: 'admin',
  });

  const app = createApp();
  return { app, lesson };
}

export async function teardownTestApp() {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
}
