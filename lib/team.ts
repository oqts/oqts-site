// Member descriptions, read from the platform API.
//
// SOURCE OF TRUTH IS THE PLATFORM as of 2026-09-04. The `bio:` field is
// gone from data/society.yml: a committee member writes their own
// description on the platform's account page and it reaches oqts.org
// from here, the same move events made on 2026-09-01 and for the same
// reason: nobody should need a pull request to fix their own paragraph.
//
// society.yml still owns everything else about the team: who is on it,
// their role, their course, their links, and the order they appear in.
// Only the paragraph left.
//
// Reached SERVER-SIDE only, through the same shared secret as the form
// proxies, so the secret never reaches a browser.

const REVALIDATE = 300; // 5 minutes: an edit lands on the site without a deploy

/** Descriptions by the name the site knows the person as.
 *
 *  Never throws, for the same reason getEvents does not: a team page
 *  that 500s because the API blinked is worse than one rendering the
 *  cards without their paragraphs. A failure here is indistinguishable
 *  from nobody having written one, and that is the correct behaviour:
 *  the page is still the team. */
export async function getBios(): Promise<Record<string, string>> {
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
    return ((await res.json()) as { bios?: Record<string, string> }).bios ?? {};
  } catch {
    return {};
  }
}
