# UK GDPR (General Data Protection Regulation — UK retained law)
> **Source**: https://www.legislation.gov.uk/eur/2016/679/contents (as retained and amended by the Data Protection, Privacy and Electronic Communications (Amendments etc) (EU Exit) Regulations 2019); read alongside the Data Protection Act 2018
> **Compiled**: From training knowledge (August 2025 cutoff) — verify against current official text
> **Enforcement body**: Information Commissioner's Office (ICO)
> **Scope**: Processing of personal data of individuals in the UK, or by UK-established controllers/processors; extraterritorial reach where processing relates to offering goods/services to UK individuals or monitoring behaviour in the UK

## Quick Reference

| Threshold / Penalty | Detail |
|---|---|
| Maximum fine (Tier 1) | £17.5 million or 4% of global annual turnover (whichever is higher) — for most serious violations |
| Maximum fine (Tier 2) | £8.75 million or 2% of global annual turnover (whichever is higher) |
| Age of digital consent (UK) | 13 years (set by s.9 DPA 2018) |
| DPIA required | When processing is high risk (profiling, systematic monitoring, large-scale special categories, etc.) |
| Breach notification to ICO | Within 72 hours of becoming aware |
| Breach notification to individuals | Without undue delay where likely high risk to rights/freedoms |
| DPO required | Public authorities; large-scale systematic monitoring; large-scale special categories |

---

## Overview

The UK GDPR is the retained EU law version of the EU GDPR (Regulation (EU) 2016/679), as incorporated into UK domestic law by the European Union (Withdrawal) Act 2018 and amended by the Data Protection, Privacy and Electronic Communications (Amendments etc) (EU Exit) Regulations 2019 SI 2019/419. It is read alongside the Data Protection Act 2018 (DPA 2018), which fills in gaps, sets the age of digital consent, creates exemptions, and establishes the ICO's powers.

Key differences from EU GDPR:
- Fines denominated in GBP (£17.5m vs €20m cap).
- Age of digital consent set at 13 (not 16 as in EU GDPR default).
- ICO (not EDPB) is the supervisory authority.
- Post-Brexit adequacy decisions issued by the UK Secretary of State for international transfers.

---

## Article 4 — Definitions (Key)

- **Personal data**: Any information relating to an identified or identifiable natural person ("data subject"). Includes online identifiers (IP addresses, cookie IDs).
- **Processing**: Any operation on personal data (collection, recording, storage, use, disclosure, erasure, etc.).
- **Controller**: Entity that determines the purposes and means of processing.
- **Processor**: Entity that processes on behalf of a controller.
- **Consent**: Freely given, specific, informed, and unambiguous indication of agreement (by statement or clear affirmative action).
- **Special categories**: See Article 9.
- **Personal data breach**: A breach of security leading to accidental or unlawful destruction, loss, alteration, unauthorised disclosure, or access to personal data.
- **Profiling**: Automated processing of personal data to evaluate personal aspects (performance, economic situation, health, preferences, interests, behaviour, location, movements).

---

## Article 5 — Data Protection Principles

All processing must comply with six core principles:

1. **Lawfulness, fairness, and transparency** — processing must have a legal basis; data subjects must be informed.
2. **Purpose limitation** — data collected for specified, explicit, and legitimate purposes; not further processed in incompatible ways.
3. **Data minimisation** — data must be adequate, relevant, and limited to what is necessary for the purpose.
4. **Accuracy** — data must be accurate and kept up to date; inaccuracies must be corrected or erased without delay.
5. **Storage limitation** — data must not be kept longer than necessary for its purpose; pseudonymisation encouraged.
6. **Integrity and confidentiality (security)** — appropriate technical and organisational measures to protect data against unauthorised processing, loss, destruction, or damage.

**Accountability**: The controller is responsible for and must be able to demonstrate compliance with all six principles (Article 5(2)).

---

## Article 6 — Lawful Bases for Processing

Personal data may only be processed where one of these six bases applies:

| Basis | Key Conditions |
|---|---|
| **(a) Consent** | Freely given, specific, informed, unambiguous; easily withdrawable |
| **(b) Contract** | Necessary for performance of a contract with the data subject, or pre-contractual steps |
| **(c) Legal obligation** | Processing is necessary to comply with a legal obligation on the controller |
| **(d) Vital interests** | Necessary to protect life of data subject or another person |
| **(e) Public task** | Necessary for performance of a task in the public interest or exercise of official authority |
| **(f) Legitimate interests** | Necessary for legitimate interests of controller or third party, unless overridden by data subject's interests/rights |

**Notes on legitimate interests**:
- Requires a three-part test: (i) legitimate interest exists; (ii) processing is necessary; (iii) balancing test — interests not overridden by data subject's rights.
- ICO guidance cautions that legitimate interests is **unlikely to be appropriate** where the data subject is a child, given the power imbalance and vulnerability.
- Must document the Legitimate Interests Assessment (LIA).

