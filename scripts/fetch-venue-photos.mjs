// Derive the venue photographs in public/venues/ from their upstream
// Wikimedia Commons originals.
//
// The originals are 14MB, 7000px-wide JPEGs and are NOT committed: this
// script is the provenance record. Re-run it when a venue photo changes,
// commit the derived files, and keep the SOURCES table below in step with
// data/venues.yml — the credit line printed on the site is authored there,
// and the two must agree or we are misattributing someone's photograph.
//
//   node scripts/fetch-venue-photos.mjs
//
// Every image here is CC BY-SA: the crops below are adaptations, so the
// derived files are themselves CC BY-SA 3.0 and the site must credit the
// photographer wherever they appear. That is why the OG card has the
// credit burnt into the pixels — a share card travels with no caption.
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, 'public/venues');
const cache = join(root, '.venue-src');

const SOURCES = [
  {
    key: 'divinity-school',
    // https://commons.wikimedia.org/wiki/File:Divinity_School_Interior_3,_Bodleian_Library,_Oxford,_UK_-_Diliff.jpg
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Divinity_School_Interior_3%2C_Bodleian_Library%2C_Oxford%2C_UK_-_Diliff.jpg',
    credit: 'Photo: David Iliff · CC BY-SA 3.0',
    // Fractions of the source height, so the numbers survive a change of
    // original. The vault is the point of the picture: both crops keep all
    // of it and give up floor.
    figureTop: 0.018,
    ogTop: 0.04,
  },
];

const FIGURE_AR = 3 / 2;
const OG_W = 1200;
const OG_H = 630;

mkdirSync(out, { recursive: true });
mkdirSync(cache, { recursive: true });

/** Band of the given aspect ratio, full source width, anchored `top`
 *  fractionally down the frame and clamped to stay inside the image. */
function band(width, height, ar, topFraction) {
  const h = Math.min(height, Math.round(width / ar));
  const top = Math.min(Math.round(height * topFraction), height - h);
  return { left: 0, top, width, height: h };
}

for (const src of SOURCES) {
  const original = join(cache, `${src.key}.jpg`);
  if (!existsSync(original)) {
    process.stdout.write(`fetching ${src.key}… `);
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'oqts-site venue asset build (oqts@oqts.org)' },
    });
    if (!res.ok) throw new Error(`${src.url}: HTTP ${res.status}`);
    writeFileSync(original, Buffer.from(await res.arrayBuffer()));
    console.log(`${(readFileSync(original).length / 1e6).toFixed(1)}MB`);
  }

  const { width, height } = await sharp(original).metadata();

  for (const w of [1600, 800]) {
    const file = join(out, `${src.key}-${w}.webp`);
    await sharp(original)
      .extract(band(width, height, FIGURE_AR, src.figureTop))
      .resize({ width: w })
      .webp({ quality: 82 })
      .toFile(file);
    console.log(`  ${src.key}-${w}.webp`);
  }

  // JPEG, not WebP: some share-card scrapers still will not render WebP,
  // and a link that previews as nothing is the whole thing we are fixing.
  const label = Buffer.from(
    `<svg width="${OG_W}" height="${OG_H}">
       <text x="${OG_W - 24}" y="${OG_H - 20}" text-anchor="end"
             font-family="Georgia, 'Times New Roman', serif" font-size="19"
             fill="#ffffff" fill-opacity="0.82"
             style="paint-order:stroke;stroke:#000000;stroke-opacity:0.45;stroke-width:3px">
         ${src.credit}
       </text>
     </svg>`,
  );
  await sharp(original)
    .extract(band(width, height, OG_W / OG_H, src.ogTop))
    .resize({ width: OG_W, height: OG_H })
    .composite([{ input: label, top: 0, left: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(out, `${src.key}-og.jpg`));
  console.log(`  ${src.key}-og.jpg`);
}
