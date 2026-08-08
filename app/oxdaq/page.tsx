import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';

export const metadata: Metadata = {
  title: 'OXDAQ',
  description:
    "OXDAQ is the Oxford Quantitative Trading Society's internal exchange: a matching engine built by members, hosting trading competitions through term.",
};

export default function Oxdaq() {
  return (
    <div className="wrap">
      <section className="watermark">
        <p className="eyebrow">OXDAQ</p>
        <h1>The society&apos;s own exchange</h1>
        <p className="lede col">
          OXDAQ is an internal market built and operated by members: a matching
          engine, market data, and a term calendar of competitions traded on
          top of it.
        </p>
        <CloseRule />
      </section>

      <Section eyebrow="Why" title="Why build an exchange?" textured>
        <p className="col">
          Because everything the society teaches becomes concrete on one. An
          order book stops being a diagram when your resting order is the one
          being picked off. Building the exchange teaches the infrastructure
          half of quantitative trading; competing on it teaches the rest. The
          exchange is built and run by the core team, with members joining the
          build as the society grows.
        </p>
      </Section>

      <Section eyebrow="How it works" title="Compete in three steps">
        <div className="grid g3">
          <div className="panel">
            <h4>1 · Markets</h4>
            <p className="note">
              Each competition defines instruments and rules: what trades, how
              information arrives, and what winning means.
            </p>
          </div>
          <div className="panel">
            <h4>2 · Trade</h4>
            <p className="note">
              Members connect manually or programmatically and trade against
              each other on the live book. Play-money, real mechanics.
            </p>
          </div>
          <div className="panel">
            <h4>3 · Results</h4>
            <p className="note">
              Every round produces a ranking and a post-mortem: what worked,
              what got run over, and why.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Calendar" title="Through the year" textured>
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
            Membership is the way in. Every member can trade in every
            competition, and the team that builds OXDAQ recruits from the
            membership too.
          </p>
          <Btn href="/join">Join the society</Btn>
        </div>
      </Section>
    </div>
  );
}
