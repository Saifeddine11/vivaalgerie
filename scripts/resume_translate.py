#!/usr/bin/env python3
"""Resumable driver: translate only files still in English. Safe to re-run."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

# Import from sibling script
sys.path.insert(0, str(Path(__file__).resolve().parent))
from translate_es_nl import process_article, process_seo  # noqa: E402

ROOT = Path("/Users/namousssifeddine/vivaalgerie blog/src/content")
EN_MARKERS = re.compile(
    r"\b(the|and|with|that|this|from|which|before|after|property|developer|buying)\b",
    re.I,
)
NL_MARKERS = re.compile(
    r"\b(de|het|een|van|voor|met|niet|ook|vastgoed|ontwikkelaar|kopen|Algerije|worden|kunnen)\b",
    re.I,
)
ES_MARKERS = re.compile(
    r"\b(el|la|los|las|que|para|con|una|del|Argelia|promotor|comprar|está|desde)\b",
    re.I,
)


def is_english_body(path: Path, lang: str) -> bool:
    if not path.exists():
        return True
    body = path.read_text(encoding="utf-8").split("---", 2)[-1]
    en = len(EN_MARKERS.findall(body))
    loc = len((NL_MARKERS if lang == "nl" else ES_MARKERS).findall(body))
    return en > loc * 1.5 and en > 40


def main() -> None:
    jobs: list[tuple[str, str, str]] = []  # kind, lang, slug

    for slug_path in sorted((ROOT / "seo-pages" / "en").glob("*.md")):
        slug = slug_path.stem
        for lang in ("es", "nl"):
            dest = ROOT / "seo-pages" / lang / f"{slug}.md"
            if is_english_body(dest, lang):
                jobs.append(("seo", lang, slug))

    for slug_path in sorted((ROOT / "articles" / "en").glob("*.md")):
        slug = slug_path.stem
        for lang in ("es", "nl"):
            dest = ROOT / "articles" / lang / f"{slug}.md"
            # ES articles are already good — only NL needs work typically
            if is_english_body(dest, lang):
                jobs.append(("article", lang, slug))

    print(f"Jobs queued: {len(jobs)}")
    for kind, lang, slug in jobs:
        print(f"  - {kind} {lang} {slug}")

    done = 0
    for i, (kind, lang, slug) in enumerate(jobs, 1):
        print(f"\n[{i}/{len(jobs)}] {kind} {lang} {slug}", flush=True)
        t0 = time.time()
        if kind == "seo":
            process_seo(slug, lang, force=True)
        else:
            process_article(slug, lang, force=True)
        print(f"  elapsed {time.time() - t0:.0f}s", flush=True)
        done += 1

    print(f"\nDRIVER DONE: {done}/{len(jobs)}")


if __name__ == "__main__":
    main()
