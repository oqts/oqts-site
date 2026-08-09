import Btn from '../components/Btn';
import CloseRule from '../components/CloseRule';
import Section from '../components/Section';
import SignupForm from '../components/SignupForm';
import SponsorBanner from '../components/SponsorBanner';

export default function Home() {
  return (
    <>
      <SponsorBanner />
      <div className="wrap">
      <div className="ground g4" aria-hidden="true" />
        <section>
          <div className="plate">
            <p className="eyebrow">Oxford Quantitative Trading Society</p>
            <h1>Quantitative trading, learnt by doing</h1>
            <p className="lede col">
              We teach markets the only way that sticks: by trading them.
              Education, competition and community for Oxford students who want
              to understand how modern markets actually work.
            </p>
            <div className="btn-row">
              <Btn href="/join">Join the society</Btn>
              <Btn href="/oxdaq" secondary>Explore OXDAQ</Btn>
            </div>
          </div>
                  </section>

        <Section eyebrow="What we do" title="Three things, done properly">
          <div className="grid g3">
            <div className="panel">
              <h4>Education</h4>
              <p className="note">
                Lectures and workshops from professionals at our sponsor firms, alongside our own in-house series, built to take a strong quantitative background into the specifics of modern markets fast.
              </p>
            </div>
            <div className="panel">
              <h4>Competition</h4>
              <p className="note">
                OXDAQ, our own live exchange, where members write algorithmic strategies and compete in live rounds against each other and a market of bots.
              </p>
            </div>
            <div className="panel">
              <h4>Research</h4>
              <p className="note">
                Small research teams that go deep on one area, from systematic strategies to market microstructure, and write up what they find. The first projects launch in Michaelmas 2026.
              </p>
            </div>
          </div>
        </Section>

        <Section eyebrow="The society" title="Built around real participation">
          <p className="col">
            The society exists for one reason: the best way to understand
            markets is to participate in them, measure the result, and argue
            about why. Members follow a programme that moves from foundations,
            like how an order book works and what a market maker actually does,
            to building and testing strategies of their own. Everything taught
            in a talk gets used on OXDAQ within weeks.
          </p>
          <p className="col">
            We recruit for quantitative strength above all else. Mathematics,
            computer science, physics, statistics and engineering are the
            natural homes; what we ask for is exceptionally strong technical
            ability and the willingness to test it on a live market in public.
          </p>
          <p style={{ marginTop: 'var(--oqts-space-5)' }}>
            <Btn href="/team" secondary>See who runs what</Btn>
          </p>
        </Section>

        <Section eyebrow="OXDAQ" title="Our own exchange">
          <div className="bracketed">
            <p style={{ marginBottom: 'var(--oqts-space-5)' }}>
              OXDAQ is the society&apos;s own live exchange: a real order book, live rounds, and strategies written by members trading against each other. Real market making is normally out of students&apos; reach; OXDAQ exists to close that gap. Write a strategy, connect it, and find out whether it survives contact with everyone else&apos;s.
            </p>
            <Btn href="/oxdaq" secondary>How OXDAQ works</Btn>
          </div>
        </Section>

        <Section eyebrow="Stay in touch" title="Hear when applications open">
          <div className="panel" style={{ maxWidth: 560 }}>
            <SignupForm source="home" />
          </div>
        </Section>
      </div>
    </>
  );
}
