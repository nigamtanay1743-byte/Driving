export function formatBookingWhatsAppMessage(form, lesson) {
  const lines = [
    'Hi, I would like to book a driving lesson.',
    '',
    `Name: ${form.learnerName}`,
    `Phone: ${form.learnerPhone}`,
  ];

  if (form.learnerEmail?.trim()) {
    lines.push(`Email: ${form.learnerEmail.trim()}`);
  }

  if (lesson) {
    lines.push(
      `Package: ${lesson.name} (₹${lesson.price.toLocaleString('en-IN')})`
    );
  }

  lines.push(`Preferred start date: ${form.date}`);

  if (form.preferredTime) {
    lines.push(`Preferred time: ${form.preferredTime}`);
  }

  if (form.pickupLocation?.trim()) {
    lines.push(`Pickup location: ${form.pickupLocation.trim()}`);
  }

  if (form.notes?.trim()) {
    lines.push(`Notes: ${form.notes.trim()}`);
  }

  lines.push('', 'Please confirm my slot. Thank you!');

  return lines.join('\n');
}
