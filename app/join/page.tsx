import type { Metadata } from 'next';
import ApplicationForm from '../../components/ApplicationForm';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';
import SignupForm from '../../components/SignupForm';

export const metadata: Metadata = {
  title: 'Join',
  description:
    'Apply to the Oxford Quantitative Trading Society, or join the mailing list to hear when applications open.',
};

export default function Join() {
  return (
    <div className="wrap">
      <div className="ground g5" aria-hidden="true" />
      <section>
        <div className="plate watermark v2">
          <p className="eyebrow">Join</p>
          <h1>Join the society</h1>
          <p className="lede col">
            One application, any degree, no experience required. What we look for
            is evidence you will actually engage: with the programme, with OXDAQ,
            and with everyone else trading on it.
          </p>
          <div className="btn-row">
            <Btn href="#apply">Apply now</Btn>
            <Btn href="#mailing-list" secondary>Join the mailing list</Btn>
          </div>
        </div>
        <CloseRule />
      </section>

      <Section eyebrow="Timeline" title="Applications open September 2026" close={false}>
        <div className="bracketed">
          <p style={{ marginBottom: 0 }}>
            Applications for the live-fund cohort open in early September 2026,
            ahead of Michaelmas term. Apply below, or, if you are not ready
            yet, join the mailing list and we will email you the moment the
            round opens. Worth preparing: a one-page CV, and honest answers.
            Polish matters less than evidence of interest.
          </p>
        </div>
        <CloseRule />
      </Section>

      <Section eyebrow="Apply" title="Application" id="apply">
        <div style={{ maxWidth: 720 }}>
          <ApplicationForm />
        </div>
      </Section>

      <Section eyebrow="Mailing list" title="Not ready to apply?" id="mailing-list">
        <div className="panel" style={{ maxWidth: 560 }}>
          <p className="note">
            Get one email when applications open, and occasional term-programme
            announcements. Nothing else.
          </p>
          <SignupForm source="join" />
        </div>
      </Section>

      <Section eyebrow="Questions" title="Asked often enough">
        <div className="grid g2">
          <div>
            <h4>Do I need to know how to code?</h4>
            <p className="note">
              No. The programme starts from foundations, and OXDAQ can be traded
              through tools that do not require writing code. Members who want
              to build strategies programmatically get help doing so.
            </p>
          </div>
          <div>
            <h4>Which degrees are eligible?</h4>
            <p className="note">
              All of them, at any level. The society selects for engagement, not
              for course.
            </p>
          </div>
          <div>
            <h4>What happens after I apply?</h4>
            <p className="note">
              We read everything, and reply to every application by email once
              the round closes.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
