# Changelog

## 2026-10-26 — Review

### Content
- CCAF practice: fixed five wrong answer keys and rewrote ambiguous items. Grew the bank from 49 to 62 questions and added Developer Productivity and Structured Data Extraction scenarios. Balanced answer positions and option lengths, and replaced questions that duplicated the guide's samples.
- CCAF guide: updated for Claude 5 models (forced `tool_choice` is rejected; use `strict: true` tools or structured outputs). Fixed code samples (`model`/`max_tokens`, Pydantic v2), and updated the CLAUDE.md hierarchy, skills and `-p` guidance. Spread sample-question keys across A–D. Replaced fabricated statistics with clearly fictional examples.
- CCAP playbook: corrected the Sonnet 5.5 cache-read price, sampling-parameter and thinking behavior, Fable 5.1 and ZDR, HIPAA and BAA routes, `inference_geo` scope, the Usage Policy high-risk list and the MCP spec links. Added API model IDs. Replaced near-duplicate questions (131 → 129) and added an exact facts list (49 rows).
- Every question set now says the questions are original, AI-assisted and not official. Exam logistics are marked "as of October 2026".

### Site
- CCAP timed mock: resumes after a reload, shows a full answer review, announces time warnings, and includes at most 4 recall items. Practice progress is keyed by stable question ids on both banks.
- Accessibility: AA contrast for the accent color, a fixed heading outline, real buttons and radio groups, live feedback, an inert mobile drawer, labelled scroll regions and 44px tap targets.
- Responsive: the Courses page and the CCAF grids now fit 360px screens, and the site nav scrolls on phones.
- One footer and disclaimer on every page, Open Graph and Twitter cards, canonical URLs, robots.txt, sitemap.xml, a redesigned 404 page and redirects that keep the #hash.
- Structure: each section is self-contained (`ccaf/`, `ccap/`, `courses/`, `practice/`) with its page, styles, scripts and data together; `assets/` holds only the shared theme and images. The 404 page forwards the old `courses.html` and `questions.html` URLs.
- Repo: CI (HTML validation, link check, question checks), and issue and PR templates.
