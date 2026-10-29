import { siteContent } from '../config/siteContent';
import { WhatsAppLink } from './WhatsAppButton';

const pathSteps = siteContent.lessons.map((lesson) => ({
  id: lesson.id,
  badge: lesson.badge,
  name: lesson.name,
  price: lesson.price,
  duration: lesson.durationLabel,
}));

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
            <WhatsAppLink phoneNumber={whatsappNumber} className="btn btn-outline gap-2">
              WhatsApp Us
            </WhatsAppLink>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {siteContent.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="text-gold text-lg" aria-hidden="true">
                  {s.icon}
                </div>
                <h4 className="mt-1 text-xs font-semibold text-cream">{s.label}</h4>
              </div>
            ))}
          </div>
        </div>

        <aside
          className="mx-auto w-full max-w-md lg:max-w-none"
          aria-label="Training packages overview"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-ink-light via-card to-[#0f141c] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)]">
            <div className="border-b border-border/80 bg-ink/30 px-6 py-5 md:px-8">
              <p className="text-[11px] font-bold tracking-[0.22em] text-gold uppercase">Your learning path</p>
              <p className="mt-1 font-display text-xl text-cream md:text-2xl">From first demo to road-ready</p>
            </div>

            <ol className="relative px-6 py-6 md:px-8 md:py-7">
              {pathSteps.map((step, index) => (
                <li key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
                  {index < pathSteps.length - 1 ? (
                    <span
                      className="absolute left-4 top-9 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent"
                      aria-hidden="true"
                    />
                  ) : null}

                  <div
                    className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ink-light text-xs font-bold text-gold shadow-[0_0_0_4px_rgba(13,16,22,0.9)]"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-border/90 bg-ink/50 px-4 py-3.5 transition-colors hover:border-gold/25">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-gold uppercase">{step.badge}</p>
                        <h3 className="mt-0.5 text-sm font-semibold leading-snug text-cream md:text-base">{step.name}</h3>
                      </div>
                      <p className="font-display text-xl text-gold md:text-2xl">
                        ₹{step.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-muted">{step.duration} · one-on-one instruction</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex items-center justify-between gap-3 border-t border-border/80 bg-ink/40 px-6 py-4 text-xs text-muted md:px-8">
              <span>Real hill roads · Sidhbari</span>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 font-semibold text-gold">
                Govt approved
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
