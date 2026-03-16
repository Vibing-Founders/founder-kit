# Legitimate Interests Assessment (LIA)

> **Source**: ICO, *How do we apply legitimate interests in practice?*
> https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/legitimate-interests/how-do-we-apply-legitimate-interests-in-practice/

A Legitimate Interests Assessment (LIA) is a light-touch risk assessment you complete when relying on legitimate interests (Article 6(1)(f)) as your lawful basis. It documents the three-part test and provides evidence that you've properly considered whether your interests are overridden by the data subject's rights.

---

## Why do one?

An LIA is not strictly mandatory under UK GDPR, but the ICO is clear: it is best practice, and it is difficult to meet your obligations under the accountability principle (Article 5(2)) without it. If Ofcom or the ICO ever investigates your data processing, a completed LIA is your primary evidence that you applied the legitimate interests basis properly.

---

## The three-part test

Work through all three parts in sequence. If you fail any part, you cannot rely on legitimate interests for that processing activity.

---

### Part 1 — Purpose test: Is there a genuine legitimate interest?

Identify why you want to process the data and whether that purpose is legitimate.

**Questions to answer:**
- Why are you processing this data, and what benefit does it produce?
- How important are those benefits — are they significant and proportionate, or minor and convenient?
- Does the processing benefit third parties or the public, beyond just your organisation?
- What would happen if you didn't do this processing?
- Is the purpose compliant with relevant laws and ethical standards?
- Does the processing comply with any other applicable laws (e.g. PECR for electronic marketing or tracking, profiling rules)? Legitimate interests cannot rescue processing that is unlawful under another regime.
- Are there relevant industry guidelines, codes of practice, or ethical concerns?

**What counts as a legitimate interest:**
- Commercial interests (operating your business, preventing fraud, ensuring security)
- Organisational interests (staff administration, IT operations, legal defence)
- Third-party interests (sharing data to protect a third party from harm)
- Broader public interests (safety, crime prevention)

**What does not count on its own:**
Marketing, intra-group data transfers, and other activities that primarily benefit your organisation require a more detailed LIA — the interest being commercial does not make it illegitimate, but requires more careful balancing.

---

### Part 2 — Necessity test: Is the processing necessary for that purpose?

The processing must be a targeted, proportionate way of achieving the purpose. "Necessary" does not mean strictly indispensable, but it must be more than merely convenient.

**Questions to answer:**
- Does this processing actually achieve your stated purpose?
- Could you achieve the same purpose with less data, or by processing it differently?
- Could you use less intrusive means that are reasonably practicable?

**Be honest:** If a less privacy-intrusive alternative would work just as well, you cannot pass the necessity test by simply preferring the more intrusive option.

---

### Part 3 — Balancing test: Do the data subject's interests override yours?

This is the most complex part. You must weigh your legitimate interest against the impact on the data subject's privacy and rights.

**Minimum factors to consider:**

**Nature of the data**
- Is it special category data (health, biometrics, religion, sexuality, etc.)? Higher bar.
- Is it financial, location, or behavioural data? Higher bar.
- Is it children's data? The balancing test tips significantly in children's favour — see below.
- Are data subjects acting in a **personal capacity** (consumer, citizen) or a **professional capacity** (employee acting on behalf of their employer)? Processing business contact data in a B2B context tends to tip the balance in the controller's favour; consumer data typically tilts the other way.
- Is it general, less sensitive professional or contact data? Lower impact concern.

**Reasonable expectations**
An objective test applies: would a reasonable person in the data subject's position expect this processing, given the context? Consider:
- The nature of your relationship with the data subject (existing customer, new contact, employee)
- How and where the data was collected, and what you told them at that point
- If the data came from a third party rather than directly from the individual, whether the processing is consistent with the context in which it was originally shared
- Whether time has passed since the data was collected and circumstances may have changed
- Whether the processing is new or innovative — individuals are unlikely to anticipate novel uses of their data, which tips the balance against the controller
- Whether you've processed data in this way before without objection
- What is standard or known practice in your sector

