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
      <section>
        <div className="plate watermark v6">
          <p className="eyebrow">Sponsors</p>
          <h1>Backed by the firms that define the field</h1>
          <p className="lede col">
            Sponsorship funds the programme, the exchange and the events, and
            keeps membership free for every student.
          </p>
          <div className="btn-row">
            <Btn href="mailto:oqts@oqts.org">Sponsor the society</Btn>
          </div>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="Tiers" title="Our sponsors">
        <div className="grid g3">
          {tiers.map((tier) => (
            <div className={`tier-card ${tier.slug}`} key={tier.slug}>
              <p className="tier-label">{tier.name}</p>
              {tier.sponsors.map((s) => (
                <div className="firm" key={s.name}>
                  <a href={s.url} rel="noopener" aria-label={s.name}>
                    <img src={s.logo} alt={s.name} style={{ height: tier.logo_height }} />
                  </a>
                  {s.blurb && <p className="note">{s.blurb}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Partner with us" title="Sponsoring the society" textured={1}>
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
