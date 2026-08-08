import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';

export const metadata: Metadata = {
  title: 'About',
  description:
    'What the Oxford Quantitative Trading Society is, what membership looks like, and how the society is organised.',
};

export default function About() {
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow">About</p>
        <h1>A society built around real markets</h1>
        <p className="lede col">
          The Oxford Quantitative Trading Society exists for one reason: the
          best way to understand markets is to participate in them, measure the
          result, and argue about why.
        </p>
        <CloseRule />
      </section>

      <Section eyebrow="Membership" title="What being a member looks like">
        <p className="col">
          Members follow a term programme that moves from foundations — how an
          order book works, what a market maker actually does — to building and
          testing strategies of their own. The centre of gravity is OXDAQ, our
          internal exchange: everything taught in a talk gets used in a
          competition within weeks.
        </p>
        <p className="col">
          No prior experience is required to apply, and no particular degree.
          Mathematicians, computer scientists, physicists, economists, PPEists
          and historians have all traded on OXDAQ; curiosity and willingness to
          lose play-money in public are the only prerequisites.
        </p>
      </Section>

      <Section eyebrow="Structure" title="How the society is organised">
        <div className="grid g3">
          <div className="panel">
            <h4>Committee</h4>
            <p className="note">
              An elected committee runs the society — programme, finances and
              partnerships.
            </p>
          </div>
          <div className="panel">
            <h4>Teams</h4>
            <p className="note">
              Standing teams build and run what the society depends on, from
              the OXDAQ exchange to the speaker series.
            </p>
          </div>
          <div className="panel">
            <h4>Competitions</h4>
            <p className="note">
              Trading competitions run through term on OXDAQ, open to all
              members.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 'var(--oqts-space-5)' }}>
          <Btn href="/team" secondary>See the full structure</Btn>
        </p>
      </Section>

      <Section eyebrow="Sponsors" title="Backing">
        <p className="col">
          The society is backed by G-Research, Jane Street, Optiver and Hudson
          River Trading — firms whose day job is the subject matter. Their
          support funds the programme and keeps membership free.
        </p>
      </Section>

      <Section eyebrow="Next step" title="Join us">
        <div className="bracketed">
          <p className="col" style={{ marginBottom: 'var(--oqts-space-5)' }}>
            Applications for the live-fund cohort open in early September 2026.
            The mailing list is the reliable way to hear the moment they do.
          </p>
          <Btn href="/join">Go to Join</Btn>
        </div>
      </Section>
    </div>
  );
}
