import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  ARTICLE_PATH,
  BLOG_PATH,
  CATEGORY_PATHS,
  HOME_PATH,
  LEGAL_PATHS,
  LOCALES,
  SAFE_PATH,
  SEO_CLUSTER_PATHS,
  SITE,
  type Locale,
} from '../lib/site';

function url(path: string, lastmod?: Date) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const normalized =
    clean === '/' || /\.[a-z0-9]+$/i.test(clean)
      ? clean
      : clean.endsWith('/')
        ? clean
        : `${clean}/`;
  const loc = normalized === '/' ? SITE.url : `${SITE.url}${normalized}`;
  const lm = lastmod ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>${lm}\n  </url>`;
}

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const seoPages = await getCollection('seo-pages');
  const now = new Date();

  const staticFr = [
    '/',
    '/blog',
    '/actualite',
    '/algerie',
    '/sahara-occidental',
    '/algerie-maroc',
    '/algerie-vs-maroc',
    '/frontiere-algerie-maroc',
    '/immobilier',
    '/tourisme',
    '/economie',
    '/culture',
    '/investissement',
    '/villes',
    '/guides',
    '/analyses',
    '/contact',
    '/a-propos',
    '/mentions-legales',
    '/confidentialite',
    '/safe-certification-immobiliere',
    ...Object.values(SEO_CLUSTER_PATHS.fr),
  ];

  const urls: string[] = [];

  for (const path of staticFr) {
    urls.push(url(path, now));
  }

  // Multilingual homes + core pages
  const legacyLocalizedCategories = [
    'immobilier',
    'tourisme',
    'investissement',
    'villes',
    'guides',
    'analyses',
  ] as const;

  for (const locale of LOCALES.filter((l) => l !== 'fr') as Locale[]) {
    urls.push(url(HOME_PATH[locale], now));
    urls.push(url(BLOG_PATH[locale], now));
    for (const cat of legacyLocalizedCategories) {
      urls.push(url(CATEGORY_PATHS[locale][cat], now));
    }
    urls.push(url(SAFE_PATH[locale], now));
    for (const p of Object.values(SEO_CLUSTER_PATHS[locale])) {
      urls.push(url(p, now));
    }
    const legal = LEGAL_PATHS[locale];
    urls.push(url(legal.contact, now));
    urls.push(url(legal.about, now));
    urls.push(url(legal.mentions, now));
    urls.push(url(legal.privacy, now));
  }

  for (const article of articles) {
    const locale = article.data.lang as Locale;
    const path = `${ARTICLE_PATH[locale]}/${article.data.slug}`;
    urls.push(
      url(path, article.data.updatedDate ?? article.data.pubDate),
    );
  }

  // SEO pages already covered via SEO_CLUSTER + SAFE paths; include any extras by canonical
  for (const page of seoPages) {
    const path = page.data.canonical.replace(SITE.url, '') || '/';
    if (!urls.some((u) => u.includes(`<loc>${page.data.canonical}</loc>`))) {
      urls.push(url(path.startsWith('/') ? path : `/${path}`, now));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
