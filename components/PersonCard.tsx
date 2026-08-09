'use client';
import { useRef } from 'react';
import type { Person } from '../lib/types';

const LINK_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  website: 'Website',
};

// A role like "Co-Founder · Head of Research & Technology" may wrap at the
// separator but never inside a part, so each part renders as one line.
function Role({ role }: { role: string }) {
  const parts = role.split(' · ');
  return (
    <span className="role-label">
      {parts.map((part, i) => (
        <span key={part}>
          {i > 0 && ' · '}
          <span className="part">{part}</span>
        </span>
      ))}
    </span>
  );
}

// Bios are plain YAML text; **key phrase** is the one bit of markup allowed.
function Bold({ text }: { text: string }) {
  return <>{text.split('**').map((seg, i) => (i % 2 ? <strong key={i}>{seg}</strong> : seg))}</>;
}

// A person in the org tree. With a bio the card becomes a button that opens
// a profile dialog; without one it stays a plain card, so people render the
// same before their profile is written.
export default function PersonCard({ person, fallbackRole }: { person: Person; fallbackRole: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const role = person.role ?? fallbackRole;
  const meta = [person.course, person.year].filter(Boolean).join(' · ');
  const summary = (
    <>
      <span className="name">{person.name}</span>
      <Role role={role} />
      {meta && <span className="meta">{meta}</span>}
    </>
  );

  if (!person.bio) return <div className="org-card">{summary}</div>;

  const links = Object.entries(person.links ?? {}).filter(([, url]) => url);
  return (
    <>
      <button type="button" className="org-card" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
        {summary}
        <span className="profile-hint">Profile</span>
      </button>
      {/* the body div covers the whole dialog, so a click that targets the
          dialog element itself can only have landed on the backdrop */}
      <dialog
        ref={dialog}
        className="person-dialog"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="body">
          <div className="head">
            <h3>{person.name}</h3>
            <button type="button" className="dialog-close" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          <div className="ident">
            <Role role={role} />
            {meta && <span className="meta">{meta}</span>}
          </div>
          {person.bio.split(/\n{2,}/).map((para) => (
            <p key={para.slice(0, 40)}>
              <Bold text={para.trim()} />
            </p>
          ))}
          {links.length > 0 && (
            <p className="person-links">
              {links.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer">
                  {LINK_LABELS[key] ?? key}
                </a>
              ))}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
