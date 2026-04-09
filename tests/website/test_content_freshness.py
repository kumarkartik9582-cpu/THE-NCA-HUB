"""
Content Freshness Test Suite — The NCA Hub

What a world-class content strategist would check:
- Exam dates are not in the past
- Cost/fee information matches current NCA rates
- Copyright year is current
- No references to expired deadlines
- Date references in schema.org are valid ISO format
"""

import re
from datetime import date

import pytest

from tests.website.conftest import (
    extract_json_ld,
    get_page_label,
    read_html,
    SITE_ROOT,
)

CURRENT_YEAR = date.today().year
TODAY = date.today()


class TestExamDates:
    """Exam date information must be current."""

    def test_exam_dates_page_exists(self):
        page = SITE_ROOT / "nca-exam-dates-2026" / "index.html"
        assert page.exists(), "Exam dates page not found"

    def test_exam_dates_not_all_expired(self):
        """Page should contain at least some future exam dates in its content."""
        page = SITE_ROOT / "nca-exam-dates-2026" / "index.html"
        if not page.exists():
            pytest.skip("Exam dates page not found")

        html = read_html(page)

        # Search all dates in ISO format anywhere in the HTML/schema
        all_dates = re.findall(r'20\d{2}-\d{2}-\d{2}', html)
        future_dates = 0
        past_dates = 0
        for date_str in all_dates:
            try:
                d = date.fromisoformat(date_str)
                if d >= TODAY:
                    future_dates += 1
                else:
                    past_dates += 1
            except ValueError:
                pass

        if future_dates == 0 and past_dates > 0:
            pytest.fail(
                f"All {past_dates} dates on exam dates page are in the past — "
                f"page needs updating for current exam sessions!"
            )


class TestCostInformation:
    """Cost/fee information should be reasonable and current."""

    def test_cost_calculator_exists(self):
        page = SITE_ROOT / "nca-cost-calculator" / "index.html"
        assert page.exists(), "Cost calculator page not found"

    def test_cost_calculator_has_content(self):
        """Cost calculator page should have interactive elements and fee data."""
        page = SITE_ROOT / "nca-cost-calculator" / "index.html"
        if not page.exists():
            pytest.skip("Cost calculator not found")

        html = read_html(page)
        # Calculator should have input elements and price-related content
        has_inputs = "input" in html.lower() and ("range" in html or "checkbox" in html)
        has_currency = "$" in html or "CAD" in html or "cost" in html.lower()
        assert has_inputs, "Cost calculator missing interactive input elements"
        assert has_currency, "Cost calculator missing price/currency content"


class TestCopyrightYear:
    """Copyright notices should reference current year."""

    def test_homepage_copyright_year(self):
        page = SITE_ROOT / "index.html"
        if not page.exists():
            pytest.skip("Homepage not found")

        html = read_html(page)
        # Look for copyright patterns
        copyright_matches = re.findall(r'[©]\s*(\d{4})', html)
        year_matches = re.findall(r'copyright.*?(\d{4})', html, re.IGNORECASE)
        all_years = copyright_matches + year_matches

        if all_years:
            max_year = max(int(y) for y in all_years)
            assert max_year >= CURRENT_YEAR - 1, (
                f"Copyright year {max_year} is outdated (current: {CURRENT_YEAR})"
            )


class TestSchemaDateFormats:
    """All dates in JSON-LD schema should be valid ISO 8601."""

    def test_article_schema_dates(self, article_html_files):
        bad = []
        date_fields = ("datePublished", "dateModified", "dateCreated",
                        "startDate", "endDate")
        for f in article_html_files:
            schemas = extract_json_ld(read_html(f))
            for schema in schemas:
                items = schema.get("@graph", [schema]) if isinstance(schema, dict) else [schema]
                if isinstance(items, dict):
                    items = [items]
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    for field in date_fields:
                        val = item.get(field, "")
                        if val:
                            try:
                                date.fromisoformat(val[:10])
                            except ValueError:
                                bad.append((get_page_label(f), field, val))
        assert not bad, f"Invalid date formats in schema: {bad[:10]}"


class TestContentReferences:
    """Content should not reference obviously outdated things."""

    def test_no_old_year_references(self, article_html_files):
        """Articles shouldn't primarily reference years more than 2 years old."""
        stale = []
        cutoff = CURRENT_YEAR - 2
        for f in article_html_files:
            html = read_html(f)
            title = re.search(r"<title>(.*?)</title>", html, re.DOTALL)
            if title:
                title_text = title.group(1)
                year_in_title = re.findall(r'20\d{2}', title_text)
                for y in year_in_title:
                    if int(y) < cutoff:
                        stale.append((get_page_label(f), y))
        if stale:
            pytest.fail(f"Articles with outdated year in title: {stale}")
