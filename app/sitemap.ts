import type { MetadataRoute } from 'next';

const ROUTES = ['', '/about', '/join', '/contact', '/team', '/oxdaq', '/events'];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://oqts.org${route}`,
    changeFrequency: route === '/events' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/join' ? 0.9 : 0.6,
  }));
}
