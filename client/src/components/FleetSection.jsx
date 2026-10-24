import { siteContent } from '../config/siteContent';

export function FleetSection() {
  const { fleet } = siteContent;
  return (
    <section id="fleet" className="section-pad border-y border-border/40 bg-ink-light/30">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl text-cream md:text-4xl">{fleet.heading}</h2>
          <p className="mt-4 text-muted leading-relaxed">{fleet.description}</p>
          <ul className="mt-8 space-y-4">
            {fleet.details.map((d) => (
              <li key={d.label} className="flex gap-4 border-b border-border pb-3 text-sm">
                <span className="w-28 shrink-0 font-semibold text-gold">{d.label}</span>
                <span className="text-muted">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-card to-ink-light text-6xl"
          aria-hidden="true"
        >
          🚙
        </div>
      </div>
    </section>
  );
}
