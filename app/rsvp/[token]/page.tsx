import type { Metadata } from 'next';
import { headers } from 'next/headers';
import CloseRule from '../../../components/CloseRule';
import { getEvent } from '../../../lib/events';
import RsvpForm, { type Rsvp, type RsvpKind } from '../../../components/RsvpForm';

// A guest's personal RSVP page. They reach it from the link the
// platform composer merges into their invitation ({rsvp_link}); the
// token in the URL is the only thing that identifies them. Dinner guests
// are asked for attendance, meal and allergies; drinks-only guests for
// attendance and their Bod card. The API says which (`kind`).
//
// Loading this page changes nothing. Oxford's mail gateway fetches every
// URL in incoming mail, so the page only READS the guest's current
// answer; the form's own submit is what writes. Never index it.

export const metadata: Metadata = {
  title: 'RSVP',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

type Lookup = Rsvp & {
  name: string;
  /** null once the guest is no longer in an accepted category. */
  kind: RsvpKind | null;
  invited: boolean;
  open: boolean;
  event: {
    slug: string;
    title: string;
    date: string;
    time: string | null;
    location: string;
    dress_code: string | null;
  };
};

async function lookup(token: string): Promise<Lookup | 'unknown' | 'offline'> {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) return 'offline';
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  try {
    const res = await fetch(`${upstream}/rsvp/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-OQTS-Secret': secret, 'X-Client-IP': ip },
      body: JSON.stringify({ token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 404) return 'unknown';
    if (!res.ok) return 'offline';
    const r = (await res.json()) as Lookup;
    // An API from before drinks RSVPs sends no kind; every guest it
    // invited was a dinner guest.
    if (r.kind === undefined) r.kind = r.invited ? 'dinner' : null;
    return r;
  } catch {
    return 'offline';
  }
}

function whenLine(date: string, time: string | null): string {
  const d = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return time ? `${d}, ${time}` : d;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap">
      <div className="ground g4" aria-hidden="true" />
      {children}
      <CloseRule />
    </div>
  );
}

// The committee's preview: /rsvp/preview?event={slug}, with &kind=drinks
// for what a drinks-only guest sees. Rendered from
// the PUBLIC event (published only) with a made-up guest, and the form
// in preview mode never posts. It exists so the committee can see what a
// guest sees without opening a real guest's link, where pressing the
// button would answer for them.
async function previewOf(slug: string, kind: RsvpKind): Promise<Lookup | 'unknown'> {
  const ev = slug ? await getEvent(slug) : null;
  if (!ev) return 'unknown';
  return {
    name: 'Guest',
    kind,
    invited: true,
    open: true,
    attending: null,
    meal: null,
    allergies: null,
    event: {
      slug: ev.slug,
      title: ev.title,
      date: ev.date,
      time: ev.time ?? null,
      location: ev.location,
      dress_code: ev.dress_code ?? null,
    },
  };
}

export default async function RsvpPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ event?: string; kind?: string }>;
}) {
  const { token } = await params;
  const preview = token === 'preview';
  const sp = await searchParams;
  const r = preview
    ? await previewOf(sp.event ?? '', sp.kind === 'drinks' ? 'drinks' : 'dinner')
    : await lookup(token);

  if (r === 'unknown' || r === 'offline') {
    return (
      <Shell>
        <section>
          <div className="plate">
            <p className="eyebrow">RSVP</p>
            <h1>{r === 'unknown' ? 'That link did not work' : 'RSVPs are briefly offline'}</h1>
            <p className="lede col">
              {r === 'unknown'
                ? 'Please use the link exactly as it appears in your invitation, or '
                : 'Please try again in a few minutes, or '}
              email <a href="mailto:oqts@oqts.org">oqts@oqts.org</a> and we will
              record your answer by hand.
            </p>
          </div>
        </section>
      </Shell>
    );
  }

  const ev = r.event;
  const first = r.name.split(/\s+/)[0];
  const drinks = r.kind === 'drinks';
  const label = drinks ? 'Drinks RSVP' : 'Dinner RSVP';

  return (
    <Shell>
      <section>
        <div className="plate">
          <p className="eyebrow">{preview ? `${label} · preview` : label}</p>
          <h1>{ev.title}</h1>
          <p className="eyebrow" style={{ color: 'var(--oqts-ink)' }}>
            {whenLine(ev.date, ev.time)} · {ev.location}
          </p>
          <p className="lede col">
            {!r.invited
              ? `${first}, this invitation no longer applies. If you think that is a mistake, email oqts@oqts.org.`
              : !r.open
                ? `${first}, RSVPs for this event have closed.`
                : drinks
                  ? `${first}, you are invited to drinks. Please let us know whether you can come, and confirm that you will bring your Bod card.`
                  : `${first}, you are invited to drinks and dinner. Please let us know whether you can come, which meal you would like, and about any allergies.`}
          </p>
        </div>
      </section>

      {r.invited && r.kind && (
        <section>
          <div className="panel" style={{ maxWidth: 760 }}>
            {ev.dress_code && (
              <>
                <p className="eyebrow">Dress code</p>
                <p>{ev.dress_code}</p>
              </>
            )}
            {r.open ? (
              <RsvpForm
                kind={r.kind}
                preview={preview}
                token={token}
                initial={{ attending: r.attending, meal: r.meal, allergies: r.allergies }}
              />
            ) : (
              <p className="form-note">
                {r.attending === null
                  ? 'We did not receive an answer from you.'
                  : r.attending
                    ? drinks
                      ? 'We have you down as attending. Please bring your Bod card.'
                      : `We have you down as attending, with a ${r.meal === 'vegan' ? 'vegan' : 'standard'} meal.`
                    : 'We have you down as not attending.'}{' '}
                If something has changed, email oqts@oqts.org.
              </p>
            )}
          </div>
        </section>
      )}
    </Shell>
  );
}
