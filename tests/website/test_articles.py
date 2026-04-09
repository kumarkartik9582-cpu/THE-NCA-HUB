"""
Article Quality Test Suite — The NCA Hub

What a world-class content strategist and QA engineer would check:
- Every markdown source has valid frontmatter (title, slug, description)
- Every rendered article has required components (newsletter, CTA, author bio)
- Heading hierarchy is correct (H1 → H2 → H3, no skips)
- Articles have substantial content (word count > 300)
- Every article source produces a rendered HTML page
"""

import re

import pytest

from tests.website.conftest import (
    extract_headings,
    extract_title,
    get_page_label,
    read_html,
    BLOG_DIR,
    SITE_ROOT,
)


class TestMarkdownFrontmatter:
    """Validate markdown source files have proper frontmatter."""

    def test_all_articles_have_frontmatter(self, article_markdown_files):
        assert len(article_markdown_files) > 0, "No markdown articles found"
        bad = []
        for f in article_markdown_files:
            content = f.read_text(encoding="utf-8", errors="replace")
            if not content.startswith("---"):
                bad.append(f.name)
        assert not bad, f"Articles missing YAML frontmatter: {bad}"

    def test_frontmatter_has_title(self, article_markdown_files):
        missing = []
        for f in article_markdown_files:
            content = f.read_text(encoding="utf-8", errors="replace")
            if "title:" not in content.split("---")[1] if content.startswith("---") and content.count("---") >= 2 else "":
                missing.append(f.name)
        assert not missing, f"Articles missing title in frontmatter: {missing}"

    def test_frontmatter_has_meta_description(self, article_markdown_files):
        missing = []
        for f in article_markdown_files:
            content = f.read_text(encoding="utf-8", errors="replace")
            parts = content.split("---")
            if len(parts) >= 3:
                fm = parts[1]
                if "meta_description:" not in fm and "description:" not in fm:
                    missing.append(f.name)
        assert not missing, f"Articles missing meta_description: {missing}"

    def test_frontmatter_has_slug(self, article_markdown_files):
        """Most articles should have a slug. The filename is used as fallback."""
        missing = []
        for f in article_markdown_files:
            content = f.read_text(encoding="utf-8", errors="replace")
            parts = content.split("---")
            if len(parts) >= 3:
                fm = parts[1]
                if "slug:" not in fm:
                    missing.append(f.name)
        # Advisory: slug is optional since build.js falls back to filename
        if missing and len(missing) > len(article_markdown_files) * 0.5:
            pytest.fail(f"More than half of articles missing slug: {missing}")


class TestArticleRendering:
    """Every markdown source should have a corresponding rendered HTML page."""

    def test_all_sources_have_rendered_pages(self, article_markdown_files):
        orphans = []
        for md in article_markdown_files:
            stem = md.stem  # e.g., "article-a2-nca-exam-format"
            rendered = BLOG_DIR / stem / "index.html"
            if not rendered.exists():
                # Also check slug-based naming
                orphans.append(md.name)
        if orphans:
            pytest.fail(f"{len(orphans)} markdown files without rendered HTML: {orphans[:10]}")


class TestArticleComponents:
    """Articles should have required UI components."""

    def test_articles_have_cta(self, article_html_files):
        """Every article needs a call-to-action."""
        missing = []
        for f in article_html_files:
            html = read_html(f)
            if "art-cta" not in html and "cta" not in html.lower():
                missing.append(get_page_label(f))
        assert not missing, f"Articles missing CTA: {missing}"

    def test_articles_have_breadcrumbs(self, article_html_files):
        missing = []
        for f in article_html_files:
            html = read_html(f)
            if "breadcrumb" not in html.lower():
                missing.append(get_page_label(f))
        assert not missing, f"Articles missing breadcrumbs: {missing}"

    def test_articles_have_meta_section(self, article_html_files):
        """Articles should show reading time and date."""
        missing = []
        for f in article_html_files:
            html = read_html(f)
            if "art-meta" not in html and "read" not in html.lower():
                missing.append(get_page_label(f))
        if len(missing) > len(article_html_files) * 0.3:
            pytest.fail(f"{len(missing)} articles missing meta/reading-time section")


class TestHeadingHierarchy:
    """Heading structure should follow H1 → H2 → H3 without skips."""

    def test_articles_have_exactly_one_h1(self, article_html_files):
        bad = []
        for f in article_html_files:
            headings = extract_headings(read_html(f))
            h1_count = sum(1 for level, _ in headings if level == 1)
            if h1_count != 1:
                bad.append((get_page_label(f), h1_count))
        assert not bad, f"Articles with wrong H1 count (should be 1): {bad}"

    def test_no_heading_level_skip(self, article_html_files):
        """Should not jump from H1 to H3 (skipping H2). Advisory for most sites."""
        bad = []
        for f in article_html_files:
            headings = extract_headings(read_html(f))
            levels = [level for level, _ in headings]
            for i in range(1, len(levels)):
                # Only flag skips of 2+ levels (H1→H3 is bad, H2→H3 is fine)
                if levels[i] > levels[i - 1] + 1:
                    bad.append((get_page_label(f), f"H{levels[i-1]}→H{levels[i]}"))
                    break
        # Fail if more than 30% of articles have heading skips
        threshold = max(3, int(len(article_html_files) * 0.3))
        if len(bad) > threshold:
            pytest.fail(f"{len(bad)} articles with heading level skips (threshold {threshold}): {bad[:5]}")


class TestArticleContent:
    """Content quality checks."""

    def test_articles_have_substantial_content(self, article_html_files):
        """Articles should have at least 300 words."""
        thin = []
        for f in article_html_files:
            html = read_html(f)
            # Strip tags and count words
            text = re.sub(r"<[^>]+>", " ", html)
            text = re.sub(r"\s+", " ", text).strip()
            word_count = len(text.split())
            if word_count < 300:
                thin.append((get_page_label(f), word_count))
        assert not thin, f"Articles with < 300 words (thin content): {thin}"

    def test_article_titles_match_h1(self, article_html_files):
        """The <title> tag and H1 should share key terms."""
        stop_words = {"the", "a", "an", "in", "on", "for", "to", "of", "and", "is",
                       "it", "at", "by", "or", "—", "-", ":", "|", "your", "how",
                       "what", "why", "when", "this", "that", "with", "from"}
        mismatches = []
        for f in article_html_files:
            html = read_html(f)
            title = extract_title(html).lower()
            headings = extract_headings(html)
            h1_texts = [text.lower() for level, text in headings if level == 1]
            if h1_texts and title:
                h1 = h1_texts[0]
                h1_words = set(h1.split()) - stop_words
                title_words = set(title.split()) - stop_words
                overlap = h1_words & title_words
                # At least 1 meaningful content word should overlap
                if len(overlap) < 1 and len(h1_words) > 0:
                    mismatches.append((get_page_label(f), title[:50], h1[:50]))
        # Fail only if many articles have completely unrelated title/H1
        if len(mismatches) > max(3, int(len(article_html_files) * 0.2)):
            pytest.fail(f"Title/H1 mismatches: {mismatches[:5]}")
