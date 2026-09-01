import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import EventList from '../../components/EventList';
import Section from '../../components/Section';
import { getEvents } from '../../lib/events';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming talks, competitions and socials of the Oxford Quantitative Trading Society.',
};

// Events come from the platform API and are revalidated there
// (lib/events.ts), so this page needs no revalidate of its own.

export default async function Events() {
  const { ok, upcoming, past } = await getEvents();
  const open = upcoming.find((e) => e.signups_open);

  return (
    <div className="wrap">
      <div className="ground g2" aria-hidden="true" />
      <section>
        <div className="plate">
          <p className="eyebrow">Events</p>
          <h1>The term programme</h1>
          <p className="lede col">
            Talks, workshops, OXDAQ competition rounds, and socials.
          </p>
          <div className="btn-row">
            {open && <Btn href={`/events/${open.slug}`}>{open.title}: sign up</Btn>}
            <Btn href="/join#mailing-list" secondary>Get event emails</Btn>
          </div>
        </div>
      </section>

      <Section eyebrow="Upcoming" title="Next up">
        {upcoming.length > 0 ? (
          <EventList events={upcoming} />
        ) : (
          <div className="panel" style={{ maxWidth: 560 }}>
            <p className="note" style={{ marginBottom: 'var(--oqts-space-4)' }}>
              {ok
                ? 'Nothing is scheduled just now. Join the mailing list and the next programme will land in your inbox.'
                : 'The programme is briefly unavailable. Please try again shortly, or join the mailing list below.'}
            </p>
            <Btn href="/join#mailing-list" secondary>Join the mailing list</Btn>
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section eyebrow="Archive" title="Past events">
          <EventList events={past} />
        </Section>
      )}
    </div>
  );
}
