import argon2 from 'argon2';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const mongoUri = process.env.MONGODB_URI;

if (!email || !password || !mongoUri) {
  console.error('Set ADMIN_EMAIL, ADMIN_PASSWORD, and MONGODB_URI in .env');
  process.exit(1);
}

if (password.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters');
  process.exit(1);
}

async function main() {
  await mongoose.connect(mongoUri);
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin user already exists for', email);
    process.exit(0);
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  await User.create({
    name: 'Administrator',
    email: email.toLowerCase(),
    passwordHash,
    role: 'admin',
  });
  console.log('Admin user created for', email);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
