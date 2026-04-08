"""
Performance & Asset Test Suite — The NCA Hub

What a world-class performance engineer would check:
- HTML files are not unreasonably large (< 500KB)
- JavaScript files are within budget
- CSS files are within budget
- Images have reasonable sizes
- No duplicate script or stylesheet includes
- Service worker and manifest exist for PWA
- Critical files exist (favicon, og-image)
"""

import re

import pytest

from tests.website.conftest import (
    get_page_label,
    read_html,
    SITE_ROOT,
)

KB = 1024
MB = 1024 * KB


class TestAssetSizes:
    """Asset size budgets — keep the site fast."""

    def test_html_files_under_500kb(self, all_html_files):
        oversized = []
        for f in all_html_files:
            size = f.stat().st_size
            if size > 500 * KB:
                oversized.append((get_page_label(f), f"{size / KB:.0f}KB"))
        if oversized:
            pytest.fail(f"HTML files over 500KB: {oversized[:10]}")

    def test_javascript_files_under_100kb(self):
        js_files = sorted(SITE_ROOT.glob("*.js"))
        oversized = []
        for f in js_files:
            size = f.stat().st_size
            if size > 100 * KB:
                oversized.append((f.name, f"{size / KB:.0f}KB"))
        if oversized:
            pytest.fail(f"JS files over 100KB: {oversized}")

    def test_css_files_under_50kb(self):
        css_files = sorted(SITE_ROOT.glob("*.css"))
        oversized = []
        for f in css_files:
            size = f.stat().st_size
            if size > 50 * KB:
                oversized.append((f.name, f"{size / KB:.0f}KB"))
        if oversized:
            pytest.fail(f"CSS files over 50KB: {oversized}")

    def test_og_image_under_200kb(self):
        og_image = SITE_ROOT / "og-image.jpg"
        if og_image.exists():
            size = og_image.stat().st_size
            assert size < 200 * KB, f"og-image.jpg is {size / KB:.0f}KB (should be < 200KB)"


class TestDuplicateResources:
    """No duplicate script or stylesheet includes."""

    def test_no_duplicate_scripts(self, article_html_files):
        bad = []
        for f in article_html_files:
            html = read_html(f)
            scripts = re.findall(r'<script\s+src=["\']([^"\']+)["\']', html)
            seen = set()
            for src in scripts:
                if src in seen:
                    bad.append((get_page_label(f), src))
                seen.add(src)
        assert not bad, f"Duplicate script includes: {bad[:10]}"

    def test_no_duplicate_stylesheets(self, article_html_files):
        bad = []
        for f in article_html_files:
            html = read_html(f)
            links = re.findall(
                r'<link\s[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\']',
                html
            )
            seen = set()
            for href in links:
                if href in seen:
                    bad.append((get_page_label(f), href))
                seen.add(href)
        assert not bad, f"Duplicate stylesheet includes: {bad[:10]}"


class TestPWAReadiness:
    """Progressive Web App requirements."""

    def test_manifest_exists(self):
        manifest = SITE_ROOT / "manifest.json"
        assert manifest.exists(), "manifest.json not found (PWA requirement)"

    def test_service_worker_exists(self):
        sw = SITE_ROOT / "sw.js"
        assert sw.exists(), "sw.js not found (PWA requirement)"

    def test_offline_page_exists(self):
        offline = SITE_ROOT / "offline.html"
        assert offline.exists(), "offline.html not found (PWA requirement)"

    def test_favicon_exists(self):
        favicon = SITE_ROOT / "favicon.svg"
        assert favicon.exists(), "favicon.svg not found"


class TestCriticalAssets:
    """Critical files that must exist."""

    def test_homepage_exists(self):
        assert (SITE_ROOT / "index.html").exists()

    def test_404_page_exists(self):
        assert (SITE_ROOT / "404.html").exists(), "Custom 404 page missing"

    def test_security_headers_exist(self):
        headers = SITE_ROOT / "_headers"
        assert headers.exists(), "_headers file missing (security headers)"

    def test_redirects_exist(self):
        redirects = SITE_ROOT / "_redirects"
        assert redirects.exists(), "_redirects file missing (URL normalization)"

    def test_search_index_exists(self):
        index = SITE_ROOT / "search-index.json"
        assert index.exists(), "search-index.json missing (search will break)"

    def test_llms_txt_exists(self):
        """llms.txt provides AI-readable site summary."""
        assert (SITE_ROOT / "llms.txt").exists(), "llms.txt missing"


class TestSecurityHeaders:
    """Validate security header configuration."""

    def test_headers_have_hsts(self):
        headers = SITE_ROOT / "_headers"
        if not headers.exists():
            pytest.skip("No _headers file")
        content = headers.read_text()
        assert "Strict-Transport-Security" in content, "Missing HSTS header"

    def test_headers_have_nosniff(self):
        headers = SITE_ROOT / "_headers"
        if not headers.exists():
            pytest.skip("No _headers file")
        content = headers.read_text()
        assert "X-Content-Type-Options" in content, "Missing X-Content-Type-Options"

    def test_headers_have_frame_options(self):
        headers = SITE_ROOT / "_headers"
        if not headers.exists():
            pytest.skip("No _headers file")
        content = headers.read_text()
        assert "X-Frame-Options" in content, "Missing X-Frame-Options (clickjacking protection)"
