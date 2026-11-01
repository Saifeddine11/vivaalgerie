import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleVisibility = z.object({
  homepage: z.boolean().default(true),
  articleGrid: z.boolean().default(true),
  categoryGrid: z.boolean().default(true),
  related: z.boolean().default(true),
  featured: z.boolean().default(true),
  trending: z.boolean().default(true),
  popular: z.boolean().default(true),
  searchUI: z.boolean().default(true),
  recommendations: z.boolean().default(true),
  carousel: z.boolean().default(true),
  rss: z.boolean().default(true),
  sitemap: z.boolean().default(true),
  indexable: z.boolean().default(true),
});

const defaultArticleVisibility = {
  homepage: true,
  articleGrid: true,
  categoryGrid: true,
  related: true,
  featured: true,
  trending: true,
  popular: true,
  searchUI: true,
  recommendations: true,
  carousel: true,
  rss: true,
  sitemap: true,
  indexable: true,
};

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    h1: z.string().optional(),
    description: z.string(),
    slug: z.string(),
    category: z.enum([
      'actualite',
      'algerie',
      'sahara-occidental',
      'algerie-maroc',
      'immobilier',
      'tourisme',
      'economie',
      'culture',
      'investissement',
      'villes',
      'guides',
      'analyses',
    ]),
    lang: z.enum(['fr', 'en', 'es', 'nl']).default('fr'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Rédaction Viva Algérie'),
    image: z.string(),
    heroImage: z.string().optional(),
    imageAlt: z.string(),
    imageCredit: z.string().optional(),
    imageSource: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    translationKey: z.string().optional(),
    canonicalPath: z.string().regex(/^\/.+\/$/).optional(),
    citations: z.array(z.string().url()).default([]),
    visibility: articleVisibility.default(defaultArticleVisibility),
  }),
});

const seoPages = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/seo-pages',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string(),
    slug: z.string(),
    lang: z.enum(['fr', 'en', 'es', 'nl']).default('fr'),
    canonical: z.string().url(),
    translationKey: z.string().optional(),
  }),
});

export const collections = {
  articles,
  'seo-pages': seoPages,
};
