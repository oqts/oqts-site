# oqts-site

The public website of the **Oxford Quantitative Trading Society**, live at
[oqts.org](https://oqts.org). Next.js (App Router) + TypeScript, deployed on
Vercel.

## How it fits together

- **Brand assets are consumed, never defined here.** The design system lives
  in [`oqts/oqts-design`](https://github.com/oqts/oqts-design), pinned as the
  git submodule `vendor/oqts-design`. `scripts/sync-brand.mjs` copies the
  needed assets into the gitignored `public/brand/` before every dev/build.
  To take a brand update: bump the submodule and commit the new pin.
- **Content that changes lives in `data/`.** `society.yml` (structure),
  `sponsors.yml` (tiers) and `events.yml` (programme) are the single sources
  of truth, edited only via this repository; loaders in `lib/data.ts`
  validate on load and fail the build on a bad edit.
- **Forms post to `/api/signup` and `/api/apply`**, which proxy server-side
  to the society's platform API with a shared secret. Env vars:
  `SIGNUP_UPSTREAM_URL`, `SIGNUP_SHARED_SECRET` (see `.env.local` locally,
  project settings on Vercel). Backend code lives in `oqts/oqts-platform`.

## Develop

```sh
git clone --recurse-submodules git@github.com:oqts/oqts-site.git
cd oqts-site
npm install
npm run dev          # binds 0.0.0.0:8002
```

`npm run screenshot` captures every route at phone/desktop/minimum widths
into `.screenshots/` (Playwright; run `npx playwright install chromium` once).

## Notes

- Sponsor artwork under `public/sponsors/` remains the property of the
  respective firms; provenance is recorded in `data/sponsors.yml`.
- Brand fonts and marks are licensed as described in
  [`oqts-design`](https://github.com/oqts/oqts-design).