If the purpose or method of processing is not immediately obvious, you should conduct research (user testing, consultation) to demonstrate what expectations are reasonable. Evidence of expectation is stronger than absence of objection.

**Impact on the data subject**
Assess the realistic harms the processing could cause:
- Loss of control over their personal data
- Barriers to exercising their rights
- Financial harm (e.g. if the data is used for profiling that affects credit or pricing)
- Discrimination or differential treatment
- Reputational damage or embarrassment
- Physical or emotional harm
- Being unable to access a service

Also consider: how likely are individuals to object if they found out about this processing? A useful test: **would you be happy to explain this processing openly to the people whose data you're using?** If not — if you would be reluctant to describe it honestly — that is a strong signal the balance tips against you.

**Safeguards that can shift the balance in your favour:**
- Providing a clear, accessible opt-out (Right to Object under Article 21)
- Robust data minimisation and pseudonymisation
- Short retention periods
- Restricted internal access
- Transparency about the processing in your privacy notice
- A DPIA where risks are high

---

## Balancing test: children

If the processing involves children's data, the balancing test is weighted against you. The ICO's guidance is explicit:

- Children's interests, rights, and wellbeing carry more weight in the balance
- The power imbalance between a child and an organisation tips the scales
- Processing that would pass the balancing test for adults may fail for children
- **Behavioural advertising, profiling, and non-essential tracking will generally fail the balancing test for children** — use Consent instead, or reconsider whether to process at all
- Safeguarding, safety logging, and incident response for children's services often pass the test when appropriate safeguards are in place

---

## Documenting the LIA

Record all of the following:
- The specific processing activity
- The legitimate interest identified (Part 1)
- Why it is necessary (Part 2)
- The balancing factors considered — both those that support and those that oppose the conclusion (Part 3)
- The outcome: whether legitimate interests is appropriate for this activity
- Any safeguards you are putting in place to mitigate risk to data subjects

The ICO is clear that this is not a mathematical exercise — there is an element of judgement — but you should be as objective as possible and record your reasoning honestly, including factors that weigh against you.

---

## When an LIA triggers a DPIA

If your LIA reveals high risks to individuals — for example, large-scale profiling, processing of special category data, or systematic monitoring — you are likely required to conduct a **Data Protection Impact Assessment (DPIA)** under Article 35 before starting the processing.

An LIA is simpler and covers any legitimate interests processing. A DPIA is more detailed, involves consultation with your DPO (if you have one), and may require prior consultation with the ICO in very high-risk cases.

---

## When to review your LIA

Review your LIA:
- When the purpose or nature of the processing changes
- When the context around the processing changes (new technology, new user base, new risks)
- When you become aware of increased impact on data subjects
- At regular intervals as part of your accountability programme (at least annually for high-risk processing)

If the circumstances change so that your interests are now overridden, you must stop relying on legitimate interests and either find another lawful basis or stop the processing.

---

## Quick LIA template

Use this to document a specific processing activity:

```
Processing activity: [e.g. "Fraud detection — IP address logging and device fingerprinting"]
Completed by: [Name / role]
Date: [Date]

Part 1 — Purpose test
Legitimate interest: [What is the interest? Who benefits?]
Importance of benefits: [Why significant and proportionate?]
Other law compliance: [PECR, profiling rules, sector regulation — any issues?]
Industry guidelines / ethics: [Relevant codes or concerns]
Assessment: Pass / Fail / Uncertain

Part 2 — Necessity test
Why necessary: [Why is this the right approach?]
Alternatives considered: [What alternatives were evaluated and why rejected?]
Assessment: Pass / Fail / Uncertain

Part 3 — Balancing test
Nature of data: [Sensitive? Special category? Children's? Personal or professional capacity?]
Reasonable expectations: [Relationship, how collected, third-party source, age of data, novel processing?]
Potential impact: [Realistic harms — include likelihood of objection and transparency test]
Safeguards in place: [What reduces the impact?]
Assessment: Balance tips in favour of controller / Balance tips in favour of data subject

Outcome: Legitimate interests [appropriate / not appropriate] for this activity
Safeguards to implement: [List]
Privacy notice updated: Yes / No / To do
Review date: [Date]
```
