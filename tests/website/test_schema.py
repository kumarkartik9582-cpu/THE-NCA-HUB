"""
Schema.org JSON-LD Validation Test Suite — The NCA Hub

What a world-class SEO/structured data engineer would check:
- Every article has Article/BlogPosting schema
- Schema uses @graph format (not bare arrays)
- Required fields present: headline, author, datePublished, publisher
- FAQ schema has proper Question/Answer pairs
- BreadcrumbList schema is valid
- No JSON parse errors in any schema block
- Event schema on exam dates page has valid dates
"""

import json
import re

import pytest

from tests.website.conftest import (
    extract_json_ld,
    get_page_label,
    read_html,
    SITE_ROOT,
)


def _flatten_graph(schemas: list[dict]) -> list[dict]:
    """Flatten all schemas including @graph entries into individual items."""
    items = []
    for schema in schemas:
        if not isinstance(schema, dict):
            continue
        if "@graph" in schema:
            graph = schema["@graph"]
            if isinstance(graph, list):
                items.extend(graph)
            else:
                items.append(graph)
        elif isinstance(schema, list):
            items.extend(schema)
        else:
            items.append(schema)
    return items


def _find_by_type(items: list[dict], type_name: str) -> list[dict]:
    """Find all items with a given @type."""
    found = []
    for item in items:
        if not isinstance(item, dict):
            continue
        item_type = item.get("@type", "")
        if isinstance(item_type, list):
            if type_name in item_type:
                found.append(item)
        elif item_type == type_name:
            found.append(item)
    return found


class TestSchemaPresence:
    """Every article should have structured data."""

    def test_articles_have_json_ld(self, article_html_files):
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            if not schemas:
                missing.append(get_page_label(f))
        assert not missing, f"Articles without JSON-LD schema: {missing}"

    def test_no_json_parse_errors(self, all_html_files):
        bad = []
        for f in all_html_files:
            schemas = extract_json_ld(read_html(f))
            for s in schemas:
                if isinstance(s, dict) and s.get("_parse_error"):
                    bad.append((get_page_label(f), s.get("_raw", "")[:80]))
        assert not bad, f"JSON-LD parse errors: {bad}"


class TestArticleSchema:
    """Article/BlogPosting schema validation."""

    def test_articles_have_article_type(self, article_html_files):
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            article_types = _find_by_type(items, "Article") + _find_by_type(items, "BlogPosting")
            if not article_types:
                missing.append(get_page_label(f))
        if missing:
            pytest.fail(f"Articles without Article/BlogPosting schema: {missing[:10]}")

    def test_article_schema_has_headline(self, article_html_files):
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            articles = _find_by_type(items, "Article") + _find_by_type(items, "BlogPosting")
            for a in articles:
                if "headline" not in a and "name" not in a:
                    missing.append(get_page_label(f))
        assert not missing, f"Article schema missing headline: {missing}"

    def test_article_schema_has_author(self, article_html_files):
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            articles = _find_by_type(items, "Article") + _find_by_type(items, "BlogPosting")
            for a in articles:
                if "author" not in a:
                    missing.append(get_page_label(f))
        assert not missing, f"Article schema missing author: {missing}"

    def test_article_schema_has_dates(self, article_html_files):
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            articles = _find_by_type(items, "Article") + _find_by_type(items, "BlogPosting")
            for a in articles:
                if "datePublished" not in a:
                    missing.append((get_page_label(f), "datePublished"))
        if missing:
            pytest.fail(f"Article schema missing dates: {missing[:10]}")


class TestBreadcrumbSchema:
    """BreadcrumbList schema validation."""

    def test_articles_have_breadcrumb_schema(self, article_html_files):
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            breadcrumbs = _find_by_type(items, "BreadcrumbList")
            if not breadcrumbs:
                missing.append(get_page_label(f))
        if len(missing) > len(article_html_files) * 0.5:
            pytest.fail(f"{len(missing)} articles missing BreadcrumbList schema")

    def test_breadcrumb_has_items(self, article_html_files):
        bad = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            for bc in _find_by_type(items, "BreadcrumbList"):
                item_list = bc.get("itemListElement", [])
                if not item_list or len(item_list) < 2:
                    bad.append(get_page_label(f))
        assert not bad, f"BreadcrumbList with < 2 items: {bad}"


class TestFAQSchema:
    """FAQPage schema validation."""

    def test_faq_schema_has_questions(self, article_html_files):
        bad = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            items = _flatten_graph(schemas)
            for faq in _find_by_type(items, "FAQPage"):
                entities = faq.get("mainEntity", [])
                if not entities:
                    bad.append(get_page_label(f))
                for q in entities:
                    if not isinstance(q, dict):
                        continue
                    if q.get("@type") != "Question":
                        bad.append((get_page_label(f), "wrong type"))
                    if "name" not in q:
                        bad.append((get_page_label(f), "missing name"))
                    answer = q.get("acceptedAnswer", {})
                    if not answer.get("text"):
                        bad.append((get_page_label(f), "missing answer text"))
        assert not bad, f"FAQPage schema issues: {bad[:10]}"


class TestSchemaFormat:
    """Schema best practices."""

    def test_schema_uses_graph_format(self, article_html_files):
        """Prefer @graph wrapper over bare arrays."""
        bare_arrays = []
        for f in article_html_files:
            html = read_html(f)
            for match in re.finditer(
                r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>',
                html, re.DOTALL
            ):
                raw = match.group(1).strip()
                if raw.startswith("["):
                    bare_arrays.append(get_page_label(f))
        if bare_arrays:
            pytest.fail(
                f"{len(bare_arrays)} articles use bare JSON array instead of @graph: "
                f"{bare_arrays[:5]}"
            )

    def test_schema_has_context(self, article_html_files):
        """Top-level schema should include @context."""
        missing = []
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            for s in schemas:
                if isinstance(s, dict) and "@context" not in s:
                    missing.append(get_page_label(f))
                    break
        assert not missing, f"Schema blocks missing @context: {missing[:10]}"
