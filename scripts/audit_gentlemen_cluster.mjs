import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const locales = ['fr', 'en', 'es', 'nl'];
const falseVisibility = [
  'homepage', 'articleGrid', 'categoryGrid', 'related', 'featured', 'trending',
  'popular', 'searchUI', 'recommendations', 'carousel', 'rss',
];
const trueVisibility = ['sitemap', 'indexable'];
const articles = [];
const failures = [];
const warnings = [];

function articleRoute(locale, slug) {
  if (locale === 'fr') return `/articles/${slug}/`;
  if (locale === 'es') return `/es/articulos/${slug}/`;
  if (locale === 'nl') return `/nl/artikelen/${slug}/`;
  return `/en/articles/${slug}/`;
}

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walkHtml(full) : entry.name.endsWith('.html') ? [full] : [];
  });
}

for (const locale of locales) {
  const dir = path.join(root, 'src/content/articles', locale);
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
    const full = path.join(dir, file);
    const text = fs.readFileSync(full, 'utf8');
    if (!text.includes('translationKey: "the-gentlemen-morocco-')) continue;
    const field = (name) => text.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1]?.trim();
    const body = text.replace(/^---[\s\S]*?---\s*/m, '');
    const visibilityBlock = text.match(/^visibility:\n((?:  .+\n)+)---/m)?.[1] ?? '';
    articles.push({
      locale,
      file,
      text,
      body,
      slug: field('slug'),
      key: field('translationKey'),
      image: field('image'),
      pubDate: field('pubDate'),
      updatedDate: field('updatedDate'),
      visibilityBlock,
    });
  }
}

if (articles.length !== 40) failures.push(`Expected 40 reference articles, found ${articles.length}.`);

for (let i = 1; i <= 10; i++) {
  const group = articles.filter((article) => article.key === `the-gentlemen-morocco-${i}`);
  if (group.length !== 4) failures.push(`Translation key ${i} has ${group.length}/4 locales.`);
  const groupLocales = new Set(group.map((article) => article.locale));
  for (const locale of locales) {
    if (!groupLocales.has(locale)) failures.push(`Translation key ${i} is missing ${locale}.`);
  }
}

const allRoutes = new Set(articles.map((article) => articleRoute(article.locale, article.slug)));
if (allRoutes.size !== articles.length) failures.push('Duplicate routes detected in the reference cluster.');

