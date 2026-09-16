import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const clusters = [
  {
    category: 'investissement',
    routes: {
      fr: '/articles/maroc-algerie-investissements-internationaux/',
      en: '/en/articles/morocco-algeria-foreign-investment/',
      es: '/es/articulos/marruecos-argelia-inversion-extranjera/',
      nl: '/nl/artikelen/marokko-algerije-buitenlandse-investeringen/',
    },
  },
  {
    category: 'analyses',
    routes: {
      fr: '/articles/maroc-2030-infrastructures-algerie/',
      en: '/en/articles/morocco-2030-infrastructure-algeria/',
      es: '/es/articulos/marruecos-2030-infraestructuras-argelia/',
      nl: '/nl/artikelen/marokko-2030-infrastructuur-algerije/',
    },
  },
  {
    category: 'analyses',
    routes: {
      fr: '/articles/sahara-occidental-maroc-algerie-diplomatie/',
      en: '/en/articles/western-sahara-morocco-algeria-diplomacy/',
      es: '/es/articulos/sahara-occidental-marruecos-argelia-diplomacia/',
      nl: '/nl/artikelen/westelijke-sahara-marokko-algerije-diplomatie/',
    },
  },
  {
    category: 'actualite',
    routes: {
      fr: '/articles/football-maroc-algerie-formation-infrastructures/',
      en: '/en/articles/morocco-algeria-football-development/',
      es: '/es/articulos/futbol-marruecos-argelia-formacion/',
      nl: '/nl/artikelen/voetbal-marokko-algerije-opleiding/',
    },
  },
  {
    category: 'tourisme',
    routes: {
      fr: '/articles/tourisme-maroc-algerie-comparaison/',
      en: '/en/articles/morocco-algeria-tourism-comparison/',
      es: '/es/articulos/turismo-marruecos-argelia-comparacion/',
      nl: '/nl/artikelen/toerisme-marokko-algerije-vergelijking/',
    },
  },
];

const hubs = { fr: '/blog/', en: '/en/blog/', es: '/es/blog/', nl: '/nl/blog/' };
const categoryPaths = {
  investissement: { fr: '/investissement/', en: '/en/investment/', es: '/es/inversion/', nl: '/nl/investeren/' },
  economie: { fr: '/economie/', en: '/en/economy/', es: '/es/economia/', nl: '/nl/economie/' },
  analyses: { fr: '/analyses/', en: '/en/analysis/', es: '/es/analisis/', nl: '/nl/analyses/' },
  actualite: { fr: '/actualite/', en: '/en/news/', es: '/es/actualidad/', nl: '/nl/nieuws/' },
  tourisme: { fr: '/tourisme/', en: '/en/tourism/', es: '/es/turismo/', nl: '/nl/toerisme/' },
};

const failures = [];
const records = [];
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');

function fail(route, message) {
  failures.push(`${route}: ${message}`);
}

function outputFile(route) {
  return path.join(dist, route.replace(/^\//, ''), 'index.html');
}

function textContent(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function readPage(route) {
  const file = outputFile(route);
  if (!fs.existsSync(file)) {
    fail(route, 'route output is missing');
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

for (const cluster of clusters) {
  for (const [locale, route] of Object.entries(cluster.routes)) {
    const html = readPage(route);
    if (!html) continue;

    if (!new RegExp(`<html[^>]+lang=["']${locale}["']`, 'i').test(html)) fail(route, `html lang is not ${locale}`);
    if ((html.match(/<h1\b/gi) ?? []).length !== 1) fail(route, 'expected exactly one H1');
    if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) fail(route, 'meta description missing');
    if (!/<meta\s+property="og:title"\s+content="[^"]+"/i.test(html)) fail(route, 'Open Graph title missing');
    if (!/<meta\s+name="twitter:card"\s+content="[^"]+"/i.test(html)) fail(route, 'Twitter card missing');
    if (/noindex/i.test(html)) fail(route, 'contains noindex');

    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const expectedCanonical = `https://vivaalgerie.com${route}`;
    if (canonical !== expectedCanonical) fail(route, `canonical mismatch (${canonical ?? 'missing'})`);

    for (const hreflang of ['fr', 'en', 'es', 'nl', 'x-default']) {
      if (!new RegExp(`<link[^>]+hreflang=["']${hreflang}["']`, 'i').test(html)) fail(route, `hreflang ${hreflang} missing`);
    }

    const jsonScripts = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    const schemaTypes = new Set();
    for (const match of jsonScripts) {
      try {
        const value = JSON.parse(match[1]);
        const queue = Array.isArray(value) ? [...value] : [value];
        while (queue.length) {
          const item = queue.shift();
          if (!item || typeof item !== 'object') continue;
          if (item['@type']) schemaTypes.add(item['@type']);
          if (Array.isArray(item['@graph'])) queue.push(...item['@graph']);
        }
      } catch {
        fail(route, 'invalid JSON-LD');
      }
    }
    for (const type of ['BlogPosting', 'BreadcrumbList', 'FAQPage']) {
      if (!schemaTypes.has(type)) fail(route, `${type} JSON-LD missing`);
    }

    const h1 = textContent(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
    const title = textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ?? '';
    records.push({ route, h1, title, description, canonical });

    for (const match of html.matchAll(/<img\b[^>]*src="(\/images\/[^"]+)"[^>]*>/gi)) {
      const imagePath = match[1];
      if (!fs.existsSync(path.join(root, 'public', imagePath))) fail(route, `source image missing: ${imagePath}`);
      if (!fs.existsSync(path.join(dist, imagePath))) fail(route, `built image missing: ${imagePath}`);
    }

    for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/gi)) {
      const target = match[1];
      if (target.startsWith('/images/') || target.includes('.xml') || target.includes('.webmanifest')) continue;
      const targetFile = target.endsWith('/')
        ? path.join(dist, target.replace(/^\//, ''), 'index.html')
        : path.join(dist, target.replace(/^\//, ''), 'index.html');
      if (!fs.existsSync(targetFile) && !fs.existsSync(path.join(dist, target.replace(/^\//, '')))) {
        fail(route, `internal link does not resolve: ${target}`);
      }
    }

    const loc = `<loc>${expectedCanonical}</loc>`;
    const sitemapCount = sitemap.split(loc).length - 1;
    if (sitemapCount !== 1) fail(route, `sitemap count is ${sitemapCount}, expected 1`);

    const hubHtml = readPage(hubs[locale]);
    if (!hubHtml.includes(`href="${route}"`) && !hubHtml.includes(`href="${route.slice(0, -1)}"`)) fail(route, `not listed in ${hubs[locale]}`);

    const categoryRoute = categoryPaths[cluster.category][locale];
    const categoryHtml = readPage(categoryRoute);
    if (!categoryHtml.includes(`href="${route}"`) && !categoryHtml.includes(`href="${route.slice(0, -1)}"`)) fail(route, `not listed in ${categoryRoute}`);
  }
}

for (const field of ['canonical', 'title', 'h1', 'description']) {
  const seen = new Map();
  for (const record of records) {
    if (!record[field]) continue;
    if (seen.has(record[field])) fail(record.route, `duplicate ${field} with ${seen.get(record[field])}`);
    seen.set(record[field], record.route);
  }
}

console.log(`Audited ${records.length}/20 comparison routes.`);
console.log('Checks: route, lang, metadata, canonical, hreflang, indexability, JSON-LD, images, internal links, hub, category, sitemap, duplicates.');
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PASS: all cluster checks succeeded.');
