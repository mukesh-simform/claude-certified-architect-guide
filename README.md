# Claude Certified Architect · Foundations Exam — Guide

> **Claude Certified Architect · Foundations Exam**  
> Everything you need in one repo — official materials, an interactive study guide, a full practice question bank, and the required course list.  
> **Minimum passing score: 720 / 1000**

---

## How to Use This Repo

| Resource | What it is |
|---|---|
| [Interactive Study Guide](index.html) | Primary study resource — all 5 domains, cheat sheets, code examples, dark-themed UI |
| [Practice Question Bank](questions.html) | 49 unique questions from official practice exams, grouped by scenario, with reveal answers |
| [Required Courses](COURSES.md) | The 5 Anthropic Academy courses to complete before the exam |
| [Official Exam Guide](docs/Exam_Guide.pdf) | Anthropic's official exam specification (8 pages) |
| [Course Catalog](docs/Anthropic_Academy_Course_Catalog.pdf) | Full Anthropic Academy catalog |

---

## Exam at a Glance

| Domain | Topic | Weight |
|---|---|---|
| D1 | Agentic Architecture & Orchestration | **27%** |
| D2 | Tool Design & MCP Integration | **18%** |
| D3 | Claude Code Configuration & Workflows | **20%** |
| D4 | Prompt Engineering & Structured Output | **20%** |
| D5 | Context Management & Reliability | **15%** |

---

## Required Courses (complete before exam)

Complete these five [Anthropic Academy](https://anthropic.skilljar.com) courses in order:

1. **Claude Code 101** — Installation, agentic loop, CLAUDE.md, hooks, subagents, MCP basics → covers all 5 domains as baseline
2. **Claude Code in Action** *(Level 200)* — Hooks, custom commands, Agent SDK → covers D3, D1
3. **Building with the Claude API** *(Level 100 + 200)* — API fundamentals through agents and production patterns → covers D1, D4, D5
4. **Introduction to Model Context Protocol** *(Level 200)* — Building MCP servers and clients → covers D2
5. **Model Context Protocol: Advanced Topics** *(Level 300)* — Production MCP patterns: sampling, notifications, file system access, transport mechanisms → deepens D2

See [COURSES.md](COURSES.md) for full descriptions and domain mapping.

---

## Domain Quick Reference

**D1 — Agentic Architecture (27%):** Agentic loop lifecycle · `stop_reason` · multi-agent coordinator/subagent patterns · task decomposition · error propagation · session resumption

**D2 — Tool Design & MCP (18%):** Effective tool descriptions · structured error responses · `tool_choice` · MCP server configuration · composite tools · scope and distribution

**D3 — Claude Code Config (20%):** `CLAUDE.md` hierarchy (user → project → path) · custom slash commands and skills · `context: fork` · `allowed-tools` · Plan Mode · CI/CD with `-p` flag

**D4 — Prompt Engineering (20%):** Explicit criteria vs vague instructions · few-shot examples · structured output via `tool_use` · validation and retry loops · multi-pass review · batch processing

**D5 — Context Management (15%):** Context window optimization · lost-in-the-middle · progressive summarization · persistent fact blocks · Explore subagent for isolation · information provenance

---

## Key Numbers to Memorize

- Passing score: **720 / 1000**
- Batch API max latency: **24 hours** — disqualifies any blocking workflow
- `stop_reason: "tool_use"` → continue loop · `stop_reason: "end_turn"` → stop
- `context: fork` isolates skill execution from main conversation history
- `-p` flag puts Claude Code into non-interactive (CI/pipeline) mode
- User-scope (`~/.claude/`) overrides project-scope (`.claude/`) for that user

---

## Practice Exam

Practice Exam: Claude Certified Architect – Foundations Certification

1. Login to https://anthropic.skilljar.com/
2. Access My Profile
3. Access Practice Exam

> Do not attempt the final exam until you score 850–900 in practice exam.