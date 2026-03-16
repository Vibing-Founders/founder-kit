# Data Protection Impact Assessment (DPIA)

> **Source**: Article 29 Data Protection Working Party, *Guidelines on Data Protection Impact Assessment (DPIA) and determining whether processing is "likely to result in a high risk" for the purposes of Regulation 2016/679* (WP248 rev.01, adopted 4 April 2017, last revised 4 October 2017)
> https://ec.europa.eu/newsroom/article29/items/611236

A DPIA is a process designed to describe processing activities, assess their necessity and proportionality, and help manage risks to the rights and freedoms of individuals. It is both a compliance tool and an accountability mechanism under Article 35 of EU GDPR.

Non-compliance with DPIA requirements can result in fines of up to €10M, or 2% of total worldwide annual turnover, whichever is higher.

---

## When is a DPIA required?

A DPIA is mandatory where processing is **"likely to result in a high risk to the rights and freedoms of natural persons"** (Article 35(1)). It is not required for every processing operation — only where a genuine high risk exists.

### Article 35(3) examples that are always high risk

- Systematic and extensive evaluation of personal aspects based on automated processing, including profiling, on which decisions producing legal or similarly significant effects are based
- Processing on a large scale of special category data (Article 9) or criminal conviction/offence data (Article 10)
- Systematic monitoring of a publicly accessible area on a large scale

### Nine criteria for assessing high risk (WP29)

The Article 29 Working Party identified nine criteria. **Meeting two or more generally requires a DPIA.** In some cases, a single criterion may be sufficient.

1. **Evaluation or scoring** — profiling or predicting aspects of data subjects' performance, economic situation, health, preferences, reliability, behaviour, location, or movements. Examples: credit screening, fraud databases, behavioural marketing profiles.

2. **Automated decision-making with legal or similar significant effect** — processing aimed at decisions that produce legal effects or similarly significantly affect individuals, such as automatic refusal of a loan or exclusion from a service.

3. **Systematic monitoring** — observing, monitoring, or controlling individuals via networks or in publicly accessible areas. This includes both network monitoring and CCTV. Data subjects may be unable to avoid the processing.

4. **Sensitive data or data of a highly personal nature** — includes special category data (Article 9), criminal data (Article 10), and data linked to household or private activities (electronic communications, location data, financial data, personal documents, emails, diaries, life-logging apps).

5. **Data processed on a large scale** — the GDPR does not define "large scale", but relevant factors are:
   - Number of data subjects (as a specific number or proportion of the relevant population)
   - Volume of data and/or the range of different data items
   - Duration or permanence of the processing
   - Geographical extent

6. **Matching or combining datasets** — combining data from two or more processing operations performed for different purposes, or by different controllers, in a way that would exceed reasonable expectations.

7. **Data concerning vulnerable data subjects** — children, employees, patients, asylum seekers, the elderly, and other groups where there is a power imbalance that makes it difficult for individuals to consent to or oppose processing.

8. **Innovative use or applying new technological or organisational solutions** — new technologies (e.g. IoT devices, facial recognition, fingerprinting) can involve novel forms of data collection with unknown personal and social consequences (Article 35(1), recitals 89 and 91).

9. **Processing that prevents data subjects from exercising a right or using a service/contract** — processing that aims to allow, modify, or refuse access to a service or contract, such as screening customers against a credit reference database.

### Examples table

| Processing activity | Relevant criteria | DPIA required? |
|---|---|---|
| Hospital processing genetic and health data | Sensitive data; vulnerable subjects; large scale | Yes |
| Intelligent camera system recognising vehicle licence plates on highways | Systematic monitoring; innovative technology | Yes |
| Company monitoring employees' workstations and internet activity | Systematic monitoring; vulnerable subjects (employees) | Yes |
| Gathering public social media data to generate profiles | Evaluation/scoring; large scale; dataset matching; sensitive data | Yes |
| National credit rating or fraud database | Evaluation/scoring; automated decisions; prevents access to services; sensitive data | Yes |
| Archiving pseudonymised clinical trial data on vulnerable subjects | Sensitive data; vulnerable subjects; prevents access to services | Yes |
| Individual physician processing patient data | Sensitive data; vulnerable subjects | No (small scale) |
| Online magazine mailing list for generic daily digest | Large scale only (borderline) | No |
| E-commerce site with limited profiling based on own browsing data | Evaluation/scoring only (limited) | No |

### When a DPIA is not required

- Processing is not likely to result in high risk (Article 35(1))
- The processing is very similar in nature, scope, context, and purpose to processing already covered by an existing DPIA
- Processing was checked by a supervisory authority under Directive 95/46/EC before May 2018, and conditions have not changed
- Processing has a legal basis in EU or Member State law that already covered a DPIA as part of establishing that basis (Article 35(10))
- Processing is included on a supervisory authority's optional list of operations for which no DPIA is required (Article 35(5))

Even where a DPIA is not required, controllers must still assess whether high risk is likely, and document that assessment.

---

## What does a DPIA cover?

A DPIA may address a **single processing operation** or a **set of similar processing operations** that present similar high risks (Article 35(1)). Using a single DPIA for similar operations across multiple controllers (e.g. a common platform rolled out across an industry) is acceptable where a reference DPIA is shared and individual measures are documented.

The **minimum content** of a DPIA (Article 35(7)) is:

