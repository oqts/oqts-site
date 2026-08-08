import Link from 'next/link';
import { getAllSponsors } from '../lib/data';

// Continuously drifting strip under the masthead; the whole band is one
// link to the Sponsors page. Two identical groups make the loop seamless;
// the second is decoration only. Under prefers-reduced-motion the drift
// stops and the first group reads as a static row.
export default function SponsorBanner() {
  const sponsors = getAllSponsors();
  return (
    <Link href="/sponsors" className="sponsor-banner" aria-label="Our sponsors">
      <div className="sponsor-track">
        {[0, 1].map((copy) => (
          <div className="group" key={copy} aria-hidden={copy === 1}>
            {sponsors.map((s) => (
              <img key={s.name} src={s.logo} alt={copy === 0 ? s.name : ''} />
            ))}
          </div>
        ))}
      </div>
    </Link>
  );
}
