import type { Metadata } from 'next';
import Btn from '../../components/Btn';
import CloseRule from '../../components/CloseRule';
import EventList from '../../components/EventList';
import Section from '../../components/Section';
import { getEvents } from '../../lib/data';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming talks, competitions and socials of the Oxford Quantitative Trading Society.',
};

export const revalidate = 86400; // re-split upcoming/past daily

export default function Events() {
  const { upcoming, past } = getEvents();
  return (
    <div className="wrap">
      <section>
        <p className="eyebrow">Events</p>
        <h1>The term programme</h1>
        <p className="lede col">
          Talks, workshops, OXDAQ competition rounds and socials. Everything is
          free for members.
        </p>
        <CloseRule />
      </section>

      <Section eyebrow="Upcoming" title="Next up">
        {upcoming.length > 0 ? (
          <EventList events={upcoming} />
        ) : (
          <div className="panel" style={{ maxWidth: 560 }}>
            <p className="note" style={{ marginBottom: 'var(--oqts-space-4)' }}>
              The Michaelmas programme is announced in September. Join the
              mailing list and it will land in your inbox.
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
