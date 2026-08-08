'use client';

import { useState } from 'react';

const MAX_CV_BYTES = 4 * 1024 * 1024; // Vercel's request-body ceiling is 4.5 MB

type State = 'idle' | 'busy' | 'ok' | 'dup' | 'invalid' | 'toolarge' | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy'>, string> = {
  ok: 'Application received — thank you. We will reply by email.',
  dup: 'We already have an application under that email address.',
  invalid: 'Something in the form was rejected — please check each field and try again.',
  toolarge: 'That CV is over 4 MB — please export a smaller PDF.',
  offline: 'Applications are briefly offline — email your CV to oqts@oqts.org instead.',
};

// Question set is a deliberate stub — wording will change before applications
// open. Keys are stable identifiers; the backend stores answers as JSON.
const QUESTIONS = [
  { key: 'why_join', label: 'Why do you want to join the society?' },
  { key: 'experience', label: 'Relevant experience, if any — none is required' },
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
          <span>Email address</span>
          <input name="email" type="email" required autoComplete="email" inputMode="email" />
        </label>
        <label className="field">
          <span>College</span>
          <input name="college" required />
        </label>
        <label className="field">
          <span>Course &amp; year</span>
          <input name="course" required placeholder="e.g. Mathematics, 2nd year" />
        </label>
      </div>
      {QUESTIONS.map((q) => (
        <label className="field" key={q.key}>
          <span>{q.label}</span>
          <textarea name={q.key} required={q.key === 'why_join'} maxLength={2000} />
        </label>
      ))}
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
