#!/usr/bin/env python3
"""Translate EN content to ES/NL into language subfolders."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path("/Users/namousssifeddine/vivaalgerie blog/src/content")
ARTICLES = ROOT / "articles"
SEO = ROOT / "seo-pages"

TERM_PHRASES = [
    "S.A.F.E — Security, Analysis, Fidelity & Expert Guidance",
    "Security, Analysis, Fidelity & Expert Guidance",
    "S.A.F.E",
    "FGCMPI",
    "Law No. 11-04 of 17 February 2011",
    "law No. 11-04 of 17 February 2011",
    "Law 11-04",
    "law 11-04",
    "Executive Decree No. 13-431 of 18 December 2013",
    "executive Decree No. 13-431 of 18 December 2013",
    "Executive Decree 13-431",
    "Decree 13-431",
    "decree 13-431",
    "livret foncier",
    "conservation foncière",
    "acte de propriété",
    "vente sur plans",
    "vente sur plan",
    "agrément",
    "tableau national des promoteurs",
    "garantie décennale",
    "registre du commerce",
    "wilaya",
    "Wilaya",
    "Journal officiel",
    "Office national du tourisme",
    "ONAT",
    "ONS",
    "DGDN",
    "Viva Algérie",
    "VEFA",
    "VRD",
    "Hydra",
    "Bab Ezzouar",
    "Tipaza",
    "Béjaïa",
    "Bejaia",
    "fgcmpi.org.dz",
    "dgdn.gov.dz",
    "lkeria.com",
    "Fonds de garantie et de caution mutuelle de la promotion immobilière",
]
TERM_MAP = [(p, f"QQ{i:03d}QQ") for i, p in enumerate(TERM_PHRASES)]
RESTORE = {v: k for k, v in TERM_MAP}

ARTICLE_SLUGS = {
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
}

SEO_CANONICAL = {
    "es": {
        "safe-certification-immobiliere": "https://vivaalgerie.com/es/certificacion-inmobiliaria-safe",
        "acheter-sur-plan-algerie": "https://vivaalgerie.com/es/comprar-sobre-plano-argelia",
        "acheter-sur-plan-alger": "https://vivaalgerie.com/es/comprar-sobre-plano-argel",
        "risques-achat-immobilier-algerie": "https://vivaalgerie.com/es/riesgos-compra-inmobiliaria-argelia",
        "comment-verifier-promoteur-immobilier-algerie": "https://vivaalgerie.com/es/como-verificar-promotor-inmobiliario-argelia",
        "documents-achat-immobilier-algerie": "https://vivaalgerie.com/es/documentos-compra-inmobiliaria-argelia",
        "livraison-logement-neuf-algerie": "https://vivaalgerie.com/es/entrega-vivienda-nueva-argelia",
        "prix-immobilier-alger": "https://vivaalgerie.com/es/precios-inmobiliarios-argel",
    },
    "nl": {
        "safe-certification-immobiliere": "https://vivaalgerie.com/nl/safe-vastgoedcertificering",
        "acheter-sur-plan-algerie": "https://vivaalgerie.com/nl/off-plan-kopen-algerije",
        "acheter-sur-plan-alger": "https://vivaalgerie.com/nl/off-plan-kopen-algiers",
        "risques-achat-immobilier-algerie": "https://vivaalgerie.com/nl/vastgoedrisicos-algerije",
        "comment-verifier-promoteur-immobilier-algerie": "https://vivaalgerie.com/nl/vastgoedontwikkelaar-controleren-algerije",
        "documents-achat-immobilier-algerie": "https://vivaalgerie.com/nl/documenten-vastgoedkoop-algerije",
        "livraison-logement-neuf-algerie": "https://vivaalgerie.com/nl/oplevering-nieuwe-woning-algerije",
        "prix-immobilier-alger": "https://vivaalgerie.com/nl/vastgoedprijzen-algiers",
    },
}

# Map EN paths → target locale paths
EN_TO_LOCALE = {
    "es": {
        "/en/safe-real-estate-certification": "/es/certificacion-inmobiliaria-safe",
        "/en/buying-off-plan-algeria": "/es/comprar-sobre-plano-argelia",
        "/en/buying-off-plan-algiers": "/es/comprar-sobre-plano-argel",
        "/en/real-estate-risks-algeria": "/es/riesgos-compra-inmobiliaria-argelia",
        "/en/how-to-check-real-estate-developer-algeria": "/es/como-verificar-promotor-inmobiliario-argelia",
        "/en/real-estate-documents-algeria": "/es/documentos-compra-inmobiliaria-argelia",
        "/en/new-housing-delivery-algeria": "/es/entrega-vivienda-nueva-argelia",
        "/en/algiers-property-prices": "/es/precios-inmobiliarios-argel",
        "/en/guides": "/es/guias",
        "/en/cities": "/es/ciudades",
        "/en/real-estate": "/es/inmobiliario",
        "/en/investment": "/es/inversion",
        "/en/tourism": "/es/turismo",
        "/en/analysis": "/es/analisis",
        "/en/blog": "/es/blog",
    },
    "nl": {
        "/en/safe-real-estate-certification": "/nl/safe-vastgoedcertificering",
        "/en/buying-off-plan-algeria": "/nl/off-plan-kopen-algerije",
        "/en/buying-off-plan-algiers": "/nl/off-plan-kopen-algiers",
        "/en/real-estate-risks-algeria": "/nl/vastgoedrisicos-algerije",
        "/en/how-to-check-real-estate-developer-algeria": "/nl/vastgoedontwikkelaar-controleren-algerije",
        "/en/real-estate-documents-algeria": "/nl/documenten-vastgoedkoop-algerije",
        "/en/new-housing-delivery-algeria": "/nl/oplevering-nieuwe-woning-algerije",
        "/en/algiers-property-prices": "/nl/vastgoedprijzen-algiers",
        "/en/guides": "/nl/gidsen",
        "/en/cities": "/nl/steden",
        "/en/real-estate": "/nl/vastgoed",
        "/en/investment": "/nl/investeren",
        "/en/tourism": "/nl/toerisme",
        "/en/analysis": "/nl/analyses",
        "/en/blog": "/nl/blog",
    },
}

# Also FR path fallbacks (if any EN file still has FR links)
FR_TO_LOCALE = {
    "es": {
        "/safe-certification-immobiliere": "/es/certificacion-inmobiliaria-safe",
        "/acheter-sur-plan-algerie": "/es/comprar-sobre-plano-argelia",
        "/acheter-sur-plan-alger": "/es/comprar-sobre-plano-argel",
        "/risques-achat-immobilier-algerie": "/es/riesgos-compra-inmobiliaria-argelia",
        "/comment-verifier-promoteur-immobilier-algerie": "/es/como-verificar-promotor-inmobiliario-argelia",
        "/documents-achat-immobilier-algerie": "/es/documentos-compra-inmobiliaria-argelia",
        "/livraison-logement-neuf-algerie": "/es/entrega-vivienda-nueva-argelia",
        "/prix-immobilier-alger": "/es/precios-inmobiliarios-argel",
        "/guides": "/es/guias",
        "/villes": "/es/ciudades",
        "/immobilier": "/es/inmobiliario",
        "/investissement": "/es/inversion",
        "/tourisme": "/es/turismo",
        "/analyses": "/es/analisis",
        "/blog": "/es/blog",
    },
    "nl": {
        "/safe-certification-immobiliere": "/nl/safe-vastgoedcertificering",
        "/acheter-sur-plan-algerie": "/nl/off-plan-kopen-algerije",
        "/acheter-sur-plan-alger": "/nl/off-plan-kopen-algiers",
        "/risques-achat-immobilier-algerie": "/nl/vastgoedrisicos-algerije",
        "/comment-verifier-promoteur-immobilier-algerie": "/nl/vastgoedontwikkelaar-controleren-algerije",
        "/documents-achat-immobilier-algerie": "/nl/documenten-vastgoedkoop-algerije",
        "/livraison-logement-neuf-algerie": "/nl/oplevering-nieuwe-woning-algerije",
        "/prix-immobilier-alger": "/nl/vastgoedprijzen-algiers",
        "/guides": "/nl/gidsen",
        "/villes": "/nl/steden",
        "/immobilier": "/nl/vastgoed",
        "/investissement": "/nl/investeren",
        "/tourisme": "/nl/toerisme",
        "/analyses": "/nl/analyses",
        "/blog": "/nl/blog",
    },
}

AUTHOR = {"es": "Redacción Viva Algérie", "nl": "Redactie Viva Algérie"}

GLOSSARY = {
    "es": [
        (r"(?i)\bproprietary method\b", "metodología propietaria"),
        (r"(?i)\bcertificación patentada\b", "metodología propietaria"),
        (r"(?i)\bel rejilla\b", "la rejilla"),
        (r"(?i)\bgrid de\b", "rejilla de"),
        (r"Maruecos|Marruecos|Morocco|Marokko", "Argelia"),
        (r"\bViva Argelia\b", "Viva Algérie"),
    ],
    "nl": [
        (r"(?i)\bproprietary method\b", "eigen methode"),
        (r"Marokko|Morocco|Marruecos", "Algerije"),
        (r"\bViva Algerije\b", "Viva Algérie"),
    ],
}

PLACE = {
    "es": [
        (r"\bAlgeria\b", "Argelia"),
        (r"\bAlgerian\b", "argelino"),
        (r"\bAlgiers\b", "Argel"),
        (r"\bOran\b", "Orán"),
        (r"\bConstantine\b", "Constantina"),
    ],
    "nl": [
        (r"\bAlgeria\b", "Algerije"),
        (r"\bAlgerian\b", "Algerijns"),
        (r"\bAlgiers\b", "Algiers"),
    ],
}


def parse_frontmatter(text: str) -> tuple[dict, str]:
    parts = text.split("---", 2)
    fm_raw = parts[1]
    body = parts[2].lstrip("\n")
    data: dict = {}
    for line in fm_raw.splitlines():
        if not line.strip():
            continue
        if line.startswith("tags:"):
            m = re.search(r"\[(.*)\]", line)
            if m:
                data["tags"] = [
                    t.strip().strip('"').strip("'")
                    for t in m.group(1).split(",")
                    if t.strip()
                ]
            continue
        m = re.match(r"^(\w+):\s*(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            elif val in ("true", "false"):
                val = val == "true"
            data[key] = val
    return data, body


def dump_frontmatter(data: dict, kind: str) -> str:
    if kind == "article":
        keys = [
            "title", "description", "slug", "category", "lang", "pubDate",
            "updatedDate", "author", "image", "imageAlt", "featured", "draft",
            "translationKey", "tags",
        ]
    else:
        keys = ["title", "h1", "description", "slug", "lang", "canonical", "translationKey"]
    lines = ["---"]
    for key in keys:
        if key not in data:
            continue
        val = data[key]
        if key == "tags":
            lines.append("tags: [" + ", ".join(f'"{t}"' for t in val) + "]")
        elif isinstance(val, bool):
            lines.append(f"{key}: {'true' if val else 'false'}")
        elif key in ("pubDate", "updatedDate"):
            lines.append(f"{key}: {val}")
        elif key in ("slug", "category", "lang", "translationKey", "image", "canonical"):
            lines.append(f'{key}: "{val}"')
        else:
            lines.append(f'{key}: "{str(val).replace(chr(34), chr(92)+chr(34))}"')
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def localize_url(url: str, lang: str) -> str:
    if url.startswith("http"):
        return url
    article_prefix = "/es/articulos" if lang == "es" else "/nl/artikelen"
    # /en/articles/slug
    m = re.match(r"^/en/articles/([a-z0-9-]+)$", url)
    if m:
        return f"{article_prefix}/{m.group(1)}"
    m = re.match(r"^/articles/([a-z0-9-]+)$", url)
    if m:
        return f"{article_prefix}/{m.group(1)}"
    if url in EN_TO_LOCALE[lang]:
        return EN_TO_LOCALE[lang][url]
    if url in FR_TO_LOCALE[lang]:
        return FR_TO_LOCALE[lang][url]
    slug = url.lstrip("/")
    if slug in ARTICLE_SLUGS:
        return f"{article_prefix}/{slug}"
    return url


def extract_links(text: str):
    links = []

    def repl(m):
        links.append((m.group(1), m.group(2)))
        return f"QQLINK{len(links)-1}QQ"

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl, text), links


def restore_links(text, links, lang, labels):
    out = text
    for i, ((_lab, url), new_lab) in enumerate(zip(links, labels)):
        loc = localize_url(url, lang)
        replacement = f"[{new_lab}]({loc})"
        out = re.sub(rf"QQ\s*LINK\s*{i}\s*QQ", replacement, out, flags=re.I)
        out = out.replace(f"QQLINK{i}QQ", replacement)
    return out


def protect_terms(text: str) -> str:
    out = text
    for phrase, token in sorted(TERM_MAP, key=lambda x: len(x[0]), reverse=True):
        out = out.replace(phrase, token)
    out = re.sub(r"\|\s*\*\*F\*\*\s*\|", "| QQPILLARFQQ |", out)
    out = re.sub(r"\*\*F\*\*\s+[—\-]", "QQPILLARFQQ — ", out)
    out = re.sub(r"\bPillar F\b", "QQPILIARFNAMEQQ", out)
    return out


def unprotect_terms(text: str, lang: str = "es") -> str:
    out = text
    for token, phrase in RESTORE.items():
        out = out.replace(token, phrase)
        n = token[2:-2]
        out = re.sub(rf"QQ\s*{re.escape(n)}\s*QQ", phrase, out, flags=re.I)
    out = re.sub(r"QQ\s*PILLARF\s*QQ", "**F**", out, flags=re.I)
    out = out.replace("QQPILLARFQQ", "**F**")
    pillar = "Pilar F" if lang == "es" else "Pijler F"
    out = out.replace("QQPILIARFNAMEQQ", pillar)
    return out


def apply_post(text: str, lang: str) -> str:
    out = text
    for pat, repl in PLACE[lang]:
        out = re.sub(pat, repl, out)
    for pat, repl in GLOSSARY[lang]:
        out = re.sub(pat, repl, out)
    out = out.replace("Viva Argelia", "Viva Algérie").replace("Viva Algerije", "Viva Algérie")
    # Fix missing newline before markdown headings after disclaimer blocks
    out = re.sub(r"([^\n])(## )", r"\1\n\n\2", out)
    if lang == "es":
        out = out.replace("due diligence", "diligencia debida")
        out = out.replace("Due diligence", "Diligencia debida")
        out = re.sub(r"\bshowroom\b", "sala de exposición", out)
        out = re.sub(r"(?i)\boff-plan\b", "sobre plano", out)
    if lang == "nl":
        out = re.sub(r"(?i)\bproprietary method\b", "eigen methode", out)
    return out


def translate_chunk(text: str, target: str, retries: int = 6, source: str = "en") -> str:
    if not text.strip():
        return text
    tr = GoogleTranslator(source=source, target=target)
    for attempt in range(retries):
        try:
            r = tr.translate(text)
            if r is None:
                raise RuntimeError("None")
            return r
        except Exception as e:
            wait = min(2 ** attempt, 20)
            print(f"  retry {attempt+1}: {e}; sleep {wait}s")
            time.sleep(wait)
    print("  WARNING: untranslated chunk")
    return text


def translate_text(text: str, target: str) -> str:
    blocks = re.split(r"(\n{2,})", text)
    out, buf = [], ""
    for block in blocks:
        if re.fullmatch(r"\n{2,}", block or ""):
            if buf:
                out.append(translate_chunk(buf, target))
                time.sleep(0.35)
                buf = ""
            out.append(block)
            continue
        if len(buf) + len(block) > 2800:
            if buf:
                out.append(translate_chunk(buf, target))
                time.sleep(0.35)
            buf = block
        else:
            buf += block
    if buf:
        out.append(translate_chunk(buf, target))
        time.sleep(0.35)
    return "".join(out)


def translate_pipeline(text: str, lang: str) -> str:
    target = "es" if lang == "es" else "nl"
    no_links, links = extract_links(text)
    protected = protect_terms(no_links)
    translated = translate_text(protected, target)
    restored = unprotect_terms(translated, lang)
    labels = []
    for label, _u in links:
        lab = protect_terms(label)
        tlab = translate_chunk(lab, target) if lab.strip() else label
        tlab = apply_post(unprotect_terms(tlab, lang), lang)
        labels.append(tlab)
        time.sleep(0.15)
    with_links = restore_links(restored, links, lang, labels)
    return apply_post(with_links, lang)


def process_article(slug: str, lang: str, force: bool = False) -> Path | None:
    src = ARTICLES / "en" / f"{slug}.md"
    dest = ARTICLES / lang / f"{slug}.md"
    if dest.exists() and not force:
        print(f"[{lang}] skip article {slug} (exists)")
        return dest
    if not src.exists():
        print(f"[{lang}] MISSING EN source {slug}")
        return None
    print(f"[{lang}] article {slug}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    fm, body = parse_frontmatter(src.read_text(encoding="utf-8"))
    title = translate_pipeline(fm["title"], lang)
    description = translate_pipeline(fm["description"], lang)
    image_alt = translate_pipeline(fm["imageAlt"], lang)
    tags = [translate_pipeline(t, lang) for t in fm.get("tags", [])]
    body_t = translate_pipeline(body, lang)
    new_fm = {
        **fm,
        "title": title,
        "description": description,
        "imageAlt": image_alt,
        "lang": lang,
        "author": AUTHOR[lang],
        "translationKey": fm.get("translationKey") or fm["slug"],
        "tags": tags,
    }
    out = dump_frontmatter(new_fm, "article") + body_t
    if not out.endswith("\n"):
        out += "\n"
    tmp = dest.with_suffix(dest.suffix + ".tmp")
    tmp.write_text(out, encoding="utf-8")
    tmp.replace(dest)
    words = len(re.findall(r"\S+", body_t))
    print(f"  -> {dest} ({words} words)", flush=True)
    return dest


def process_seo(slug: str, lang: str, force: bool = False) -> Path | None:
    src = SEO / "en" / f"{slug}.md"
    dest = SEO / lang / f"{slug}.md"
    if dest.exists() and not force:
        print(f"[{lang}] skip seo {slug} (exists)")
        return dest
    if not src.exists():
        print(f"[{lang}] MISSING EN seo {slug}")
        return None
    print(f"[{lang}] seo {slug}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    fm, body = parse_frontmatter(src.read_text(encoding="utf-8"))
    title = translate_pipeline(fm["title"], lang)
    h1 = translate_pipeline(fm["h1"], lang)
    description = translate_pipeline(fm["description"], lang)
    body_t = translate_pipeline(body, lang)
    new_fm = {
        "title": title,
        "h1": h1,
        "description": description,
        "slug": fm["slug"],
        "lang": lang,
        "canonical": SEO_CANONICAL[lang][fm["slug"]],
        "translationKey": fm.get("translationKey") or fm["slug"],
    }
    out = dump_frontmatter(new_fm, "seo") + body_t
    if not out.endswith("\n"):
        out += "\n"
    tmp = dest.with_suffix(dest.suffix + ".tmp")
    tmp.write_text(out, encoding="utf-8")
    tmp.replace(dest)
    words = len(re.findall(r"\S+", body_t))
    print(f"  -> {dest} ({words} words)", flush=True)
    return dest


def main():
    force = "--force" in sys.argv or "--regen" in sys.argv
    args = [a for a in sys.argv[1:] if a not in ("--force",)]
    langs = [a for a in args if a in ("es", "nl")] or ["es", "nl"]
    only = [a for a in args if a not in ("es", "nl")]

    article_slugs = sorted(p.stem for p in (ARTICLES / "en").glob("*.md"))
    seo_slugs = sorted(p.stem for p in (SEO / "en").glob("*.md"))
    if only:
        article_slugs = [s for s in article_slugs if s in only]
        seo_slugs = [s for s in seo_slugs if s in only]

    done = []
    for lang in langs:
        for s in seo_slugs:
            r = process_seo(s, lang, force=force)
            if r:
                done.append(r)
        for s in article_slugs:
            r = process_article(s, lang, force=force)
            if r:
                done.append(r)
    print(f"\nDONE touched/kept: {len(done)}")


if __name__ == "__main__":
    main()
