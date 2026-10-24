import { siteContent } from '../config/siteContent';

export function WhyUsSection() {
  const { whyUs } = siteContent;
  return (
    <section id="why-us" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-cream md:text-4xl">{whyUs.heading}</h2>
        <p className="mt-3 max-w-2xl text-muted">{whyUs.subheading}</p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {whyUs.items.map((item) => (
            <div key={item.n} className="border-t border-border pt-6">
              <span className="text-xs font-bold text-gold">{item.n}</span>
              <h3 className="mt-2 font-display text-xl text-cream">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
