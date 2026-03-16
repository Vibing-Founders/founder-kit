---
name: dpia
description: >
  Conducts a Data Protection Impact Assessment (DPIA) under Article 35 of EU/UK GDPR.
  Scans the codebase and project documentation to identify personal data processing
  activities, applies the WP29 nine-criteria framework to determine which activities
  require a DPIA, asks targeted questions to fill gaps the code can't answer, then
  produces one or more formal DPIA compliance documents suitable for a regulator or DPO.
  Use this skill whenever someone asks about DPIAs, whether their processing needs a DPIA,
  how to document a DPIA, what a DPIA should cover, or wants to assess data protection
  risks for their product or feature. Triggers on: "do we need a DPIA", "help me do a
  DPIA", "DPIA for X", "data protection impact assessment", "Article 35 assessment",
  "assess data protection risks", "high risk processing assessment", "do a DPIA on our
  codebase", "DPIA for our app", "complete a DPIA", "prior consultation DPIA",
  "does this need a DPIA", "run a DPIA".
---

# DPIA Skill

Conducts a complete Data Protection Impact Assessment grounded in the actual codebase and
project context — not a generic template fill-in.

Read `../gdpr/knowledge/dpia.md` before starting. That file contains the nine WP29
high-risk criteria, what a DPIA must legally cover (Article 35(7)), the Annex 2
acceptability criteria, and the prior consultation rules. It is the regulatory backbone
of this skill.

---

## The three phases

Work through these in order. The discovery phase is what makes this valuable — surface
the processing from the code before asking the user anything.

---

### Phase 1: Discovery

Scan the codebase and docs to build a map of personal data processing activities. Run
these searches in parallel — they are independent.

**Data models and schemas**

Look for the data structures that hold personal data:
```
Glob: schema.rb, schema.prisma, *.sql, **/migrations/**, **/models/**
Grep: email|phone|address|name|dob|birth_date|location|lat|lon|ip_address|device_id|
      user_id|session_id|health|biometric|passport|national_id
      (in: schema files, model files, TypeScript interfaces, GraphQL schemas)
```

**Third-party integrations**

Dependencies and imports reveal processing you might otherwise miss:
```
Glob: package.json, requirements.txt, Gemfile, go.mod, *.toml, .env.example
Grep: segment|mixpanel|amplitude|google.*analytics|ga4|analytics
      stripe|paypal|braintree|adyen|checkout
      auth0|cognito|firebase|okta
      mailchimp|sendgrid|hubspot|salesforce|marketo|klaviyo
      sentry|datadog|newrelic|logrocket|fullstory|hotjar
      (in: config files, package manifests, import statements)
```

**Processing logic**

Look for code that actively processes personal data beyond simple storage:
```
Grep: recommend|personaliz|personalise|profile|score|segment|target|behavioral|
      behavioural|predict|classify|automat.*decision|fraud.*detect|content.*moderat|
      monitor|surveil|track.*user|activity.*log|audit.*log
      (in: service files, worker files, algorithm files)
```

**User-facing features**

Routes and UI components reveal what the product does with users' data:
```
Grep: /users|/accounts|/profile|/messages|/location|/upload|/age.*verif|
      /children|/parental|/health|/medical|/payment|/checkout|/analytics
      (in: routes, controllers, view files)
```

**Documentation**

```
Glob: README.md, ARCHITECTURE.md, docs/**/*.md, **/data-flow*, **/privacy*, **/gdpr*
```

After scanning, synthesise a list of **processing activities**. For each, note:
- What personal data is involved (be specific — "email address and browsing history", not "user data")
- Whose data it is (registered users, prospective customers, employees, children)
- What is being done with it (stored, analysed, shared with third parties, used for decisions)

If the codebase is sparse or primarily infrastructure, say so and explain what you found — don't fabricate processing activities.

---

### Phase 2: Scope analysis

Apply the nine WP29 criteria to each processing activity. Load `../gdpr/knowledge/dpia.md`
for the full criteria if you haven't already — do not rely on memory here.

The rule: **two or more criteria → DPIA required. One criterion may be enough** depending
on severity. When in doubt, do the DPIA — it is low cost and demonstrates accountability.

Produce a **scope table**:

| Processing activity | Criteria met | DPIA required? | Notes |
|---|---|---|---|
| e.g. Behavioural profiling for recommendations | Evaluation/scoring; Large scale | Yes | — |
| e.g. Email newsletter sending | Large scale (borderline) | No | Confirm user count |

Then present this to the user and fill the gaps that affect the conclusion. Ask only
what you genuinely don't know from the code — targeted questions, not a questionnaire.
The most important gaps are typically:

- **Scale** — approximate number of data subjects affected (even an order of magnitude helps)
- **Children** — are users or a subset of users under 18?
- **Geography** — EU/UK users, or other jurisdictions?
- **Retention** — how long is personal data kept, if not specified in code?
- **Processors** — are there third-party processors not obvious from the dependencies (e.g. a sub-processor of Stripe, or a cloud region)?
- **Existing DPIAs** — has any assessment already been done for this activity?

Confirm the list of activities that need DPIAs before proceeding.

---

### Phase 3: Produce the DPIA document(s)

For each confirmed DPIA, use the template in `references/dpia-template.md`. Populate it
from what you learned in phases 1 and 2. Where information is incomplete, note it
explicitly in the document — do not guess.

**What makes a DPIA useful to a regulator:**

- **Specificity** — "IP addresses, device fingerprints, and clickstream data for 150,000 registered users" is useful. "User data" is not.
- **Honest risk assessment** — list harms that weigh against the controller, not just the ones you've mitigated. A document that finds only positives looks like it wasn't done properly.
- **Connected safeguards** — for each identified risk, explain the specific measure that addresses it and how it reduces either the likelihood or severity of harm.
- **Clear DPIA trigger** — state at the top which of the nine criteria triggered the assessment.
- **Prior consultation flag** — if residual risks remain high after all mitigation, the controller must consult the supervisory authority (ICO for UK; lead DPA for EU) before processing.

If the activity involves children's data, apply extra scrutiny in the risk section. The
power imbalance between a child and an organisation means the same risks weigh more
heavily than they would for adults.

**Saving the output**

Save each DPIA as a markdown file in the project root (or a `compliance/` subdirectory
if one exists):

```
dpia-[activity-slug]-[YYYY-MM].md
```

Also save the scope analysis:
```
dpia-scope-analysis-[YYYY-MM].md
```

Tell the user the file paths. If you produce multiple DPIAs, summarise the outcome of
each (required / not required / borderline) in a brief closing message.

---

## Two failure modes to avoid

**Over-scoping** — flagging routine, low-risk processing as needing a DPIA. This wastes the user's time and erodes trust in the assessment. A user profile that stores name and email for login, with no profiling or automated decisions, does not need a DPIA on its own.

**Under-scoping** — missing high-risk processing because it was in a dependency, a third-party integration, or a feature not obviously named in the code. An analytics platform that tracks and profiles users at scale is a DPIA trigger even if the app itself looks simple. Scan thoroughly.

---

## Reference files

| File | When to read |
|---|---|
| `../gdpr/knowledge/dpia.md` | Before starting — contains the nine criteria, Article 35(7) content requirements, Annex 2 acceptability checklist, and prior consultation rules |
| `references/dpia-template.md` | When producing the DPIA document — use this template exactly |
