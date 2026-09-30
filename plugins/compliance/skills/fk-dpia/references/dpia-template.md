# DPIA Document Template

Use this template exactly. Populate from codebase discovery and user answers. Where
information is incomplete, note it with [NEEDS CONFIRMATION: what is needed and why].

---

```markdown
# Data Protection Impact Assessment (DPIA)

**Organisation**: [name]
**Date**: [date]
**Prepared by**: [name / team]
**Reviewed by**: [DPO / legal / name — or "DPO review pending"]
**Review date**: [12 months from date, or earlier if processing changes]

**DPIA trigger**: [State which of the nine WP29 criteria triggered this assessment —
e.g. "Evaluation/scoring (criterion 1) and Large-scale processing (criterion 5)"]

---

## 1. Description of the processing

### 1.1 Purpose and context

[Describe what this processing activity does and why. Be specific about the business
purpose — what outcome does the processing achieve, and who benefits?]

### 1.2 Personal data involved

| Data type | Description | Whose data | Source | Sensitivity |
|---|---|---|---|---|
| [e.g. Email address] | [e.g. Used for account login and marketing] | [e.g. Registered users] | [e.g. Provided at sign-up] | [e.g. Standard] |
| [e.g. Browsing history] | [e.g. Pages viewed, time on page, clicks] | [e.g. Registered users] | [e.g. Collected via frontend tracking] | [e.g. Behavioural — higher sensitivity] |

### 1.3 Processing operations

[Describe the sequence of processing: how data is collected, stored, used, shared, and
deleted. Include: who accesses it internally, which third-party processors receive it,
and what automated processing occurs.]

### 1.4 Assets involved

| Asset | Type | Description |
|---|---|---|
| [e.g. User database] | [Database] | [e.g. PostgreSQL on AWS RDS, EU-West region] |
| [e.g. Analytics pipeline] | [Third-party service] | [e.g. Segment → Mixpanel] |

### 1.5 Data subjects and scale

- **Who**: [describe the data subjects — consumers, employees, children, vulnerable groups]
- **Number**: [approximate number of data subjects, or range if unknown]
- **Geography**: [UK, EU member states, or wider — relevant for supervisory authority]
- **Vulnerable groups**: [note if any data subjects are children, patients, employees, or otherwise vulnerable]

### 1.6 Retention

[How long is this data retained? Note if retention differs by data type or purpose.
If not defined, note it as a gap to resolve.]

### 1.7 Lawful basis

**Lawful basis (Article 6)**: [Consent / Contract / Legal obligation / Vital interests /
Public task / Legitimate interests — cite the specific sub-article, e.g. Article 6(1)(b)]

[If legitimate interests: note that an LIA should accompany this DPIA, or include the LIA
conclusion here.]

[If special category data (Article 9): state the additional condition relied upon.]

---

## 2. Necessity and proportionality

### 2.1 Why this processing is necessary

[Explain why the processing is needed to achieve the stated purpose. Could the purpose
be achieved with less data, or with less intrusive processing? If alternatives were
considered and rejected, say why.]

### 2.2 Data minimisation and purpose limitation

[Describe the measures in place to ensure only necessary data is collected and used
only for the stated purpose. Include: what data is not collected, what access controls
exist, whether data is pseudonymised or anonymised at any stage.]

### 2.3 Data subject rights

Confirm how each right is implemented:

| Right | Article | Implementation |
|---|---|---|
| Right to be informed | 13/14 | [e.g. Privacy notice updated — link or status] |
| Right of access | 15 | [e.g. Self-serve export in account settings] |
| Right to erasure | 17 | [e.g. Account deletion triggers cascade delete] |
| Right to portability | 20 | [e.g. JSON export available] |
| Right to object | 21 | [e.g. Opt-out available in account settings] |
| Right to restrict processing | 18 | [e.g. Support ticket process — SLA: X days] |
| Right to rectification | 16 | [e.g. User can edit profile data directly] |
| Automated decision rights | 22 | [e.g. No automated decisions / human review available] |

### 2.4 International transfers

[Are any transfers made outside the UK or EEA? If yes, state the transfer mechanism —
adequacy decision, standard contractual clauses, binding corporate rules, or other.]

---

## 3. Risk assessment

For each risk, assess: **likelihood** (low / medium / high) and **severity** (low / medium / high).
Residual risk = likelihood × severity after mitigation measures are applied.

### Risk 1: [name — e.g. Unauthorised access to personal data]

**Description**: [Describe the threat scenario concretely — e.g. "A breach of the user
database would expose email addresses, hashed passwords, and browsing history for all
registered users."]

**Likelihood (inherent)**: [Low / Medium / High] — [brief reason]

**Severity**: [Low / Medium / High] — [brief reason, including realistic harms to data
subjects: financial loss, discrimination, embarrassment, loss of control over data,
physical harm, etc.]

**Mitigation measures**:
- [Specific measure and how it reduces likelihood or severity]
- [e.g. "AES-256 encryption at rest reduces severity: stolen data is not immediately
  usable without the decryption key"]

**Residual likelihood**: [Low / Medium / High]
**Residual severity**: [Low / Medium / High]
**Residual risk level**: [Low / Medium / High]

---

### Risk 2: [name — e.g. Profiling producing inaccurate or discriminatory outcomes]

**Description**: [...]

**Likelihood (inherent)**: [...]
**Severity**: [...]

**Mitigation measures**:
- [...]

**Residual likelihood**: [...]
**Residual severity**: [...]
**Residual risk level**: [...]

---

[Add further risks as needed. Common risks depending on the processing type:
- Unauthorised access / data breach
- Inaccurate profiling or automated decision-making
- Scope creep / secondary use beyond stated purpose
- Data subject unable to exercise rights
- Third-party processor incident
- Retention beyond what is necessary
- Special category data exposure
- Children's data misuse]

### Overall residual risk

**Overall residual risk level**: [Low / Medium / High]

[Summarise the combined picture — does the set of measures reduce risks to an acceptable
level? Are any risks that could not be fully mitigated?]

---

## 4. Measures to address risks

[List the complete set of technical and organisational measures in place or to be
implemented. Group by type.]

**Technical measures**
- [e.g. Encryption at rest and in transit (TLS 1.2+, AES-256)]
- [e.g. Role-based access control — only X team can access Y data]
- [e.g. Pseudonymisation of analytics events (user ID → opaque token)]
- [e.g. Automated deletion after [X] days via scheduled job]

**Organisational measures**
- [e.g. Staff data protection training — annual, recorded]
- [e.g. DPA with all processors (Article 28)]
- [e.g. Incident response plan with [X]-hour notification SLA]
- [e.g. Privacy notice updated to describe this processing]

**Data subject controls**
- [e.g. Opt-out for [specific processing] in account settings]
- [e.g. Self-service data export and deletion]

---

## 5. Consultation

### 5.1 DPO consultation

[Was the DPO consulted? Record advice given and decisions taken. If no DPO: note
whether one is required (Article 37) and the status.]

### 5.2 Data subject consultation

[Were data subjects or their representatives consulted (Article 35(9))? If yes,
summarise the findings. If not, state the justification — e.g. impracticable,
would compromise confidentiality, or not appropriate given the context.]

---

## 6. Overall outcome

**Residual risk is acceptable**: Yes / No / Conditional

**Legitimate interests / lawful basis confirmed**: Yes / No / [conditions]

**DPIA outcome**: [Processing may proceed / Processing may proceed subject to the
measures in section 4 being implemented / Processing should not proceed until
[condition] is resolved / Prior consultation with supervisory authority required]

---

## 7. Prior consultation

**Prior consultation required** (Article 36(1)): Yes / No

[If yes: the controller must consult the ICO (UK) or lead DPA (EU) before the processing
begins. The full DPIA must be provided to the authority. The authority has 8 weeks to
respond (extendable to 14 weeks for complex cases).]

[If no: state why residual risks are at an acceptable level.]

---

## 8. Actions

| Action | Owner | Deadline | Status |
|---|---|---|---|
| [e.g. Update privacy notice to describe this processing] | [Team] | [Date] | [To do] |
| [e.g. Implement automated data deletion after 12 months] | [Team] | [Date] | [To do] |
| [e.g. Execute DPA with [processor name]] | [Legal] | [Date] | [To do] |
| [e.g. DPO review of this DPIA] | [DPO] | [Date] | [To do] |

---

## 9. Review triggers

Review this DPIA if any of the following occur:
- The nature, scope, context, or purpose of the processing changes materially
- The user base changes (e.g. begins serving children, new geographies)
- A new third-party processor is introduced
- A data incident occurs affecting this processing activity
- New risks or harms are identified
- Annual review — [date]

---

*This DPIA was prepared in accordance with Article 35 of [UK GDPR / EU Regulation 2016/679]
and the Article 29 Working Party Guidelines on DPIA (WP248 rev.01, October 2017).*

*This document was produced with AI assistance and is for informational purposes only. It does not constitute legal advice. Before relying on this DPIA as a compliance record, have it reviewed by a qualified legal professional with data protection expertise. Laws and regulatory guidance change — verify that this document reflects current requirements at the time of use.*
```
