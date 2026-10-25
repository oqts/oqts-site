'use client';

import { useState } from 'react';

/** Which RSVP the guest answers, from their category: drinks and dinner,
 *  or drinks only. */
export type RsvpKind = 'dinner' | 'drinks';

export type Rsvp = {
  attending: boolean | null;
  meal: 'standard' | 'vegan' | null;
  allergies: string | null;
};

type State = 'idle' | 'busy' | 'saved' | 'closed' | 'revoked' | 'invalid' | 'slow' | 'offline';

const MESSAGES: Record<Exclude<State, 'idle' | 'busy' | 'saved'>, string> = {
  // Both of these can change between the page loading and the submit,
  // so they are real states, not defensive branches.
  closed: 'RSVPs for this event have closed. Email oqts@oqts.org if your plans have changed.',
  revoked: 'This invitation no longer applies. Email oqts@oqts.org if you think that is a mistake.',
  invalid: 'Something in the form was rejected. Please check your answers and try again.',
  slow: 'Too many attempts from your network just now. Please wait a minute and send it again.',
  offline: 'RSVPs are briefly offline. Please try again shortly, or email oqts@oqts.org.',
};

export default function RsvpForm({
  kind,
  token,
  initial,
  preview = false,
}: {
  kind: RsvpKind;
  token: string;
  initial: Rsvp;
  /** The committee's preview: behaves exactly like the real form but
   *  never posts, so looking at it cannot answer for anybody. */
  preview?: boolean;
}) {
  const [state, setState] = useState<State>('idle');
  const [attending, setAttending] = useState<boolean | null>(initial.attending);
  const [saved, setSaved] = useState<Rsvp>(initial);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const going = form.get('attending') === 'yes';
    const dinner = kind === 'dinner';
    const body = {
      token,
      attending: going,
      meal: going && dinner ? String(form.get('meal') ?? '') : null,
      allergies: going && dinner ? String(form.get('allergies') ?? '') : null,
      // The box is required, so a yes that reaches here has it ticked;
      // the API refuses a drinks yes without it all the same.
      bod_card: going && !dinner ? form.get('bod_card') === 'yes' : null,
    };
    if (preview) {
      setSaved({ attending: body.attending, meal: body.meal as Rsvp['meal'], allergies: body.allergies || null });
      setState('saved');
      return;
    }
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
          {!saved.attending
            ? 'Thank you for letting us know. We are sorry you cannot make it.'
            : kind === 'drinks'
              ? 'Thank you, you are confirmed for drinks. Please remember to bring your Bod card.'
              : `Thank you, you are confirmed for dinner with a ${
                  saved.meal === 'vegan' ? 'vegan' : 'standard'
                } meal${saved.allergies ? ', and we have passed on your allergies' : ''}.`}
        </p>
        {preview && (
          <p className="form-note">This is a preview. Nothing was saved.</p>
        )}
        <p className="form-note">
          If anything changes, open this same link again and update your answer
          before the day of the {kind === 'drinks' ? 'event' : 'dinner'}.
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
        <legend>{kind === 'drinks' ? 'Will you be at drinks?' : 'Will you be at dinner?'}</legend>
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

      {attending && kind === 'drinks' && (
        <fieldset className="form-section">
          <legend>Bod card</legend>
          <label className="check">
            <input
              type="checkbox"
              name="bod_card"
              value="yes"
              required
              defaultChecked={saved.attending === true}
            />
            <span>I will bring my Bod card on the night</span>
          </label>
        </fieldset>
      )}

      {attending && kind === 'dinner' && (
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
