import { siteContent } from '../config/siteContent';
import { WhatsAppLink } from './WhatsAppButton';

export function Footer({ whatsappNumber, onBookClick }) {
  return (
    <footer className="border-t border-border bg-ink-light/60 px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-cream">{siteContent.businessName}</p>
          <p className="mt-2 text-sm text-muted">{siteContent.footerTagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-cream">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><a href="#why-us" className="hover:text-gold">Why Us</a></li>
            <li><a href="#pricing" className="hover:text-gold">Courses & Pricing</a></li>
            <li><a href="#fleet" className="hover:text-gold">Our Fleet</a></li>
            <li><a href="#reviews" className="hover:text-gold">Reviews</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-cream">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href={`tel:${siteContent.phoneDisplay.replace(/\s/g, '')}`}>{siteContent.phoneDisplay}</a>
            </li>
            <li>
              <WhatsAppLink phoneNumber={whatsappNumber} className="hover:text-gold">
                WhatsApp Us
              </WhatsAppLink>
            </li>
            <li>
              <a href={siteContent.mapUrl} target="_blank" rel="noopener noreferrer">{siteContent.address}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-border pt-8 text-center">
        <h2 className="font-display text-2xl text-cream">{siteContent.cta.heading}</h2>
        <p className="mt-2 text-muted">{siteContent.cta.text}</p>
        <button type="button" className="btn btn-gold mt-6" onClick={onBookClick}>
          Book Your Demo Ride
        </button>
      </div>
    </footer>
  );
}
