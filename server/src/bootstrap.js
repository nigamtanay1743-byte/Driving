import { connectDb } from './config/db.js';
import { seedDefaultAvailability } from './services/availabilityService.js';
import { Lesson } from './models/Lesson.js';

const defaultLessons = [
  {
    name: 'Trial Demo Ride',
    slug: 'trial-demo',
    badge: 'ONE DAY',
    subtitle: 'A single guided session',
    price: 400,
    durationMinutes: 60,
    durationLabel: '1 Day',
    features: [
      'One full driving session',
      'Feel the car, meet your instructor',
      'No commitment required',
      'Amount adjusts into full course if you continue',
    ],
    sortOrder: 1,
  },
  {
    name: 'Standard Course',
    slug: 'standard-course',
    badge: '15 DAYS',
    subtitle: 'Daily practice sessions',
    price: 4500,
    durationMinutes: 60,
    durationLabel: '15 Days',
    features: [
      '15 days of one-on-one training',
      'City roads, hill roads & parking',
      'Flexible morning / evening slots',
      'Ideal for quick, focused learners',
    ],
    sortOrder: 2,
  },
  {
    name: 'Complete Course',
    slug: 'complete-course',
    badge: '200 KM · 25 DAYS',
    subtitle: 'Our most thorough program',
    price: 7500,
    durationMinutes: 90,
    durationLabel: '25 Days',
    features: [
      '200 KM of real, logged driving practice',
      'Full 25-day structured program',
      'Hill starts, reverse parking, night driving',
      'Road-test ready, best value per hour',
    ],
    sortOrder: 3,
  },
];

async function seedLessonsIfEmpty() {
  const count = await Lesson.countDocuments();
  if (count === 0) {
    await Lesson.insertMany(defaultLessons);
  }
}

let bootstrapped = false;

export async function bootstrapDatabase() {
  if (bootstrapped) return;
  await connectDb();
  await seedLessonsIfEmpty();
  await seedDefaultAvailability();
  bootstrapped = true;
}
