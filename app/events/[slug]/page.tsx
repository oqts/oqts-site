import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Btn from '../../../components/Btn';
import EventSignupForm from '../../../components/EventSignupForm';
import Section from '../../../components/Section';
import { venueForLocation } from '../../../lib/data';
import { OG_DEFAULTS, OG_DEFAULT_IMAGE } from '../../../lib/og';
import { getEvent } from '../../../lib/events';

// One page shape for every event. What varies is written in the back
// office: the blurb, and whether signups are open. There is no
// per-event code, so announcing the next dinner is an edit, not a
// deploy.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ev = await getEvent(slug);
  if (!ev) return { title: 'Event' };
  const venue = venueForLocation(ev.location);
  const description = ev.description.slice(0, 200);
  return {
    title: ev.title,
    description,
    // Spread, never replace: see lib/og.ts. An event at a venue we have no
    // photograph of must still fall back to the house card rather than
    // sharing as a bare link.
    openGraph: {
      ...OG_DEFAULTS,
      title: ev.title,
      description,
      images: venue
        ? [{ url: venue.og_image, width: 1200, height: 630, alt: venue.alt }]
        : [OG_DEFAULT_IMAGE],
    },
  };
}

function whenLine(date: string, time?: string | null): string {
  const d = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return time ? `${d}, ${time}` : d;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ev = await getEvent(slug);
  if (!ev) notFound();

  const isPast = ev.date < new Date().toISOString().slice(0, 10);
  // The photograph belongs to the room, not the event: matched off the
  // location the committee typed, so no event carries an image field.
  const venue = venueForLocation(ev.location);
  // Blank lines separate paragraphs, so the committee can write more
  // than one without writing HTML.
  const blurb = (ev.signup_blurb ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="wrap">
      <div className="ground g3" aria-hidden="true" />
      <section>
        <div className="plate">
          <p className="eyebrow">{ev.tag}</p>
          <h1>{ev.title}</h1>
          <p className="eyebrow" style={{ color: 'var(--oqts-ink)' }}>
            {whenLine(ev.date, ev.time)} · {ev.location}
          </p>
          <p className="lede col">{ev.description}</p>
          <div className="btn-row">
            {ev.signups_open && !isPast && <Btn href="#signup">Request a place</Btn>}
            <Btn href="/events" secondary>All events</Btn>
          </div>
        </div>
      </section>

      {venue && (
        <section>
          <figure className="venue-figure">
            <img
              src={venue.image}
              srcSet={`${venue.image_small} 800w, ${venue.image} 1600w`}
              sizes="(max-width: 980px) 100vw, 980px"
              width={venue.width}
              height={venue.height}
              alt={venue.alt}
            />
            <figcaption>
              {venue.caption}{' '}
              <a href={venue.credit_url} target="_blank" rel="noopener noreferrer">
                {venue.credit}
              </a>
            </figcaption>
          </figure>
        </section>
      )}

      {blurb.length > 0 && (
        <Section eyebrow="Detail" title="About this event">
          <div className="bracketed" style={{ maxWidth: 760 }}>
            {blurb.map((para, i) => (
              <p key={i} style={i === blurb.length - 1 ? { marginBottom: 0 } : undefined}>
                {para}
              </p>
            ))}
          </div>
        </Section>
      )}

      {ev.signups_open && !isPast ? (
        <>
          <Section eyebrow="Signup" title="Request a place" id="signup">
            <div className="panel" style={{ maxWidth: 760 }}>
              <EventSignupForm event={ev.slug} />
            </div>
          </Section>

          <Section eyebrow="Before you go" title="Add us to your safe senders">
            <div className="bracketed" style={{ maxWidth: 760 }}>
              <p style={{ marginBottom: 0 }}>
                Please add <a href="mailto:oqts@oqts.org">oqts@oqts.org</a> to your
                contacts, or mark it as a safe sender in your mail client.
                Invitations go out in a single batch, and a university spam
                filter is the most common reason one is never seen. If you have
                signed up and heard nothing, check your junk folder before you
                write to us, then write to us.
              </p>
            </div>
          </Section>
        </>
      ) : (
        <Section eyebrow="Signup" title={isPast ? 'This event has passed' : 'Signups are closed'}>
          <div className="panel" style={{ maxWidth: 560 }}>
            <p className="note" style={{ marginBottom: 'var(--oqts-space-4)' }}>
              {isPast
                ? 'This event has already taken place. Join the mailing list to hear about the next one.'
                : 'Signups for this event are not open. Join the mailing list and we will email you when they are.'}
            </p>
            <Btn href="/join#mailing-list" secondary>Join the mailing list</Btn>
          </div>
        </Section>
      )}
    </div>
  );
}
