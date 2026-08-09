import type { Structure } from '../lib/types';
import PersonCard from './PersonCard';

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
            <PersonCard person={f} fallbackRole="Co-Founder" />
          </li>
        ))}
      </ul>
      <div className="org-stem" />
      <p className="org-tier-label">Core team</p>
      <ul className="org-row connected">
        {core.map((c) => (
          <li key={c.name}>
            <PersonCard person={c} fallbackRole="Core member" />
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
