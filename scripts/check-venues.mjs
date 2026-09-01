// Build gate for data/venues.yml.
//
// This lives in a prebuild script rather than in the lib/data.ts loader
// because /events/[slug] is a dynamic route: nothing renders it at build
// time, so a loader that throws would catch a bad edit only when a
// visitor hit the page, which is the one moment it must not. Running here
// means a mistyped path or a stripped credit fails the Vercel build, and
// getVenues() can stay a plain read of data already known to be good.
//
// Keep this the only place venues.yml is validated.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const file = join(root, 'data/venues.yml');

const problems = [];
const { venues } = parse(readFileSync(file, 'utf8')) ?? {};

if (!Array.isArray(venues)) {
  problems.push('venues must be a list');
} else {
  const seen = new Set();
  for (const [i, v] of venues.entries()) {
    const at = v?.key ?? `entry ${i + 1}`;
    if (!v?.key) problems.push(`${at}: key is required`);
    else if (seen.has(v.key)) problems.push(`${at}: duplicate key`);
    else seen.add(v.key);

    if (!v?.alt) problems.push(`${at}: alt text is required, the photograph is content`);
    if (!v?.caption) problems.push(`${at}: caption is required`);
    // Not style: CC BY-SA obliges us to name the photographer wherever
    // the photograph appears. Shipping without one is a licence breach.
    if (!v?.credit) problems.push(`${at}: credit is a licence condition and is required`);
    if (!v?.credit_url) problems.push(`${at}: credit_url is a licence condition and is required`);

    if (!Array.isArray(v?.match) || v.match.length === 0) {
      problems.push(`${at}: match must be a non-empty list of location substrings`);
    }
    // The figure reserves its box from these, so a wrong pair shifts the
    // page as the photograph decodes.
    if (typeof v?.width !== 'number' || typeof v?.height !== 'number') {
      problems.push(`${at}: numeric width and height are required`);
    }
    for (const key of ['image', 'image_small', 'og_image']) {
      if (!v?.[key]) {
        problems.push(`${at}: ${key} is required`);
      } else if (!existsSync(join(root, 'public', v[key]))) {
        problems.push(`${at}: ${key} is not in public/ (${v[key]}). Run: node scripts/fetch-venue-photos.mjs`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error('data/venues.yml is not valid:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check-venues: ${venues.length} venue(s) ok`);
