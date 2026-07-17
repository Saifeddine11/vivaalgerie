#!/usr/bin/env python3
"""Translate EN folder content to ES/NL with localized links. Overwrites targets."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path("/Users/namousssifeddine/vivaalgerie blog/src/content")

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

EN_TO_LOC = {
    "es": [
        ("/en/safe-real-estate-certification", "/es/certificacion-inmobiliaria-safe"),
        ("/en/buying-off-plan-algeria", "/es/comprar-sobre-plano-argelia"),
        ("/en/buying-off-plan-algiers", "/es/comprar-sobre-plano-argel"),
        ("/en/real-estate-risks-algeria", "/es/riesgos-compra-inmobiliaria-argelia"),
        ("/en/how-to-check-real-estate-developer-algeria", "/es/como-verificar-promotor-inmobiliario-argelia"),
        ("/en/real-estate-documents-algeria", "/es/documentos-compra-inmobiliaria-argelia"),
        ("/en/new-housing-delivery-algeria", "/es/entrega-vivienda-nueva-argelia"),
        ("/en/algiers-property-prices", "/es/precios-inmobiliarios-argel"),
        ("/en/articles/", "/es/articulos/"),
        ("/en/real-estate", "/es/inmobiliario"),
        ("/en/tourism", "/es/turismo"),
        ("/en/investment", "/es/inversion"),
        ("/en/cities", "/es/ciudades"),
        ("/en/guides", "/es/guias"),
        ("/en/analysis", "/es/analisis"),
        ("/en/blog", "/es/blog"),
        ("/en/about", "/es/acerca-de"),
        ("/en/contact", "/es/contacto"),
    ],
    "nl": [
        ("/en/safe-real-estate-certification", "/nl/safe-vastgoedcertificering"),
        ("/en/buying-off-plan-algeria", "/nl/off-plan-kopen-algerije"),
        ("/en/buying-off-plan-algiers", "/nl/off-plan-kopen-algiers"),
        ("/en/real-estate-risks-algeria", "/nl/vastgoedrisicos-algerije"),
        ("/en/how-to-check-real-estate-developer-algeria", "/nl/vastgoedontwikkelaar-controleren-algerije"),
        ("/en/real-estate-documents-algeria", "/nl/documenten-vastgoedkoop-algerije"),
        ("/en/new-housing-delivery-algeria", "/nl/oplevering-nieuwe-woning-algerije"),
        ("/en/algiers-property-prices", "/nl/vastgoedprijzen-algiers"),
        ("/en/articles/", "/nl/artikelen/"),
        ("/en/real-estate", "/nl/vastgoed"),
        ("/en/tourism", "/nl/toerisme"),
        ("/en/investment", "/nl/investeren"),
        ("/en/cities", "/nl/steden"),
        ("/en/guides", "/nl/gidsen"),
        ("/en/analysis", "/nl/analyses"),
        ("/en/blog", "/nl/blog"),
        ("/en/about", "/nl/over-ons"),
        ("/en/contact", "/nl/contact"),
    ],
}

AUTHOR = {"es": "Redacción Viva Algérie", "nl": "Redactie Viva Algérie"}

PROTECT = [
    ("S.A.F.E — Security, Analysis, Fidelity & Expert Guidance", "§SAFEFULL§"),
    ("Security, Analysis, Fidelity & Expert Guidance", "§SAFEMEAN§"),
    ("S.A.F.E", "§SAFE§"),
    ("FGCMPI", "§FGCMPI§"),
    ("livret foncier", "§LIVRET§"),
    ("conservation foncière", "§CONSERV§"),
    ("vente sur plans", "§VSP§"),
    ("agrément", "§AGREMENT§"),
    ("Viva Algérie", "§VIVA§"),
    ("Hydra", "§HYDRA§"),
    ("Bab Ezzouar", "§BAB§"),
    ("Tipaza", "§TIPAZA§"),
    ("Béjaïa", "§BEJAIA§"),
    ("Dély Ibrahim", "§DELY§"),
    ("Law 11-04", "§LAW1104§"),
    ("Decree 13-431", "§DEC13431§"),
    ("loi 11-04", "§LOI1104§"),
    ("décret 13-431", "§DECRET13431§"),
]

POST_ES = [
    (r"\bAlgeria\b", "Argelia"),
    (r"\bAlgiers\b", "Argel"),
    (r"\bOran\b", "Orán"),
    (r"\bConstantine\b", "Constantina"),
    (r"(?i)\b(Maruecos|Marruecos|Morocco)\b", "Argelia"),
    ("§SAFEFULL§", "S.A.F.E — Security, Analysis, Fidelity & Expert Guidance"),
    ("§SAFEMEAN§", "Security, Analysis, Fidelity & Expert Guidance"),
    ("§SAFE§", "S.A.F.E"),
    ("§FGCMPI§", "FGCMPI"),
    ("§LIVRET§", "livret foncier"),
    ("§CONSERV§", "conservation foncière"),
    ("§VSP§", "vente sur plans"),
    ("§AGREMENT§", "agrément"),
    ("§VIVA§", "Viva Algérie"),
    ("§HYDRA§", "Hydra"),
    ("§BAB§", "Bab Ezzouar"),
    ("§TIPAZA§", "Tipaza"),
    ("§BEJAIA§", "Béjaïa"),
    ("§DELY§", "Dély Ibrahim"),
    ("§LAW1104§", "ley 11-04"),
    ("§DEC13431§", "decreto 13-431"),
    ("§LOI1104§", "loi 11-04"),
    ("§DECRET13431§", "décret 13-431"),
]

POST_NL = [
    (r"\bAlgeria\b", "Algerije"),
    (r"\bAlgiers\b", "Algiers"),
    (r"(?i)\b(Marokko|Morocco)\b", "Algerije"),
    ("§SAFEFULL§", "S.A.F.E — Security, Analysis, Fidelity & Expert Guidance"),
    ("§SAFEMEAN§", "Security, Analysis, Fidelity & Expert Guidance"),
    ("§SAFE§", "S.A.F.E"),
    ("§FGCMPI§", "FGCMPI"),
    ("§LIVRET§", "livret foncier"),
    ("§CONSERV§", "conservation foncière"),
    ("§VSP§", "vente sur plans"),
    ("§AGREMENT§", "agrément"),
    ("§VIVA§", "Viva Algérie"),
    ("§HYDRA§", "Hydra"),
    ("§BAB§", "Bab Ezzouar"),
    ("§TIPAZA§", "Tipaza"),
    ("§BEJAIA§", "Béjaïa"),
    ("§DELY§", "Dély Ibrahim"),
    ("§LAW1104§", "wet 11-04"),
    ("§DEC13431§", "decreet 13-431"),
    ("§LOI1104§", "loi 11-04"),
    ("§DECRET13431§", "décret 13-431"),
]


def parse_fm(text: str):
    parts = text.split("---", 2)
    fm_raw, body = parts[1], parts[2].lstrip("\n")
    data = {}
    for line in fm_raw.splitlines():
        if not line.strip():
            continue
        if line.startswith("tags:"):
            m = re.search(r"\[(.*)\]", line)
            data["tags"] = [t.strip().strip('"').strip("'") for t in m.group(1).split(",") if t.strip()] if m else []
            continue
        m = re.match(r"^(\w+):\s*(.*)$", line)
        if m:
            k, v = m.group(1), m.group(2).strip()
            if v.startswith('"') and v.endswith('"'):
                v = v[1:-1]
            elif v in ("true", "false"):
                v = v == "true"
            data[k] = v
    return data, body


def dump_fm(data: dict, kind: str) -> str:
    if kind == "seo":
        keys = ["title", "h1", "description", "slug", "lang", "canonical", "translationKey"]
    else:
        keys = [
            "title", "description", "slug", "category", "lang", "pubDate", "updatedDate",
            "author", "image", "imageAlt", "featured", "draft", "translationKey", "tags",
        ]
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
    lines.append("---\n")
    return "\n".join(lines) + "\n"


def protect(text: str) -> str:
    out = text
    for a, b in sorted(PROTECT, key=lambda x: -len(x[0])):
        out = out.replace(a, b)
    return out


def unprotect_and_localize(text: str, lang: str) -> str:
    out = text
    # restore possibly spaced tokens
    for a, b in PROTECT:
        token = b
        inner = token[1:-1]
        out = re.sub(rf"§\s*{re.escape(inner)}\s*§", token, out, flags=re.I)
    posts = POST_ES if lang == "es" else POST_NL
    for pat, repl in posts:
        if pat.startswith("§"):
            out = out.replace(pat, repl)
        else:
            out = re.sub(pat, repl, out)
    for en, loc in EN_TO_LOC[lang]:
        out = out.replace(en, loc)
    out = re.sub(r"([^\n])(#{2,6}\s)", r"\1\n\n\2", out)
    out = out.replace("Viva Argelia", "Viva Algérie").replace("Viva Algerije", "Viva Algérie")
    return out


def extract_links(text: str):
    links = []

    def repl(m):
        links.append((m.group(1), m.group(2)))
        return f"§LINK{len(links)-1}§"

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl, text), links


def restore_links(text: str, links, lang: str, labels):
    out = text
    for i, ((_, url), label) in enumerate(zip(links, labels)):
        loc = url
        for en, mapped in EN_TO_LOC[lang]:
            if loc.startswith(en) or loc == en:
                loc = mapped + loc[len(en):] if loc.startswith(en) and en.endswith("/") else mapped if loc == en else loc.replace(en, mapped)
                break
        # also map remaining /en/
        for en, mapped in EN_TO_LOC[lang]:
            loc = loc.replace(en, mapped)
        out = re.sub(rf"§\s*LINK\s*{i}\s*§", f"[{label}]({loc})", out, flags=re.I)
        out = out.replace(f"§LINK{i}§", f"[{label}]({loc})")
    return out


def tr_chunk(text: str, target: str, retries=6) -> str:
    if not text.strip():
        return text
    tr = GoogleTranslator(source="en", target=target)
    for attempt in range(retries):
        try:
            r = tr.translate(text)
            if r is None:
                raise RuntimeError("None")
            return r
        except Exception as e:
            wait = min(2 ** attempt, 25)
            print(f"  retry {attempt+1}: {e}; sleep {wait}s", flush=True)
            time.sleep(wait)
    print("  WARNING: untranslated chunk", flush=True)
    return text


def tr_text(text: str, target: str) -> str:
    blocks = re.split(r"(\n{2,})", text)
    out, buf = [], ""
    for block in blocks:
        if re.fullmatch(r"\n{2,}", block or ""):
            if buf:
                out.append(tr_chunk(buf, target))
                time.sleep(0.35)
                buf = ""
            out.append(block)
            continue
        if len(buf) + len(block) > 3200:
            if buf:
                out.append(tr_chunk(buf, target))
                time.sleep(0.35)
            buf = block
        else:
            buf += block
    if buf:
        out.append(tr_chunk(buf, target))
        time.sleep(0.35)
    return "".join(out)


def translate_pipeline(text: str, lang: str) -> str:
    target = "es" if lang == "es" else "nl"
    no_links, links = extract_links(text)
    protected = protect(no_links)
    translated = tr_text(protected, target)
    labels = []
    for label, _ in links:
        lab = protect(label)
        tlab = tr_chunk(lab, target) if lab.strip() else label
        tlab = unprotect_and_localize(tlab, lang)
        labels.append(tlab)
        time.sleep(0.15)
    with_links = restore_links(translated, links, lang, labels)
    return unprotect_and_localize(with_links, lang)


def process_seo(slug: str, lang: str):
    src = ROOT / "seo-pages" / "en" / f"{slug}.md"
    fm, body = parse_fm(src.read_text(encoding="utf-8"))
    print(f"[{lang}] SEO {slug}", flush=True)
    new_fm = {
        "title": translate_pipeline(fm["title"], lang),
        "h1": translate_pipeline(fm["h1"], lang),
        "description": translate_pipeline(fm["description"], lang),
        "slug": slug,
        "lang": lang,
        "canonical": SEO_CANONICAL[lang][slug],
        "translationKey": slug,
    }
    body_t = translate_pipeline(body, lang)
    dest = ROOT / "seo-pages" / lang / f"{slug}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(dump_fm(new_fm, "seo") + body_t + ("\n" if not body_t.endswith("\n") else ""), encoding="utf-8")
    nwords = len(re.findall(r"\S+", body_t))
    print(f"  wrote {dest} ({nwords} words)", flush=True)


def process_article(slug: str, lang: str):
    src = ROOT / "articles" / "en" / f"{slug}.md"
    fm, body = parse_fm(src.read_text(encoding="utf-8"))
    print(f"[{lang}] ART {slug}", flush=True)
    tags = [translate_pipeline(t, lang) for t in fm.get("tags", [])]
    new_fm = {
        **fm,
        "title": translate_pipeline(fm["title"], lang),
        "description": translate_pipeline(fm["description"], lang),
        "imageAlt": translate_pipeline(fm.get("imageAlt", ""), lang),
        "lang": lang,
        "author": AUTHOR[lang],
        "translationKey": slug,
        "tags": tags,
        "slug": slug,
    }
    body_t = translate_pipeline(body, lang)
    dest = ROOT / "articles" / lang / f"{slug}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(dump_fm(new_fm, "article") + body_t + ("\n" if not body_t.endswith("\n") else ""), encoding="utf-8")
    nwords = len(re.findall(r"\S+", body_t))
    print(f"  wrote {dest} ({nwords} words)", flush=True)


# Files that need real target-language bodies
JOBS = [
    # ES SEO (acheter-sur-plan-alger already Spanish — still refresh for consistency)
    ("seo", "es", "safe-certification-immobiliere"),
    ("seo", "es", "acheter-sur-plan-algerie"),
    ("seo", "es", "acheter-sur-plan-alger"),
    ("seo", "es", "risques-achat-immobilier-algerie"),
    ("seo", "es", "comment-verifier-promoteur-immobilier-algerie"),
    ("seo", "es", "documents-achat-immobilier-algerie"),
    ("seo", "es", "livraison-logement-neuf-algerie"),
    ("seo", "es", "prix-immobilier-alger"),
    # NL SEO
    ("seo", "nl", "safe-certification-immobiliere"),
    ("seo", "nl", "acheter-sur-plan-algerie"),
    ("seo", "nl", "acheter-sur-plan-alger"),
    ("seo", "nl", "risques-achat-immobilier-algerie"),
    ("seo", "nl", "comment-verifier-promoteur-immobilier-algerie"),
    ("seo", "nl", "documents-achat-immobilier-algerie"),
    ("seo", "nl", "livraison-logement-neuf-algerie"),
    ("seo", "nl", "prix-immobilier-alger"),
    # NL articles
    ("art", "nl", "acheter-sur-plan-algerie-verifications"),
    ("art", "nl", "alger-oran-constantine-investir"),
    ("art", "nl", "algerie-2030-infrastructures-opportunites"),
    ("art", "nl", "cadre-juridique-immobilier-algerie"),
    ("art", "nl", "diaspora-algerienne-acheter-immobilier"),
    ("art", "nl", "erreurs-acheter-immobilier-algerie"),
    ("art", "nl", "immobilier-algerie-2026"),
    ("art", "nl", "logement-neuf-algerie-opportunite-risque"),
    ("art", "nl", "pourquoi-investir-immobilier-alger"),
    ("art", "nl", "tipaza-bejaia-oran-zones-a-suivre"),
    ("art", "nl", "tourisme-villes-cotieres-algerie"),
]


def main():
    only = set(sys.argv[1:])
    jobs = JOBS
    if only:
        jobs = [j for j in JOBS if j[2] in only or j[1] in only or f"{j[1]}-{j[0]}" in only]
    for kind, lang, slug in jobs:
        try:
            if kind == "seo":
                process_seo(slug, lang)
            else:
                process_article(slug, lang)
        except Exception as e:
            print(f"ERROR {kind} {lang} {slug}: {e}", flush=True)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
