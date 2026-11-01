import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const site = 'https://vivaalgerie.com';
const failures = [];
const warnings = [];

const pages = [
  { file: 'src/content/articles/fr/the-gentlemen-maroc.md', route: '/the-gentlemen-maroc/', lang: 'fr', min: 2500, pillar: true },
  { file: 'src/content/articles/en/the-gentlemen-morocco.md', route: '/en/the-gentlemen-morocco/', lang: 'en', min: 2500, pillar: true },
  { file: 'src/content/articles/fr/the-gentlemen-rabat.md', route: '/the-gentlemen-rabat/', lang: 'fr', min: 900 },
  { file: 'src/content/articles/fr/the-gentlemen-erfoud.md', route: '/the-gentlemen-erfoud/', lang: 'fr', min: 900 },
  { file: 'src/content/articles/fr/the-gentlemen-accrocar-dune-films.md', route: '/the-gentlemen-accrocar-dune-films/', lang: 'fr', min: 1200 },
  { file: 'src/content/articles/en/the-gentlemen-luxury-cars-morocco.md', route: '/en/the-gentlemen-luxury-cars-morocco/', lang: 'en', min: 1200 },
];

const redirects = {
  '/articles/the-gentlemen-saison-3-maroc-rabat-erfoud/': '/the-gentlemen-maroc/',
  '/articles/ou-est-tournee-the-gentlemen-saison-3-maroc/': '/the-gentlemen-maroc/',
  '/articles/pourquoi-the-gentlemen-tourne-maroc-cinema/': '/the-gentlemen-maroc/',
  '/articles/the-gentlemen-saison-3-rabat-tournage/': '/the-gentlemen-rabat/',
  '/articles/the-gentlemen-saison-3-erfoud-desert-maroc/': '/the-gentlemen-erfoud/',
  '/articles/the-gentlemen-accrocar-voitures-luxe-maroc/': '/the-gentlemen-accrocar-dune-films/',
  '/articles/coulisses-the-gentlemen-accrocar-voitures-tournage/': '/the-gentlemen-accrocar-dune-films/',
  '/articles/the-gentlemen-rolls-royce-bentley-voitures-luxe/': '/the-gentlemen-accrocar-dune-films/',
  '/articles/the-gentlemen-production-maroc-coulisses-accrocar/': '/the-gentlemen-accrocar-dune-films/',
  '/articles/location-voiture-luxe-production-cinema-maroc/': '/the-gentlemen-accrocar-dune-films/',
  '/en/articles/the-gentlemen-season-3-morocco-rabat-erfoud/': '/en/the-gentlemen-morocco/',
  '/en/articles/where-is-the-gentlemen-season-3-filmed-morocco/': '/en/the-gentlemen-morocco/',
  '/en/articles/why-the-gentlemen-films-in-morocco/': '/en/the-gentlemen-morocco/',
  '/en/articles/the-gentlemen-season-3-rabat-filming/': '/en/the-gentlemen-morocco/',
  '/en/articles/the-gentlemen-season-3-erfoud-morocco-desert/': '/en/the-gentlemen-morocco/',
  '/en/articles/the-gentlemen-accrocar-luxury-cars-morocco/': '/en/the-gentlemen-luxury-cars-morocco/',
  '/en/articles/the-gentlemen-rolls-royce-bentley-luxury-cars/': '/en/the-gentlemen-luxury-cars-morocco/',
  '/en/articles/the-gentlemen-production-morocco-accrocar/': '/en/the-gentlemen-luxury-cars-morocco/',
  '/en/articles/behind-the-scenes-accrocar-production-cars-morocco/': '/en/the-gentlemen-luxury-cars-morocco/',
  '/en/articles/luxury-car-rental-film-production-morocco/': '/en/the-gentlemen-luxury-cars-morocco/',
};

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

function htmlPath(route) {
  return path.join(dist, route.replace(/^\//, ''), 'index.html');
}

function words(markdown) {
  const body = markdown
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\p{L}\p{N}’-]+/gu, ' ')
    .trim();
  return body ? body.split(/\s+/).length : 0;
}

