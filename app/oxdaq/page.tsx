import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';

export const metadata: Metadata = {
  title: 'OXDAQ',
  description:
    "OXDAQ is the Oxford Quantitative Trading Society's own live exchange: members write algorithmic strategies and compete in live rounds on a real order book.",
};

export default function Oxdaq() {
  return (
    <div className="wrap">
      <section>
        <div className="plate watermark v4">
          <p className="eyebrow">OXDAQ</p>
          <h1>The society&apos;s own exchange</h1>
          <p className="lede col">
            A real-time exchange built by the society: write an algorithmic strategy, connect it to a live order book, and compete in rounds against everyone else&apos;s.
          </p>
          <div className="btn-row">
            <span className="btn" aria-disabled="true">OXDAQ platform</span>
            <span className="btn secondary" aria-disabled="true">Competition entry</span>
          </div>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="Why" title="Why build an exchange?" textured={6}>
        <p className="col">
          Because real market making is normally out of students&apos; reach: the data and infrastructure it needs do not exist outside the firms themselves. OXDAQ closes that gap. It is a live exchange with real market mechanics, a price-time order book, and instruments whose fair value is never revealed; you infer it from the order flow, the way every real desk has to. The exchange is built by the core team, and members join the build as the society grows.
        </p>
      </Section>

      <Section eyebrow="How it works" title="Compete in three steps">
        <div className="grid g3">
          <div className="panel">
            <h4>1 · Write</h4>
            <p className="note">
              Write your strategy against the OXDAQ client library: a few event
              handlers and you are on the book. The infrastructure is our
              problem, not yours.
            </p>
          </div>
          <div className="panel">
            <h4>2 · Compete</h4>
            <p className="note">
              Rounds run live. Your algorithm trades against other members and
              an ecosystem of bots, from market makers to noise traders, on
              instruments that never stand still.
            </p>
          </div>
          <div className="panel">
            <h4>3 · Iterate</h4>
            <p className="note">
              Track your performance live, pause your algorithm, change
              something, and redeploy mid-round. The effect of every change is
              visible immediately.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Calendar" title="Through the year" textured={2}>
        <p className="col">
          Competition rounds run through each term, building from simple
          market-making games to multi-instrument events. Dates land on the{' '}
          events page as each round is announced.
        </p>
        <Btn href="/events" secondary>See upcoming events</Btn>
      </Section>

      <Section eyebrow="Take part" title="Trade on it">
        <div className="bracketed">
          <p className="col" style={{ marginBottom: 'var(--oqts-space-5)' }}>
            Membership is the way in. Every member can compete in every round, and the team that builds OXDAQ recruits from the membership too.
          </p>
          <Btn href="/join">Join the society</Btn>
        </div>
      </Section>
    </div>
  );
}
