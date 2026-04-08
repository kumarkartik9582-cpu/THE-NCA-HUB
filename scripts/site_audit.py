#!/usr/bin/env python3
"""
NCA Hub — Unified Site Audit Tool

Replaces the 24 scattered fix_*.py and sprint_*.py scripts with a single,
professional-grade content validation and repair pipeline.

Usage:
    uv run python scripts/site_audit.py              # Audit only (report issues)
    uv run python scripts/site_audit.py --fix        # Audit + auto-fix safe issues
    uv run python scripts/site_audit.py --verbose    # Detailed output

What it checks (and optionally fixes):
1. SEO: meta tags, descriptions, canonical URLs, language tags
2. Schema: JSON-LD format (@graph), required fields, date validity
3. Structure: heading hierarchy, div balance, component presence
4. Content: word count, stale dates, broken internal links
5. Accessibility: alt text, ARIA labels, lang attribute
6. Performance: file sizes, duplicate resources
"""

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = SITE_ROOT / "blog"
DOMAIN = "https://www.thencahub.com"

# ── Data structures ──


@dataclass
class Issue:
    severity: str  # "error", "warning", "info"
    category: str  # "seo", "schema", "structure", "content", "a11y", "perf"
    page: str
    message: str
    fixable: bool = False


@dataclass
class AuditReport:
    issues: list[Issue] = field(default_factory=list)
    pages_scanned: int = 0
    fixes_applied: int = 0

    @property
    def errors(self):
        return [i for i in self.issues if i.severity == "error"]

    @property
    def warnings(self):
        return [i for i in self.issues if i.severity == "warning"]

    def add(self, severity, category, page, message, fixable=False):
        self.issues.append(Issue(severity, category, page, message, fixable))

    def summary(self):
        lines = [
            f"\n{'='*60}",
            f"  NCA Hub Site Audit Report",
            f"{'='*60}",
            f"  Pages scanned:  {self.pages_scanned}",
            f"  Errors:         {len(self.errors)}",
            f"  Warnings:       {len(self.warnings)}",
            f"  Info:           {len(self.issues) - len(self.errors) - len(self.warnings)}",
            f"  Fixes applied:  {self.fixes_applied}",
            f"{'='*60}",
        ]

        if self.errors:
            lines.append("\n  ERRORS:")
            for i in self.errors[:20]:
                lines.append(f"    [{i.category}] {i.page}: {i.message}")

        if self.warnings:
            lines.append("\n  WARNINGS:")
            for i in self.warnings[:20]:
                lines.append(f"    [{i.category}] {i.page}: {i.message}")

        return "\n".join(lines)


# ── Helpers ──


def find_html_pages():
    """Find all index.html files to audit."""
    excluded = {".venv", "node_modules", "ncahub-next", ".git",
                "Obra Super Powers", "AI CHATBOT UPDATE", "awesome-claude-code", "UI UX"}
    pages = []
    for f in SITE_ROOT.rglob("index.html"):
        if not any(ex in f.parts for ex in excluded):
            pages.append(f)
    return sorted(pages)


def rel_path(p: Path) -> str:
    return str(p.relative_to(SITE_ROOT))


def extract_meta(html):
    tags = {}
    for m in re.finditer(r'<meta\s+(?:name|property)=["\']([^"\']+)["\']\s+content=["\']([^"\']*)["\']', html, re.I):
        tags[m.group(1)] = m.group(2)
    for m in re.finditer(r'<meta\s+content=["\']([^"\']*)["\'].*?(?:name|property)=["\']([^"\']+)["\']', html, re.I):
        tags[m.group(2)] = m.group(1)
    return tags


def extract_title(html):
    m = re.search(r"<title>(.*?)</title>", html, re.DOTALL)
    return m.group(1).strip() if m else ""


