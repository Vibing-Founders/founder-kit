# Online Safety — Strategy-Check Mode

## Goal
Check a specific product decision against the project's own compliance strategy document and give a clear verdict: does the decision align, partially align, or conflict with the strategy? If it conflicts, say so plainly and suggest how to resolve it.

## Steps

1. **Read the project's compliance strategy** at `docs/compliance-strategy.md`. If the file doesn't exist or can't be found, tell the user and offer to do a general regulatory assessment instead (using assess mode).

2. **Understand the product decision** being checked. If it's vague, ask:
   - What is being changed or decided?
   - Which user group does it affect (under-13, 13–15, 16–17, 18+)?
   - Which feature does it apply to (registration, direct messaging, live video, content, age assurance, etc.)?

3. **Compare** the decision against the relevant sections of the strategy. Pay attention to:
   - Age band policies (section 4 of the strategy)
   - Feature-specific requirements (section 5)
   - Platform-wide compliance principles (section 3)
   - Any "decided" vs "open question" items in the strategy

4. **Produce the verdict** using the output format below.

---

## Output format

```markdown
# Strategy Check: [Decision Being Checked]

## Verdict: [ALIGNED / PARTIAL / CONFLICT]

---

## What Aligns
[Specific points where the decision is consistent with the strategy. Quote or reference relevant strategy sections.]

---

## What Conflicts or Is Missing
[Specific points where the decision contradicts the strategy, or where the strategy doesn't address this situation and needs to. Be direct — if it's a conflict, call it a conflict.]

---

## Recommended Action

**If ALIGNED**: [Confirm it's clear to proceed; note any minor caveats]

**If PARTIAL**: [What needs to be changed or clarified before proceeding]

**If CONFLICT**: [What the decision would need to change to align with strategy, OR alternatively, whether the strategy should be updated to reflect a legitimate change in direction — with the implications spelled out]

---

## Does the Strategy Need Updating?
[Yes / No / Maybe — with brief reasoning. If yes, suggest what section should be updated and what it should say.]
```

---

## Notes

- Be direct about conflicts. Don't soften a conflict into a "consideration". The point of this mode is to flag problems before they become real.
- The strategy is a living document — it's valid to conclude that the strategy should be updated to reflect a legitimate product evolution. But spell out the regulatory implications of that update.
- If the strategy has "open questions" (section 7) that are relevant to the decision being checked, flag them explicitly — the decision may be premature if it depends on unresolved strategic questions.
- If the decision affects under-13 access, direct or private interactions with minors, or content that could be seen by under-18s, apply extra scrutiny — these are the highest-risk areas in the strategy.
