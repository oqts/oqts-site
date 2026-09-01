import Link from 'next/link';
import type { PublicEvent } from '../lib/events';

function displayDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function EventList({ events }: { events: PublicEvent[] }) {
  return (
    <ul className="event-list">
      {events.map((ev) => (
        <li key={ev.slug}>
          <div className="when">
            {displayDate(ev.date)}
            {ev.time && <><br />{ev.time}</>}
          </div>
          <div className="what">
            <b>
              <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
            </b>
            <span className="meta">
              {ev.tag.toUpperCase()} · {ev.location}
              {ev.signups_open && <> · SIGNUPS OPEN</>}
            </span>
            <p className="note" style={{ marginTop: 6, marginBottom: 0 }}>{ev.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
