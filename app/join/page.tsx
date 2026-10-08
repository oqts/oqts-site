import type { Metadata } from 'next';
import ApplicationForm from '../../components/ApplicationForm';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import Section from '../../components/Section';
import SignupForm from '../../components/SignupForm';
import { getApplicationForm } from '../../lib/applicationForm';

export const metadata: Metadata = {
  title: 'Join',
  description:
    'Apply to the Oxford Quantitative Trading Society, or join the mailing list to hear when applications open.',
};

// Whether the form shows is decided on the platform, not here: the
// committee opens and closes applications at
// platform.oqts.org/website/applications/form, and this page re-reads
// that switch every minute.
export const revalidate = 60;

export default async function Join() {
  const res = await getApplicationForm();
  const open = res.ok && res.form.open ? res.form : null;
  return (
    <div className="wrap">
      <div className="ground g5" aria-hidden="true" />
      <section>
        <div className="plate">
          <p className="eyebrow">Join</p>
          <h1>Join the society</h1>
          <p className="lede col">
            Membership is by application. We select for quantitative degrees
            and exceptionally strong technical skills, and for evidence that
            you will engage with the programme, with OXDAQ, and with everyone
            else trading on it.
          </p>
          <div className="btn-row">
            <Btn href="#apply">Apply now</Btn>
            <Btn href="#mailing-list" secondary>Join the mailing list</Btn>
          </div>
        </div>
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
        {open ? (
          <div className="panel" style={{ maxWidth: 720 }}>
            <ApplicationForm form={open} />
          </div>
        ) : (
          <div className="bracketed" style={{ maxWidth: 720 }}>
            <p style={{ marginBottom: 0 }}>
              {res.ok
                ? 'The application form will appear here when applications open. Join the mailing list below and we will email you the moment it does.'
                : 'The application form could not be loaded just now. Please try again in a few minutes, or email oqts@oqts.org.'}
            </p>
          </div>
        )}
      </Section>

      <Section eyebrow="Mailing list" title="Keep up to date" id="mailing-list">
        <div className="panel" style={{ maxWidth: 560 }}>
          <p className="note">
            Get one email when applications open, and occasional term-programme
            announcements. Nothing else.
          </p>
          <SignupForm source="join" />
        </div>
      </Section>

    </div>
  );
}
