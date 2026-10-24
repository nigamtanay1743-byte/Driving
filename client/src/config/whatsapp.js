import { siteContent } from './siteContent';

export const WHATSAPP_PLACEHOLDER = 'YOUR_INTERNATIONAL_PHONE_NUMBER';

export function buildWhatsAppUrl(phoneNumber, message = siteContent.whatsappDefaultMessage) {
  const number = (phoneNumber || siteContent.whatsappNumber || WHATSAPP_PLACEHOLDER).replace(/\D/g, '');
  if (!number || number === WHATSAPP_PLACEHOLDER) {
    return null;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
