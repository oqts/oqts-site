import type { Team } from '../lib/types';

export default function TeamTree({ teams }: { teams: Team[] }) {
  return (
    <div className="team-tree">
      {teams.map((team) => (
        <div className="team" key={team.slug}>
          <h3>{team.name}</h3>
          <p className="col">{team.description}</p>
          {team.leads.length > 0 && (
            <div>
              {team.leads.map((lead) => (
                <p className="person" key={lead.name}>
                  <span className="role-label">{lead.role ?? 'Lead'}</span>
                  <br />
                  {lead.name}
                </p>
              ))}
            </div>
          )}
          {(team.subteams?.length ?? 0) > 0 && (
            <ul className="subteams">
              {team.subteams!.map((sub) => (
                <li key={sub.name}>
                  <h4>{sub.name}</h4>
                  {sub.description && <p className="note">{sub.description}</p>}
                  {sub.leads.map((lead) => (
                    <p className="person" key={lead.name}>
                      <span className="role-label">{lead.role ?? 'Lead'}</span>
                      <br />
                      {lead.name}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
