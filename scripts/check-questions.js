#!/usr/bin/env node
/* Sanity checks for both question banks and the in-page anchors, plus local links. Run from anywhere:
     node scripts/check-questions.js
   Exits 1 on any failure; CI runs it on every push and pull request. */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.log("FAIL:", m); } };

// ---- CCAP bank (ccap/questions.js) ----
global.window = {};
require(path.join(ROOT, "ccap/questions.js"));
const Q = window.CCAP_Q;
const QUOTA = { d1: 11, d2: 8, d3: 12, d4: 10, d5: 9, d6: 9, d7: 4 };
const ids = new Set();
let ccapTotal = 0, mr = 0;
for (const k of Object.keys(Q)) {
  for (const q of Q[k]) {
    ccapTotal++;
    ok(/^(d[1-7]|fx)-\d{2}$/.test(q.id || ""), "ccap: bad id " + q.id);
    ok(!ids.has(q.id), "ccap: duplicate id " + q.id); ids.add(q.id);
    ok(Array.isArray(q.o) && q.o.length === 4, q.id + ": needs 4 options");
    ok(Array.isArray(q.a) && q.a.every((i) => Number.isInteger(i) && i >= 0 && i < q.o.length), q.id + ": key out of range");
    ok(new Set(q.a).size === q.a.length, q.id + ": duplicate key");
    ok(typeof q.e === "string" && q.e.length > 20, q.id + ": missing explanation");
    if (q.m) { mr++; ok(q.a.length === 2 && /\(Select two\.\)/.test(q.s), q.id + ": multiple-response items need 2 keys and '(Select two.)'"); }
    else ok(q.a.length === 1, q.id + ": single-answer item has " + q.a.length + " keys");
    if (k === "facts") ok(QUOTA[q.dom] !== undefined, q.id + ": facts item needs a valid dom");
  }
}
for (const d of Object.keys(QUOTA)) ok((Q[d] || []).length >= QUOTA[d], "ccap: not enough " + d + " scenario items for the mock quota");
ok(Object.values(QUOTA).reduce((a, b) => a + b, 0) === 63, "ccap: mock quotas must sum to 63");

// ---- CCAF practice bank (ccaf/practice.html) ----
const prac = read("ccaf/practice.html");
const cards = [...prac.matchAll(/<article class="q-card"[^>]*data-qid="([^"]+)"[^>]*data-d="(d[1-5])"[^>]*data-answer="([A-D])"[\s\S]*?<\/article>/g)];
const qids = new Set();
const ccafDomains = {};
for (const [card, qid, d, ans] of cards) {
  ok(!qids.has(qid), "ccaf: duplicate data-qid " + qid); qids.add(qid);
  ccafDomains[d] = (ccafDomains[d] || 0) + 1;
  const opts = (card.match(/class="q-opt"/g) || []).length;
  ok(opts === 4, qid + ": " + opts + " options");
  ok(card.includes("Correct answer: " + ans), qid + ": revealed answer doesn't match data-answer " + ans);
}
ok(cards.length === (prac.match(/<article class="q-card"/g) || []).length, "ccaf: a q-card is missing data-qid/data-d/data-answer");

// ---- In-page anchors on every page ----
const pages = ["index.html", "practice/index.html", "ccaf/index.html", "ccaf/practice.html", "courses/index.html", "ccap/index.html"];
for (const p of pages) {
  const html = read(p);
  const idList = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const idSet = new Set(idList);
  ok(idList.length === idSet.size, p + ": duplicate ids " + idList.filter((x, i) => idList.indexOf(x) !== i).join(","));
  for (const [, h] of html.matchAll(/href="#([^"]+)"/g)) ok(idSet.has(h), p + ": broken anchor #" + h);
  // Local links must point at real files (not directories) so they also work when a page is opened from disk.
  for (const [, u] of html.matchAll(/(?:href|src)="([^"#:]+)(?:#[^"]*)?"/g)) {
    const t = path.join(ROOT, path.dirname(p), u);
    ok(fs.existsSync(t) && fs.statSync(t).isFile(), p + ": link '" + u + "' is not an existing file");
  }
  for (const [tag] of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) ok(/rel="[^"]*noopener/.test(tag), p + ": target=_blank without rel=noopener");
}

console.log(JSON.stringify({ ccap: { total: ccapTotal, multipleResponse: mr }, ccaf: { total: cards.length, byDomain: ccafDomains } }));
console.log(fail ? fail + " failure(s)" : "All checks passed");
process.exit(fail ? 1 : 0);
