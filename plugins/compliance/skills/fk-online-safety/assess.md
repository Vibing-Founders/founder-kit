# Online Safety — Assess Mode

## Goal
Produce a structured regulatory risk assessment of a feature for online safety compliance. The output should be specific enough that a product team can immediately understand what obligations they have and what to build.

## Steps

1. **Understand the feature** — if the description is vague, ask clarifying questions:
   - Does it involve minors (under-18)?
   - Is it a private or public/group interaction?
   - Does it involve real-time communication (video, audio, text), user-generated content, or direct contact between users?
   - What jurisdictions does the platform operate in?

2. **Load relevant knowledge files** — at minimum load `knowledge/regulatory-map.md`. For features involving age assurance or minor–adult interaction, also load `knowledge/age-assurance-blueprint.md`. Derive the assessment from these files and the shared legislation in `../../_shared/legislation/`.

3. **Produce the assessment** using the output format below.

---

## Output format

```markdown
# Online Safety Risk Assessment: [Feature Name]

## Summary
[1–2 sentence plain-English summary of the risk level and core issue]

---

## Risk Level
**[HIGH / MEDIUM / LOW]**

[Brief justification — what makes this high/medium/low risk]

---

## Applicable Regulations

| Regulation | Applies | Trigger |
|---|---|---|
| UK Online Safety Act 2023 | Yes/No/Conditional | [Why it applies or doesn't] |
| UK Children's Code | Yes/No/Conditional | [Why it applies or doesn't] |
| EU Digital Services Act | Yes/No/Conditional | [Why it applies or doesn't] |
| US COPPA | Yes/No/Conditional | [Why it applies or doesn't] |

---

## Triggered Duties

### Mandatory Requirements (non-negotiable)
[Numbered list of things the platform MUST do, with specific regulation citations]

### Strongly Recommended
[Numbered list of things that are not strictly mandatory but would be expected by regulators]

---

## Required Mitigations
[Specific technical or process controls that must be in place. Be concrete — "implement X" not "consider X".]

## Recommended Mitigations
[Additional controls that would strengthen the compliance position]

---

## What You Must NOT Do
[Red-line list of design patterns that would be non-compliant]

---

## Next Steps
[Suggested immediate actions — e.g., run a DPIA, implement age assurance, consult legal]
```

---

## Risk level guidance

**HIGH**: Feature involves real-time or private communication with minors, direct contact between minors and adults, age-gating of sensitive content, or large-scale collection of children's data. Regulatory scrutiny is likely; a single incident could trigger regulatory action.

**MEDIUM**: Feature involves minors in a lower-risk context (e.g., group interactions with moderation), or involves adults-only content that minors could theoretically access. Requires controls but less immediate regulatory risk.

**LOW**: Feature has minimal child-safety impact — e.g., it's behind a verified-adult gate, or doesn't involve real-time interaction. Standard data protection obligations apply but no heightened online safety risk.
