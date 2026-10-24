import { siteContent } from '../config/siteContent';
import trainingSide from '../assets/fleet/training-side.jpg';
import trainingFront from '../assets/fleet/training-front.jpg';
import schoolSidhbari from '../assets/fleet/school-sidhbari.jpg';

const fleetImages = [
  {
    src: trainingSide,
    alt: 'Red Maruti Alto 800 training vehicle — side view',
    caption: 'Training vehicle',
    className: 'row-span-2 h-full min-h-0',
  },
  {
    src: trainingFront,
    alt: 'Training car front view with registration HP 40C 7038',
    caption: 'HP 40C 7038',
    className: 'h-full min-h-0',
  },
  {
    src: schoolSidhbari,
    alt: 'Ganpati Driving Training School at Sidhbari',
    caption: 'Our school, Sidhbari',
    className: 'h-full min-h-0',
  },
];

export function FleetSection({ onBookClick }) {
  const { fleet } = siteContent;
  return (
    <section id="fleet" className="section-pad border-y border-border/40 bg-ink-light/30">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Our training car</p>
          <h2 className="mt-2 font-display text-3xl text-cream md:text-4xl">{fleet.heading}</h2>
          <p className="mt-4 text-muted leading-relaxed">{fleet.description}</p>
          <ul className="mt-8 space-y-4">
            {fleet.details.map((d) => (
              <li key={d.label} className="flex gap-4 border-b border-border pb-3 text-sm">
                <span className="w-28 shrink-0 font-semibold text-gold">{d.label}</span>
                <span className="text-muted">{d.value}</span>
              </li>
            ))}
          </ul>
          {onBookClick && (
            <button type="button" className="btn btn-gold mt-8" onClick={onBookClick}>
              Take It For a Demo
            </button>
          )}
        </div>

        <div className="w-full min-w-0 max-lg:relative max-lg:left-1/2 max-lg:w-screen max-lg:max-w-[100vw] max-lg:-translate-x-1/2 lg:left-auto lg:translate-x-0">
          <div className="grid w-full grid-cols-2 grid-rows-2 gap-2 px-4 sm:gap-3 sm:px-6 lg:px-0 aspect-[4/3] min-h-[220px] max-h-[min(75vh,580px)]">
          {fleetImages.map((img) => (
            <figure
              key={img.caption}
              className={`relative overflow-hidden rounded-xl border border-border bg-card ${img.className}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <figcaption
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2.5 text-[10px] font-semibold tracking-wide text-gold uppercase sm:text-xs"
              >
                {img.caption}
              </figcaption>
            </figure>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
