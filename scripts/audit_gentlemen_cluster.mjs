import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const locales = ['fr', 'en', 'es', 'nl'];
const articles = [];
const failures = [];
const warnings = [];

for (const locale of locales) {
  const dir = path.join(root, 'src/content/articles', locale);
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
    const full = path.join(dir, file);
    const text = fs.readFileSync(full, 'utf8');
    if (!text.includes('translationKey: "the-gentlemen-morocco-')) continue;
    const field = (name) => text.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1]?.trim();
    const body = text.replace(/^---[\s\S]*?---\s*/m, '');
    articles.push({ locale, file, full, text, body, slug: field('slug'), key: field('translationKey'), image: field('image') });
  }
}

if (articles.length !== 40) failures.push(`Expected 40 articles, found ${articles.length}.`);

for (let i = 1; i <= 10; i++) {
  const group = articles.filter((a) => a.key === `the-gentlemen-morocco-${i}`);
  if (group.length !== 4) failures.push(`Translation key ${i} has ${group.length}/4 locales.`);
}

const allRoutes = new Set(articles.map((a) => a.slug));
if (allRoutes.size !== articles.length) failures.push('Duplicate slugs detected in the cluster.');

for (const article of articles) {
  const words = article.body.replace(/<[^>]+>/g, ' ').replace(/[\[\]()*_#>`]/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 1300) failures.push(`${article.locale}/${article.file}: only ${words} words.`);
  if (words < 1500) warnings.push(`${article.locale}/${article.file}: ${words} words (below the 1,500-word editorial target).`);
  for (const required of ['title', 'description', 'slug', 'lang', 'pubDate', 'updatedDate', 'image', 'imageAlt', 'translationKey']) {
    if (!new RegExp(`^${required}:`, 'm').test(article.text)) failures.push(`${article.locale}/${article.file}: missing ${required}.`);
  }
  if (!article.body.includes('## FAQ')) failures.push(`${article.locale}/${article.file}: missing visible FAQ.`);
  if (!article.body.includes('Netflix') || !article.body.includes('Le360')) failures.push(`${article.locale}/${article.file}: missing core sources in body.`);
  if (/official Netflix supplier|official Netflix partner|proveedor oficial de Netflix|officiële Netflix-leverancier/i.test(article.body)) {
    const negated = /not call any company an “official Netflix supplier”|Is Accrocar an official Netflix supplier|¿Accrocar es proveedor oficial de Netflix|evitamos “proveedor oficial de Netflix”|Is Accrocar een officiële Netflix-leverancier|nooit “officiële Netflix-leverancier”/i.test(article.body);
    if (!negated) failures.push(`${article.locale}/${article.file}: unsupported official-supplier wording.`);
  }
  const imagePath = path.join(root, 'public', article.image.replace(/^\//, ''));
  if (!fs.existsSync(imagePath)) failures.push(`${article.locale}/${article.file}: missing hero image ${article.image}.`);
  const internal = [...article.body.matchAll(/\]\((\/(?:en\/articles|es\/articulos|nl\/artikelen|articles)\/[^)]+)\)/g)].map((m) => m[1]);
  if (internal.length < 3) failures.push(`${article.locale}/${article.file}: only ${internal.length} cluster links.`);
  if (article.key.match(/-(?:6|7|8|9|10)$/)) {
    const links = (article.body.match(/https:\/\/accrocar\.com\/?/g) ?? []).length;
    if (links < 1 || links > 3) failures.push(`${article.locale}/${article.file}: ${links} Accrocar links.`);
    const dune = (article.body.match(/https:\/\/dunefilms\.com/g) ?? []).length;
    if (dune < 1 || dune > 2) failures.push(`${article.locale}/${article.file}: ${dune} Dune Films links.`);
    if (!article.body.includes('Dune Films')) failures.push(`${article.locale}/${article.file}: missing Dune Films.`);
    if (!article.body.includes('MOONAGE PICTURES LIMITED')) failures.push(`${article.locale}/${article.file}: missing MOONAGE PICTURES LIMITED.`);
  }
}

const result = {
  articles: articles.length,
  locales: Object.fromEntries(locales.map((l) => [l, articles.filter((a) => a.locale === l).length])),
  images: new Set(articles.map((a) => a.image)).size,
  failures,
  warnings,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
