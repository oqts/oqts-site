import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';
import { getSociety } from '../../lib/data';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'The research programme of the Oxford Quantitative Trading Society: small project teams working towards live-deployable strategies.',
};

export default function Research() {
  const { future } = getSociety().structure;
  return (
    <div className="wrap">
      <div className="ground g6" aria-hidden="true" />
      <section>
        <div className="plate watermark v3">
          <p className="eyebrow">Research</p>
          <h1>Small teams, real stakes</h1>
          <p className="lede col">
            The society&apos;s research programme runs as small project teams, each living with one idea, from systematic strategies to market microstructure, for long enough to know whether it deserves real capital.
          </p>
          <div className="btn-row">
            <Btn href="https://github.com/oqts">Society GitHub</Btn>
            <span className="btn secondary" aria-disabled="true">Papers &amp; writeups</span>
          </div>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="The model" title="How research is organised">
        <div className="grid g3">
          <div className="panel">
            <h4>Projects</h4>
            <p className="note">
              Around five projects run at a time, four members each, every one with a project lead. A team goes deep on its area over a term or a year and finishes with a research paper or article.
            </p>
          </div>
          <div className="panel">
            <h4>Oversight</h4>
            <p className="note">
              All projects report to the Head of Research &amp; Technology,
              who sets standards for methodology, data handling and honest
              measurement.
            </p>
          </div>
          <div className="panel">
            <h4>Deployment</h4>
            <p className="note">
              After review, strategies that look promising may be deployed live, trading real capital under the society&apos;s live-fund programme.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="The path" title="From idea to live capital">
        <div className="bracketed">
          <p style={{ marginBottom: 0 }}>
            Research → backtest → review → live deployment. Most ideas die on the way, and that is the point: the
            programme teaches the discipline of killing your own ideas with
            evidence before the market does it for you.
          </p>
        </div>
      </Section>

      <Section eyebrow="Projects" title="First cohort: Michaelmas 2026">
        <p className="col">{future.note}</p>
        <p className="col">
          Down the line, a research competition may see teams present their
          strategies and wider research for judging by our sponsors.
        </p>
        <div className="project-row">
          {Array.from({ length: future.count }, (_, i) => (
            <div className="org-card ghost" key={i} style={{ textAlign: 'center' }}>
              <span className="role-label">Project {i + 1}</span>
              <span className="name">Announced Michaelmas</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Take part" title="Research starts with joining">
        <div className="bracketed">
          <p style={{ marginBottom: 'var(--oqts-space-5)' }}>
            Project teams are recruited from the membership. Apply now and the
            first cohort of projects is yours to shape.
          </p>
          <Btn href="/join">Join the society</Btn>
        </div>
      </Section>
    </div>
  );
}
