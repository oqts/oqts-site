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
      const res = await fetch('/api/apply', { method: 'POST', body: new FormData(form) });
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
      <p className="form-note">
        We store what you submit here, including your CV, solely to assess your
        application, and delete it when the round closes. Contact oqts@oqts.org
        to have your data removed at any time.
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
