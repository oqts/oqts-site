// Copy the brand assets the site serves out of the oqts-design submodule
// into public/brand/. public/brand/ is gitignored — the submodule pin is the
// single source of truth for what ships. Selective on purpose: demo/, lab/,
// archive/ and the PNG logo exports never reach the deploy.
import { cpSync, mkdirSync, rmSync, readdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'vendor/oqts-design/assets');
const dst = join(root, 'public/brand');

if (!existsSync(join(src, 'oqts.css'))) {
  console.error('sync-brand: submodule missing — run: git submodule update --init');
  process.exit(1);
}

rmSync(dst, { recursive: true, force: true });
mkdirSync(dst, { recursive: true });

copyFileSync(join(src, 'oqts.css'), join(dst, 'oqts.css'));

// WOFF2 + licences only; OTF/TTF sources stay in the design repo.
for (const family of readdirSync(join(src, 'fonts'))) {
  const from = join(src, 'fonts', family);
  const to = join(dst, 'fonts', family);
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) {
    if (f.endsWith('.woff2') || f === 'LICENSE.txt') copyFileSync(join(from, f), join(to, f));
  }
}

cpSync(join(src, 'logo'), join(dst, 'logo'), { recursive: true });
cpSync(join(src, 'favicon'), join(dst, 'favicon'), { recursive: true });
cpSync(join(src, 'patterns'), join(dst, 'patterns'), { recursive: true });

console.log('sync-brand: public/brand refreshed from vendor/oqts-design');
