import Link from 'next/link';
import { getAllSponsors } from '../lib/data';

// Continuously rotating strip under the masthead; the whole band is one
// link to the Sponsors page. The track is two identical halves and the
// animation translates exactly one half, so the loop is seamless; each
// half repeats the logo set enough times to stay wider than any viewport,
// so the belt is always full. Under prefers-reduced-motion the drift
// stops and the strip reads as a static row.
const REPEATS = 6; // ~4200px per half, wider than ultrawide monitors

export default function SponsorBanner() {
  const sponsors = getAllSponsors();
  return (
    <Link href="/sponsors" className="sponsor-banner" aria-label="Our sponsors">
      <div className="sponsor-track">
        {[0, 1].map((half) => (
          <div className="group" key={half} aria-hidden={half === 1}>
            {Array.from({ length: REPEATS }, (_, rep) =>
              sponsors.map((s) => (
                <img
                  key={`${rep}-${s.name}`}
                  src={s.logo}
                  alt={half === 0 && rep === 0 ? s.name : ''}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </Link>
  );
}
