import Btn from '../components/Btn';
import CloseRule from '../components/CloseRule';
import Section from '../components/Section';

export default function Home() {
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow">Oxford Quantitative Trading Society</p>
        <h1>Quantitative trading, learnt by doing</h1>
        <p className="lede col">
          We teach markets the only way that sticks: by trading them. Education,
          competition and community for Oxford students who want to understand
          how modern markets work.
        </p>
        <div className="btn-row">
          <Btn href="/join">Join the society</Btn>
          <Btn href="/about" secondary>About us</Btn>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="Placeholder" title="Frame check">
        <p className="col">
          This is the stage-3 frame: masthead, type roles, buttons, close rules
          and footer, all consuming the brand tokens. Full pages follow.
        </p>
      </Section>
    </div>
  );
}
