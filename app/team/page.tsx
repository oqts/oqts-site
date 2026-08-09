import type { Metadata } from 'next';
import Btn from '../../components/Btn';
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
      <section>
        <div className="plate watermark v2">
          <p className="eyebrow">Team &amp; structure</p>
          <h1>Who runs what</h1>
          <p className="lede col">
            Two co-founders, a core team, and a research structure that grows from Michaelmas.
          </p>
          <div className="btn-row">
            <Btn href="/join">Join the team</Btn>
            <Btn href="/research" secondary>Research programme</Btn>
          </div>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="Structure" title="The tree">
        <OrgTree structure={structure} />
      </Section>

      <Section eyebrow="How it grows" title="From core team to research projects">
        <p className="col">{structure.future.note}</p>
        <p className="col">
          A team lives with one research area for a term or a year, going deep enough to learn everything there is to know about it, and finishes by writing it up as a research paper or article. After review, a strategy that looks promising may be deployed live. Project teams and leads will appear on this chart as they are formed; the projects themselves live on the{' '}
          <a href="/research">Research</a> page.
        </p>
      </Section>
    </div>
  );
}
