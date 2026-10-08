// The membership application form's questions and open/closed switch,
// read from the platform API.
//
// SOURCE OF TRUTH IS THE PLATFORM as of 2026-10-08, the same move events
// and team bios made: the committee writes the questions and opens the
// form at platform.oqts.org/website/applications/form, and this fetch is
// how that reaches oqts.org/join. Opening applications is not a deploy.
//
// The API serves questions only while the form is open, so a closed
// form leaks nothing about the next round.

const REVALIDATE = 60; // the platform says "within a minute"; keep the two in step

export type FormQuestion = {
  key: string; // the form field name, e.g. q3
  section: 'all' | 'lead';
  prompt: string;
  word_limit: number;
};

export type OpenForm = {
  open: true;
  intake_researchers: number;
  intake_leads: number;
  lead_blurb: string;
  questions: FormQuestion[];
};

/** Never throws, like getEvents: a join page that 500s because the API
 *  blinked is worse than one that says the form is briefly unavailable.
 *  `ok: false` is "could not reach the API", distinct from closed. */
export async function getApplicationForm(): Promise<
  { ok: false } | { ok: true; form: OpenForm | { open: false } }
> {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) return { ok: false };
  try {
    const res = await fetch(`${upstream}/application-form`, {
      headers: { 'X-OQTS-Secret': secret },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { ok: false };
    return { ok: true, form: (await res.json()) as OpenForm | { open: false } };
  } catch {
    return { ok: false };
  }
}