---

## Article 7 — Conditions for Consent

- The controller must demonstrate that consent was given (burden is on the controller).
- If consent is given in the context of other matters (e.g., terms of service), the consent request must be clearly distinguishable and in plain language.
- The data subject has the right to withdraw consent at any time; withdrawal must be as easy as giving consent.
- Consent is not freely given if the performance of a service is conditional on consent to unnecessary processing (consent as a condition of service).
- Consent cannot be bundled — separate consents required for separate purposes.

---

## Article 8 — Children's Consent for Information Society Services

- The age of digital consent in the UK is **13 years** (set by s.9 DPA 2018, exercising the Article 8(1) member state discretion).
- For children **under 13**, consent must be given or authorised by a parent/guardian who holds parental responsibility.
- Controllers must make **reasonable efforts** to verify parental consent, taking into account available technology.
- This does not affect general contract law — but for consent as a lawful basis for processing children's data, the 13-year threshold applies.

**ICO guidance on children specifically**:
- When a service is directed at or likely to be accessed by children, the ICO expects: child-friendly privacy notices; higher privacy defaults; restrictions on profiling and tracking; particular care with consent as a lawful basis for under-13s.
- The Children's Code (AADC) supplements Article 8 with 15 detailed standards — see uk-childrens-code.md.

---

## Article 9 — Special Categories of Personal Data

Processing of the following categories is **prohibited** unless a specific condition under Article 9(2) applies:
- Racial or ethnic origin
- Political opinions
- Religious or philosophical beliefs
- Trade union membership
- Genetic data
- Biometric data (for uniquely identifying a natural person)
- Health data
- Sex life or sexual orientation

**Key Article 9(2) conditions**:
- (a) Explicit consent of the data subject.
- (b) Necessary for employment law obligations.
- (e) Manifestly made public by the data subject.
- (f) Necessary for legal claims.
- (g) Substantial public interest (with DPA 2018 Schedule 1 conditions).

---

## Articles 12–14 — Transparency Obligations

### Article 12 — Modalities
Privacy information must be provided in a **concise, transparent, intelligible, and easily accessible** form, using clear and plain language. Must be free of charge. Written form required (or other means, including electronic).

### Article 13 — Information Provided at Collection (First-Party Data)
Where personal data is collected directly from the data subject, provide at time of collection:
- Controller identity and contact details; DPO contact (if applicable).
- Purposes and legal basis for each processing activity.
- Legitimate interests pursued (if LI basis).
- Recipients or categories of recipients.
- Transfers to third countries, with safeguards.
- Retention periods (or criteria used).
- Data subject rights.
- Right to withdraw consent (if consent is the basis).
- Right to lodge a complaint with the ICO.
- Whether provision is statutory/contractual requirement and consequences of failure.
- Existence of automated decision-making including profiling, with meaningful information about the logic.

### Article 14 — Information When Data Not Obtained Directly
Where personal data was not obtained directly from the data subject, provide the above information within 1 month (or at time of first communication, or when disclosed to a third party — whichever is earliest). Add: the categories of data and source.

---

## Articles 15–22 — Data Subject Rights

| Article | Right | Key Notes |
|---|---|---|
| **15** | Right of access | Data subject can request confirmation of processing and a copy of personal data; must be provided within 1 month (extendable by 2 further months for complex requests) |
| **16** | Right to rectification | Must correct inaccurate data without undue delay; complete incomplete data |
| **17** | Right to erasure ("right to be forgotten") | Must erase data where: no longer necessary; consent withdrawn; object upheld; unlawful processing; legal obligation; child consent under Art. 8 | Exceptions for freedom of expression, legal obligation, public interest, legal claims |
| **18** | Right to restriction | Data subject can restrict processing while accuracy is contested, or processing is unlawful (but erasure not desired), or controller no longer needs data but subject needs it for claims, or pending objection |
| **19** | Notification obligation | Must notify recipients of rectification/erasure/restriction unless impossible or disproportionate effort |
| **20** | Right to data portability | Where basis is consent or contract, and processing is automated: must provide data in machine-readable format; must transmit directly to another controller where technically feasible |
| **21** | Right to object | Can object at any time to processing based on legitimate interests or public task (including profiling); must stop unless compelling legitimate grounds overriding; absolute right to object to direct marketing profiling |
| **22** | Right not to be subject to automated decision-making | Prohibition on solely automated decisions producing legal/similarly significant effects, unless: contract necessity, legal authorisation, explicit consent; in latter two cases: must allow human review, ability to contest |

**Response timelines**: Generally 1 month from receipt of request; extendable by 2 further months for complex or numerous requests (data subject must be notified of extension within first month).

---

## Article 25 — Data Protection by Design and by Default

