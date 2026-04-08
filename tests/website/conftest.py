"""
Website test fixtures for The NCA Hub

Provides shared fixtures for discovering HTML files, articles,
markdown sources, and site configuration used across all website tests.
"""

import json
import re
from pathlib import Path

import pytest

SITE_ROOT = Path(__file__).resolve().parent.parent.parent
BLOG_DIR = SITE_ROOT / "blog"
ARTICLE_SOURCE_DIR = BLOG_DIR / "article"
DOMAIN = "https://www.thencahub.com"

# Directories that contain rendered article pages (blog/slug/index.html)
SKIP_DIRS = {"article"}  # source markdown dir, not rendered


def _find_html_files(root: Path, pattern: str = "index.html") -> list[Path]:
    """Recursively find all index.html files under root."""
    return sorted(root.rglob(pattern))


@pytest.fixture(scope="session")
def site_root():
    """Path to the website root directory."""
    return SITE_ROOT


@pytest.fixture(scope="session")
def all_html_files():
    """All index.html files in the entire site."""
    files = sorted(SITE_ROOT.rglob("index.html"))
    # Exclude node_modules, .venv, ncahub-next build artifacts
    excluded = {".venv", "node_modules", "ncahub-next", ".git", "Obra Super Powers",
                "AI CHATBOT UPDATE", "awesome-claude-code", "UI UX"}
    return [f for f in files
            if not any(ex in f.parts for ex in excluded)]


@pytest.fixture(scope="session")
def article_html_files():
    """All rendered blog article index.html files."""
    articles = []
    if not BLOG_DIR.exists():
        return articles
    for d in sorted(BLOG_DIR.iterdir()):
        if d.is_dir() and d.name not in SKIP_DIRS and d.name != "article":
            index = d / "index.html"
            if index.exists():
                articles.append(index)
    return articles


@pytest.fixture(scope="session")
def article_markdown_files():
    """All markdown source files for blog articles."""
    if not ARTICLE_SOURCE_DIR.exists():
        return []
    return sorted(ARTICLE_SOURCE_DIR.glob("*.md"))


@pytest.fixture(scope="session")
def country_guide_files():
    """HTML files for country-specific NCA guides."""
    patterns = ["nca-for-*-lawyers"]
    files = []
    for pattern in patterns:
        for d in sorted(SITE_ROOT.glob(pattern)):
            index = d / "index.html"
            if index.exists():
                files.append(index)
    return files


@pytest.fixture(scope="session")
def tool_pages():
    """Interactive tool pages (calculator, scheduler, etc.)."""
    tool_dirs = [
        "nca-cost-calculator",
        "study-schedule-generator",
        "nca-practice-questions",
        "nca-prep-checklist",
        "readiness",
    ]
    files = []
    for name in tool_dirs:
        index = SITE_ROOT / name / "index.html"
        if index.exists():
            files.append(index)
    return files


@pytest.fixture(scope="session")
def sitemap_path():
    """Path to sitemap.xml."""
    return SITE_ROOT / "sitemap.xml"


@pytest.fixture(scope="session")
def robots_path():
    """Path to robots.txt."""
    return SITE_ROOT / "robots.txt"


# ── Helper functions available to all tests ──

def read_html(path: Path) -> str:
    """Read and return HTML content from a file."""
    return path.read_text(encoding="utf-8", errors="replace")


def extract_meta_tags(html: str) -> dict:
    """Extract meta tags into a dict of {name/property: content}.

    Uses double-quote-only matching to handle apostrophes inside content values.
    """
    tags = {}
    # Match name="x" content="y"
    for match in re.finditer(
        r'<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"',
        html, re.IGNORECASE
    ):
        tags[match.group(1)] = match.group(2)
    # Also catch reversed attribute order
    for match in re.finditer(
        r'<meta\s+content="([^"]*)"[^>]*(?:name|property)="([^"]+)"',
        html, re.IGNORECASE
    ):
        tags[match.group(2)] = match.group(1)
    return tags


def extract_title(html: str) -> str:
    """Extract the <title> content."""
    match = re.search(r"<title>(.*?)</title>", html, re.DOTALL)
    return match.group(1).strip() if match else ""


def extract_json_ld(html: str) -> list[dict]:
    """Extract all JSON-LD script blocks."""
    schemas = []
    for match in re.finditer(
        r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>',
        html, re.DOTALL
    ):
        try:
            data = json.loads(match.group(1))
            schemas.append(data)
        except json.JSONDecodeError:
            schemas.append({"_parse_error": True, "_raw": match.group(1)[:200]})
    return schemas


def extract_links(html: str) -> list[str]:
    """Extract all href values from anchor tags."""
    return re.findall(r'<a\s[^>]*href=["\']([^"\']*)["\']', html, re.IGNORECASE)


def extract_images(html: str) -> list[dict]:
    """Extract img tags with src and alt attributes."""
    images = []
    for match in re.finditer(r"<img\s([^>]*)>", html, re.IGNORECASE):
        attrs = match.group(1)
        src = re.search(r'src=["\']([^"\']*)["\']', attrs)
        alt = re.search(r'alt=["\']([^"\']*)["\']', attrs)
        images.append({
            "src": src.group(1) if src else "",
            "alt": alt.group(1) if alt else None,
        })
    return images


def extract_headings(html: str) -> list[tuple]:
    """Extract all headings as (level, text) tuples."""
    headings = []
    for match in re.finditer(r"<h([1-6])[^>]*>(.*?)</h\1>", html, re.DOTALL):
        level = int(match.group(1))
        text = re.sub(r"<[^>]+>", "", match.group(2)).strip()
        headings.append((level, text))
    return headings


def get_page_label(path: Path) -> str:
    """Human-readable label for a page path (for test IDs)."""
    rel = path.relative_to(SITE_ROOT)
    return str(rel.parent) if rel.name == "index.html" else str(rel)
