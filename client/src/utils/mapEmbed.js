import { siteContent } from '../config/siteContent';

export function getMapEmbedUrl() {
  if (siteContent.mapEmbedUrl?.trim()) {
    return siteContent.mapEmbedUrl.trim();
  }
  const query = encodeURIComponent(
    `${siteContent.address}, Sidhbari, Dharamshala, Himachal Pradesh, India`
  );
  return `https://www.google.com/maps?q=${query}&z=15&output=embed`;
}