**By design**: The controller must, at the time of determining the means of processing and at the time of processing itself, implement appropriate technical and organisational measures designed to implement the data protection principles and integrate safeguards into processing.

**By default**: The controller must implement measures ensuring that, by default, only personal data that is necessary for each specific purpose is processed. This applies to: amount of data collected, extent of processing, period of storage, accessibility.

**Practical notes**:
- Privacy-by-design must be embedded in engineering sprints, not bolted on post-launch.
- Default settings must be the most privacy-protective option.
- Document design decisions and rationale.

---

## Article 32 — Security of Processing

Controllers and processors must implement **appropriate technical and organisational measures** (taking into account state of the art, costs, nature of data, and risks) to ensure a level of security appropriate to the risk. Measures should include (as appropriate):
- Pseudonymisation and encryption.
- Ability to ensure ongoing confidentiality, integrity, availability, and resilience of systems.
- Ability to restore availability in a timely manner following an incident.
- Regular testing and evaluation of effectiveness of security measures.

**Risk factors**: Nature of data (special categories, children's data = higher risk); scope; context; purposes.

---

## Article 33 — Notification of Breach to Supervisory Authority

Personal data breaches must be notified to the ICO **within 72 hours** of becoming aware, unless unlikely to result in a risk to individuals' rights and freedoms.

Notification must include: description of nature of breach; categories and approximate number of data subjects; categories and approximate number of records; contact details of DPO; likely consequences; measures taken/proposed.

Where notification cannot be made within 72 hours, initial notification must be made with reasons for delay; information may be provided in phases.

---

## Article 34 — Communication of Breach to Data Subjects

Where a breach is likely to result in a **high risk** to the rights and freedoms of individuals, the controller must communicate the breach to the affected individuals **without undue delay**.

Exceptions: encryption/pseudonymisation rendered data unintelligible; subsequent measures eliminated high risk; disproportionate effort (public communication instead).

---

## Article 35 — Data Protection Impact Assessment (DPIA)

A DPIA is **mandatory** when processing is likely to result in high risk, particularly:
- Systematic and extensive profiling with significant effects.
- Large-scale processing of special categories.
- Systematic monitoring of publicly accessible areas.
- **ICO guidance adds**: processing children's data at scale; innovative technology; AI/ML systems with significant effects.

**DPIA must include**:
- Systematic description of processing and purposes.
- Assessment of necessity and proportionality.
- Assessment of risks to data subjects.
- Measures to address risks (safeguards, security measures, mechanisms to ensure compliance).

**Consultation with ICO**: Where DPIA indicates high residual risk that cannot be mitigated, the controller must consult the ICO before starting processing (Article 36).

---

## Article 37 — Data Protection Officer (DPO)

A DPO must be designated where:
- The controller is a public authority or body.
- Core activities consist of large-scale systematic monitoring of individuals.
- Core activities consist of large-scale processing of special categories or criminal offence data.

**DPO requirements**:
- Must have expert knowledge of data protection law and practice.
- Can be staff or external contractor.
- Must be provided with resources and access to report to highest management level.
- Must not be given instructions on how to perform DPO tasks.
- Contact details must be published and notified to the ICO.

---

## Article 44–49 — International Transfers

Personal data may only be transferred to third countries (non-UK) where:
- The UK has issued an **adequacy regulation** for that country (e.g., EU has adequacy under UK decision post-Brexit).
- Appropriate safeguards are in place, such as: UK International Data Transfer Agreements (IDTAs), UK Addendum to EU SCCs, binding corporate rules.
- A specific derogation applies (e.g., explicit consent, vital interests, public interest, legal claims).

---

## Article 83 — Administrative Fines

**Tier 1 (most serious violations)** — up to £17.5 million or 4% of global annual turnover:
- Violations of: basic principles of processing (Article 5); conditions for consent (Articles 6, 7); children's consent (Article 8); special categories (Article 9); data subjects' rights (Articles 15–22); international transfers (Articles 44–49).

**Tier 2 (other violations)** — up to £8.75 million or 2% of global annual turnover:
- Violations of: security obligations (Article 32); breach notification (Articles 33–34); DPIA (Article 35); DPO requirements (Article 37); technical/organisational obligations of processors.

**Factors in determining fine**:
- Nature, gravity, and duration.
- Intentional or negligent character.
- Actions taken to mitigate damage.
- Degree of cooperation with ICO.
- Categories of personal data affected.
- Prior infringements.

---

## Supplementary — Data Protection Act 2018

The DPA 2018 supplements the UK GDPR by:
- Setting the age of digital consent at 13 (s.9).
- Providing exemptions for journalism, research, legal proceedings, etc.
- Creating Schedule 1 conditions for special categories processing in a public interest context.
- Establishing the ICO's investigation and enforcement powers.
- Providing criminal offences for unlawful obtaining, selling, or procuring personal data (s.170).
