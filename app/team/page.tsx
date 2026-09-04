import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import OrgTree from '../../components/OrgTree';
import Section from '../../components/Section';
import { getSociety } from '../../lib/data';
import { getBios } from '../../lib/team';

export const metadata: Metadata = {
  title: 'Team & structure',
  description: 'The founders, core team and research structure of the Oxford Quantitative Trading Society.',
};

// The structure is society.yml, edited in GitHub. The paragraph on each
// card is the person's own, written on the platform and fetched here, so
// the two are merged before the tree is drawn rather than inside it:
// OrgTree and PersonCard should not need to know where a bio came from.
//
// A bio in society.yml is no longer read. The field was removed there
// when this landed, so there is nothing to fall back to and nothing to
// disagree with.
export default async function Team() {
  const { structure } = getSociety();
  const bios = await getBios();
  const withBio = <T extends { name: string }>(people: T[]) =>
    people.map((p) => (bios[p.name] ? { ...p, bio: bios[p.name] } : p));
  const structureWithBios = {
    ...structure,
    founders: withBio(structure.founders),
    core: withBio(structure.core),
  };
  return (
    <div className="wrap">
      <div className="ground g5" aria-hidden="true" />
      <section>
        <div className="plate">
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
              </section>

      <Section eyebrow="Structure" title="The tree">
        <OrgTree structure={structureWithBios} />
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
