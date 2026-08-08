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
  if (!Array.isArray(s.committee) || s.committee.length === 0) fail('society.yml', 'committee must be a non-empty list');
  for (const m of s.committee) {
    if (!m.role || !m.name) fail('society.yml', `committee entries need role and name (got ${JSON.stringify(m)})`);
  }
  if (!Array.isArray(s.teams)) fail('society.yml', 'teams must be a list');
  for (const t of s.teams) {
    if (!t.name || !t.slug || !t.description) fail('society.yml', `team entries need name, slug, description (got ${t.name ?? '?'})`);
    t.leads ??= [];
    for (const sub of t.subteams ?? []) {
      if (!sub.name) fail('society.yml', `subteams need a name (team ${t.name})`);
      sub.leads ??= [];
    }
  }
  return s;
}

export function getSponsors(): Sponsors {
  const s = load('sponsors.yml') as Sponsors;
  if (!Array.isArray(s.tiers) || s.tiers.length === 0) fail('sponsors.yml', 'tiers must be a non-empty list');
  for (const tier of s.tiers) {
    if (!tier.name || typeof tier.logo_height !== 'number') fail('sponsors.yml', `tiers need name and numeric logo_height (${tier.name ?? '?'})`);
    for (const sp of tier.sponsors ?? []) {
      if (!sp.name || !sp.logo || !sp.url) fail('sponsors.yml', `sponsors need name, logo, url (${sp.name ?? '?'})`);
      const onDisk = join(process.cwd(), 'public', sp.logo);
      if (!existsSync(onDisk)) fail('sponsors.yml', `logo file missing: ${sp.logo}`);
    }
  }
  return s;
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
