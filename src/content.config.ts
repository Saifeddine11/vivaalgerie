import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
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
