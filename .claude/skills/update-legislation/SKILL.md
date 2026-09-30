---
name: update-legislation
description: >
  Use this skill when a law has been amended, updated, or new guidance has been issued for existing legislation.
  Triggers on: "update act", "legislation changed", "law amended", "update regulation", "amend legislation",
  "new guidance on", "[act name] has been updated", "[act name] amendment", "commencement order",
  "update [law name]", "the rules changed".
---

# Update Legislation

You are helping a maintainer update an existing legislation file in the founder-kit compliance plugin. Work through each step in order.

---

## Step 1: Locate

Find the existing file(s) that need updating.

Ask the maintainer:
- Which act or regulation has changed?
- What changed? (amendment, commencement order, new regulatory guidance, updated penalties, new secondary legislation)
- Do they have a link to the amendment or updated guidance?

Search for the existing file:
- Shared legislation: `plugins/compliance/skills/_shared/legislation/`
- Skill-specific: `plugins/compliance/skills/*/knowledge/legislation/`
- Also check: knowledge files that summarise or reference the act (e.g. `regulatory-map.md`, `jurisdiction-map.md`)

Read the existing file before making any changes.

---

## Step 2: Diff

Understand exactly what changed in the law.

Fetch the official amendment source. Compare with the existing file and produce a diff summary:

```
Changed:
- Section X: [old text/interpretation] → [new text/interpretation]

Added:
- Section Y: [new provision summary]

Removed / no longer in force:
- Section Z: [what was removed]

Status change:
- [e.g. "Section 40 (age assurance) now in force from 2025-01-01"]
```

Present this diff to the maintainer for confirmation before making changes.

---

## Step 3: Update

Make the changes to the legislation file:

1. Add or update the **Amendments** section at the top of the file (below the metadata header, above the Overview):

```markdown
## Amendments

| Date | Change | Source |
|------|--------|--------|
| [ISO date] | [Plain-English description of what changed] | [URL to amendment] |
```

2. Update the affected provisions in the body of the file — edit in place rather than appending, so the file remains a single coherent document

3. Update the **Status** field in the header metadata if commencement status changed

4. Update the **Key dates** table if new milestones were added

5. If penalties changed, update the **Penalties** section

---

## Step 4: Check cascades

After updating the legislation file, check whether the change cascades to other files:

**Check these files for stale references:**

1. `plugins/compliance/skills/_shared/jurisdiction-map.md`
   — Does the jurisdiction map still accurately describe this act's scope?

2. `plugins/compliance/skills/fk-online-safety/knowledge/regulatory-map.md` (if online-safety-relevant)
   — Does the regulatory map still accurately reflect applicability thresholds and enforcement dates?

3. Relevant `SKILL.md` files
   — If the skill prompt mentions specific provisions, dates, or thresholds from this act, do they need updating?

4. Other knowledge files that cite this act
   - Run: Grep for the act name across `plugins/compliance/skills/`
   - Read any files with references and check if the citation is still accurate

Read each file before deciding whether it needs updating. Only edit if the change is material.

---

## Step 5: Eval

Verify the update is correct and the compliance skill still gives accurate answers:

1. Identify the provisions that changed
2. For each significant change, construct a compliance question a platform builder would ask
3. Simulate answering that question as the compliance skill, using the updated file
4. Verify the answer:
   - Reflects the updated law (not the old version)
   - Cites the correct section
   - Is practically actionable

Example: if the age assurance provisions of the UK Online Safety Act came into force:
- Q: "Is age verification required on my platform under the UK Online Safety Act?"
- Expected: "Yes, from [date], platforms [in scope criteria] are required to [specific obligation] under Section [X]."

Fix any inaccuracies before finishing.

---

## Done

Confirm with the maintainer:
- File updated: `[path]`
- Amendment recorded: `[summary of change + date]`
- Cascades checked: `[list of other files checked and whether they were updated]`
- Eval: `[summary — questions tested, answers correct Y/N, any fixes made]`
