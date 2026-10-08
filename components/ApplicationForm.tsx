'use client';

import { useState } from 'react';
import type { OpenForm } from '../lib/applicationForm';

const MAX_CV_BYTES = 4 * 1024 * 1024; // Vercel's request-body ceiling is 4.5 MB

type State = 'idle' | 'busy' | 'ok' | 'dup' | 'invalid' | 'toolarge' | 'closed' | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy'>, string> = {
  ok: 'Application received. Thank you; we will reply by email.',
  dup: 'We already have an application under that email address.',
  invalid: 'Something in the form was rejected. Please check each field and try again.',
  toolarge: 'That CV is over 4 MB. Please export a smaller PDF.',
  closed: 'Applications have closed. Join the mailing list below to hear about the next round.',
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

/** THE word-count rule, mirrored by count_words in the platform API
 *  (signup-api/app/main.py): whitespace-separated runs. If the two ever
 *  disagree, an answer this form accepted is refused on submit. */
function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

// Same ceiling as the API's CHARS_PER_WORD, so one enormous "word"
// cannot get past a word limit.
const CHARS_PER_WORD = 25;

export default function ApplicationForm({ form }: { form: OpenForm }) {
  const [state, setState] = useState<State>('idle');
  const [lead, setLead] = useState(false);
  const [words, setWords] = useState<Record<string, number>>({});
  const asked = form.questions.filter((q) => q.section === 'all' || lead);
  const leadQuestions = form.questions.filter((q) => q.section === 'lead');
  const over = asked.some((q) => (words[q.key] ?? 0) > q.word_limit);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (over) return; // the button is disabled too; this is the Enter key
    const el = e.currentTarget;
    const cv = (el.elements.namedItem('cv') as HTMLInputElement).files?.[0];
    if (cv && cv.size > MAX_CV_BYTES) {
      setState('toolarge');
      return;
    }
    setState('busy');
    try {
      const body = new FormData(el);
      // Send the WORDING, not a boolean, and only when it was agreed to.
      // The API stores whatever arrives here verbatim, so an unticked box
      // must send nothing at all rather than a falsy flag.
      body.delete('cv_book_opt_in');
      if ((el.elements.namedItem('cv_book_opt_in') as HTMLInputElement)?.checked) {
        body.set('cv_book_consent', CV_BOOK_CONSENT);
      }
      const res = await fetch('/api/apply', { method: 'POST', body });
      if (res.ok) setState('ok');
      else if (res.status === 409) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setState(err.error === 'applications_closed' ? 'closed' : 'dup');
      }
      else if (res.status === 413) setState('toolarge');
      else if (res.status === 400) setState('invalid');
      else setState('offline');
    } catch {
      setState('offline');
    }
  }

  const question = (q: OpenForm['questions'][number], n: number) => {
    const count = words[q.key] ?? 0;
    const tooMany = count > q.word_limit;
    return (
      <label className="field" key={q.key}>
        <span>
          {n}. {q.prompt}
        </span>
        <textarea
          name={q.key}
          required
          rows={6}
          maxLength={q.word_limit * CHARS_PER_WORD}
          aria-describedby={`${q.key}-count`}
          aria-invalid={tooMany || undefined}
          onChange={(e) => setWords((w) => ({ ...w, [q.key]: countWords(e.target.value) }))}
        />
        <span id={`${q.key}-count`} className={`wordcount${tooMany ? ' over' : ''}`} aria-live="polite">
          {count} / {q.word_limit} words{tooMany ? `: ${count - q.word_limit} over the limit` : ''}
        </span>
      </label>
    );
  };

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

      <fieldset className="form-section">
        <legend>Written answers</legend>
        <p className="form-note">
          Your answers are stored apart from your CV, so they can be read
          without your name or CV beside them. Word limits are firm: the
          form will not submit an answer over its limit.
        </p>
        {form.questions
          .filter((q) => q.section === 'all')
          .map((q, i) => question(q, i + 1))}
      </fieldset>

      <fieldset className="form-section">
        <legend>Applying as project lead</legend>
        <p className="form-note">
          {form.intake_leads > 0
            ? `This round we are taking ${form.intake_researchers} researchers and ${form.intake_leads} project leads. `
            : ''}
          {form.lead_blurb}
        </p>
        <label className="check">
          <input
            type="checkbox"
            name="applies_as_lead"
            checked={lead}
            onChange={(e) => setLead(e.target.checked)}
          />
          <span>I am applying as a project lead</span>
        </label>
        {lead && leadQuestions.map((q, i) => question(q, i + 1))}
      </fieldset>
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
      <button className="btn" type="submit" disabled={state === 'busy' || over}>
        {state === 'busy' ? 'Submitting…' : 'Submit application'}
      </button>
      {state !== 'idle' && state !== 'busy' && (
        <p className={`form-status ${state === 'dup' ? '' : 'err'}`}>{MESSAGES[state]}</p>
      )}
    </form>
  );
}
