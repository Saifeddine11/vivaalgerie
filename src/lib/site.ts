export const SITE = {
  name: 'Viva Algérie',
  url: 'https://vivaalgerie.com',
  email: 'contact@vivaalgerie.com',
  author: 'Rédaction Viva Algérie',
  defaultTitle: 'Viva Algérie — Actualité, Sahara occidental et analyses sur l’Algérie',
  defaultDescription:
    'Viva Algérie décrypte l’actualité algérienne, le Sahara occidental, les relations Algérie–Maroc, le tourisme, l’économie, la culture et les grands enjeux du Maghreb.',
  locale: 'fr_DZ',
  twitter: '@vivaalgerie',
} as const;

export type Locale = 'fr' | 'en' | 'es' | 'nl';

export const LOCALES: Locale[] = ['fr', 'en', 'es', 'nl'];

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES',
  nl: 'NL',
};

export type Category =
  | 'actualite'
  | 'algerie'
  | 'sahara-occidental'
  | 'algerie-maroc'
  | 'immobilier'
  | 'tourisme'
  | 'economie'
  | 'culture'
  | 'investissement'
  | 'villes'
  | 'guides'
  | 'analyses';

export const CATEGORY_PATHS: Record<
  Locale,
  Record<Category, string>
> = {
  fr: {
    actualite: '/actualite',
    algerie: '/algerie',
    'sahara-occidental': '/sahara-occidental',
    'algerie-maroc': '/algerie-maroc',
    immobilier: '/immobilier',
    tourisme: '/tourisme',
    economie: '/economie',
    culture: '/culture',
    investissement: '/investissement',
    villes: '/villes',
    guides: '/guides',
    analyses: '/analyses',
  },
  en: {
    actualite: '/en/news',
    algerie: '/en/algeria',
    'sahara-occidental': '/en/western-sahara',
    'algerie-maroc': '/en/algeria-morocco',
    immobilier: '/en/real-estate',
    tourisme: '/en/tourism',
    economie: '/en/economy',
    culture: '/en/culture',
    investissement: '/en/investment',
    villes: '/en/cities',
    guides: '/en/guides',
    analyses: '/en/analysis',
  },
  es: {
    actualite: '/es/actualidad',
    algerie: '/es/argelia',
    'sahara-occidental': '/es/sahara-occidental',
    'algerie-maroc': '/es/argelia-marruecos',
    immobilier: '/es/inmobiliario',
    tourisme: '/es/turismo',
    economie: '/es/economia',
    culture: '/es/cultura',
    investissement: '/es/inversion',
    villes: '/es/ciudades',
    guides: '/es/guias',
    analyses: '/es/analisis',
  },
  nl: {
    actualite: '/nl/nieuws',
    algerie: '/nl/algerije',
    'sahara-occidental': '/nl/westelijke-sahara',
    'algerie-maroc': '/nl/algerije-marokko',
    immobilier: '/nl/vastgoed',
    tourisme: '/nl/toerisme',
    economie: '/nl/economie',
    culture: '/nl/cultuur',
    investissement: '/nl/investeren',
    villes: '/nl/steden',
    guides: '/nl/gidsen',
    analyses: '/nl/analyses',
  },
};

export const ARTICLE_PATH: Record<Locale, string> = {
  fr: '/articles',
  en: '/en/articles',
  es: '/es/articulos',
  nl: '/nl/artikelen',
};

export const BLOG_PATH: Record<Locale, string> = {
  fr: '/blog',
  en: '/en/blog',
  es: '/es/blog',
  nl: '/nl/blog',
};

export const HOME_PATH: Record<Locale, string> = {
  fr: '/',
  en: '/en',
  es: '/es',
  nl: '/nl',
};

export const LEGAL_PATHS: Record<
  Locale,
  { mentions: string; privacy: string; contact: string; about: string }
> = {
  fr: {
    mentions: '/mentions-legales',
    privacy: '/confidentialite',
    contact: '/contact',
    about: '/a-propos',
  },
  en: {
    mentions: '/en/legal-notice',
    privacy: '/en/privacy-policy',
    contact: '/en/contact',
    about: '/en/about',
  },
  es: {
    mentions: '/es/aviso-legal',
    privacy: '/es/politica-privacidad',
    contact: '/es/contacto',
    about: '/es/sobre-nosotros',
  },
  nl: {
    mentions: '/nl/juridische-vermelding',
    privacy: '/nl/privacybeleid',
    contact: '/nl/contact',
    about: '/nl/over-ons',
  },
};

export const SAFE_PATH: Record<Locale, string> = {
  fr: '/safe-certification-immobiliere',
  en: '/en/safe-real-estate-certification',
  es: '/es/certificacion-inmobiliaria-safe',
  nl: '/nl/safe-vastgoedcertificering',
};

