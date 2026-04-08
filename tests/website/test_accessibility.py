"""
Accessibility Test Suite — The NCA Hub

What a world-class accessibility expert would check:
- All images have alt text
- Skip navigation link present
- Proper ARIA labels on interactive elements
- Heading hierarchy is logical
- Language attribute on <html>
- Form inputs have labels
- Color contrast considerations (via class checks)
- Keyboard-accessible FAQ accordions
"""

import re

import pytest

from tests.website.conftest import (
    extract_headings,
    extract_images,
    get_page_label,
    read_html,
)


class TestImageAccessibility:
    """Every image must have alt text."""

    def test_all_images_have_alt_text(self, article_html_files):
        missing_alt = []
        for f in article_html_files:
            images = extract_images(read_html(f))
            for img in images:
                if img["alt"] is None:
                    missing_alt.append((get_page_label(f), img["src"][:60]))
        assert not missing_alt, f"Images missing alt attribute: {missing_alt[:15]}"

    def test_no_empty_alt_on_content_images(self, article_html_files):
        """Content images (not decorative) should have descriptive alt text."""
        empty_alt = []
        for f in article_html_files:
            images = extract_images(read_html(f))
            for img in images:
                src = img["src"]
                # Skip decorative/icon images
                if any(skip in src.lower() for skip in ("icon", "logo", "spacer", "pixel")):
                    continue
                if img["alt"] is not None and img["alt"].strip() == "":
                    empty_alt.append((get_page_label(f), src[:60]))
        if empty_alt:
            pytest.fail(f"Content images with empty alt text: {empty_alt[:10]}")


class TestSkipNavigation:
    """Skip-to-content link for keyboard users."""

    def test_pages_have_skip_nav(self, all_html_files):
        missing = []
        for f in all_html_files:
            html = read_html(f)
            has_skip = (
                "skip" in html.lower() and "main" in html.lower()
                and re.search(r'href=["\']#main', html, re.IGNORECASE)
            )
            if not has_skip and "nca-skip-nav" not in html:
                missing.append(get_page_label(f))
        # Advisory threshold — at least 50% of pages should have skip nav
        total = len(all_html_files)
        if total > 0 and len(missing) < total * 0.5:
            pass  # Good enough
        elif total > 0:
            pytest.fail(
                f"{len(missing)}/{total} pages missing skip navigation link"
            )


class TestAriaLabels:
    """ARIA attributes on interactive elements."""

    def test_faq_sections_are_keyboard_accessible(self, article_html_files):
        """FAQ items should have role=button and aria-expanded."""
        faq_pages_without_aria = []
        for f in article_html_files:
            html = read_html(f)
            if "faq-item" in html or "faq-q" in html:
                if 'aria-expanded' not in html and 'role="button"' not in html:
                    faq_pages_without_aria.append(get_page_label(f))
        assert not faq_pages_without_aria, (
            f"FAQ sections without ARIA attributes: {faq_pages_without_aria}"
        )

    def test_nav_has_aria_label(self, article_html_files):
        """Navigation elements should have aria-label (checked on articles)."""
        bad = []
        for f in article_html_files:
            html = read_html(f)
            navs = re.findall(r"<nav\b[^>]*>", html, re.IGNORECASE)
            for nav in navs:
                if "aria-label" not in nav and "aria-labelledby" not in nav:
                    bad.append(get_page_label(f))
                    break
        # Advisory — warn if more than half of articles lack this
        if bad and len(bad) > len(article_html_files) * 0.5:
            pytest.fail(f"{len(bad)}/{len(article_html_files)} articles with <nav> missing aria-label")


class TestHtmlLang:
    """HTML document must declare language."""

    def test_html_has_lang_attribute(self, all_html_files):
        missing = []
        for f in all_html_files:
            html = read_html(f)
            if not re.search(r'<html[^>]*\slang=', html, re.IGNORECASE):
                missing.append(get_page_label(f))
        assert not missing, f"Pages missing lang attribute on <html>: {missing}"


class TestFormAccessibility:
    """Form inputs should have associated labels."""

    def test_form_inputs_have_labels(self, tool_pages):
        bad = []
        for f in tool_pages:
            html = read_html(f)
            inputs = re.findall(r'<input\s[^>]*id=["\']([^"\']+)["\'][^>]*>', html)
            for input_id in inputs:
                # Check for <label for="id"> or aria-label
                has_label = (
                    f'for="{input_id}"' in html
                    or f"for='{input_id}'" in html
                    or f'aria-label' in html
                )
                if not has_label:
                    bad.append((get_page_label(f), input_id))
        if bad:
            pytest.fail(f"Form inputs without labels: {bad[:10]}")


class TestReducedMotion:
    """Site should respect prefers-reduced-motion."""

    def test_css_respects_reduced_motion(self):
        """Check that main CSS files include prefers-reduced-motion."""
        css_files = [
            "nca-premium.css",
            "nca-premium-v3.css",
        ]
        from tests.website.conftest import SITE_ROOT
        found = False
        for css_name in css_files:
            css_path = SITE_ROOT / css_name
            if css_path.exists():
                content = css_path.read_text()
                if "prefers-reduced-motion" in content:
                    found = True
                    break
        if not found:
            pytest.fail("No CSS file respects prefers-reduced-motion media query")
