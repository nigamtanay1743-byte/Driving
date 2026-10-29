import { siteContent } from '../config/siteContent';

export function ReviewsSection() {
  const { reviews } = siteContent;
  return (
    <section id="reviews" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-cream md:text-4xl">{reviews.heading}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.quotes.map((q) => (
            <blockquote
              key={q}
              className="rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted"
            >
              {q}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
