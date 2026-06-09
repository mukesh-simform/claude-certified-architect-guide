# Required Courses Before the CCA Exam

The following five courses from [Anthropic Academy](https://anthropic.skilljar.com) are the recommended foundation before attempting the Claude Certified Architect (CCA) Foundations exam. Complete them in order.

---

## 1. Claude Code 101 — Foundational

**What it covers:** Everything from installation to advanced customization — designed for developers new to AI coding agents or experienced engineers exploring Claude Code for the first time.
- Understanding AI coding agents and how Claude Code differs from chat-based tools
- Installation across terminal, VS Code, JetBrains, Claude Desktop, and web
- The agentic loop, context window, tools, and permissions model
- Prompt writing with approval mode, auto-accept, and Plan Mode
- The Explore → Plan → Code → Commit workflow
- Context management techniques
- Creating `CLAUDE.md` files for persistent project memory
- Building custom subagents and connecting external tools via MCP servers
- Writing hooks for deterministic control

**Why it matters for the exam:** Directly introduces the foundational concepts tested across all five domains — the agentic loop (D1), MCP servers (D2), CLAUDE.md and hooks (D3), prompt writing and Plan Mode (D4), and context management (D5). This is the most exam-relevant starting point in the catalog.

---

## 2. Claude Code in Action — Level 200 · Intermediate

**What it covers:** Integrating Claude Code into development workflows — context management, hooks, custom commands, and the Agent SDK.

**Why it matters for the exam:** Directly maps to **Domain 3** (CLAUDE.md hierarchy, custom slash commands/skills, path-specific rules, Plan Mode, CI/CD integration) and reinforces **Domain 1** (multi-agent orchestration via the Agent SDK). ~20% of the exam.

---

## 3. Building with the Claude API — Level 100 + 200

**What it covers:**
- **First 4 sections (L100):** Authentication, basic prompting, prompt engineering, and evaluations using the Claude API.
- **Remaining sections (L200):** Tool use, RAG, building agents, production patterns, and optimization techniques.

**Why it matters for the exam:** Directly maps to **Domain 1** (Agentic Loop, tool_use, stop_reason), **Domain 4** (prompt engineering, structured output via tool_use, batch processing), and **Domain 5** (context management, retry loops).

---

## 4. Introduction to Model Context Protocol — Level 200 · Intermediate

**What it covers:** Building MCP servers and clients from scratch in Python. Tools, resources, and prompts for connecting Claude to external services.

**Why it matters for the exam:** Directly maps to **Domain 2** — writing effective tool descriptions, MCP server configuration, tool distribution, and structured error responses. ~18% of the exam.

---

## 5. Model Context Protocol: Advanced Topics — Level 300 · Advanced

**What it covers:** Advanced MCP implementation patterns — sampling, notifications, file system access, and transport mechanisms for production MCP server development.

**Why it matters for the exam:** Deepens **Domain 2** knowledge beyond basic server setup. Production MCP patterns (transport mechanisms, resource access, error handling at scale) directly map to exam questions on MCP configuration, structured error responses, and tool distribution in real-world deployments.

---

## Course → Domain Mapping

| Course | Primary Domain | Secondary Domains |
|---|---|---|
| Claude Code 101 | D1, D2, D3, D4, D5 (baseline) | — |
| Claude Code in Action | D3 | D1, D5 |
| Building with the Claude API | D1, D4, D5 | D2 |
| Introduction to Model Context Protocol | D2 | D1 |
| Model Context Protocol: Advanced Topics | D2 | — |

---

## Domain Weight Recap

| Domain | Topic | Weight |
|---|---|---|
| D1 | Agentic Architecture & Orchestration | 27% |
| D2 | Tool Design & MCP | 18% |
| D3 | Claude Code Configuration & Workflows | 20% |
| D4 | Prompt Engineering & Structured Output | 20% |
| D5 | Context Management & Reliability | 15% |

**Passing score: 720 / 1000**

Access all courses at: [anthropic.skilljar.com](https://anthropic.skilljar.com)
