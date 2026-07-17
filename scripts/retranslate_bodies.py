#!/usr/bin/env python3
"""Force-retranslate ES/NL bodies that are still English, writing to lang folders."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

# Reuse pipeline from translate_es_nl
sys.path.insert(0, str(Path(__file__).resolve().parent))
from translate_es_nl import (  # noqa: E402
    AUTHOR,
    SEO_CANONICAL,
    dump_frontmatter,
    parse_frontmatter,
    translate_pipeline,
)

ROOT = Path("/Users/namousssifeddine/vivaalgerie blog/src/content")
ARTICLES = ROOT / "articles"
SEO = ROOT / "seo-pages"

SEO_NEED = {
    "es": [
        "acheter-sur-plan-algerie",
        "comment-verifier-promoteur-immobilier-algerie",
        "documents-achat-immobilier-algerie",
        "livraison-logement-neuf-algerie",
        "prix-immobilier-alger",
        "risques-achat-immobilier-algerie",
        "safe-certification-immobiliere",
        # also re-do alger if needed — currently OK in Spanish; skip
    ],
    "nl": [
        "acheter-sur-plan-alger",
        "acheter-sur-plan-algerie",
        "comment-verifier-promoteur-immobilier-algerie",
        "documents-achat-immobilier-algerie",
        "livraison-logement-neuf-algerie",
        "prix-immobilier-alger",
        "risques-achat-immobilier-algerie",
        "safe-certification-immobiliere",
    ],
}

ART_NEED = {
    "es": [],  # already Spanish
    "nl": [
        "acheter-sur-plan-algerie-verifications",
        "alger-oran-constantine-investir",
        "algerie-2030-infrastructures-opportunites",
        "cadre-juridique-immobilier-algerie",
        "diaspora-algerienne-acheter-immobilier",
        "erreurs-acheter-immobilier-algerie",
        "immobilier-algerie-2026",
        "logement-neuf-algerie-opportunite-risque",
        "pourquoi-investir-immobilier-alger",
        "tipaza-bejaia-oran-zones-a-suivre",
        "tourisme-villes-cotieres-algerie",
    ],
}


def process_seo(slug: str, lang: str) -> Path:
    src = SEO / "fr" / f"{slug}.md"
    if not src.exists():
        # fallback flat FR
        src = SEO / f"{slug}.md"
    raw = src.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(raw)
    print(f"[{lang}] seo {slug}", flush=True)

    title = translate_pipeline(fm["title"], lang)
    h1 = translate_pipeline(fm["h1"], lang)
    description = translate_pipeline(fm["description"], lang)
    body_t = translate_pipeline(body, lang)

    new_fm = {
        "title": title,
        "h1": h1,
        "description": description,
        "slug": slug,
        "lang": lang,
        "canonical": SEO_CANONICAL[lang][slug],
        "translationKey": slug,
    }
    out = dump_frontmatter(new_fm, "seo") + body_t
    if not out.endswith("\n"):
        out += "\n"
    dest = SEO / lang / f"{slug}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out, encoding="utf-8")
    words = len(re.findall(r"\S+", body_t))
    print(f"  -> {dest} ({words} body words)", flush=True)
    return dest


def process_article(slug: str, lang: str) -> Path:
    src = ARTICLES / "fr" / f"{slug}.md"
    if not src.exists():
        src = ARTICLES / f"{slug}.md"
    raw = src.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(raw)
    print(f"[{lang}] article {slug}", flush=True)

    title = translate_pipeline(fm["title"], lang)
    description = translate_pipeline(fm["description"], lang)
    image_alt = translate_pipeline(fm["imageAlt"], lang)
    tags = []
    for t in fm.get("tags", []):
        tags.append(translate_pipeline(t, lang))
        time.sleep(0.1)

    body_t = translate_pipeline(body, lang)

    new_fm = {
        **fm,
        "title": title,
        "description": description,
        "imageAlt": image_alt,
        "lang": lang,
        "author": AUTHOR[lang],
        "translationKey": slug,
        "tags": tags,
        "slug": slug,
    }
    out = dump_frontmatter(new_fm, "article") + body_t
    if not out.endswith("\n"):
        out += "\n"
    dest = ARTICLES / lang / f"{slug}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out, encoding="utf-8")
    words = len(re.findall(r"\S+", body_t))
    print(f"  -> {dest} ({words} body words)", flush=True)
    return dest


def main():
    only = [a for a in sys.argv[1:] if a not in ("es", "nl")]
    langs = [a for a in sys.argv[1:] if a in ("es", "nl")] or ["es", "nl"]
    done = []
    for lang in langs:
        for slug in SEO_NEED.get(lang, []):
            if only and slug not in only:
                continue
            done.append(process_seo(slug, lang))
        for slug in ART_NEED.get(lang, []):
            if only and slug not in only:
                continue
            done.append(process_article(slug, lang))
    print(f"\nDONE: {len(done)} files", flush=True)
    for d in done:
        print(d, flush=True)


if __name__ == "__main__":
    main()
