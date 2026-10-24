# Deploy on Vercel

## 1. Log in (one time)

```bash
cd c:\Users\nigam\OneDrive\Desktop\Achyut
npx vercel login
```

## 2. MongoDB Atlas (required for bookings)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas  
2. Add a database user and allow network access (`0.0.0.0/0` for serverless).  
3. Copy the connection string → `MONGODB_URI`

## 3. Set Vercel environment variables

In the [Vercel project dashboard](https://vercel.com/dashboard) → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `MONGODB_URI` | Your Atlas connection string |
| `SESSION_SECRET` | Long random string (32+ characters) |
| `BUSINESS_WHATSAPP_NUMBER` | `919236295604` |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password (for seed script only) |
| `NODE_ENV` | `production` |
| `DEFAULT_TIMEZONE` | `Asia/Kolkata` |

`CLIENT_ORIGIN` is auto-set from your Vercel URL when `VERCEL_URL` is present.

## 4. Deploy

```bash
npx vercel deploy --prod --yes
```

## 5. Create admin (after first deploy)

Run locally with production `MONGODB_URI` in `.env`, or use MongoDB Compass to insert admin:

```bash
npm run seed:admin
```

Use the same `MONGODB_URI` as production.