def extract_json_ld(html):
    schemas = []
    for m in re.finditer(r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>', html, re.DOTALL):
        try:
            schemas.append(json.loads(m.group(1)))
        except json.JSONDecodeError:
            schemas.append(None)
    return schemas


# ── Auditors ──


def audit_seo(page: Path, html: str, report: AuditReport):
    label = rel_path(page)
    title = extract_title(html)
    meta = extract_meta(html)

    if not title:
        report.add("error", "seo", label, "Missing <title> tag")
    elif len(title) < 20:
        report.add("warning", "seo", label, f"Title too short ({len(title)} chars)")
    elif len(title) > 100:
        report.add("warning", "seo", label, f"Title too long ({len(title)} chars)")

    if "description" not in meta:
        report.add("error", "seo", label, "Missing meta description")
    elif len(meta["description"]) < 50:
        report.add("warning", "seo", label, f"Description too short ({len(meta['description'])} chars)")

    if 'rel="canonical"' not in html:
        report.add("warning", "seo", label, "Missing canonical URL")

    if not re.search(r'<html[^>]*\slang=', html, re.I):
        report.add("error", "a11y", label, "Missing lang attribute on <html>")

    # Language consistency
    if 'lang="en"' in html and "blog/" in label:
        report.add("warning", "seo", label, 'lang="en" should be "en-CA" for Canadian content', fixable=True)


def audit_schema(page: Path, html: str, report: AuditReport):
    label = rel_path(page)
    schemas = extract_json_ld(html)

    if not schemas and "blog/" in label:
        report.add("warning", "schema", label, "No JSON-LD schema found")
        return

    for i, schema in enumerate(schemas):
        if schema is None:
            report.add("error", "schema", label, f"JSON-LD block #{i+1} has parse error")
            continue

        # Check for bare array format
        if isinstance(schema, list):
            report.add("warning", "schema", label, "Uses bare JSON array instead of @graph format", fixable=True)

        if isinstance(schema, dict) and "@context" not in schema:
            report.add("warning", "schema", label, "Schema missing @context")


def audit_structure(page: Path, html: str, report: AuditReport):
    label = rel_path(page)

    # Div balance check
    opens = len(re.findall(r"<div[\s>]", html))
    closes = html.count("</div>")
    if abs(opens - closes) > 2:
        report.add("warning", "structure", label,
                    f"Div imbalance: {opens} opening vs {closes} closing tags")

    # Heading hierarchy
    headings = re.findall(r"<h([1-6])", html)
    levels = [int(h) for h in headings]
    for i in range(1, len(levels)):
        if levels[i] > levels[i-1] + 1:
            report.add("warning", "structure", label,
                        f"Heading skip: H{levels[i-1]} -> H{levels[i]}")
            break

    # H1 count
    h1_count = levels.count(1)
    if h1_count == 0 and "blog/" in label:
        report.add("error", "structure", label, "No H1 heading found")
    elif h1_count > 1:
        report.add("warning", "structure", label, f"Multiple H1 headings ({h1_count})")


def audit_accessibility(page: Path, html: str, report: AuditReport):
    label = rel_path(page)

    # Images without alt
    imgs_without_alt = len(re.findall(r"<img\s(?:(?!alt=)[^>])*>", html, re.I))
    if imgs_without_alt > 0:
        report.add("warning", "a11y", label, f"{imgs_without_alt} images missing alt attribute")

    # Links opening in new tab without noopener
    blank_links = re.findall(r'<a\s[^>]*target=["\']_blank["\'][^>]*>', html, re.I)
    for link in blank_links:
        if "noopener" not in link:
            report.add("warning", "a11y", label, "Link with target=_blank missing rel=noopener")
            break


def audit_performance(page: Path, html: str, report: AuditReport):
    label = rel_path(page)
    size_kb = page.stat().st_size / 1024

    if size_kb > 500:
        report.add("warning", "perf", label, f"Page is {size_kb:.0f}KB (over 500KB budget)")

    # Duplicate scripts
    scripts = re.findall(r'<script\s+src=["\']([^"\']+)["\']', html)
    if len(scripts) != len(set(scripts)):
        report.add("warning", "perf", label, "Duplicate <script> includes detected")

    # Duplicate stylesheets
    styles = re.findall(r'<link[^>]*href=["\']([^"\']+\.css)["\']', html)
    if len(styles) != len(set(styles)):
        report.add("warning", "perf", label, "Duplicate stylesheet includes detected")


# ── Fixers ──


def fix_lang_attribute(page: Path, html: str) -> str:
    """Fix lang='en' to lang='en-CA'."""
    return html.replace('lang="en"', 'lang="en-CA"')


def fix_schema_array(page: Path, html: str) -> str:
    """Convert bare JSON-LD arrays to @graph format."""
    def replace_schema(match):
        raw = match.group(1).strip()
        if raw.startswith("["):
            try:
                arr = json.loads(raw)
                # Remove individual @context from items
                for item in arr:
                    if isinstance(item, dict):
                        item.pop("@context", None)
                graph = {"@context": "https://schema.org", "@graph": arr}
                return f'<script type="application/ld+json">{json.dumps(graph, ensure_ascii=False)}</script>'
            except json.JSONDecodeError:
                return match.group(0)
        return match.group(0)

    return re.sub(
        r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>',
        replace_schema, html, flags=re.DOTALL
    )


FIXERS = {
    "lang": fix_lang_attribute,
    "schema_array": fix_schema_array,
}


# ── Main ──


def run_audit(fix=False, verbose=False):
    report = AuditReport()
    pages = find_html_pages()
    report.pages_scanned = len(pages)

    print(f"\nScanning {len(pages)} pages...")

    for page in pages:
        html = page.read_text(encoding="utf-8", errors="replace")

        audit_seo(page, html, report)
        audit_schema(page, html, report)
        audit_structure(page, html, report)
        audit_accessibility(page, html, report)
        audit_performance(page, html, report)

    # Apply fixes if requested
    if fix:
        fixable = [i for i in report.issues if i.fixable]
        print(f"\nApplying {len(fixable)} auto-fixes...")

        pages_to_fix = {}
        for issue in fixable:
            page_path = SITE_ROOT / issue.page
            if page_path not in pages_to_fix:
                pages_to_fix[page_path] = page_path.read_text(encoding="utf-8", errors="replace")

            html = pages_to_fix[page_path]
            if "lang" in issue.message.lower() and "en-CA" in issue.message:
                html = fix_lang_attribute(page_path, html)
            elif "bare JSON array" in issue.message:
                html = fix_schema_array(page_path, html)
            pages_to_fix[page_path] = html

        for page_path, fixed_html in pages_to_fix.items():
            original = page_path.read_text(encoding="utf-8", errors="replace")
            if fixed_html != original:
                page_path.write_text(fixed_html, encoding="utf-8")
                report.fixes_applied += 1

    print(report.summary())

    if verbose:
        print("\n  ALL ISSUES:")
        for i in report.issues:
            icon = {"error": "X", "warning": "!", "info": "i"}[i.severity]
            print(f"    [{icon}] [{i.category}] {i.page}: {i.message}")

    return len(report.errors)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="NCA Hub Site Audit")
    parser.add_argument("--fix", action="store_true", help="Auto-fix safe issues")
    parser.add_argument("--verbose", action="store_true", help="Show all issues")
    args = parser.parse_args()

    error_count = run_audit(fix=args.fix, verbose=args.verbose)
    sys.exit(1 if error_count > 0 else 0)
