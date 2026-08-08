import type { SocietyEvent } from '../lib/types';

function displayDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function EventList({ events }: { events: SocietyEvent[] }) {
  return (
    <ul className="event-list">
      {events.map((ev) => (
        <li key={`${ev.date}-${ev.title}`}>
          <div className="when">
            {displayDate(ev.date)}
            {ev.time && <><br />{ev.time}</>}
          </div>
          <div className="what">
            <b>{ev.url ? <a href={ev.url}>{ev.title}</a> : ev.title}</b>
            <span className="meta">{ev.tag.toUpperCase()} · {ev.location}</span>
            <p className="note" style={{ marginTop: 6, marginBottom: 0 }}>{ev.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
