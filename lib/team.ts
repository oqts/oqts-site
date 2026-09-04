// Member descriptions, read from the platform API.
//
// SOURCE OF TRUTH IS THE PLATFORM as of 2026-09-04. The `bio:` and
// `course:` fields are gone from data/society.yml: a committee member
// writes their own description and degree on the platform's account page
// and they reach oqts.org from here, the same move events made on
// 2026-09-01 and for the same reason: nobody should need a pull request
// to fix their own paragraph, or to say they have graduated.
//
// society.yml still owns everything else about the team: who is on it,
// their committee role, their links, and the order they appear in. The
// two fields that are facts about the PERSON rather than about the
// society are the ones that left.
//
// Reached SERVER-SIDE only, through the same shared secret as the form
// proxies, so the secret never reaches a browser.

const REVALIDATE = 300; // 5 minutes: an edit lands on the site without a deploy

export type PublicProfile = { bio: string | null; course: string | null };

/** Profiles by the name the site knows the person as.
 *
 *  Never throws, for the same reason getEvents does not: a team page
 *  that 500s because the API blinked is worse than one rendering the
 *  cards without their paragraphs. A failure here is indistinguishable
 *  from nobody having written one, and that is the correct behaviour:
 *  the page is still the team. */
export async function getProfiles(): Promise<Record<string, PublicProfile>> {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) return {};

  try {
    const res = await fetch(`${upstream}/team`, {
      headers: { 'X-OQTS-Secret': secret },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return {};
    return ((await res.json()) as { people?: Record<string, PublicProfile> }).people ?? {};
  } catch {
    return {};
  }
}
