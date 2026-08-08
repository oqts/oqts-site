import type { Metadata } from 'next';
import CloseRule from '../../components/CloseRule';
import OrgTree from '../../components/OrgTree';
import Section from '../../components/Section';
import { getSociety } from '../../lib/data';

export const metadata: Metadata = {
  title: 'Team & structure',
  description: 'The founders, core team and research structure of the Oxford Quantitative Trading Society.',
};

export default function Team() {
  const { structure } = getSociety();
  return (
    <div className="wrap">
      <section className="watermark">
        <p className="eyebrow">Team &amp; structure</p>
        <h1>Who runs what</h1>
        <p className="lede col">
          Two co-founders, a core team, and a research structure that grows
          from Michaelmas. This chart is rendered from the society&apos;s own
          records.
        </p>
        <CloseRule />
      </section>

      <Section eyebrow="Structure" title="The tree">
        <OrgTree structure={structure} />
      </Section>

      <Section eyebrow="How it grows" title="From core team to research projects">
        <p className="col">{structure.future.note}</p>
        <p className="col">
          Research is overseen end to end by the Head of Research &amp;
          Technology. Project teams and leads will appear on this chart as
          they are formed; the projects themselves live on the{' '}
          <a href="/research">Research</a> page.
        </p>
      </Section>
    </div>
  );
}