for (const page of pages) {
  if (!fs.existsSync(path.join(root, page.file))) {
    failures.push(`${page.file}: source file is missing.`);
    continue;
  }
  const source = read(page.file);
  const count = words(source);
  if (count < page.min) failures.push(`${page.file}: ${count} words; expected at least ${page.min}.`);
  if (!source.includes(`canonicalPath: "${page.route}"`)) failures.push(`${page.file}: canonicalPath mismatch.`);
  for (const hidden of ['homepage', 'articleGrid', 'categoryGrid', 'related', 'featured', 'trending', 'popular', 'searchUI', 'recommendations', 'carousel', 'rss']) {
    if (!new RegExp(`^  ${hidden}: false$`, 'm').test(source)) failures.push(`${page.file}: visibility.${hidden} must be false.`);
  }
  for (const visible of ['sitemap', 'indexable']) {
    if (!new RegExp(`^  ${visible}: true$`, 'm').test(source)) failures.push(`${page.file}: visibility.${visible} must be true.`);
  }
  for (const required of ['Netflix', 'Dune Films', 'Accrocar', 'Moonage']) {
    if (!source.includes(required)) failures.push(`${page.file}: missing ${required} context.`);
  }
  if (!source.includes('## FAQ')) failures.push(`${page.file}: visible FAQ is missing.`);
  if (!source.includes('30 octobre 2026') && !source.includes('October 30, 2026')) failures.push(`${page.file}: update log/date disclosure is missing.`);

  const generated = htmlPath(page.route);
  if (!fs.existsSync(generated)) {
    failures.push(`${page.route}: generated HTML is missing.`);
    continue;
  }
  const html = fs.readFileSync(generated, 'utf8');
  const canonical = `${site}${page.route}`;
  for (const fragment of [
    `<link rel="canonical" href="${canonical}">`,
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    '<meta property="og:type" content="article">',
    `"mainEntityOfPage":"${canonical}"`,
    '"@type":"BlogPosting"',
    '"@type":"BreadcrumbList"',
    '"@type":"FAQPage"',
    '"datePublished":"2026-10-30T00:00:00.000Z"',
    '"dateModified":"2026-10-30T00:00:00.000Z"',
    `"inLanguage":"${page.lang}"`,
  ]) {
    if (!html.includes(fragment)) failures.push(`${page.route}: generated HTML missing ${fragment}.`);
  }
  if (html.includes('<meta name="robots" content="noindex')) failures.push(`${page.route}: unexpectedly noindexed.`);
  if (!page.pillar && html.includes('hreflang=')) failures.push(`${page.route}: has hreflang without a real translated counterpart.`);
}

const frenchPillar = fs.readFileSync(htmlPath('/the-gentlemen-maroc/'), 'utf8');
const englishPillar = fs.readFileSync(htmlPath('/en/the-gentlemen-morocco/'), 'utf8');
for (const html of [frenchPillar, englishPillar]) {
  for (const alternate of [
    `hreflang="fr" href="${site}/the-gentlemen-maroc/"`,
    `hreflang="en" href="${site}/en/the-gentlemen-morocco/"`,
    `hreflang="x-default" href="${site}/the-gentlemen-maroc/"`,
  ]) {
    if (!html.includes(alternate)) failures.push(`Pillar hreflang missing ${alternate}.`);
  }
}

const sitemapPath = path.join(dist, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) failures.push('Generated sitemap.xml is missing.');
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const page of pages) {
    if (!sitemap.includes(`<loc>${site}${page.route}</loc>`)) failures.push(`${page.route}: missing from sitemap.`);
  }
  for (const oldRoute of Object.keys(redirects)) {
    if (sitemap.includes(`<loc>${site}${oldRoute}</loc>`)) failures.push(`${oldRoute}: redirect URL remains in sitemap.`);
  }
}

for (const [from, to] of Object.entries(redirects)) {
  const generated = htmlPath(from);
  if (!fs.existsSync(generated)) {
    failures.push(`${from}: redirect page is missing.`);
    continue;
  }
  const html = fs.readFileSync(generated, 'utf8');
  if (!html.includes(`content="0;url=${to}"`)) failures.push(`${from}: does not redirect to ${to}.`);
  if (!html.includes(`<link rel="canonical" href="${site}${to}">`)) failures.push(`${from}: redirect canonical mismatch.`);
  if (!html.includes('<meta name="robots" content="noindex">')) failures.push(`${from}: redirect must be noindex.`);
}

const discoveryPages = ['index.html', 'blog/index.html', 'culture/index.html', 'en/index.html', 'en/blog/index.html', 'en/culture/index.html'];
for (const relative of discoveryPages) {
  const file = path.join(dist, relative);
  if (!fs.existsSync(file)) {
    failures.push(`${relative}: discovery page is missing.`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  for (const page of pages) {
    if (html.includes(`href="${page.route}`)) failures.push(`${relative}: exposes reference-only URL ${page.route}.`);
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const incorrectMoonageName = ['Montage', 'Pictures'].join(' ');
for (const file of walk(path.join(root, 'src'))) {
  if (fs.readFileSync(file, 'utf8').includes(incorrectMoonageName)) failures.push(`${file}: contains an incorrect Moonage entity name.`);
}

for (const [file, target] of [
  ['src/content/articles/fr/tourisme-maroc-algerie-comparaison.md', '/the-gentlemen-maroc/'],
  ['src/content/articles/en/morocco-algeria-tourism-comparison.md', '/en/the-gentlemen-morocco/'],
]) {
  if (!read(file).includes(`](${target})`)) failures.push(`${file}: missing contextual link to ${target}.`);
}

if (pages.filter((page) => page.pillar).length !== 2) failures.push('Expected exactly two pillar pages.');
if (pages.filter((page) => !page.pillar).length !== 4) failures.push('Expected exactly four supporting pages.');

const result = {
  pages: pages.map((page) => ({ route: page.route, words: words(read(page.file)) })),
  redirects: Object.keys(redirects).length,
  failures,
  warnings,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
