import type { Structure } from '../lib/types';

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
            <div className="org-card">
              <span className="role-label">{f.role}</span>
              <span className="name">{f.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="org-stem" />
      <p className="org-tier-label">Core team</p>
      <ul className="org-row connected">
        {core.map((c) => (
          <li key={c.name}>
            <div className="org-card">
              <span className="role-label">{c.role ?? 'Core member'}</span>
              <span className="name">{c.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="org-stem dashed" />
      <p className="org-tier-label">{future.label} · from Michaelmas</p>
      <ul className="org-row">
        {Array.from({ length: future.count }, (_, i) => (
          <li key={i}>
            <div className="org-card ghost">
              <span className="role-label">Project {i + 1}</span>
              <span className="name">Lead + 3 researchers</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
