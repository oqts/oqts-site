import type { Metadata } from 'next';
import CloseRule from '../../components/CloseRule';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

// Deliberately one click and no questions asked. Making unsubscribing
// awkward does not keep subscribers; it converts them into spam
// complaints, and complaint rate is what decides whether the rest of our
// mail reaches anybody at all.

export default async function UnsubscribePage({
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
              <h1>You have been unsubscribed</h1>
              <p className="lede col">
                We will not email you again. If this was a mistake, you can sign
                up again from the join page at any time.
              </p>
            </>
          ) : error || !token ? (
            <>
              <h1>That link did not work</h1>
              <p className="lede col">
                Email <a href="mailto:oqts@oqts.org">oqts@oqts.org</a> and we
                will remove you by hand.
              </p>
            </>
          ) : (
            <>
              <h1>Unsubscribe</h1>
              <p className="lede col">
                Confirm below and we will stop emailing you.
              </p>
              <form method="POST" action={`/api/unsubscribe?token=${encodeURIComponent(token)}`}>
                <input type="hidden" name="token" value={token} />
                <button className="btn" type="submit">
                  Unsubscribe me
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
