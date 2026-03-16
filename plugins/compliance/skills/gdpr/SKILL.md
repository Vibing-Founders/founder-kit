---
name: gdpr
description: >
  Assess features for GDPR compliance (UK GDPR and EU GDPR), identify the correct lawful basis
  for data processing activities, run or document a Legitimate Interests Assessment (LIA), generate
  GDPR implementation checklists, and advise on children's data obligations. Use this skill whenever
  someone asks about GDPR compliance, lawful basis for processing, data subject rights, DPIAs,
  consent requirements, children's data under GDPR, Article 8 obligations, or legitimate interests.
  Triggers on: "assess this for GDPR", "what's the lawful basis for X", "GDPR checklist for X",
  "do we need a DPIA for this", "is this GDPR compliant", "data subject rights for X", "can we
  rely on legitimate interests for X", "help me do an LIA", "legitimate interests assessment for X",
  "GDPR obligations for X", "/compliance:gdpr", "UK GDPR", "EU GDPR", "ICO obligations".
---

# GDPR Skill

This skill has two modes. Identify which mode the user wants based on their request, then follow the corresponding instruction file.

## Modes

### `assess` — GDPR Compliance Assessment
Triggered by: "assess X for GDPR", "what are our GDPR obligations for X", "is this GDPR compliant", "what's the lawful basis for X", "do we need a DPIA for X"

Read `assess.md` for instructions.

### `checklist` — GDPR Implementation Checklist
Triggered by: "GDPR checklist for X", "what do I need to implement for GDPR compliance", "GDPR requirements for X feature"

Read `checklist.md` for instructions.

### `lia` — Legitimate Interests Assessment
Triggered by: "run an LIA for X", "help me do a legitimate interests assessment", "document our legitimate interests basis", "can we rely on LI for X", "legitimate interests assessment for X", "do an LIA"

Read `lia.md` for instructions.

---

## Knowledge files

| File | When to load |
|---|---|
| `knowledge/lawful-basis.md` | When the question involves lawful basis for processing, or whether to rely on consent vs contract vs LI |
| `knowledge/legitimate-interests-assessment.md` | When the user needs to document a legitimate interests basis, run an LIA, or understand the three-part test in detail |
| `knowledge/dpia.md` | When the question involves whether a DPIA is required, how to carry one out, the nine high-risk criteria, prior consultation, or DPIA methodology |
| `knowledge/data-subject-rights.md` | When the question involves subject access requests, erasure, portability, or other data subject rights |
| `knowledge/childrens-data.md` | When the feature involves under-18 users, Article 8 consent, the Children's Code, or age-of-digital-consent |
| `../../_shared/legislation/uk-gdpr.md` | When specific UK GDPR articles are needed |
| `../../_shared/legislation/eu-gdpr.md` | When specific EU GDPR articles are needed, or EU member state differences matter |
| `../../_shared/jurisdiction-map.md` | When jurisdiction-specific thresholds (e.g. age of consent by country) are relevant |

---

## General principles

- Always distinguish between UK GDPR and EU GDPR when they differ (they do on fines, DPO thresholds, and some Article 8 details).
- Be specific about Articles — "Article 6(1)(f)" not "legitimate interests".
- For lawful basis questions: don't default to consent. Walk through whether contract or legitimate interests could apply first.
- For children's data: load `knowledge/childrens-data.md` even if the user doesn't mention it explicitly — it's frequently relevant for platforms with under-18 users.
- Flag when a DPIA is required — this is a common gap.
