# Contributing

Thanks for helping keep these guides accurate. Corrections are most useful when they come with a link to the current Anthropic docs.

## Good contributions
- Corrections backed by a link to the current Anthropic docs (state the page and what changed). Use the **Content correction** issue template.
- Typos, broken links, accessibility and mobile layout fixes.
- New original practice questions with a short explanation of why the answer is right and why the distractors are wrong.

## Ground rules
- **No real exam content.** Do not submit questions, answers or wording from the live exam, the official practice exam, or any material covered by an NDA.
- Do not copy Anthropic or third-party documents wholesale. Summarize and link instead.
- Keep a neutral tone and keep the "independent, not affiliated with Anthropic" notice intact.
- Don't present unverified numbers as fact. Link the source, or write "as of <month year>; check the current docs".

## Writing questions
- One scenario, four options, one defensible answer. Multiple-response items have exactly two keys and end the stem with "(Select two.)".
- Make distractors plausible and about the same length as the answer. The correct option should not usually be the longest.
- Explanations should not refer to options by letter, because options are shuffled or reordered.
- Use US spelling.

### CCAF (`ccaf/practice.html`)
Each question is an `<article class="q-card">` with a unique, stable `id`/`data-qid` (for example `ccaf-cs-refund-hook`), `data-d` (`d1`–`d5`) and `data-answer` (`A`–`D`). Copy an existing card. Saved progress is keyed by `data-qid`, so never reuse or rename an id.

### CCAP (`ccap/questions.js`)
Each domain key holds objects with `id` (for example `d3-21`, never reused), `s` (stem), `o` (four options), `a` (correct indexes), optional `m: true` (multiple response), `e` (explanation) and, in `facts`, `dom` (the domain it counts toward). The timed mock draws 11/8/12/10/9/9/4 items per domain.

## Before opening a pull request
```bash
python3 -m http.server 8000               # check light, dark and a 360px viewport
node scripts/check-questions.js           # question banks and anchors
npx html-validate "*.html" "*/*.html"
```
- Do a keyboard-only pass on anything interactive you changed.
- If you added or removed questions, update the counts in `README.md`, `index.html` and `practice.html`.
- If you changed a page `<title>` or description, run `python3 scripts/sync-head-footer.py` to refresh the sharing tags and footer.
- If you re-verified facts against the docs, bump the date in `assets/js/theme.js` and `sitemap.xml`, and add a line to `CHANGELOG.md`.
