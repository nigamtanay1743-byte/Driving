export function PricingSection({ lessons, onBookLesson }) {
  return (
    <section id="pricing" className="section-pad bg-ink-light/40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-cream md:text-4xl">Pick your route to the license.</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Three ways to start — from a single trial ride to a complete, road-ready course. All fees include personal one-on-one instruction.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {lessons.map((lesson, i) => (
            <article
              key={lesson._id}
              className={`relative flex flex-col rounded-xl border bg-card p-6 ${
                i === 1 ? 'border-gold/50 shadow-[0_0_0_1px_rgba(233,205,124,0.15)]' : 'border-border'
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-[10px] font-bold text-ink uppercase">
                  Most booked
                </span>
              )}
              <p className="text-xs font-bold tracking-widest text-gold uppercase">{lesson.badge}</p>
              <h3 className="mt-2 font-display text-2xl text-cream">{lesson.name}</h3>
              <p className="text-sm text-muted">{lesson.subtitle}</p>
              <p className="mt-4 font-display text-4xl text-cream">₹{lesson.price.toLocaleString('en-IN')}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
                {(lesson.features || []).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-gold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn btn-gold mt-6 w-full"
                onClick={() => onBookLesson(lesson._id)}
              >
                {lesson.slug === 'trial-demo' ? 'Book the Demo' : 'Book This Package'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
