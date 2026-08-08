export type Person = {
  name: string;
  role?: string;
  links?: Record<string, string>;
};

export type Subteam = {
  name: string;
  description?: string;
  leads: Person[];
};

export type Team = {
  name: string;
  slug: string;
  description: string;
  leads: Person[];
  subteams?: Subteam[];
};

export type Society = {
  society: {
    name: string;
    short_name: string;
    email: string;
    links: Record<string, string>;
  };
  committee: { role: string; name: string; links?: Record<string, string> }[];
  teams: Team[];
};

export type Sponsor = { name: string; logo: string; url: string };
export type SponsorTier = { name: string; logo_height: number; sponsors: Sponsor[] };
export type Sponsors = { tiers: SponsorTier[] };

export type EventTag = 'talk' | 'social' | 'competition' | 'workshop';
export type SocietyEvent = {
  title: string;
  date: string; // ISO YYYY-MM-DD
  time?: string;
  location: string;
  tag: EventTag;
  description: string;
  url?: string;
};
export type Events = { events: SocietyEvent[] };
