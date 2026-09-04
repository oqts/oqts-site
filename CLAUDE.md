# oqts-site: agent guidance

Read `../.github/CLAUDE.md` first. Human overview is `README.md`.

## What this repo is

Public. The society's marketing site at oqts.org. Next.js App Router,
TypeScript, deployed on Vercel. Nothing sensitive lives here: it is
public marketing on zero-ops hosting, by design (`ARCHITECTURE.md`).

```bash
git clone --recurse-submodules ...   # the submodule is not optional
npm install
npm run dev          # binds 0.0.0.0:8002, runs sync-brand first
npm run screenshot   # every route at phone/desktop/min width
```

## Five sources of truth, none of them here

1. **Styling comes from `oqts-design`**, pinned as the submodule
   `vendor/oqts-design`. `scripts/sync-brand.mjs` copies what ships into
   `public/brand/`, which is **gitignored**: the submodule pin is what
   ships. Never edit `public/brand/`, never hand-code a hex value, and
   never add a style rule that belongs in the design repo. To take a
   brand update, bump the submodule pin and commit it.
2. **Content lives in `data/`.** `society.yml` and `sponsors.yml` are
   edited only here. Loaders in `lib/data.ts` validate on load and
   **fail the build on a bad edit**, which is the intended behaviour: do
   not soften it to a warning. One exception, and it is deliberate:
   `society.yml` no longer holds `bio:`. See 5.
3. **Society hierarchy comes from the GitHub org**, read-only via API.
   Never fork a copy into `data/`.
4. **Events come from the platform, not this repo.** `data/events.yml`
   was deleted on 2026-09-01. `lib/events.ts` fetches `/events` from the
   platform API server-side and revalidates every 5 minutes, so
   publishing an event is a back-office edit, not a deploy. That loader
   **never throws**: an events page that 500s because the API blinked is
   worse than one rendering its own empty state, so callers check `ok`
   to tell "no events" from "could not reach the API". Do not add a
   second copy of event data here.
5. **Team profiles come from the platform too.** `bio:` and `course:`
   were removed from `society.yml` on 2026-09-04, the same move for the
   same reason: a committee member writes their own description and
   degree at `platform.oqts.org/account` and they reach the team page
   through `lib/team.ts`, so fixing your own paragraph, or saying you
   have graduated, is not a pull request. `society.yml` still owns what
   the society decides rather than the person: who is on the team, their
   committee role, their links, and the order they appear in. The loader
   returns `{}` rather than throwing, so a card renders without those
   fields if the API blinks. Either field added back into `society.yml`
   is not read by anything.

## Forms and the API

`app/api/{signup,apply,event-signup,hit,confirm,unsubscribe}/route.ts` proxy
**server-side** to the platform API with a shared secret. The secret
never reaches the browser. Env: `SIGNUP_UPSTREAM_URL`,
`SIGNUP_SHARED_SECRET` (`.env.local` locally, project settings on
Vercel).

**Adding a public endpoint is a three-repo change.** A new route here
also needs the endpoint in `oqts-platform/signup-api`, and the path
added to the Caddy allow-list, or it returns 404 in production and the
failure surfaces only as a generic error page. This has already happened
once, to `/confirm` and `/unsubscribe`.

## Brand compliance

This is a brand surface and compliance is not optional. `styles/site.css`
is ported from the design repo's reference page and expressed entirely in
`--oqts-*` tokens. In force here:

- Navy as masthead and footer bands only, never mid-page.
- The double close-rule closes a section. Never decorative, never
  mid-content.
- Paper cards always carry a 1px camel frame. Borderless paper cards do
  not exist.
- At most one page-load reveal. No scroll effects, no ambient animation.
- **No em-dashes in any copy.** Colon, comma, or full stop.
- Long-form measure 68ch, in STIX, never mono.

## Ownership

Frontend is written by Claude, entirely, and is not reviewed line by
line. It must therefore be correct and on brand without supervision.
Run `npm run screenshot` and look at the output before claiming a visual
change works.
