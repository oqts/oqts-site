import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';
import { getSociety } from '../../lib/data';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Oxford Quantitative Trading Society.',
};

export default function Contact() {
  const { society } = getSociety();
  const links = Object.entries(society.links).filter(([, url]) => url);
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p className="lede col">
          One address reaches the committee:{' '}
          <a href={`mailto:${society.email}`}>{society.email}</a>.
        </p>
        <div className="btn-row">
          <Btn href={`mailto:${society.email}`}>Email the society</Btn>
        </div>
        <CloseRule />
      </section>

      {links.length > 0 && (
        <Section eyebrow="Elsewhere" title="Social">
          <ul>
            {links.map(([name, url]) => (
              <li key={name}>
                <a href={url}>{name}</a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section eyebrow="Sponsorship" title="Partner with the society">
        <p className="col">
          If your firm is interested in sponsoring the society — talks,
          competitions, or the programme as a whole — write to{' '}
          <a href={`mailto:${society.email}`}>{society.email}</a> and we will
          send the sponsorship prospectus.
        </p>
      </Section>
    </div>
  );
}
