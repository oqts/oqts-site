import { getSponsors } from '../lib/data';

// Fixed-height rows sized from sponsors.yml so artwork swaps never reflow.
export default function SponsorStrip() {
  const { tiers } = getSponsors();
  return (
    <div>
      {tiers.map((tier) => (
        <div className="sponsor-tier" key={tier.name}>
          <p className="tier-label">{tier.name}</p>
          <div className="sponsor-row" style={{ minHeight: tier.logo_height }}>
            {tier.sponsors.map((s) => (
              <a key={s.name} href={s.url} rel="noopener" aria-label={s.name}>
                <img src={s.logo} alt={s.name} style={{ height: tier.logo_height }} />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