export const SEO_CLUSTER_PATHS = {
  fr: {
    'acheter-sur-plan-algerie': '/acheter-sur-plan-algerie',
    'acheter-sur-plan-alger': '/acheter-sur-plan-alger',
    'risques-achat-immobilier-algerie': '/risques-achat-immobilier-algerie',
    'comment-verifier-promoteur-immobilier-algerie':
      '/comment-verifier-promoteur-immobilier-algerie',
    'documents-achat-immobilier-algerie': '/documents-achat-immobilier-algerie',
    'livraison-logement-neuf-algerie': '/livraison-logement-neuf-algerie',
    'prix-immobilier-alger': '/prix-immobilier-alger',
  },
  en: {
    'acheter-sur-plan-algerie': '/en/buying-off-plan-algeria',
    'acheter-sur-plan-alger': '/en/buying-off-plan-algiers',
    'risques-achat-immobilier-algerie': '/en/real-estate-risks-algeria',
    'comment-verifier-promoteur-immobilier-algerie':
      '/en/how-to-check-real-estate-developer-algeria',
    'documents-achat-immobilier-algerie': '/en/real-estate-documents-algeria',
    'livraison-logement-neuf-algerie': '/en/new-housing-delivery-algeria',
    'prix-immobilier-alger': '/en/algiers-property-prices',
  },
  es: {
    'acheter-sur-plan-algerie': '/es/comprar-sobre-plano-argelia',
    'acheter-sur-plan-alger': '/es/comprar-sobre-plano-argel',
    'risques-achat-immobilier-algerie':
      '/es/riesgos-compra-inmobiliaria-argelia',
    'comment-verifier-promoteur-immobilier-algerie':
      '/es/como-verificar-promotor-inmobiliario-argelia',
    'documents-achat-immobilier-algerie':
      '/es/documentos-compra-inmobiliaria-argelia',
    'livraison-logement-neuf-algerie':
      '/es/entrega-vivienda-nueva-argelia',
    'prix-immobilier-alger': '/es/precios-inmobiliarios-argel',
  },
  nl: {
    'acheter-sur-plan-algerie': '/nl/off-plan-kopen-algerije',
    'acheter-sur-plan-alger': '/nl/off-plan-kopen-algiers',
    'risques-achat-immobilier-algerie': '/nl/vastgoedrisicos-algerije',
    'comment-verifier-promoteur-immobilier-algerie':
      '/nl/vastgoedontwikkelaar-controleren-algerije',
    'documents-achat-immobilier-algerie':
      '/nl/documenten-vastgoedkoop-algerije',
    'livraison-logement-neuf-algerie':
      '/nl/oplevering-nieuwe-woning-algerije',
    'prix-immobilier-alger': '/nl/vastgoedprijzen-algiers',
  },
} as const;

export const CITIES = [
  { slug: 'alger', name: { fr: 'Alger', en: 'Algiers', es: 'Argel', nl: 'Algiers' } },
  { slug: 'oran', name: { fr: 'Oran', en: 'Oran', es: 'Orán', nl: 'Oran' } },
  { slug: 'constantine', name: { fr: 'Constantine', en: 'Constantine', es: 'Constantina', nl: 'Constantine' } },
  { slug: 'annaba', name: { fr: 'Annaba', en: 'Annaba', es: 'Annaba', nl: 'Annaba' } },
  { slug: 'bejaia', name: { fr: 'Béjaïa', en: 'Béjaïa', es: 'Bugía', nl: 'Béjaïa' } },
  { slug: 'tlemcen', name: { fr: 'Tlemcen', en: 'Tlemcen', es: 'Tremecén', nl: 'Tlemcen' } },
  { slug: 'tipaza', name: { fr: 'Tipaza', en: 'Tipaza', es: 'Tipasa', nl: 'Tipaza' } },
  { slug: 'mostaganem', name: { fr: 'Mostaganem', en: 'Mostaganem', es: 'Mostaganem', nl: 'Mostaganem' } },
] as const;

/** Sourced figures for homepage — do not invent */
export const ALGERIA_FIGURES = [
  {
    value: '47 M',
    label: {
      fr: 'Habitants (mi-2025)',
      en: 'Residents (mid-2025)',
      es: 'Habitantes (mediados 2025)',
      nl: 'Inwoners (midden 2025)',
    },
    source: 'Ministère de la Santé / projections ONS',
  },
  {
    value: '3,55 M',
    label: {
      fr: 'Visiteurs en 2024',
      en: 'Visitors in 2024',
      es: 'Visitantes en 2024',
      nl: 'Bezoekers in 2024',
    },
    source: 'ONAT — Office national du tourisme',
  },
  {
    value: '1,09 M',
    label: {
      fr: 'Visites diaspora 2024',
      en: 'Diaspora visits 2024',
      es: 'Visitas diáspora 2024',
      nl: 'Diaspora-bezoeken 2024',
    },
    source: 'ONAT — Algériens résidents à l’étranger',
  },
  {
    value: '58',
    label: {
      fr: 'Wilayas',
      en: 'Wilayas',
      es: 'Wilayas',
      nl: 'Wilayas',
    },
    source: 'Organisation territoriale algérienne',
  },
] as const;
