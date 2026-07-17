import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category, Locale } from './site';

export type ArticleEntry = CollectionEntry<'articles'>;
export type SeoEntry = CollectionEntry<'seo-pages'>;

export async function getArticles(locale: Locale = 'fr'): Promise<ArticleEntry[]> {
  const all = await getCollection('articles', ({ data }) => {
    return !data.draft && data.lang === locale;
  });
  return all.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export async function getArticlesByCategory(
  category: Category,
  locale: Locale = 'fr',
): Promise<ArticleEntry[]> {
  const articles = await getArticles(locale);
  return articles.filter((a) => a.data.category === category);
}

export async function getFeaturedArticles(
  locale: Locale = 'fr',
  limit = 1,
): Promise<ArticleEntry[]> {
  const articles = await getArticles(locale);
  const featured = articles.filter((a) => a.data.featured);
  return (featured.length ? featured : articles).slice(0, limit);
}

export async function getRelatedArticles(
  article: ArticleEntry,
  limit = 3,
): Promise<ArticleEntry[]> {
  const articles = await getArticles(article.data.lang);
  return articles
    .filter(
      (a) =>
        a.data.slug !== article.data.slug &&
        (a.data.category === article.data.category ||
          a.data.tags.some((t) => article.data.tags.includes(t))),
    )
    .slice(0, limit);
}

export async function getSeoPage(
  slug: string,
  locale: Locale = 'fr',
): Promise<SeoEntry | undefined> {
  const pages = await getCollection('seo-pages');
  return pages.find((p) => p.data.slug === slug && p.data.lang === locale);
}

export function extractFaqsFromMarkdown(content: string): {
  question: string;
  answer: string;
}[] {
  const faqs: { question: string; answer: string }[] = [];
  const faqSection = content.split(/##\s+FAQ/i)[1];
  if (!faqSection) return faqs;
  const faqOnly = faqSection.split(/\n##\s+/)[0] ?? faqSection;
  const blocks = faqOnly.split(/###\s+/).slice(1);
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const question = lines[0]?.trim();
    const answer = lines.slice(1).join(' ').replace(/\s+/g, ' ').trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}
