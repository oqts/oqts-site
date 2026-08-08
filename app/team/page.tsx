import type { Metadata } from 'next';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';
import TeamTree from '../../components/TeamTree';
import { getSociety } from '../../lib/data';

export const metadata: Metadata = {
  title: 'Team & structure',
  description: 'The committee and teams of the Oxford Quantitative Trading Society.',
};

export default function Team() {
  const { committee, teams } = getSociety();
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow">Team &amp; structure</p>
        <h1>Who runs what</h1>
        <p className="lede col">
          An elected committee and standing teams. The structure below is the
          live one — it is rendered from the society&apos;s own records.
        </p>
        <CloseRule />
      </section>

      <Section eyebrow="Committee" title="Committee">
        <div className="grid g3">
          {committee.map((m) => (
            <div className="panel" key={m.role}>
              <p className="role-label">{m.role}</p>
              <p className="person" style={{ fontSize: 'var(--oqts-label)' }}>
                {m.links?.linkedin ? <a href={m.links.linkedin}>{m.name}</a> : m.name}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Teams" title="Standing teams">
        <TeamTree teams={teams} />
      </Section>
    </div>
  );
}
