import { siteContent } from './siteContent';

/** Optional override: VITE_BUSINESS_WHATSAPP_NUMBER in client .env */
export function getWhatsAppNumber() {
  const fromEnv = import.meta.env.VITE_BUSINESS_WHATSAPP_NUMBER;
  return (fromEnv || siteContent.whatsappNumber || '').replace(/\D/g, '');
}

export const lessonPackages = siteContent.lessons;
