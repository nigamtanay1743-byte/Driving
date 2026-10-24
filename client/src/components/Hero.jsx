import { siteContent } from '../config/siteContent';
import { WhatsAppLink } from './WhatsAppButton';

export function Hero({ onBookClick, whatsappNumber }) {
  const { hero } = siteContent;
  return (
    <section className="section-pad border-b border-border/40">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-gold uppercase">{siteContent.locationTag}</p>
          <h1 className="font-display text-4xl leading-tight text-cream md:text-5xl lg:text-[3.25rem]">
            {hero.title}{' '}
            <em className="text-gold not-italic">{hero.titleEmphasis}</em>
            <br />
            {hero.titleEnd}
          </h1>
          <p className="mt-6 max-w-xl text-muted leading-relaxed">{hero.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-gold" onClick={onBookClick}>
              Book ₹400 Demo Ride
            </button>
            <WhatsAppLink
              phoneNumber={whatsappNumber}
              className="btn btn-outline gap-2"
            >
              WhatsApp Us
            </WhatsAppLink>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {siteContent.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="text-gold text-lg" aria-hidden="true">{s.icon}</div>
                <h4 className="mt-1 text-xs font-semibold text-cream">{s.label}</h4>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div className="rounded-2xl border border-border bg-gradient-to-b from-ink-light to-card p-8">
            <div className="mx-auto flex h-64 w-24 flex-col items-center justify-center rounded-full bg-[#1a2030]">
              <div className="h-full w-1 rounded-full bg-[#2a3344]" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 py-12">
              <span className="rounded-full border border-gold/30 bg-ink/80 px-3 py-1 text-[10px] text-gold">
                Start • Demo Ride
              </span>
              <span className="rounded-full border border-gold/30 bg-ink/80 px-3 py-1 text-[10px] text-gold">
                15-Day Course
              </span>
              <span className="rounded-full border border-gold/30 bg-ink/80 px-3 py-1 text-[10px] text-gold">
                Full License • 25 Days
              </span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">🚗</div>
          </div>
        </div>
      </div>
    </section>
  );
}
