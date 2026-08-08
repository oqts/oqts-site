'use client';

import { useState } from 'react';

type State = 'idle' | 'busy' | 'ok' | 'dup' | 'invalid' | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy'>, string> = {
  ok: "You're on the list. We'll be in touch before applications open.",
  dup: 'That address is already on the list.',
  invalid: "That doesn't look like an email address. Please check it.",
  offline: 'Signups are briefly offline. Email oqts@oqts.org and we will add you.',
};

export default function SignupForm({ source = 'site' }: { source?: string }) {
  const [state, setState] = useState<State>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setState('busy');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) setState('ok');
      else if (res.status === 409) setState('dup');
      else if (res.status === 400) setState('invalid');
      else setState('offline');
    } catch {
      setState('offline');
    }
  }

  if (state === 'ok') return <p className="form-status ok">{MESSAGES.ok}</p>;

  return (
    <form onSubmit={submit}>
      <label className="field">
        <span>Email address</span>
        <input name="email" type="email" required autoComplete="email" inputMode="email" />
      </label>
      <p className="form-note">
        We store your address only to email you about the society, and you can
        unsubscribe at any time. Questions: oqts@oqts.org.
      </p>
      <button className="btn" type="submit" disabled={state === 'busy'}>
        {state === 'busy' ? 'Joining…' : 'Join the mailing list'}
      </button>
      {state !== 'idle' && state !== 'busy' && (
        <p className={`form-status ${state === 'offline' || state === 'invalid' ? 'err' : ''}`}>
          {MESSAGES[state]}
        </p>
      )}
    </form>
  );
}
