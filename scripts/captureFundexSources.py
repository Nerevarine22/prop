from __future__ import annotations

import html
import re
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "research" / "notebooklm" / "sources"
HELP_ROOT = "https://help.fundex.gg/en/"
OFFICIAL_PAGES = [
    ("Fundex homepage", "https://fundex.gg/"),
    ("Programs and pricing", "https://trade.fundex.gg/get-funded"),
    ("Terms and Conditions", "https://fundex.gg/terms/"),
    ("Privacy Policy", "https://fundex.gg/privacy/"),
]


def fetch(url: str) -> str:
    request = Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 Chrome/140 Safari/537.36"
            )
        },
    )
    with urlopen(request, timeout=45) as response:
        return response.read().decode(response.headers.get_content_charset() or "utf-8", "replace")


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        href = dict(attrs).get("href")
        if href:
            self.links.append(href)


class VisibleTextParser(HTMLParser):
    BLOCKS = {
        "address", "article", "aside", "blockquote", "br", "div", "dl", "dt", "dd",
        "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6",
        "header", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table",
        "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
    }
    SKIP = {"script", "style", "svg", "noscript", "template"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in self.SKIP:
            self.skip_depth += 1
        elif not self.skip_depth and tag in self.BLOCKS:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in self.SKIP and self.skip_depth:
            self.skip_depth -= 1
        elif not self.skip_depth and tag in self.BLOCKS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(data)

    def text(self) -> str:
        raw = html.unescape("".join(self.parts)).replace("\xa0", " ")
        lines = [re.sub(r"\s+", " ", line).strip() for line in raw.splitlines()]
        compact: list[str] = []
        for line in lines:
            if not line or (compact and compact[-1] == line):
                continue
            compact.append(line)
        return "\n\n".join(compact)


def visible_text(document: str) -> str:
    parser = VisibleTextParser()
    parser.feed(document)
    return parser.text()


def links(document: str, base_url: str, pattern: str) -> list[str]:
    parser = LinkParser()
    parser.feed(document)
    found = []
    for href in parser.links:
        absolute = urljoin(base_url, href).split("#", 1)[0]
        if re.search(pattern, absolute) and absolute not in found:
            found.append(absolute)
    return found


def page_title(document: str, fallback: str) -> str:
    for pattern in (r"<h1[^>]*>(.*?)</h1>", r"<title[^>]*>(.*?)</title>"):
        match = re.search(pattern, document, flags=re.IGNORECASE | re.DOTALL)
        if match:
            value = visible_text(match.group(1)).strip()
            if value:
                return value.replace(" — Fundex", "")
    return fallback


def write_official_pages() -> Path:
    chunks = [
        "# Fundex — official website captures",
        "",
        f"Captured: {datetime.now(timezone.utc).isoformat()}",
        "",
        "Only pages on fundex.gg and trade.fundex.gg are included.",
    ]
    for label, url in OFFICIAL_PAGES:
        print(f"Fetching {url}", flush=True)
        document = fetch(url)
        chunks.extend(["", f"## {label}", "", f"Source: {url}", "", visible_text(document)])
        time.sleep(0.2)
    target = OUTPUT_DIR / "fundex-official-pages.md"
    target.write_text("\n".join(chunks).strip() + "\n", encoding="utf-8")
    return target


def write_help_center() -> tuple[Path, int]:
    print(f"Fetching {HELP_ROOT}", flush=True)
    root_document = fetch(HELP_ROOT)
    collection_urls = links(root_document, HELP_ROOT, r"help\.fundex\.gg/en/collections/")
    article_urls: list[str] = []
    for collection_url in collection_urls:
        print(f"Fetching collection {collection_url}", flush=True)
        document = fetch(collection_url)
        for article_url in links(document, collection_url, r"help\.fundex\.gg/en/articles/"):
            if article_url not in article_urls:
                article_urls.append(article_url)
        time.sleep(0.15)

    chunks = [
        "# Fundex — official help-center articles",
        "",
        f"Captured: {datetime.now(timezone.utc).isoformat()}",
        "",
        f"Help center: {HELP_ROOT}",
        "",
        f"Collections discovered: {len(collection_urls)}",
        f"Articles discovered: {len(article_urls)}",
    ]
    failures: list[str] = []
    for index, article_url in enumerate(article_urls, start=1):
        try:
            print(f"Fetching article {index}/{len(article_urls)}", flush=True)
            document = fetch(article_url)
            slug = urlparse(article_url).path.rstrip("/").split("/")[-1]
            title = page_title(document, slug)
            chunks.extend(["", f"## {title}", "", f"Source: {article_url}", "", visible_text(document)])
        except Exception as exc:  # keep the other official articles usable
            failures.append(f"- {article_url}: {exc}")
        time.sleep(0.12)

    if failures:
        chunks.extend(["", "## Capture failures", "", *failures])
    target = OUTPUT_DIR / "fundex-help-center.md"
    target.write_text("\n".join(chunks).strip() + "\n", encoding="utf-8")
    return target, len(article_urls) - len(failures)


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    try:
        official = write_official_pages()
        help_center, article_count = write_help_center()
    except Exception as exc:
        print(f"Capture failed: {exc}", file=sys.stderr)
        return 1
    print(f"Wrote {official.relative_to(ROOT)}", flush=True)
    print(f"Wrote {help_center.relative_to(ROOT)} ({article_count} articles)", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
