# Online Safety — Checklist Mode

## Goal
Generate a concrete, tickable implementation checklist for a given feature type. The checklist should be something a product team or engineer can work through directly.

## Steps

1. **Identify the feature type** from the user's request. Common types:
   - Age verification / age assurance system
   - User registration (with age collection)
   - Private or direct interactions between users (messaging, video, live sessions)
   - Live streaming / broadcast
   - Content moderation system
   - User-generated content

2. **Load the relevant knowledge**:
   - For age assurance: load `knowledge/age-assurance-blueprint.md`
   - For all feature types: derive requirements from `knowledge/regulatory-map.md` and `../../_shared/legislation/` files — generate the checklist from first principles based on the feature's risk profile

3. **Adapt the checklist to the specific feature** — don't just paste the knowledge file verbatim. Customise items to the user's context where they've given details.

4. **Mark priority** on each item:
   - 🔴 **MANDATORY** — legal requirement, must ship with this
   - 🟡 **STRONGLY RECOMMENDED** — expected by regulators, high risk to skip
   - 🟢 **BEST PRACTICE** — good to have, lower immediate risk

---

## Output format

```markdown
# Online Safety Implementation Checklist: [Feature Name]

> Use this checklist to implement [feature name] in compliance with UK OSA, UK Children's Code, EU DSA, and US COPPA.
>
> 🔴 MANDATORY | 🟡 STRONGLY RECOMMENDED | 🟢 BEST PRACTICE

---

## [Domain 1 — e.g., Age Assurance]

- 🔴 ☐ [Item]
- 🔴 ☐ [Item]
- 🟡 ☐ [Item]
- 🟢 ☐ [Item]

## [Domain 2 — e.g., In-Call Safety]
...

## [Domain N — e.g., Governance & Documentation]
...

---

## Must-NOTs (Red Lines)

- ⛔ [Thing you must not do]
- ⛔ [Thing you must not do]
```

---

## Notes

- Ground items in specific regulations where helpful (e.g., "Required under UK OSA children's safety duty").
- If the user hasn't specified their jurisdiction, default to UK + EU as primary, US as secondary.
- If the feature involves 13–17 year olds AND adults interacting, apply the highest standard across all items.
- Use the checklist files in `knowledge/` as the source of truth for specific items — don't invent requirements that aren't grounded in the knowledge files or legislation.
