import type { Structure } from '../lib/types';

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

function Card({ title, role }: { title: string; role: string }) {
  return (
    <div className="org-card">
      <span className="name">{title}</span>
      <Role role={role} />
    </div>
  );
}

// The society structure as a connected tree: founders, a stem down to the
// core team, and a dashed tier for the research projects to come.
export default function OrgTree({ structure }: { structure: Structure }) {
  const { founders, core, future } = structure;
  return (
    <div className="org-tree">
      <p className="org-tier-label">Founders</p>
      <ul className="org-row pair">
        {founders.map((f) => (
          <li key={f.name}>
            <Card title={f.name} role={f.role ?? 'Co-Founder'} />
          </li>
        ))}
      </ul>
      <div className="org-stem" />
      <p className="org-tier-label">Core team</p>
      <ul className="org-row connected">
        {core.map((c) => (
          <li key={c.name}>
            <Card title={c.name} role={c.role ?? 'Core member'} />
          </li>
        ))}
      </ul>
      <div className="org-stem dashed" />
      <p className="org-tier-label">{future.label} · from Michaelmas</p>
      <ul className="org-row spread">
        {Array.from({ length: future.count }, (_, i) => (
          <li key={i}>
            <div className="org-card ghost">
              <span className="name">Project {i + 1}</span>
              <span className="role-label">Lead + 3 researchers</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
