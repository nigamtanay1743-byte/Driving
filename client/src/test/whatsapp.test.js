import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl, WHATSAPP_PLACEHOLDER } from '../config/whatsapp';

describe('WhatsApp URL', () => {
  it('builds wa.me link with encoded message', () => {
    const url = buildWhatsAppUrl('919882051705', 'Hello world');
    expect(url).toBe('https://wa.me/919882051705?text=Hello%20world');
  });

  it('returns null when number not configured', () => {
    expect(buildWhatsAppUrl('')).toBeNull();
    expect(buildWhatsAppUrl(WHATSAPP_PLACEHOLDER)).toBeNull();
  });
});
