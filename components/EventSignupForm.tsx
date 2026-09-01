'use client';

import { useState } from 'react';

const MAX_CV_BYTES = 4 * 1024 * 1024; // Vercel's request-body ceiling is 4.5 MB

type State =
  | 'idle'
  | 'busy'
  | 'ok'
  | 'dup'
  | 'closed'
  | 'gone'
  | 'invalid'
  | 'toolarge'
  | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy'>, string> = {
  ok: 'Signup received. Check your inbox: we have sent you a confirmation.',
  dup: 'That address is already signed up for this event.',
  // Signups can close between the page being served and the form being
  // submitted, so this is a real state a real person will see, not a
  // defensive branch: the room filling up while someone types is exactly
  // when it happens.
  closed: 'Signups for this event have just closed. Join the mailing list and we will tell you about the next one.',
  gone: 'This event is no longer listed. Please check the events page.',
  invalid: 'Something in the form was rejected. Please check each field and try again.',
  toolarge: 'That CV is over 4 MB. Please export a smaller PDF.',
  offline: 'Signups are briefly offline. Email oqts@oqts.org with your CV instead.',
};

// The qualification, not the year of study: an event guest list is
// sorted by what someone will hold and when, and "3rd year" does not say
// whether that is a BA or the third year of an MMath.
const QUALIFICATIONS = [
  'BA',
  'BSc',
  'MMath',
  'MEng',
  'MPhys',
  'MComp',
  'MSc',
  'MPhil',
  'MBA',
  'DPhil / PhD',
  'Other',
];

export default function EventSignupForm({ event }: { event: string }) {
  const [state, setState] = useState<State>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const cv = (form.elements.namedItem('cv') as HTMLInputElement).files?.[0];
    if (cv && cv.size > MAX_CV_BYTES) {
      setState('toolarge');
      return;
    }
    setState('busy');
    try {
      const res = await fetch('/api/event-signup', { method: 'POST', body: new FormData(form) });
      if (res.ok) setState('ok');
      else if (res.status === 409) {
        // Two different 409s: already on the list, or the door just shut.
        const why = await res.json().catch(() => ({}));
        setState(why?.error === 'signups_closed' ? 'closed' : 'dup');
      } else if (res.status === 404) setState('gone');
      else if (res.status === 413) setState('toolarge');
      else if (res.status === 400) setState('invalid');
      else setState('offline');
    } catch {
      setState('offline');
    }
  }

  if (state === 'ok') {
    return (
      <div>
        <p className="form-status ok">{MESSAGES.ok}</p>
        <p className="form-note">
          Please add oqts@oqts.org to your contacts, or mark it as a safe
          sender. Invitations go out in one batch and a university mail filter
          is the most common reason one is never seen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <input type="hidden" name="event" value={event} />
      <div className="grid g2">
        <label className="field">
          <span>Full name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>University email address</span>
          <input
            name="uni_email"
            type="email"
            required
            inputMode="email"
            placeholder="first.last@college.ox.ac.uk"
            pattern=".*\.ac\.uk\s*"
            title="A UK university address ending in .ac.uk"
          />
        </label>
        <label className="field">
          <span>Degree subject</span>
          <input name="degree_subject" required placeholder="e.g. Mathematics and Statistics" />
        </label>
        <label className="field">
          <span>Degree qualification</span>
          <select name="degree_level" required defaultValue="">
            <option value="" disabled>
              Select qualification
            </option>
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Expected graduation</span>
          {/* Month, not a full date: nobody knows the day, and asking for
              one invites invention.

              Firefox does not implement type="month" and silently renders
              a plain text box, so without the pattern and placeholder a
              Firefox user types "June 2027", the server rejects it, and
              the form blames them for a field it never explained. The
              pattern is ignored by browsers that DO implement the month
              picker, so it costs those nothing. */}
          <input
            name="graduation_month"
            type="month"
            required
            placeholder="YYYY-MM"
            pattern="\d{4}-(0[1-9]|1[0-2])"
            title="Year and month, for example 2027-06"
          />
        </label>
      </div>
      <label className="field">
        <span>CV (PDF, up to 4 MB)</span>
        <input name="cv" type="file" accept="application/pdf" required />
      </label>
      <p className="form-note">
        We store what you submit here, including your CV, solely to choose and
        seat guests for this event, and we delete it within 30 days of the
        event. We do not pass it to sponsors. Contact oqts@oqts.org to have
        your data removed at any time.
      </p>
      <button className="btn" type="submit" disabled={state === 'busy'}>
        {state === 'busy' ? 'Submitting…' : 'Request a place'}
      </button>
      {state !== 'idle' && state !== 'busy' && (
        <p className={`form-status ${state === 'dup' || state === 'closed' ? '' : 'err'}`}>
          {MESSAGES[state]}
        </p>
      )}
    </form>
  );
}
