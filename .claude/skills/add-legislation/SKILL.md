---
name: add-legislation
description: >
  Use this skill when the user wants to add a new law, act, or regulation to the compliance plugin.
  Triggers on: "add new law", "add act", "add regulation", "add legislation", "add a new act",
  "add [act name]", "include [regulation]", "cover [legislation]".
---

# Add Legislation

You are helping a maintainer add a new act, law, or regulation to the founder-kit compliance plugin. Work through each step in order, asking for confirmation before proceeding to the next.

---

## Step 1: Source

Identify the official text of the legislation.

Ask the maintainer:
- What is the full name and year of the act? (e.g. "UK Online Safety Act 2023")
- What jurisdiction does it fall under? (UK, EU, US federal, US state, other)
- Do they have a link to the official text, or should you find it?

**Official source URLs by jurisdiction:**
- UK: https://www.legislation.gov.uk
- UK ICO guidance: https://ico.org.uk
- UK Ofcom guidance: https://www.ofcom.org.uk
- EU: https://eur-lex.europa.eu
- EU EDPB: https://edpb.europa.eu
- US FTC / COPPA: https://www.ftc.gov
- Australia: https://www.legislation.gov.au
- Canada: https://laws-lois.justice.gc.ca

Fetch the official source using WebFetch. Read the full act or at minimum: the purpose/overview section, scope/applicability provisions, key obligations, and penalty provisions.

---

## Step 2: Scope

Decide where the file should live:

**Shared** (`plugins/compliance/skills/_shared/legislation/`):
- The act affects obligations in **more than one skill area** (fk-online-safety, fk-gdpr, fk-application-security)
- Examples: GDPR (affects fk-gdpr + fk-online-safety), UK Online Safety Act (affects fk-online-safety + fk-gdpr)

**Skill-specific** (`plugins/compliance/skills/<skill>/knowledge/legislation/`):
- The act has narrow scope relevant to only one skill area
- Examples: OWASP Top 10 (fk-application-security only)

Ask the maintainer to confirm placement, explaining your reasoning.

---

## Step 3: Convert

Transform the act text into a structured markdown file using this template:

```markdown
# [Act Name] ([Year])

**Jurisdiction:** [UK / EU / US / etc.]
**Official source:** [URL]
**Status:** [In force / Partially in force / Pending commencement]
**Relevant to:** [fk-online-safety, fk-gdpr, fk-application-security — list which apply]

## Overview

[2–4 sentences: what the act covers, who it applies to, enforcement body]

## Key provisions

### [Provision name]
[Plain-English explanation. Include section numbers for citations.]

### [Provision name]
[Plain-English explanation.]

## Who it applies to

[Which platforms/services are in scope. Include any thresholds: user numbers, revenue, geography.]

## Penalties

[Maximum fines, enforcement body, criminal liability if any, notable enforcement cases]

## Applicability checklist

- [ ] [Condition that puts a platform in scope]
- [ ] [Condition]

## Practical guidance

[Actionable steps for a platform builder to achieve compliance]

## Key dates

| Date | Event |
|------|-------|
| [Date] | [Commencement / enforcement milestone] |
```

Prioritise accuracy over comprehensiveness. Every substantive claim should be traceable to a specific section of the official text.

---

## Step 4: Place

Write the file to the confirmed path. Use a filename in the format:
- `<jurisdiction>-<act-name-kebab-case>-<year>.md`
- Examples: `uk-online-safety-act-2023.md`, `eu-ai-act-2024.md`, `us-children-safety-act-2024.md`

---

## Step 5: Update cross-references

After writing the file, update these files as needed:

**Always check:**
1. `plugins/compliance/skills/_shared/jurisdiction-map.md`
   — Add the new act and which skill areas it affects

**If online-safety-relevant:**
2. `plugins/compliance/skills/fk-online-safety/knowledge/regulatory-map.md`
   — Add the act with applicability thresholds and enforcement body

**If the act is significant coverage (major new jurisdiction or regulatory regime):**
3. `plugins/compliance/skills/fk-online-safety/SKILL.md` or `plugins/compliance/skills/fk-gdpr/SKILL.md` or `plugins/compliance/skills/fk-application-security/SKILL.md`
   — Add the act to the skill's context/coverage description
4. `README.md`
   — Add to the compliance plugin's coverage list

Read each file before editing it.

---

## Step 6: Eval

Verify the new legislation is correctly integrated:

1. Ask the maintainer: "What are 3 compliance questions a platform builder might ask that this legislation should answer?"
2. Simulate answering each question as if you were the compliance skill, citing the new legislation file
3. Identify any gaps — provisions not covered, edge cases not addressed, or incorrect information
4. Fix gaps by updating the legislation file

Example eval questions for a children's safety act:
- "Does this apply to my app if I don't target children but some might use it?"
- "What age verification does this require?"
- "What are the fines if I don't comply?"

---

## Done

Confirm with the maintainer:
- File written to: `[path]`
- Cross-references updated: `[list of files updated]`
- Eval: [summary of 3 questions and whether answers were correct]
- Suggested next step: run `/update-legislation` if any existing files need updating to reference this act
