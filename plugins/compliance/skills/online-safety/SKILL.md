---
name: online-safety
description: >
  Assess features for online safety regulatory risk (UK OSA, EU DSA, UK Children's Code, COPPA),
  generate implementation checklists, conduct Ofcom Children's Risk Assessments (CRA), and check
  product decisions against a project's compliance strategy. Use this skill whenever someone asks
  about online safety compliance, child safety regulations, age assurance requirements, or wants to
  know whether a feature is compliant with the Online Safety Act, Digital Services Act, Children's
  Code, or COPPA. Also triggers on: "assess this feature for online safety", "online safety checklist
  for X", "check this against our online safety strategy", "does this comply with the Children's Code",
  "/compliance:online-safety", "OSA risk for X", "DSA obligations for X", "is this safe for minors",
  "child safety requirements for X", "do a children's risk assessment", "run a CRA", "Ofcom CRA",
  "OSA children's risk assessment", "draft my CRA".
---

# Online Safety Skill

This skill has three modes. Identify which mode the user wants based on their request, then follow the corresponding instruction file.

## Modes

### `assess` — Regulatory Risk Assessment
Triggered by: "assess X for online safety", "what are the OSA/DSA obligations for X", "is this compliant", "what regulations apply to X"

Read `assess.md` for instructions.

### `checklist` — Implementation Checklist
Triggered by: "online safety checklist for X", "what do I need to implement for X to be compliant", "checklist for age verification / direct messaging / live video"

Read `checklist.md` for instructions.

### `strategy-check` — Check Against Project Strategy
Triggered by: "check this against our strategy", "does this align with our compliance strategy", "strategy-check: X"

Read `strategy-check.md` for instructions.

### `cra` — Ofcom Children's Risk Assessment
Triggered by: "do a children's risk assessment", "run a CRA for my service", "help me with the OSA children's risk assessment", "I need to do a CRA", "draft my children's risk assessment", "what's my children's risk level under OSA", "Ofcom CRA"

Read `cra.md` for instructions.

---

## Knowledge files

Load the relevant knowledge files based on the feature being assessed. Don't load all of them upfront — use the descriptions below to choose:

| File | When to load |
|---|---|
| `knowledge/regulatory-map.md` | Always — foundational overview of which laws apply where |
| `knowledge/age-assurance-blueprint.md` | When the feature involves age verification, age gating, or minor/adult classification |
| `knowledge/ofcom-childrens-risk-assessment-guidance.md` | When conducting or reviewing a children's risk assessment under UK OSA, understanding Ofcom's four-step methodology, risk levels, significant change triggers, or evidence requirements |
| `knowledge/benchmarks/tiktok-teen-safety.md` | When comparing against industry benchmarks or looking for design inspiration |
| `../../_shared/legislation/uk-online-safety-act-2023.md` | When specific OSA provisions are needed |
| `../../_shared/legislation/uk-childrens-code.md` | When Children's Code standards are directly relevant |
| `../../_shared/legislation/eu-digital-services-act-2022.md` | When EU DSA obligations are the focus |
| `../../_shared/legislation/us-coppa.md` | When US / under-13 obligations are the focus |
| `../../_shared/jurisdiction-map.md` | When the user needs to understand which laws apply to which countries |

---

## General principles

- Be specific about which regulation creates which obligation. Don't say "regulations require X" — say "UK OSA Section Y requires X".
- Distinguish between **mandatory** (you must do this) and **recommended** (strongly advisable but not strictly required by law).
- Flag the risk level prominently. High-risk features (private or direct interactions with minors, age assurance, user-generated content accessible to minors) warrant immediate attention.
- Don't assume the project's jurisdiction — ask if unclear, or note that the assessment assumes UK/EU as primary.
- Where a knowledge file gives a template or checklist, use it directly rather than generating from scratch.
