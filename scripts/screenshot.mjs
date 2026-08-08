// Self-verification: screenshot every route at phone (primary), desktop and
// minimum widths against a running dev/start server. Output: .screenshots/.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.SHOT_BASE ?? 'http://127.0.0.1:8002';
const ROUTES = (process.env.SHOT_ROUTES ?? '/').split(',');
const WIDTHS = [
  { w: 390, h: 844, tag: 'phone' },
  { w: 1280, h: 900, tag: 'desktop' },
  { w: 360, h: 780, tag: 'min' },
];

mkdirSync('.screenshots', { recursive: true });
const browser = await chromium.launch();
for (const route of ROUTES) {
  for (const { w, h, tag } of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const name = route === '/' ? 'home' : route.replaceAll('/', '');
    await page.screenshot({ path: `.screenshots/${name}-${tag}.png`, fullPage: true });
    // horizontal-overflow check: brand requires clean 360px rendering
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (overflow > 0) console.warn(`OVERFLOW ${route} @${w}px: +${overflow}px`);
    await page.close();
  }
}
await browser.close();
console.log(`screenshots written for ${ROUTES.length} route(s)`);
