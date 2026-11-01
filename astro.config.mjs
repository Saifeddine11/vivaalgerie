// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vivaalgerie.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  redirects: {
    '/articles/the-gentlemen-saison-3-maroc-rabat-erfoud': '/the-gentlemen-maroc/',
    '/articles/ou-est-tournee-the-gentlemen-saison-3-maroc': '/the-gentlemen-maroc/',
    '/articles/pourquoi-the-gentlemen-tourne-maroc-cinema': '/the-gentlemen-maroc/',
    '/articles/the-gentlemen-saison-3-rabat-tournage': '/the-gentlemen-rabat/',
    '/articles/the-gentlemen-saison-3-erfoud-desert-maroc': '/the-gentlemen-erfoud/',
    '/articles/the-gentlemen-accrocar-voitures-luxe-maroc': '/the-gentlemen-accrocar-dune-films/',
    '/articles/coulisses-the-gentlemen-accrocar-voitures-tournage': '/the-gentlemen-accrocar-dune-films/',
    '/articles/the-gentlemen-rolls-royce-bentley-voitures-luxe': '/the-gentlemen-accrocar-dune-films/',
    '/articles/the-gentlemen-production-maroc-coulisses-accrocar': '/the-gentlemen-accrocar-dune-films/',
    '/articles/location-voiture-luxe-production-cinema-maroc': '/the-gentlemen-accrocar-dune-films/',
    '/en/articles/the-gentlemen-season-3-morocco-rabat-erfoud': '/en/the-gentlemen-morocco/',
    '/en/articles/where-is-the-gentlemen-season-3-filmed-morocco': '/en/the-gentlemen-morocco/',
    '/en/articles/why-the-gentlemen-films-in-morocco': '/en/the-gentlemen-morocco/',
    '/en/articles/the-gentlemen-season-3-rabat-filming': '/en/the-gentlemen-morocco/',
    '/en/articles/the-gentlemen-season-3-erfoud-morocco-desert': '/en/the-gentlemen-morocco/',
    '/en/articles/the-gentlemen-accrocar-luxury-cars-morocco': '/en/the-gentlemen-luxury-cars-morocco/',
    '/en/articles/the-gentlemen-rolls-royce-bentley-luxury-cars': '/en/the-gentlemen-luxury-cars-morocco/',
    '/en/articles/the-gentlemen-production-morocco-accrocar': '/en/the-gentlemen-luxury-cars-morocco/',
    '/en/articles/behind-the-scenes-accrocar-production-cars-morocco': '/en/the-gentlemen-luxury-cars-morocco/',
    '/en/articles/luxury-car-rental-film-production-morocco': '/en/the-gentlemen-luxury-cars-morocco/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es', 'nl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
