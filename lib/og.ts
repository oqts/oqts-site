import type { Metadata } from 'next';

// Next overwrites `openGraph` wholesale between segments rather than deep
// merging it: a page that sets only `images` silently drops siteName,
// locale and type from its share card. Any page that touches openGraph
// therefore spreads these back in, and the layout reads them from here so
// there is one place to change them.
export const OG_DEFAULTS = {
  siteName: 'Oxford Quantitative Trading Society',
  locale: 'en_GB',
  type: 'website',
} as const satisfies Metadata['openGraph'];

/** The share card used by every page that has nothing better of its own. */
export const OG_DEFAULT_IMAGE = '/brand/favicon/og-card.png';
