import type { MetadataRoute } from 'next';
import { getEvents } from '../lib/events';

const ROUTES = ['', '/join', '/contact', '/team', '/research', '/oxdaq', '/events', '/sponsors'];

// Event pages are enumerated from the platform API, so publishing an
// event puts it in the sitemap without a code change. If the API is
// unreachable getEvents returns empty and the static routes still ship:
// a sitemap missing a page is recoverable, a build failure is not.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { upcoming, past } = await getEvents();
  const events = [...upcoming, ...past].map((e) => ({
    url: `https://oqts.org/events/${e.slug}`,
    changeFrequency: 'weekly' as const,
    priority: e.signups_open ? 0.9 : 0.5,
  }));
  return [
    ...ROUTES.map((route) => ({
      url: `https://oqts.org${route}`,
      changeFrequency: route === '/events' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : route === '/join' ? 0.9 : 0.6,
    })),
    ...events,
  ];
}
