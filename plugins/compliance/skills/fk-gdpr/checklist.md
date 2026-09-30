# GDPR — Checklist Mode

## Goal
Generate a concrete, tickable GDPR implementation checklist for a given feature or processing activity.

## Steps

1. **Identify the feature** from the user's request. Common types:
   - User registration / account creation
   - Analytics and tracking
   - Marketing and notifications
   - Age verification
   - Video calls or recording
   - Data export / deletion features
   - Third-party integrations

2. **Load relevant knowledge files**:
   - `knowledge/lawful-basis.md` — for lawful basis items
   - `knowledge/data-subject-rights.md` — for rights-related items
   - `knowledge/childrens-data.md` — if children are involved

3. **Adapt the checklist to the specific feature** — be concrete. "Identify the lawful basis for collecting DOB" not "identify a lawful basis".

4. **Mark priority**:
   - 🔴 **REQUIRED** — legal obligation
   - 🟡 **RECOMMENDED** — strongly advisable
   - 🟢 **BEST PRACTICE** — good to have

---

## Output format

```markdown
# GDPR Implementation Checklist: [Feature Name]

> 🔴 REQUIRED | 🟡 RECOMMENDED | 🟢 BEST PRACTICE

---

## Lawful Basis & Documentation

- 🔴 ☐ Identify and document the lawful basis for each processing activity (Art. 6)
- 🔴 ☐ [Feature-specific basis items]

## Privacy Notice & Transparency (Arts. 13–14)

- 🔴 ☐ [Items specific to this feature]

## Data Minimisation (Art. 5(1)(c))

- 🔴 ☐ [Items]

## Retention (Art. 5(1)(e))

- 🔴 ☐ Define retention periods for each data type collected by this feature
- 🔴 ☐ [Feature-specific items]

## Data Subject Rights (Arts. 15–22)

- 🔴 ☐ [Rights that are particularly relevant to this feature]

## Security (Art. 32)

- 🔴 ☐ [Security items specific to the data involved]

## [Children's Data — include only if relevant]

- 🔴 ☐ [Art. 8 items]
- 🔴 ☐ [Children's Code items]

## DPIA (Art. 35) — [include only if required]

- 🔴 ☐ Conduct and document a DPIA before going live
- 🔴 ☐ [Key DPIA areas for this feature]

## Third-Party Processors (Art. 28)

- 🔴 ☐ Identify all third-party processors used by this feature
- 🔴 ☐ Ensure Data Processing Agreements (DPAs) are in place
```

---

## Notes

- Always include a "Lawful Basis & Documentation" section — it's the most commonly missed item.
- If the feature involves any third-party services (analytics, auth, payment, age verification), always include the Art. 28 processor section.
- If children are involved, the Children's Data section is mandatory, not optional.
- Cross-reference with the `fk-online-safety` checklist if the feature also involves child safety concerns — GDPR and online safety obligations often overlap.
