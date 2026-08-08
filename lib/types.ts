export type Person = {
  name: string;
  role?: string;
  links?: Record<string, string>;
};

export type Structure = {
  founders: Person[];
  core: Person[];
  future: { label: string; note: string; count: number };
};

export type Society = {
  society: {
    name: string;
    short_name: string;
    email: string;
    links: Record<string, string>;
  };
  structure: Structure;
};

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
  blurb?: string;
  logo_height?: number; // per-firm override for marks that are not wide wordmarks
};
export type SponsorTier = {
  name: string;
  slug: 'founder' | 'gold' | 'silver' | 'bronze';
  logo_height: number;
  sponsors: Sponsor[];
};
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
