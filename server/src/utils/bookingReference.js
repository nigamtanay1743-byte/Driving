import { customAlphabet } from 'nanoid';

const suffix = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6);

export function generateBookingReference() {
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `GDT-${y}${m}${d}-${suffix()}`;
}
