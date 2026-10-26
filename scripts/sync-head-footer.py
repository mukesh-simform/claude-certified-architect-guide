#!/usr/bin/env python3
"""Apply the shared <head> sharing tags and the standard footer to every page.

Run from the repo root after editing a page's <title> or description:
    python3 scripts/sync-head-footer.py
Idempotent: it removes the tags it manages before re-inserting them.
"""
import re
from pathlib import Path

BASE = "https://mukesh-simform.github.io/claude-certified-architect-guide/"
REPO = "https://github.com/mukesh-simform/claude-certified-architect-guide"
SITE = "Claude Certification Prep"

PAGES = ["index.html", "practice/index.html", "ccaf/index.html", "ccaf/practice.html",
         "courses/index.html", "ccap/index.html"]

MANAGED = re.compile(
    r'\n?<(?:meta (?:property="og:[^"]+"|name="twitter:[^"]+"|name="theme-color")[^>]*'
    r'|link rel="(?:canonical|apple-touch-icon)"[^>]*)>')

FOOTER = """<footer class="sitefoot">
  <p>Independent, community-written study guide. Not affiliated with, endorsed by or reviewed by Anthropic. All practice questions are original study material written with AI assistance: they are not real exam questions and do not predict exam content. Product details change, so when this guide and the current Anthropic docs disagree, the docs win.</p>
  <p>Last reviewed <span data-reviewed>October 2026</span> · <a href="{repo}/issues/new/choose">Report an error</a> · <a href="{repo}">Source on GitHub</a> · <a href="https://anthropic.skilljar.com/">Anthropic Academy</a></p>
</footer>""".format(repo=REPO)


def attr(html, pattern):
    m = re.search(pattern, html)
    return m.group(1) if m else ""


def apply(path):
    p = Path(path)
    html = p.read_text()
    depth = path.count("/")
    rel = "../" * depth
    url = BASE + ("" if path == "index.html" else path.replace("index.html", ""))
    title = attr(html, r"<title>(.*?)</title>")
    desc = attr(html, r'<meta name="description" content="([^"]*)"')
    html = MANAGED.sub("", html)
    tags = "\n".join([
        f'<link rel="canonical" href="{url}">',
        f'<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{SITE}">',
        f'<meta property="og:title" content="{title}">',
        f'<meta property="og:description" content="{desc}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{BASE}assets/img/og-card.png">',
        f'<meta property="og:image:width" content="1200">',
        f'<meta property="og:image:height" content="630">',
        f'<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="theme-color" content="#FAF9F5" media="(prefers-color-scheme: light)">',
        f'<meta name="theme-color" content="#1F1E1D" media="(prefers-color-scheme: dark)">',
        f'<link rel="apple-touch-icon" href="{rel}assets/img/apple-touch-icon.png">',
    ])
    html = re.sub(r'(<meta name="description"[^>]*>)', lambda m: m.group(1) + "\n" + tags, html, count=1)
    html = re.sub(r'<footer class="sitefoot">.*?</footer>', FOOTER, html, count=1, flags=re.S)
    html = re.sub(r'(target="_blank")(?![^>]*\brel=)', r'\1 rel="noopener"', html)
    p.write_text(html)
    print("updated", path)


if __name__ == "__main__":
    for page in PAGES:
        apply(page)
