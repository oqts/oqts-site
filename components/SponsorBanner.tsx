import Link from 'next/link';
import { getAllSponsors } from '../lib/data';

// Thin, static strip under the masthead: every sponsor, one quiet row.
export default function SponsorBanner() {
  return (
    <div className="sponsor-banner">
      <div className="wrap inner">
        {getAllSponsors().map((s) => (
          <a key={s.name} href={s.url} rel="noopener" aria-label={s.name}>
            <img src={s.logo} alt={s.name} />
          </a>
        ))}
        <Link href="/sponsors" className="note" style={{ whiteSpace: 'nowrap' }}>
          Our sponsors
        </Link>
      </div>
    </div>
  );
}
