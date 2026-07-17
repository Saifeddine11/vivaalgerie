#!/usr/bin/env python3
"""Audit ES/NL markdown bodies for leftover English.

Usage:
  python3 scripts/audit_language.py
  python3 scripts/audit_language.py --fail   # exit 1 if any file flagged EN

Looks for English stopword density and keyword markers. Does not rewrite files.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src" / "content"

MARKERS = re.compile(
    r"\b("
    r"the|and|buyer|real estate|investment|off-plan|developer|property|"
    r"legal|notary|This|Because|However|Before buying|What “|Why there|"
    r"Step \d|Principle:|Related pages:"
    r")\b",
    re.I,
)
EN_STOP = re.compile(
    r"\b(the|this|that|with|from|their|have|been|will|can|for|are|is|of|to|in|on|"
    r"a|an|as|by|or|be|not|you|your|we|our|it|its)\b",
    re.I,
)
ES_MARK = re.compile(
    r"\b(el|la|los|las|que|para|con|una|del|por|como|sobre|Argelia|promotor|comprar)\b",
    re.I,
)
NL_MARK = re.compile(
    r"\b(de|het|een|van|voor|met|niet|ook|vastgoed|ontwikkelaar|kopen|Algerije|worden|kunnen)\b",
    re.I,
)


def body_of(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    parts = text.split("---", 2)
    return parts[2] if len(parts) >= 3 else text


def analyze(path: Path, lang: str) -> dict:
    body = body_of(path)
    words = re.findall(r"[A-Za-zÀ-ÿ']+", body)
    n = max(len(words), 1)
    en_stop = sum(1 for w in words if EN_STOP.fullmatch(w))
    pct = round(100 * en_stop / n, 1)
    markers = len(MARKERS.findall(body))
    loc = len((NL_MARK if lang == "nl" else ES_MARK).findall(body))
    # Flag if English stopword share is high OR English outweighs locale markers strongly
    flagged = pct > 8.0 or (markers > 40 and en_stop > loc * 1.2)
    return {
        "path": str(path.relative_to(ROOT.parent.parent)),
        "pct": pct,
        "markers": markers,
        "loc": loc,
        "en_stop": en_stop,
        "flagged": flagged,
        "words": n,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fail", action="store_true", help="Exit 1 if any file is flagged")
    args = ap.parse_args()

    targets = [
        ("articles/es", "es"),
        ("articles/nl", "nl"),
        ("seo-pages/es", "es"),
        ("seo-pages/nl", "nl"),
    ]

    flagged_rows = []
    ok_count = 0
    total = 0

    for folder, lang in targets:
        print(f"\n=== {folder} ===")
        paths = sorted((ROOT / folder).glob("*.md"))
        for path in paths:
            total += 1
            row = analyze(path, lang)
            status = "EN?" if row["flagged"] else "ok "
            print(
                f"{status} pct={row['pct']:5.1f}% markers={row['markers']:3d} "
                f"loc={row['loc']:4d}  {path.name}"
            )
            if row["flagged"]:
                flagged_rows.append(row)
            else:
                ok_count += 1

    print(f"\nSummary: {ok_count}/{total} OK, {len(flagged_rows)} flagged")
    if flagged_rows:
        print("Flagged files (inspect manually — do not blind-replace):")
        for r in flagged_rows:
            print(f"  - {r['path']} (pct={r['pct']}%, markers={r['markers']})")

    if args.fail and flagged_rows:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
