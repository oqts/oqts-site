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

// A photograph of a room we hold events in, from data/venues.yml. Keyed
// to events by matching the free-text location the committee typed, so
// the platform keeps no image of its own.
export type Venue = {
  key: string;
  match: string[];
  image: string;
  image_small: string;
  og_image: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string; // a licence condition: never render the photo without it
  credit_url: string;
};
export type Venues = { venues: Venue[] };
