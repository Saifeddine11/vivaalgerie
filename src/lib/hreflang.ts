import type { Locale, Category } from '../lib/site';
import { absoluteUrl, getCategoryPath, getHomePath, getBlogPath, getLegalPaths, getSafePath, getSeoPath, getArticlePath } from './paths';
import { SEO_CLUSTER_PATHS } from './site';

export function homeHreflang(): { lang: string; href: string }[] {
  return [
    { lang: 'fr', href: absoluteUrl('/') },
    { lang: 'en', href: absoluteUrl('/en') },
    { lang: 'es', href: absoluteUrl('/es') },
    { lang: 'nl', href: absoluteUrl('/nl') },
    { lang: 'x-default', href: absoluteUrl('/') },
  ];
}

export function blogHreflang(): { lang: string; href: string }[] {
  return (['fr', 'en', 'es', 'nl'] as Locale[]).map((l) => ({
    lang: l,
    href: absoluteUrl(getBlogPath(l)),
  })).concat([{ lang: 'x-default', href: absoluteUrl('/blog') }]);
}

export function categoryHreflang(category: Category): { lang: string; href: string }[] {
  return (['fr', 'en', 'es', 'nl'] as Locale[]).map((l) => ({
    lang: l,
    href: absoluteUrl(getCategoryPath(l, category)),
  })).concat([{ lang: 'x-default', href: absoluteUrl(getCategoryPath('fr', category)) }]);
}

export function legalHreflang(
  key: 'mentions' | 'privacy' | 'contact' | 'about',
): { lang: string; href: string }[] {
  return (['fr', 'en', 'es', 'nl'] as Locale[]).map((l) => ({
    lang: l,
    href: absoluteUrl(getLegalPaths(l)[key]),
  })).concat([{ lang: 'x-default', href: absoluteUrl(getLegalPaths('fr')[key]) }]);
}

export function safeHreflang(): { lang: string; href: string }[] {
  return (['fr', 'en', 'es', 'nl'] as Locale[]).map((l) => ({
    lang: l,
    href: absoluteUrl(getSafePath(l)),
  })).concat([{ lang: 'x-default', href: absoluteUrl(getSafePath('fr')) }]);
}

export function seoHreflang(
  key: keyof (typeof SEO_CLUSTER_PATHS)['fr'],
): { lang: string; href: string }[] {
  return (['fr', 'en', 'es', 'nl'] as Locale[]).map((l) => ({
    lang: l,
    href: absoluteUrl(getSeoPath(l, key)),
  })).concat([{ lang: 'x-default', href: absoluteUrl(getSeoPath('fr', key)) }]);
}

export function articleHreflang(
  slugs: Partial<Record<Locale, string>>,
  fallbackSlug: string,
): { lang: string; href: string }[] {
  const available = (['fr', 'en', 'es', 'nl'] as Locale[])
    .filter((l) => slugs[l])
    .map((l) => ({
      lang: l,
      href: absoluteUrl(getArticlePath(l, slugs[l] ?? fallbackSlug)),
    }));

  return available.concat([
    {
      lang: 'x-default',
      href: absoluteUrl(getArticlePath('fr', slugs.fr ?? fallbackSlug)),
    },
  ]);
}

export { getHomePath };
