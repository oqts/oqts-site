export type Person = {
  name: string;
  role?: string;
  course?: string;
  year?: string;
  bio?: string; // a bio makes the person's org-tree card open a profile dialog
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
  banner_height?: number; // height in the marquee; tuned so logos read optically equal
};
export type SponsorTier = {
  name: string;
  slug: 'founder' | 'gold' | 'silver' | 'bronze';
  logo_height: number;
  sponsors: Sponsor[];
};
export type Sponsors = { tiers: SponsorTier[] };

export type EventTag = 'talk' | 'social' | 'competition' | 'workshop';
// Shape as served by the platform API (lib/events.ts). `time` is free
// text because the committee writes things like "18:30 for 19:00".
export type SocietyEvent = {
  title: string;
  date: string; // ISO YYYY-MM-DD
  time?: string | null;
  location: string;
  tag: EventTag;
  description: string;
};
