# Adding and Updating Legislation

This guide explains how to manually add a new act or law — or update existing legislation — in the compliance plugin. For a guided, step-by-step workflow, use the maintainer skills:

- `/add-legislation` — guided flow for sourcing and adding new legislation
- `/update-legislation` — guided flow for amending existing legislation

---

## Where legislation files live

### Shared legislation

**Path:** `plugins/compliance/skills/_shared/legislation/`

Use shared placement when the act applies across **multiple skill areas** (e.g. GDPR affects both the `gdpr` and `online-safety` skills).

Existing shared files:
- `eu-digital-services-act-2022.md`
- `eu-gdpr.md`
- `uk-childrens-code.md`
- `uk-gdpr.md`
- `uk-online-safety-act-2023.md`
- `us-coppa.md`

### Skill-specific legislation

**Path:** `plugins/compliance/skills/<skill-name>/knowledge/legislation/`

Use skill-specific placement when the act has **narrow scope** relevant to only one skill area.

Example: `plugins/compliance/skills/application-security/knowledge/legislation/owasp-top10-2021.md`

### Decision guide

Ask: "Does this legislation affect compliance obligations in more than one skill area?"

- **Yes** → `_shared/legislation/`
- **No** → `<skill>/knowledge/legislation/`

---

## Markdown format for legislation files

Use existing files as templates. The structure is:

```markdown
# [Act Name] ([Year])

**Jurisdiction:** [UK / EU / US / etc.]
**Official source:** [URL to official text]
**Status:** [In force / Partially in force / Pending commencement]
**Relevant to:** [List of skill areas: online-safety, gdpr, application-security]

## Overview

[2–4 sentence summary of what the act covers and who it applies to.]

## Key provisions

### [Provision name]
[Plain-English explanation of what the provision requires.]

### [Provision name]
[Plain-English explanation.]

## Who it applies to

[Description of which platforms or services are in scope, including thresholds if relevant.]

## Penalties

[Maximum fines, enforcement body, and any notable enforcement precedents.]

## Applicability checklist

- [ ] [Condition 1]
- [ ] [Condition 2]

## Practical guidance

[What a platform builder should do to comply. Actionable steps.]

## Key dates

| Date | Event |
|------|-------|
| [Date] | [Milestone] |
```

---

## Official sources by jurisdiction

| Jurisdiction | Source | URL |
|---|---|---|
| UK | legislation.gov.uk | https://www.legislation.gov.uk |
| UK regulator (ICO) | ico.org.uk | https://ico.org.uk |
| UK regulator (Ofcom) | ofcom.org.uk | https://www.ofcom.org.uk |
| EU | EUR-Lex | https://eur-lex.europa.eu |
| EU regulator (EDPB) | edpb.europa.eu | https://edpb.europa.eu |
| US federal | ftc.gov | https://www.ftc.gov |
| US (COPPA) | ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa | |
| International | OECD | https://www.oecd.org |

Always link to the **official source** (not a summary site). Include the section number when citing a specific provision.

---

## Files to update after adding legislation

When you add or significantly update a legislation file, check whether these files need updating:

1. **`plugins/compliance/skills/_shared/jurisdiction-map.md`**
   - Add the jurisdiction and act to the map if not already present
   - Update which skill areas it affects

2. **`plugins/compliance/skills/online-safety/knowledge/regulatory-map.md`** (if online-safety-relevant)
   - Add the act to the regulatory map with applicability thresholds

3. **Relevant `SKILL.md` context sections**
   - If the skill's system prompt references covered legislation, add the new act

4. **`README.md` plugin description**
   - If adding a major new act, add it to the compliance plugin's coverage list

---

## Updating existing legislation

When a law is amended:

1. Locate the existing file (see paths above)
2. Add an **Amendments** section at the top (below the header metadata) noting what changed and the amendment date
3. Update the affected provisions in place
4. Re-check the files listed above for any cascading updates

```markdown
## Amendments

| Date | Change |
|------|--------|
| 2024-01-15 | Section 40 commencement date confirmed |
```

---

## Verification

After adding or updating legislation, test that the affected skills give correct answers:

1. Install the plugin locally: `/plugin add compliance` (pointing at local path)
2. Ask 3 compliance questions that the new legislation should answer
3. Verify responses include accurate citations to the legislation
4. Correct any gaps or inaccuracies in the legislation file
