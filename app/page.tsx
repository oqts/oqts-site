import Btn from '../components/Btn';
import CloseRule from '../components/CloseRule';
import Section from '../components/Section';
import SignupForm from '../components/SignupForm';
import SponsorStrip from '../components/SponsorStrip';

export default function Home() {
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow">Oxford Quantitative Trading Society</p>
        <h1>Quantitative trading, learnt by doing</h1>
        <p className="lede col">
          We teach markets the only way that sticks: by trading them. Education,
          competition and community for Oxford students who want to understand
          how modern markets actually work.
        </p>
        <div className="btn-row">
          <Btn href="/join">Join the society</Btn>
          <Btn href="/oxdaq" secondary>Explore OXDAQ</Btn>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="What we do" title="Three things, done properly">
        <div className="grid g3">
          <div className="panel">
            <h4>Education</h4>
            <p className="note">
              A term programme of talks and workshops — market microstructure,
              strategy design, and the mathematics underneath — pitched so that
              no prior experience is needed to start.
            </p>
          </div>
          <div className="panel">
            <h4>Competition</h4>
            <p className="note">
              OXDAQ, our internal exchange, hosts trading competitions where
              members test strategies against each other on a real matching
              engine, with real market mechanics.
            </p>
          </div>
          <div className="panel">
            <h4>Community</h4>
            <p className="note">
              Socials, speaker dinners and a network of Oxford students and
              alumni who care about markets — from first-years to researchers.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="OXDAQ" title="Our own exchange">
        <div className="bracketed">
          <p className="col" style={{ marginBottom: 'var(--oqts-space-5)' }}>
            OXDAQ is the society&apos;s internal market: a matching engine and
            market data stack built by members, for members. Competitions run on
            it through term — write a strategy, connect it, and find out whether
            it survives contact with everyone else&apos;s.
          </p>
          <Btn href="/oxdaq" secondary>How OXDAQ works</Btn>
        </div>
      </Section>

      <Section eyebrow="Our sponsors" title="Backed by the firms that define the field">
        <SponsorStrip />
        <p className="note">
          Interested in sponsoring the society?{' '}
          <a href="mailto:oqts@oqts.org">Get in touch</a>.
        </p>
      </Section>

      <Section eyebrow="Stay in touch" title="Hear when applications open">
        <div className="panel" style={{ maxWidth: 560 }}>
          <SignupForm source="home" />
        </div>
      </Section>
    </div>
  );
}
