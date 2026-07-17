# Viva Algérie

Premium editorial blog on Algerian real estate, tourism, investment and cities.

- **Domain:** https://vivaalgerie.com  
- **Stack:** Astro + TypeScript + Tailwind CSS  
- **Default language:** French (`/`) — also EN `/en`, ES `/es`, NL `/nl`  
- **Hosting:** static `/dist` → Apache/cPanel `public_html`

## Commands

```bash
npm install
npm run dev
npm run build
```

## Deploy (Hostinger / cPanel)

1. `npm run build`
2. Upload **all contents** of `dist/` into `public_html/`
3. Confirm hidden `.htaccess` is uploaded
4. Confirm `send-newsletter.php` and `send-contact.php` are present
5. Test https://vivaalgerie.com , `/sitemap.xml`, `/robots.txt`
6. Test newsletter + contact forms on live hosting (PHP `mail()`)
7. Submit sitemap in Google Search Console

## Contact

contact@vivaalgerie.com
# vivaalgerie
