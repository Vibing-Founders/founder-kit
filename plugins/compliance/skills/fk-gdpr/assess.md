# GDPR — Assess Mode

## Goal
Produce a structured GDPR compliance assessment of a feature or processing activity. The output should clearly identify obligations, recommended lawful bases, and any gaps.

## Steps

1. **Understand the processing activity** — if not clear, ask:
   - What personal data is collected or used?
   - What is the purpose?
   - Who are the data subjects? (users, minors, employees, etc.)
   - Which jurisdiction? (UK, EU, both?)
   - Is any special category data involved? (health, biometrics, etc.)

2. **Load relevant knowledge files** based on the activity:
   - Always load `knowledge/lawful-basis.md`
   - Load `knowledge/childrens-data.md` if under-18 users are involved
   - Load `knowledge/data-subject-rights.md` if the question touches on user rights
   - Load legislation files if specific articles are needed

3. **Produce the assessment** using the output format below.

---

## Output format

```markdown
# GDPR Assessment: [Feature / Activity Name]

## Summary
[1–2 sentences: what data is processed, what the main compliance considerations are]

---

## Data Inventory

| Data Type | Collected | Purpose | Special Category? |
|---|---|---|---|
| [e.g. Email address] | Yes | Account creation | No |
| [e.g. Date of birth] | Yes | Age verification | No |
| [e.g. Selfie for age check] | Yes | Age assurance | Potentially (biometric) |

---

## Recommended Lawful Bases

| Processing Activity | Recommended Basis | Alternative | Notes |
|---|---|---|---|
| [Activity] | [Art. 6(1)(x)] | [Art. 6(1)(y)] | [Why] |

---

## GDPR Obligations

### Required
[Numbered list of things the platform must do, with Article citations]

### Recommended
[Additional steps that would strengthen the compliance position]

---

## Is a DPIA Required?
**[Yes / No / Likely]**

[Reasoning — which Art. 35 trigger applies, or why it doesn't]

If yes, key areas to cover in the DPIA:
- [Area 1]
- [Area 2]

---

## Children's Data Considerations
[Only include if children are involved. Flag Article 8 obligations, Children's Code implications, relevant age thresholds]

---

## Data Subject Rights Impact
[Which rights are most relevant to this feature and how they should be handled]

---

## Gaps / Risks
[Specific GDPR compliance gaps identified, with severity]
```

---

## Guidance on common scenarios

**"Can we rely on legitimate interests for X?"**
Apply the three-part LI test from `knowledge/lawful-basis.md`: purpose test → necessity test → balancing test. For children's data, note that the balancing test tips heavily toward the child's interests.

**"Do we need consent for X?"**
Consent is rarely the right answer for core features. Check whether contract or LI applies first. If the user insists on consent, ensure it meets the validity requirements (freely given, specific, informed, unambiguous, withdrawable).

**"Do we need a DPIA?"**
Art. 35 requires a DPIA when processing is likely to result in high risk. Automatic triggers: systematic profiling, large-scale special category data, systematic monitoring. For services involving minors + real-time comms: almost certainly yes.
