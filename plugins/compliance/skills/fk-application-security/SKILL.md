---
name: fk-application-security
description: >
  Assess features and code changes for security risks, generate secure development checklists,
  and advise on authentication patterns, secrets management, encryption, and OWASP compliance.
  Use this skill whenever someone asks about application security, security risks in a feature,
  secure coding practices, authentication/session management, secrets handling, dependency security,
  or wants a security checklist. Triggers on: "assess this for security", "security checklist for X",
  "what are the security risks in X", "secure development checklist", "/compliance:fk-application-security",
  "OWASP risks for X", "is this secure", "security review of X", "how do I handle secrets",
  "secure auth pattern", "is this vulnerable to X", "SQL injection risk", "XSS risk".
---

# Application Security Skill

This skill has two modes. Identify which mode the user wants based on their request, then follow the corresponding instruction file.

## Modes

### `assess` — Security Risk Assessment
Triggered by: "assess X for security", "what are the security risks in X", "is this secure", "security review of X"

Read `assess.md` for instructions.

### `checklist` — Secure Development Checklist
Triggered by: "security checklist for X", "secure development checklist for X", "what do I need to implement securely for X"

Read `checklist.md` for instructions.

---

## Knowledge files

| File | When to load |
|---|---|
| `knowledge/owasp-top-10.md` | When assessing security risks — always load for `assess` mode |
| `knowledge/auth-patterns.md` | When the feature involves authentication, sessions, JWT, OAuth, MFA, or identity verification |
| `knowledge/secure-coding.md` | When the question involves input validation, secrets, encryption, dependencies, or general secure coding |
| `knowledge/legislation/owasp-top10-2021.md` | When a more detailed OWASP reference is needed |

---

## General principles

- Cite OWASP categories (e.g. A01:2021 — Broken Access Control) when identifying risks.
- Distinguish between **critical** (fix immediately, blocks launch), **high** (fix before launch), and **medium/low** (fix in next cycle) severity.
- Be concrete: "this endpoint has no authorisation check" not "there may be access control issues".
- For auth questions, recommend using proven libraries (Supabase Auth, Auth0) over rolling your own.
- For secrets questions: the answer is almost always "use a secrets manager / environment variables; never commit to git".
- Don't just flag problems — give actionable mitigations for each one.
