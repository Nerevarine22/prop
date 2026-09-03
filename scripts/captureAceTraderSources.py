from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

from captureFundexSources import fetch, visible_text


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "research" / "notebooklm" / "sources"
DOCS_FULL = "https://docs.acetrader.com/llms-full.txt"
OFFICIAL_PAGES = [
    ("AceTrader homepage", "https://acetrader.com/"),
    ("Pricing", "https://acetrader.com/pricing"),
    ("Transparency", "https://acetrader.com/transparency"),
    ("Community Reward", "https://acetrader.com/community-reward"),
    ("Terms", "https://acetrader.com/terms"),
    ("Privacy", "https://acetrader.com/privacy"),
]


def deduplicate_blocks(value: str) -> str:
    seen: set[str] = set()
    result: list[str] = []
    for block in value.split("\n\n"):
        cleaned = block.strip()
        key = cleaned.casefold()
        if not cleaned or key in seen:
            continue
        seen.add(key)
        result.append(cleaned)
    return "\n\n".join(result)


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    captured = datetime.now(timezone.utc).isoformat()
    try:
        print(f"Fetching {DOCS_FULL}", flush=True)
        docs = fetch(DOCS_FULL)
        docs_target = OUTPUT_DIR / "acetrader-docs.md"
        docs_target.write_text(
            f"# AceTrader — official documentation snapshot\n\nCaptured: {captured}\n\nSource: {DOCS_FULL}\n\n{docs.strip()}\n",
            encoding="utf-8",
        )

        chunks = [
            "# AceTrader — official website captures",
            "",
            f"Captured: {captured}",
            "",
            "Only pages on acetrader.com are included.",
        ]
        for label, url in OFFICIAL_PAGES:
            print(f"Fetching {url}", flush=True)
            document = fetch(url)
            text = deduplicate_blocks(visible_text(document))
            chunks.extend(["", f"## {label}", "", f"Source: {url}", "", text])

        pages_target = OUTPUT_DIR / "acetrader-official-pages.md"
        pages_target.write_text("\n".join(chunks).strip() + "\n", encoding="utf-8")
    except Exception as exc:
        print(f"Capture failed: {exc}", file=sys.stderr)
        return 1

    print(f"Wrote {docs_target.relative_to(ROOT)}", flush=True)
    print(f"Wrote {pages_target.relative_to(ROOT)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
