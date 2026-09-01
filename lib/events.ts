// The term programme, read from the platform API.
//
// SOURCE OF TRUTH IS THE PLATFORM as of 2026-09-01. data/events.yml and
// its loader are gone: the committee writes events in the back office
// and this fetch is how they reach oqts.org. Editing an event no longer
// needs a code deploy.
//
// The API is reached SERVER-SIDE only, through the same shared secret as
// the form proxies, so the secret never reaches a browser and the events
// endpoint is not a public URL anyone can scrape from the page source.
import type { SocietyEvent } from './types';

const REVALIDATE = 300; // 5 minutes: an edit lands on the site without a deploy

export type PublicEvent = SocietyEvent & {
  slug: string;
  signup_blurb: string | null;
  signups_open: boolean;
};

/** Never throws. An events page that 500s because the API is briefly
 *  unreachable is worse than one that renders its own empty state, and
 *  every caller here is a page that must still build and serve. Callers
 *  distinguish "no events" from "could not reach the API" via `ok`. */
export async function getEvents(): Promise<{
  ok: boolean;
  upcoming: PublicEvent[];
  past: PublicEvent[];
}> {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) return { ok: false, upcoming: [], past: [] };

  let events: PublicEvent[];
  try {
    const res = await fetch(`${upstream}/events`, {
      headers: { 'X-OQTS-Secret': secret },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { ok: false, upcoming: [], past: [] };
    events = ((await res.json()) as { events: PublicEvent[] }).events ?? [];
  } catch {
    return { ok: false, upcoming: [], past: [] };
  }

  // Split on today in UTC, matching how dates are stored: an event is
  // "upcoming" for the whole of its own day, because a dinner at 19:00
  // should not drop into the archive at breakfast.
  const today = new Date().toISOString().slice(0, 10);
  return {
    ok: true,
    upcoming: events
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date)),
    past: events
      .filter((e) => e.date < today)
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export async function getEvent(slug: string): Promise<PublicEvent | null> {
  const { upcoming, past } = await getEvents();
  return [...upcoming, ...past].find((e) => e.slug === slug) ?? null;
}
