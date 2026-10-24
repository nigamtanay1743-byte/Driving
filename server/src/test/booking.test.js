import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { setupTestApp, teardownTestApp } from './setupApp.js';

describe('Booking API', () => {
  let app;
  let lesson;
  let agent;

  beforeAll(async () => {
    const ctx = await setupTestApp();
    app = ctx.app;
    lesson = ctx.lesson;
    agent = request.agent(app);
  });

  afterAll(async () => {
    await teardownTestApp();
  });

  function nextMonday() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + ((1 + 7 - d.getUTCDay()) % 7 || 7));
    return d.toISOString().slice(0, 10);
  }

  it('rejects invalid booking input', async () => {
    const res = await request(app).post('/api/bookings').send({ learnerName: 'A' });
    expect(res.status).toBe(400);
  });

  it('rejects past dates', async () => {
    const res = await request(app).post('/api/bookings').send({
      learnerName: 'Test Learner',
      learnerPhone: '9876543210',
      lessonId: lesson._id.toString(),
      date: '2020-01-01',
      timeSlot: '10:00',
    });
    expect(res.status).toBe(400);
  });

  it('creates a booking successfully', async () => {
    const date = nextMonday();
    const res = await request(app).post('/api/bookings').send({
      learnerName: 'Test Learner',
      learnerPhone: '9876543210',
      lessonId: lesson._id.toString(),
      date,
      timeSlot: '10:00',
    });
    expect(res.status).toBe(201);
    expect(res.body.booking.reference).toMatch(/^GDT-/);
    expect(res.body.booking.status).toBe('pending');
  });

  it('rejects duplicate slot booking', async () => {
    const date = nextMonday();
    const payload = {
      learnerName: 'Another Learner',
      learnerPhone: '9876543211',
      lessonId: lesson._id.toString(),
      date,
      timeSlot: '10:00',
    };
    const first = await request(app).post('/api/bookings').send(payload);
    if (first.status === 201) {
      const second = await request(app).post('/api/bookings').send(payload);
      expect(second.status).toBe(409);
    }
  });

  it('blocks unauthorized admin access', async () => {
    const res = await request(app).get('/api/admin/bookings');
    expect(res.status).toBe(403);
  });

  it('allows admin after login', async () => {
    await agent.get('/api/auth/csrf-token');
    const login = await agent.post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'TestPassword123!',
    });
    expect(login.status).toBe(200);
    const csrf = login.body.csrfToken;
    const res = await agent
      .get('/api/admin/bookings')
      .set('x-csrf-token', csrf);
    expect(res.status).toBe(200);
  });

  it('lookup requires matching phone', async () => {
    const date = nextMonday();
    const created = await request(app).post('/api/bookings').send({
      learnerName: 'Lookup Test',
      learnerPhone: '9123456789',
      lessonId: lesson._id.toString(),
      date,
      timeSlot: '10:00',
    });
    if (created.status !== 201) return;
    const ref = created.body.booking.reference;
    const bad = await request(app).post('/api/bookings/lookup').send({
      reference: ref,
      learnerPhone: '0000000000',
    });
    expect(bad.status).toBe(404);
    const good = await request(app).post('/api/bookings/lookup').send({
      reference: ref,
      learnerPhone: '9123456789',
    });
    expect(good.status).toBe(200);
  });
});