1. A systematic description of the envisaged processing operations and purposes, including the legitimate interest pursued where relevant
2. An assessment of the necessity and proportionality of the processing in relation to the purposes
3. An assessment of the risks to the rights and freedoms of data subjects
4. The measures envisaged to address the risks, including safeguards, security measures, and mechanisms to demonstrate compliance

---

## How to carry out a DPIA

### Timing

A DPIA must be carried out **before the processing begins** (Articles 35(1) and 35(10)). It should be started as early as practicable in the design of the processing operation. The DPIA is an ongoing process — not a one-time exercise — and must be updated when the processing or its risks change.

### Who is responsible

The **controller** is responsible for ensuring the DPIA is carried out (Article 35(2)). In practice:

- The **DPO** (where designated) must be consulted and their advice documented within the DPIA. The DPO should also monitor the DPIA's performance (Article 39(1)(c)).
- **Processors** must assist the controller in carrying out the DPIA and provide necessary information (Article 28(3)(f)).
- **Data subjects or their representatives** must be consulted where appropriate (Article 35(9)). If their views are not sought, the controller must document the justification for this.
- Other internal stakeholders (CISO, IT, legal, business units) and, where appropriate, independent external experts should be involved.

### The iterative process

The DPIA involves six iterative stages:

1. **Description of the envisaged processing** — nature, scope, context, purpose; assets involved (hardware, software, networks, people); data flows
2. **Assessment of necessity and proportionality** — lawful basis, purpose limitation, data minimisation, storage limitation, data subject rights
3. **Identification of measures already envisaged** — existing technical and organisational safeguards
4. **Assessment of risks** — for each risk (illegitimate access, undesired modification, disappearance of data): sources, likelihood, severity
5. **Measures to address residual risks** — additional safeguards to reduce risk to an acceptable level
6. **Documentation and monitoring/review** — record findings, review when circumstances change

### Publishing the DPIA

Publishing a DPIA is not legally required, but controllers should consider publishing at least a summary. This is particularly good practice where the public is affected by the processing. The full DPIA must be provided to the supervisory authority if prior consultation is required or if the authority requests it.

---

## Criteria for an acceptable DPIA (Annex 2)

A DPIA methodology must satisfy the following criteria to comply with the GDPR:

**Systematic description of processing (Article 35(7)(a))**
- Nature, scope, context, and purposes are documented
- Personal data, recipients, and retention periods are recorded
- A functional description of the processing is provided
- The assets on which personal data rely (hardware, software, networks, people, paper, transmission channels) are identified
- Compliance with approved codes of conduct (Article 35(8)) is addressed

**Necessity and proportionality assessed (Article 35(7)(b))**
- Processing measures are determined in accordance with the Regulation, covering:
  - Specified, explicit, and legitimate purpose(s) (Article 5(1)(b))
  - Lawfulness of processing (Article 6)
  - Data adequacy, relevance, and minimisation (Article 5(1)(c))
  - Limited storage duration (Article 5(1)(e))
- Data subject rights measures are addressed:
  - Information provided to data subjects (Articles 12, 13, 14)
  - Right of access and portability (Articles 15, 20)
  - Right to rectification and erasure (Articles 16, 17, 19)
  - Right to object and restriction of processing (Articles 18, 19, 21)
  - Processor relationships (Article 28)
  - International transfer safeguards (Chapter V)
  - Prior consultation where required (Article 36)

**Risks to rights and freedoms managed (Article 35(7)(c))**
- For each risk (illegitimate access, undesired modification, disappearance of data):
  - Risk sources are identified (recital 90)
  - Potential impacts on rights and freedoms are identified
  - Threats are identified
  - Likelihood and severity are estimated
- Measures to treat residual risks are determined

**Interested parties are involved**
- DPO advice is sought (Article 35(2))
- Views of data subjects or their representatives are sought where appropriate (Article 35(9))

---

## Prior consultation with the supervisory authority

Where a DPIA reveals that **residual risks remain high** after all available mitigation measures have been applied, the controller must consult the supervisory authority before proceeding with the processing (Article 36(1)). The full DPIA must be provided to the authority as part of that consultation.

Unacceptable residual risks include scenarios where:
- Data subjects may encounter significant or irreversible consequences they cannot overcome (e.g. threat to life, financial jeopardy, unlawful dismissal)
- The risk will clearly occur because it cannot be reduced — e.g. the number of people accessing the data cannot be reduced given the sharing or distribution model, or a known vulnerability cannot be patched

Consultation is also required where Member State law requires it for processing in the public interest, including social protection and public health (Article 36(5)).

---

## Existing processing operations

A DPIA is required for existing processing if:
- It is likely to result in high risk, and
- There has been a **change of risks** (in nature, scope, context, purpose, technology used, or user base)

Processing already checked by a supervisory authority under Directive 95/46/EC before May 2018, and unchanged since, does not require a new DPIA. However, any change to the implementation conditions triggers a fresh assessment.

A DPIA should be continuously reviewed and regularly re-assessed as a matter of good practice.

---

## UK GDPR note

The UK GDPR contains equivalent DPIA obligations under Article 35. The ICO has published its own DPIA guidance and maintains lists of processing operations for which a DPIA is required (and not required) under UK GDPR. The nine WP29 criteria above are applicable under UK GDPR and should be used alongside ICO guidance.
