import type { Locale } from './site';
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
} from './site';
import type { Category } from './site';

export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean === '/' ? '' : clean}`;
}

export function localePath(locale: Locale, path: string): string {
  if (locale === 'fr') return path;
  if (path === '/') return HOME_PATH[locale];
  return path.startsWith(`/${locale}`) ? path : `/${locale}${path}`;
}

export function getHomePath(locale: Locale): string {
  return HOME_PATH[locale];
}

export function getBlogPath(locale: Locale): string {
  return BLOG_PATH[locale];
}

export function getArticlePath(locale: Locale, slug: string): string {
  return `${ARTICLE_PATH[locale]}/${slug}`;
}

export function getCategoryPath(locale: Locale, category: Category): string {
  return CATEGORY_PATHS[locale][category];
}

export function getSafePath(locale: Locale): string {
  return SAFE_PATH[locale];
}

export function getSeoPath(
  locale: Locale,
  key: keyof (typeof SEO_CLUSTER_PATHS)['fr'],
): string {
  return SEO_CLUSTER_PATHS[locale][key];
}

export function getLegalPaths(locale: Locale) {
  return LEGAL_PATHS[locale];
}

/** Map FR slug translationKey to localized URL for hreflang */
export function buildHreflang(
  translationKey: string,
  type: 'home' | 'blog' | 'category' | 'article' | 'safe' | 'seo' | 'legal' | 'static',
  opts?: {
    category?: Category;
    articleSlugs?: Partial<Record<Locale, string>>;
    seoKey?: keyof (typeof SEO_CLUSTER_PATHS)['fr'];
    legalKey?: 'mentions' | 'privacy' | 'contact' | 'about';
    staticPaths?: Partial<Record<Locale, string>>;
  },
): { lang: string; href: string }[] {
  const links: { lang: string; href: string }[] = [];

  for (const locale of LOCALES) {
    let path = '';
    switch (type) {
      case 'home':
        path = getHomePath(locale);
        break;
      case 'blog':
        path = getBlogPath(locale);
        break;
      case 'category':
        path = opts?.category
          ? getCategoryPath(locale, opts.category)
          : getBlogPath(locale);
        break;
      case 'article':
        path = getArticlePath(
          locale,
          opts?.articleSlugs?.[locale] ?? translationKey,
        );
        break;
      case 'safe':
        path = getSafePath(locale);
        break;
      case 'seo':
        path = opts?.seoKey
          ? getSeoPath(locale, opts.seoKey)
          : getSafePath(locale);
        break;
      case 'legal':
        path = opts?.legalKey
          ? getLegalPaths(locale)[opts.legalKey]
          : getHomePath(locale);
        break;
      case 'static':
        path = opts?.staticPaths?.[locale] ?? getHomePath(locale);
        break;
    }
    links.push({ lang: locale, href: absoluteUrl(path) });
  }

  links.push({ lang: 'x-default', href: absoluteUrl(getHomePath('fr')) });
  return links;
}

export function readingTime(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_\-\[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    fr: 'fr-DZ',
    en: 'en-GB',
    es: 'es-ES',
    nl: 'nl-NL',
  };
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
