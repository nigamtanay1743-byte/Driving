import { env } from '../config/env.js';

export function parseDateOnly(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date format');
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}

/** Build a UTC Date for a local calendar date + HH:mm in the configured timezone. */
export function localDateTimeToUtc(dateStr, timeStr) {
  const { year, month, day } = parseDateOnly(dateStr);
  const [hour, minute] = timeStr.split(':').map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: env.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(probe);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  const shownHour = get('hour') % 24;
  const offsetMinutes =
    (shownHour - hour) * 60 +
    (get('minute') - minute) +
    (get('day') - day) * 24 * 60;
  return new Date(probe.getTime() - offsetMinutes * 60 * 1000);
}

export function formatLocalDate(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: env.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatLocalTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: env.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isPastDate(dateStr) {
  const today = formatLocalDate(new Date());
  return dateStr < today;
}

export function dayOfWeekFromDateStr(dateStr) {
  const { year, month, day } = parseDateOnly(dateStr);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
