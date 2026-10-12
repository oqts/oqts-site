'use client';

import { useState } from 'react';

export type Rsvp = {
  attending: boolean | null;
  meal: 'standard' | 'vegan' | null;
  allergies: string | null;
};

type State = 'idle' | 'busy' | 'saved' | 'closed' | 'revoked' | 'invalid' | 'slow' | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy' | 'saved'>, string> = {
  // Both of these can change between the page loading and the submit,
  // so they are real states, not defensive branches.
  closed: 'RSVPs for this dinner have closed. Email oqts@oqts.org if your plans have changed.',
  revoked: 'This invitation no longer applies. Email oqts@oqts.org if you think that is a mistake.',
  invalid: 'Something in the form was rejected. Please check your answers and try again.',
  slow: 'Too many attempts from your network just now. Please wait a minute and send it again.',
  offline: 'RSVPs are briefly offline. Please try again shortly, or email oqts@oqts.org.',
};

export default function RsvpForm({ token, initial }: { token: string; initial: Rsvp }) {
  const [state, setState] = useState<State>('idle');
  const [attending, setAttending] = useState<boolean | null>(initial.attending);
  const [saved, setSaved] = useState<Rsvp>(initial);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const going = form.get('attending') === 'yes';
    const body = {
      token,
      attending: going,
      meal: going ? String(form.get('meal') ?? '') : null,
      allergies: going ? String(form.get('allergies') ?? '') : null,
    };
    setState('busy');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const r = await res.json();
        setSaved({ attending: r.attending, meal: r.meal, allergies: r.allergies });
        setState('saved');
      } else if (res.status === 409) {
        const why = await res.json().catch(() => ({}));
        setState(why?.error === 'rsvp_closed' ? 'closed' : 'revoked');
      } else if (res.status === 400) setState('invalid');
      else if (res.status === 429) setState('slow');
      else setState('offline');
    } catch {
      setState('offline');
    }
  }

  if (state === 'saved') {
    return (
      <div>
        <p className="form-status ok">
          {saved.attending
            ? `Thank you, you are confirmed for dinner with a ${
                saved.meal === 'vegan' ? 'vegan' : 'standard'
              } meal${saved.allergies ? ', and we have passed on your allergies' : ''}.`
            : 'Thank you for letting us know. We are sorry you cannot make it.'}
        </p>
        <p className="form-note">
          If anything changes, open this same link again and update your answer
          before the day of the dinner.
        </p>
        <button className="btn secondary" type="button" onClick={() => {
            setAttending(saved.attending);
            setState('idle');
          }}>
          Change my answer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <fieldset className="form-section" style={{ marginTop: 0 }}>
        <legend>Will you be at dinner?</legend>
        <label className="check">
          <input
            type="radio"
            name="attending"
            value="yes"
            required
            defaultChecked={saved.attending === true}
            onChange={() => setAttending(true)}
          />
          <span>Yes, I will be there</span>
        </label>
        <label className="check">
          <input
            type="radio"
            name="attending"
            value="no"
            defaultChecked={saved.attending === false}
            onChange={() => setAttending(false)}
          />
          <span>No, I can no longer come</span>
        </label>
      </fieldset>

      {attending && (
        <>
          <fieldset className="form-section">
            <legend>Meal</legend>
            <label className="check">
              <input
                type="radio"
                name="meal"
                value="standard"
                required
                defaultChecked={saved.meal !== 'vegan'}
              />
              <span>Standard</span>
            </label>
            <label className="check">
              <input
                type="radio"
                name="meal"
                value="vegan"
                defaultChecked={saved.meal === 'vegan'}
              />
              <span>Vegan</span>
            </label>
          </fieldset>
          <fieldset className="form-section">
            <legend>Allergies</legend>
            <label className="field">
              <span>Anything the kitchen must avoid. Leave blank if none.</span>
              <textarea
                name="allergies"
                rows={3}
                maxLength={1000}
                defaultValue={saved.allergies ?? ''}
              />
            </label>
            {/* Allergies are health information, so this says exactly
                what happens to them. The deletion is the 30-day signup
                retention (oqts-platform deploy/retention.sh): the answer
                lives on the signup row and goes when it does. */}
            <p className="form-note">
              We use this only to tell the caterer, and delete it with the rest of
              your signup within 30 days of the event.
            </p>
          </fieldset>
        </>
      )}

      <button className="btn" type="submit" disabled={state === 'busy' || attending === null}>
        {state === 'busy' ? 'Sending…' : saved.attending === null ? 'Send my RSVP' : 'Update my RSVP'}
      </button>
      {state !== 'idle' && state !== 'busy' && (
        <p className="form-status err">{MESSAGES[state]}</p>
      )}
    </form>
  );
}
