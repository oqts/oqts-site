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
      <section className="watermark">
        <p className="eyebrow">Research</p>
        <h1>Small teams, real stakes</h1>
        <p className="lede col">
          The society&apos;s research programme runs as a set of small project
          teams, each pursuing one idea far enough to know whether it deserves
          real capital.
        </p>
        <CloseRule />
      </section>

      <Section eyebrow="The model" title="How research is organised">
        <div className="grid g3">
          <div className="panel">
            <h4>Projects</h4>
            <p className="note">
              Around five projects run at a time, four members each. Every
              project has a project lead who owns its direction and its
              write-ups.
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
              Projects that survive scrutiny may graduate to live strategies,
              trading real capital under the society&apos;s live-fund
              programme.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="The path" title="From idea to live capital">
        <div className="bracketed">
          <p style={{ marginBottom: 0 }}>
            Research → backtest → review → paper trading on OXDAQ → live
            deployment. Most ideas die on the way, and that is the point: the
            programme teaches the discipline of killing your own ideas with
            evidence before the market does it for you.
          </p>
        </div>
      </Section>

      <Section eyebrow="Projects" title="First cohort: Michaelmas 2026">
        <p className="col">{future.note}</p>
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
