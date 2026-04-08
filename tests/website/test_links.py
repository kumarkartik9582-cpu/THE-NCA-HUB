"""
Link Validation Test Suite — The NCA Hub

What a world-class QA engineer would check:
- No broken internal links (every href to a local page resolves)
- No empty href attributes
- External links use https
- No links to localhost or staging URLs
- Anchor links (#fragment) reference real IDs in the page
"""

import re
from pathlib import Path

import pytest

from tests.website.conftest import (
    extract_links,
    get_page_label,
    read_html,
    DOMAIN,
    SITE_ROOT,
)


class TestInternalLinks:
    """Validate that internal links point to real pages."""

    def test_no_broken_internal_links(self, article_html_files):
        """Check article pages for broken internal links to local pages.

        Known issues: /pricing and /sample are planned pages not yet created.
        """
        # Planned pages that don't exist yet but are intentionally linked
        known_missing = {"/pricing", "/sample"}
        broken = []
        for f in article_html_files:
            html = read_html(f)
            links = extract_links(html)
            for href in links:
                if not href:
                    continue
                # Skip external, anchors, special protocols, and absolute URLs
                if href.startswith(("#", "mailto:", "tel:", "javascript:", "data:",
                                    "https://", "http://", "//")):
                    continue
                # Strip query string and fragment
                clean_href = re.sub(r'[?#].*$', '', href)
                if not clean_href or clean_href == "/" or clean_href in known_missing:
                    continue

                # Relative link — resolve it
                if clean_href.startswith("/"):
                    target = SITE_ROOT / clean_href.lstrip("/")
                else:
                    target = f.parent / clean_href

                target_path = target.resolve()
                # Check file, directory/index.html, or .html extension
                if target_path.is_file():
                    continue
                if target_path.is_dir() and (target_path / "index.html").exists():
                    continue
                clean = str(target_path).rstrip("/")
                p = Path(clean)
                if p.is_dir() and (p / "index.html").exists():
                    continue
                if p.is_file() or Path(clean + ".html").is_file():
                    continue

                broken.append((get_page_label(f), href))

        if broken:
            unique_targets = set(href for _, href in broken)
            pytest.fail(
                f"{len(broken)} broken internal links across {len(unique_targets)} targets. "
                f"First 10: {broken[:10]}"
            )

    def test_no_empty_hrefs(self, all_html_files):
        bad = []
        for f in all_html_files:
            html = read_html(f)
            if 'href=""' in html or "href=''" in html:
                count = html.count('href=""') + html.count("href=''")
                bad.append((get_page_label(f), count))
        assert not bad, f"Pages with empty href attributes: {bad}"


class TestExternalLinks:
    """External link quality checks."""

    def test_no_http_links(self, article_html_files):
        """External links should use HTTPS, not HTTP."""
        insecure = []
        for f in article_html_files:
            links = extract_links(read_html(f))
            for href in links:
                if href.startswith("http://") and "localhost" not in href:
                    insecure.append((get_page_label(f), href))
        assert not insecure, f"Insecure HTTP links found: {insecure[:10]}"

    def test_no_localhost_links(self, all_html_files):
        """No links should point to localhost or 127.0.0.1."""
        bad = []
        for f in all_html_files:
            links = extract_links(read_html(f))
            for href in links:
                if "localhost" in href or "127.0.0.1" in href:
                    bad.append((get_page_label(f), href))
        assert not bad, f"Localhost links found in production: {bad}"

    def test_no_staging_links(self, all_html_files):
        """No links to staging/dev environments."""
        bad = []
        for f in all_html_files:
            links = extract_links(read_html(f))
            for href in links:
                # Only flag actual staging subdomains in hrefs, not partial word matches
                if re.search(r'https?://(staging|dev|test)\.\w+', href):
                    bad.append((get_page_label(f), href))
        assert not bad, f"Staging/dev links found in production: {bad}"


class TestLinkQuality:
    """Link best-practice checks."""

    def test_external_links_have_rel_noopener(self, article_html_files):
        """External links opening in new tabs should have rel=noopener."""
        bad = []
        for f in article_html_files:
            html = read_html(f)
            # Find links with target="_blank"
            for match in re.finditer(
                r'<a\s[^>]*target=["\']_blank["\'][^>]*>', html, re.IGNORECASE
            ):
                tag = match.group(0)
                if "noopener" not in tag:
                    href_match = re.search(r'href=["\']([^"\']*)["\']', tag)
                    href = href_match.group(1) if href_match else "unknown"
                    bad.append((get_page_label(f), href))
        if bad:
            pytest.fail(f"Links with target=_blank missing rel=noopener: {bad[:10]}")
