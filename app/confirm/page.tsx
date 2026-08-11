import type { Metadata } from 'next';
import CloseRule from '../../components/CloseRule';

export const metadata: Metadata = {
  title: 'Confirm subscription',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

// A button, not an automatic confirmation. Oxford's inbound mail gateway
// fetches every URL in incoming mail — we watched it consume a one-time
// login token two seconds after sending. If this page confirmed on load,
// scanners would confirm addresses their owners never saw, which is
// precisely the consent evidence double opt-in exists to create.

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string; error?: string }>;
}) {
  const { token, done, error } = await searchParams;

  return (
    <div className="wrap">
      <div className="ground g5" aria-hidden="true" />
      <section>
        <div className="plate">
          <p className="eyebrow">Mailing list</p>
          {done ? (
            <>
              <h1>You are subscribed</h1>
              <p className="lede col">
                Thank you. You will hear from us about events, applications and
                OXDAQ. Every message we send carries an unsubscribe link.
              </p>
            </>
          ) : error || !token ? (
            <>
              <h1>That link did not work</h1>
              <p className="lede col">
                It may have expired or already been used. Sign up again on the
                join page and we will send a fresh confirmation.
              </p>
            </>
          ) : (
            <>
              <h1>Confirm your subscription</h1>
              <p className="lede col">
                One click to finish. We ask because it proves the address is
                yours, and it keeps our list clean.
              </p>
              <form method="POST" action="/api/confirm">
                <input type="hidden" name="token" value={token} />
                <button className="btn" type="submit">
                  Confirm subscription
                </button>
              </form>
            </>
          )}
        </div>
      </section>
      <CloseRule />
    </div>
  );
}
