import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';
import { getSociety, getSponsors } from '../../lib/data';

export const metadata: Metadata = {
  title: 'Sponsors',
  description:
    'The firms backing the Oxford Quantitative Trading Society: G-Research, Jane Street, Optiver and Hudson River Trading.',
};

export default function SponsorsPage() {
  const { tiers } = getSponsors();
  const { society } = getSociety();
  return (
    <div className="wrap">
      <div className="ground g3" aria-hidden="true" />
      <section>
        <div className="plate">
          <p className="eyebrow">Sponsors</p>
          <h1>Backed by field-defining firms</h1>
          <p className="lede col">
            Sponsorship funds the programme, the exchange, and the events that make the society run.
          </p>
          <div className="btn-row">
            <Btn href="mailto:oqts@oqts.org">Sponsor the society</Btn>
          </div>
        </div>
              </section>

      <Section eyebrow="Tiers" title="Our sponsors">
        {tiers.map((tier) => (
          <div className={`tier-block ${tier.slug}`} key={tier.slug}>
            <p className="tier-label">{tier.name}</p>
            <div className={`tier-grid ${tier.slug}`}>
              {tier.sponsors.map((s) => (
                <div className="firm-card" key={s.name}>
                  <a href={s.url} rel="noopener" aria-label={s.name}>
                    <img src={s.logo} alt={s.name} style={{ height: s.logo_height ?? tier.logo_height }} />
                  </a>
                  {s.blurb && <p className="note">{s.blurb}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section eyebrow="Partner with us" title="Sponsoring the society">
        <p className="col">
          If your firm would like to reach Oxford&apos;s quantitative talent
          through talks, competitions or the programme as a whole, write to{' '}
          <a href={`mailto:${society.email}`}>{society.email}</a> and we will
          send the sponsorship prospectus.
        </p>
      </Section>
    </div>
  );
}