for (const article of articles) {
  const label = `${article.locale}/${article.file}`;
  const words = article.body
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\[\]()*_#>`]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 1300) failures.push(`${label}: only ${words} words.`);
  if (words < 1500) warnings.push(`${label}: ${words} words (below the 1,500-word editorial target).`);

  for (const required of [
    'title', 'description', 'slug', 'lang', 'pubDate', 'updatedDate', 'author',
    'image', 'imageAlt', 'translationKey', 'visibility',
  ]) {
    if (!new RegExp(`^${required}:`, 'm').test(article.text)) failures.push(`${label}: missing ${required}.`);
  }

  if (article.pubDate !== '2026-09-16') failures.push(`${label}: publication date changed to ${article.pubDate}.`);
  if (article.updatedDate !== '2026-09-16') failures.push(`${label}: modification date changed to ${article.updatedDate}.`);
  for (const key of falseVisibility) {
    if (!new RegExp(`^  ${key}: false$`, 'm').test(article.visibilityBlock)) {
      failures.push(`${label}: visibility.${key} must be false.`);
    }
  }
  for (const key of trueVisibility) {
    if (!new RegExp(`^  ${key}: true$`, 'm').test(article.visibilityBlock)) {
      failures.push(`${label}: visibility.${key} must be true.`);
    }
  }

  if (!article.body.includes('## FAQ')) failures.push(`${label}: missing visible FAQ.`);
  if (!article.body.includes('Netflix') || !article.body.includes('Le360')) failures.push(`${label}: missing core source context.`);
  const imagePath = path.join(root, 'public', article.image.replace(/^\//, ''));
  if (!fs.existsSync(imagePath)) failures.push(`${label}: missing hero image ${article.image}.`);

  if (/official Netflix supplier|official Netflix partner|proveedor oficial de Netflix|officiële Netflix-leverancier/i.test(article.body)) {
    const negated = /not call any company an “official Netflix supplier”|Is Accrocar an official Netflix supplier|¿Accrocar es proveedor oficial de Netflix|evitamos “proveedor oficial de Netflix”|Is Accrocar een officiële Netflix-leverancier|nooit “officiële Netflix-leverancier”/i.test(article.body);
    if (!negated) failures.push(`${label}: unsupported official-supplier wording.`);
  }
}

if (!fs.existsSync(dist)) {
  failures.push('dist/ is missing; run npm run build before this audit.');
} else {
  const sitemapPath = path.join(dist, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    failures.push('Generated sitemap.xml is missing.');
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    for (const article of articles) {
      const canonical = `https://vivaalgerie.com${articleRoute(article.locale, article.slug)}`;
      if (!sitemap.includes(`<loc>${canonical}</loc>`)) failures.push(`${article.locale}/${article.file}: missing from sitemap.`);
    }
  }

  for (const article of articles) {
    const route = articleRoute(article.locale, article.slug);
    const htmlPath = path.join(dist, route.replace(/^\//, ''), 'index.html');
    const label = `${article.locale}/${article.file}`;
    if (!fs.existsSync(htmlPath)) {
      failures.push(`${label}: generated route is missing (${route}).`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, 'utf8');
    const canonical = `https://vivaalgerie.com${route}`;
    const requiredFragments = [
      '<meta name="robots" content="index,follow,max-image-preview:large">',
      `<link rel="canonical" href="${canonical}">`,
      '<meta property="og:type" content="article">',
      `<meta property="og:url" content="${canonical}">`,
      '<meta property="og:image"',
      '<meta name="twitter:card" content="summary_large_image">',
      '<meta name="twitter:title"',
      '<meta name="twitter:description"',
      '<meta name="twitter:image"',
      '"@type":"BlogPosting"',
      '"@type":"BreadcrumbList"',
      '"datePublished":"2026-09-16T00:00:00.000Z"',
      '"dateModified":"2026-09-16T00:00:00.000Z"',
      `"inLanguage":"${article.locale}"`,
    ];
    for (const fragment of requiredFragments) {
      if (!html.includes(fragment)) failures.push(`${label}: generated HTML is missing ${fragment}.`);
    }
    if (html.includes('noindex')) failures.push(`${label}: generated HTML contains noindex.`);

    const group = articles.filter((candidate) => candidate.key === article.key);
    for (const translation of group) {
      const translatedCanonical = `https://vivaalgerie.com${articleRoute(translation.locale, translation.slug)}`;
      if (!html.includes(`hreflang="${translation.locale}" href="${translatedCanonical}"`)) {
        failures.push(`${label}: missing reciprocal ${translation.locale} hreflang.`);
      }
    }
    const french = group.find((candidate) => candidate.locale === 'fr');
    const xDefault = french && `https://vivaalgerie.com${articleRoute('fr', french.slug)}`;
    if (xDefault && !html.includes(`hreflang="x-default" href="${xDefault}"`)) {
      failures.push(`${label}: x-default does not point to the French equivalent.`);
    }
  }

  const discoveryPages = [
    'index.html', 'blog/index.html', 'culture/index.html',
    'en/index.html', 'en/blog/index.html', 'en/culture/index.html',
    'es/index.html', 'es/blog/index.html', 'es/cultura/index.html',
    'nl/index.html', 'nl/blog/index.html', 'nl/cultuur/index.html',
  ];
  for (const relative of discoveryPages) {
    const full = path.join(dist, relative);
    if (!fs.existsSync(full)) {
      failures.push(`Discovery page missing after build: ${relative}.`);
      continue;
    }
    const html = fs.readFileSync(full, 'utf8');
    for (const article of articles) {
      if (html.includes(articleRoute(article.locale, article.slug))) {
        failures.push(`${relative}: exposes reference route ${articleRoute(article.locale, article.slug)}.`);
      }
    }
  }

  const referenceHtml = new Set(
    articles.map((article) => path.join(dist, articleRoute(article.locale, article.slug).replace(/^\//, ''), 'index.html')),
  );
  const regularArticleHtml = walkHtml(dist).filter((file) =>
    /\/(?:articles|articulos|artikelen)\/.+\/index\.html$/.test(file) && !referenceHtml.has(file),
  );
  for (const file of regularArticleHtml) {
    const html = fs.readFileSync(file, 'utf8');
    for (const article of articles) {
      if (html.includes(`href="${articleRoute(article.locale, article.slug)}`)) {
        failures.push(`${path.relative(dist, file)}: exposes reference article in related content.`);
      }
    }
  }
}

const result = {
  articles: articles.length,
  sourceArticles: articles.filter((article) => article.locale === 'fr').length,
  translations: articles.filter((article) => article.locale !== 'fr').length,
  locales: Object.fromEntries(locales.map((locale) => [locale, articles.filter((article) => article.locale === locale).length])),
  images: new Set(articles.map((article) => article.image)).size,
  routes: [...allRoutes].sort(),
  failures,
  warnings,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
