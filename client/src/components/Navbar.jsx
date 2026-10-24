import { siteContent } from '../config/siteContent';

const links = [
  { href: '#why-us', label: 'Why Us' },
  { href: '#pricing', label: 'Courses & Pricing' },
  { href: '#fleet', label: 'Our Fleet' },
  { href: '#reviews', label: 'Reviews' },
];

export function Navbar({ onBookClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ink-light text-sm font-bold text-gold"
            aria-hidden="true"
          >
            GD
          </div>
          <div>
            <div className="font-display text-lg leading-tight text-cream">{siteContent.businessName}</div>
            <div className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
              {siteContent.businessSubtitle}
            </div>
          </div>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold transition">
              {l.label}
            </a>
          ))}
        </nav>
        <button type="button" className="btn btn-gold btn-sm text-xs md:text-sm" onClick={onBookClick}>
          Book a Lesson
        </button>
      </div>
    </header>
  );
}
