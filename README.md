# Driving Lesson Booking — Full-Stack App

A secure driving-school booking website inspired by the [Ganpati Driving Training School reference](https://tangerine-starlight-bb847f.netlify.app): dark/gold branding, lesson packages, real backend bookings, admin dashboard, and direct WhatsApp chat links (no WhatsApp Business API).

## Stack

| Layer | Tech |
|--------|------|
| Frontend | React (Vite), React Router, Tailwind CSS v4, Axios |
| Backend | Node.js, Express 5, Mongoose, Zod, Argon2id, express-session |
| Database | MongoDB |

## Prerequisites

- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas URI)

## Quick start

1. **Clone / open the project** and install dependencies:

   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and edit values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose |
   |----------|---------|
   | `MONGODB_URI` | MongoDB connection string |
   | `SESSION_SECRET` | Long random string (32+ chars) for session cookies |
   | `CLIENT_ORIGIN` | Frontend URL (e.g. `http://localhost:5173`) |
   | `BUSINESS_WHATSAPP_NUMBER` | International digits only, e.g. `919882051705` |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by the seed script |

   Generate a session secret (PowerShell example):

   ```powershell
   [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
   ```

3. **Create the first admin** (no public registration):

   ```bash
   npm run seed:admin
   ```

4. **Run dev servers** (API + UI):

   ```bash
   npm run dev
   ```

   - Site: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - Admin login: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

On first API start, default **lessons** (₹400 / ₹4,500 / ₹7,500) and **weekly availability** (Mon–Sat, morning/evening blocks) are seeded if the database is empty.

## WhatsApp configuration

Set `BUSINESS_WHATSAPP_NUMBER` in `.env` (digits only, country code included). The frontend loads this from `GET /api/config` and builds links via `https://wa.me/{number}?text=...` in `client/src/config/whatsapp.js`.

Opening WhatsApp is **manual** — there is no WhatsApp Business API, webhooks, or automated messaging.

## Booking flow

1. Learner opens **Book a Lesson**, selects package, date, and available slot.
2. `POST /api/bookings` validates input, checks availability, prevents double-booking (overlap check + unique partial index on `startTime` for active bookings).
3. Confirmation shows booking **reference** (e.g. `GDT-20261025-ABC123`).
4. **Check booking**: use the “Check your booking” section with reference + phone number (`POST /api/bookings/lookup`).

## Admin dashboard

After login (`/admin/login`):

- Overview stats and upcoming sessions
- List/filter bookings; confirm, reject, or complete
- View lessons and weekly availability (edit via API below; UI can be extended)

Protected routes require a session cookie and `x-csrf-token` on mutating requests.

### Admin API (session + CSRF required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Stats |
| GET | `/api/admin/bookings` | List (`status`, `search`, `date`, `page`, `limit`) |
| PATCH | `/api/admin/bookings/:id/status` | `{ "status": "confirmed" }` etc. |
| PATCH | `/api/admin/bookings/:id/reschedule` | `{ "date", "timeSlot" }` |
| GET/POST/PATCH/DELETE | `/api/admin/lessons` | Lesson CRUD |
| GET/POST | `/api/admin/availability` | Weekly slots per `dayOfWeek` (0=Sun) |
| GET/POST/DELETE | `/api/admin/availability/blocked` | Block specific dates |

## Public API

| Method | Path |
|--------|------|
| GET | `/api/config` |
| GET | `/api/lessons` |
| GET | `/api/availability?date=YYYY-MM-DD&lessonId=...` |
| POST | `/api/bookings` |
| POST | `/api/bookings/lookup` |

## Tests

```bash
npm run test
```

Server tests use `mongodb-memory-server` (first run may download a MongoDB binary). Client tests cover WhatsApp URL generation.

Production build:

```bash
npm run build -w client
```

## Security checklist (production)

- [ ] HTTPS everywhere; `NODE_ENV=production` (secure cookies)
- [ ] Strong `SESSION_SECRET` and MongoDB credentials (least privilege)
- [ ] `CLIENT_ORIGIN` set to your real frontend URL only
- [ ] Rotate admin password; keep `seed:admin` off production deploy paths
- [ ] Do not commit `.env`
- [ ] Rate limits are enabled on login and booking endpoints
- [ ] Helmet + CORS + HttpOnly session cookies + CSRF on admin mutations

## Project layout

```text
client/src/   — React UI, site content, WhatsApp helpers, admin pages
server/src/   — API, models, validation, booking logic
```

## Reference vs this build

The reference is a single-page marketing site with a modal form and UPI/WhatsApp confirmation. This project keeps the same visual direction and packages, connects the form to **MongoDB**, adds **slot availability**, **booking lookup**, and a **secured admin** area — without payment gateway integration (pay offline/UPI as on the reference).
