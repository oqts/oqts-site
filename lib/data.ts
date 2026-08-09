// Build-time loaders for the data/*.yml single-source-of-truth files.
// Validation throws so a bad GitHub edit fails the Vercel build instead
// of shipping a broken page.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import type { Events, Society, SocietyEvent, Sponsors } from './types';

const DATA = join(process.cwd(), 'data');

function load(file: string): unknown {
  return parse(readFileSync(join(DATA, file), 'utf8'));
}

function fail(file: string, msg: string): never {
  throw new Error(`${file}: ${msg}`);
}

export function getSociety(): Society {
  const s = load('society.yml') as Society;
  if (!s.society?.name || !s.society?.email) fail('society.yml', 'society.name and society.email are required');
  const st = s.structure;
  if (!st || !Array.isArray(st.founders) || st.founders.length === 0) fail('society.yml', 'structure.founders must be a non-empty list');
  for (const f of st.founders) {
    if (!f.name || !f.role) fail('society.yml', `founders need name and role (got ${JSON.stringify(f)})`);
  }
  if (!Array.isArray(st.core)) fail('society.yml', 'structure.core must be a list');
  for (const c of st.core) {
    if (!c.name) fail('society.yml', 'core members need a name');
  }
  for (const p of [...st.founders, ...st.core]) {
    for (const key of ['course', 'year', 'bio'] as const) {
      if (p[key] !== undefined && (typeof p[key] !== 'string' || !p[key].trim())) {
        fail('society.yml', `${key} on ${p.name} must be non-empty text`);
      }
    }
  }
  if (!st.future?.label || !st.future?.note || typeof st.future?.count !== 'number') {
    fail('society.yml', 'structure.future needs label, note and numeric count');
  }
  return s;
}

const TIER_SLUGS = new Set(['founder', 'gold', 'silver', 'bronze']);

export function getSponsors(): Sponsors {
  const s = load('sponsors.yml') as Sponsors;
  if (!Array.isArray(s.tiers) || s.tiers.length === 0) fail('sponsors.yml', 'tiers must be a non-empty list');
  for (const tier of s.tiers) {
    if (!tier.name || typeof tier.logo_height !== 'number') fail('sponsors.yml', `tiers need name and numeric logo_height (${tier.name ?? '?'})`);
    if (!TIER_SLUGS.has(tier.slug)) fail('sponsors.yml', `bad tier slug: ${tier.slug}`);
    for (const sp of tier.sponsors ?? []) {
      if (!sp.name || !sp.logo || !sp.url) fail('sponsors.yml', `sponsors need name, logo, url (${sp.name ?? '?'})`);
      const onDisk = join(process.cwd(), 'public', sp.logo);
      if (!existsSync(onDisk)) fail('sponsors.yml', `logo file missing: ${sp.logo}`);
    }
  }
  return s;
}

export function getAllSponsors() {
  return getSponsors().tiers.flatMap((t) => t.sponsors);
}

const TAGS = new Set(['talk', 'social', 'competition', 'workshop']);

export function getEvents(): { upcoming: SocietyEvent[]; past: SocietyEvent[] } {
  const e = load('events.yml') as Events;
  if (!Array.isArray(e.events)) fail('events.yml', 'events must be a list');
  for (const ev of e.events) {
    if (!ev.title || !ev.location || !ev.description) fail('events.yml', `events need title, location, description (${ev.title ?? '?'})`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.date ?? '') || Number.isNaN(Date.parse(ev.date))) {
      fail('events.yml', `bad ISO date on "${ev.title}": ${ev.date}`);
    }
    if (!TAGS.has(ev.tag)) fail('events.yml', `bad tag on "${ev.title}": ${ev.tag}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = e.events.filter((ev) => ev.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = e.events.filter((ev) => ev.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
