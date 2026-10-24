import { siteContent } from '../config/siteContent';
import { WhatsAppLink } from './WhatsAppButton';

export function ContactSection({ whatsappNumber }) {
  return (
    <section id="contact" className="section-pad bg-ink-light/40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-cream md:text-4xl">Find us near the Clock Tower.</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-muted">
            <p>
              <a href={`tel:${siteContent.phoneDisplay.replace(/\s/g, '')}`} className="text-cream hover:text-gold">
                {siteContent.phoneDisplay}
              </a>
            </p>
            <WhatsAppLink phoneNumber={whatsappNumber} className="text-gold hover:underline">
              Chat on WhatsApp
            </WhatsAppLink>
            <p>
              <a href={siteContent.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                {siteContent.address}
              </a>
            </p>
            <a href={siteContent.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-flex">
              Get Directions
            </a>
          </div>
          <div className="rounded-xl border border-border bg-card p-2 min-h-[240px] flex items-center justify-center text-muted text-sm">
            Map embed — use your Google Maps link in production
          </div>
        </div>
      </div>
    </section>
  );
}
