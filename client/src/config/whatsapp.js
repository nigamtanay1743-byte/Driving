import { siteContent } from './siteContent';

/** Configure BUSINESS_WHATSAPP_NUMBER in server .env (international, no + or spaces). */
export const WHATSAPP_PLACEHOLDER = 'YOUR_INTERNATIONAL_PHONE_NUMBER';

export function buildWhatsAppUrl(phoneNumber, message = siteContent.whatsappDefaultMessage) {
  const number = (phoneNumber || WHATSAPP_PLACEHOLDER).replace(/\D/g, '');
  if (!number || number === WHATSAPP_PLACEHOLDER) {
    return null;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
