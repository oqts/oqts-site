'use client';

import { useState } from 'react';

const MAX_CV_BYTES = 4 * 1024 * 1024; // Vercel's request-body ceiling is 4.5 MB

type State = 'idle' | 'busy' | 'ok' | 'dup' | 'invalid' | 'toolarge' | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy'>, string> = {
  ok: 'Application received. Thank you; we will reply by email.',
  dup: 'We already have an application under that email address.',
  invalid: 'Something in the form was rejected. Please check each field and try again.',
  toolarge: 'That CV is over 4 MB. Please export a smaller PDF.',
  offline: 'Applications are briefly offline. Email your CV to oqts@oqts.org instead.',
};

/** THE CV BOOK OPT-IN, shown here and stored verbatim against the
 *  application. Asked at the point the applicant is ALREADY uploading a
 *  CV: asking again after they join is a second upload most people never
 *  make, which leaves the book empty and the sponsorship asset
 *  imaginary. Worded for the condition that actually applies, because
 *  the book is members only and a declined applicant's CV never goes
 *  anywhere near a sponsor.
 *
 *  Keep this in step with CV_BOOK_CONSENT in the platform's lib/api.ts:
 *  the two are separate entry points to one book, and a member should
 *  not be shown materially different terms depending on which door they
 *  came through. */
const CV_BOOK_CONSENT =
  'If I am offered a place, I agree that OQTS may include this CV in the CV ' +
  'book it sends to society sponsors. I can withdraw it at any time, and it ' +
  'expires after 12 months unless I replace it.';

const YEARS = [
  '1st year undergraduate',
  '2nd year undergraduate',
  '3rd year undergraduate',
  '4th year undergraduate',
  "Master's",
  'DPhil',
  'Other',
];

export default function ApplicationForm() {
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
      const body = new FormData(form);
      // Send the WORDING, not a boolean, and only when it was agreed to.
      // The API stores whatever arrives here verbatim, so an unticked box
      // must send nothing at all rather than a falsy flag.
      body.delete('cv_book_opt_in');
      if ((form.elements.namedItem('cv_book_opt_in') as HTMLInputElement)?.checked) {
        body.set('cv_book_consent', CV_BOOK_CONSENT);
      }
      const res = await fetch('/api/apply', { method: 'POST', body });
      if (res.ok) setState('ok');
      else if (res.status === 409) setState('dup');
      else if (res.status === 413) setState('toolarge');
      else if (res.status === 400) setState('invalid');
      else setState('offline');
    } catch {
      setState('offline');
    }
  }

  if (state === 'ok') return <p className="form-status ok">{MESSAGES.ok}</p>;

  return (
    <form onSubmit={submit}>
      <div className="grid g2">
        <label className="field">
          <span>Full name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>Personal email address</span>
          <input name="email" type="email" required autoComplete="email" inputMode="email" />
        </label>
        <label className="field">
          <span>Oxford email address</span>
          <input
            name="oxford_email"
            type="email"
            required
            inputMode="email"
            placeholder="first.last@college.ox.ac.uk"
            pattern=".*ox\.ac\.uk\s*$"
            title="An @…ox.ac.uk address"
          />
        </label>
        <label className="field">
          <span>Course</span>
          <input name="course" required placeholder="e.g. Mathematics" />
        </label>
        <label className="field">
          <span>Year</span>
          <select name="year" required defaultValue="">
            <option value="" disabled>
              Select year
            </option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Why do you want to join the society?</span>
        <textarea name="why_join" required maxLength={2000} />
      </label>
      <label className="field">
        <span>CV (PDF, up to 4 MB)</span>
        <input name="cv" type="file" accept="application/pdf" required />
      </label>
      <label className="check">
        {/* Unticked by default and never required: the application is
            judged the same either way, and it must be obvious that it
            is. An opt-in that is easier to leave than to give is the
            only kind worth having. */}
        <input type="checkbox" name="cv_book_opt_in" />
        <span>{CV_BOOK_CONSENT}</span>
      </label>
      <p className="form-note">
        We store what you submit here, including your CV, to assess your
        application, and delete it when the round closes. If you tick the box
        above and are offered a place, we keep your CV for the sponsor CV book
        instead, and you can withdraw it at any time from your member account.
        Ticking it makes no difference to how your application is judged.
        Contact oqts@oqts.org to have your data removed at any time.
      </p>
      <button className="btn" type="submit" disabled={state === 'busy'}>
        {state === 'busy' ? 'Submitting…' : 'Submit application'}
      </button>
      {state !== 'idle' && state !== 'busy' && (
        <p className={`form-status ${state === 'dup' ? '' : 'err'}`}>{MESSAGES[state]}</p>
      )}
    </form>
  );
}
