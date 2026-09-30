# Children's Data Under GDPR

> Reference guide to GDPR obligations when processing personal data of children (under 18), with particular focus on Article 8 (consent), the UK Children's Code, and practical design requirements.

---

## Who Counts as a "Child"?

**GDPR / UK GDPR**: Does not define a universal age threshold for "child". However:
- **Article 8** (consent for ISS): UK GDPR sets the threshold at **13**. EU GDPR default is **16** (member states can lower to 13).
- **UK Children's Code (ICO)**: Applies protections to all **under-18s** — not just under-13s.
- **COPPA (US)**: Under **13**.

**Platform approach**: Treat **all under-18s as a protected category** for safety and design, regardless of which consent threshold is locally relevant. This is both the regulatory expectation under the UK Children's Code and a defensible global approach.

---

## GDPR Article 8 — Consent for Information Society Services

Article 8 applies specifically when you **rely on consent** as your lawful basis for processing a child's data for an **information society service (ISS)** offered directly to the child.

### Age thresholds

| Jurisdiction | Age at which child can consent themselves | Below this age |
|---|---|---|
| UK (UK GDPR) | 13 | Parental/guardian authorisation required |
| EU (default) | 16 | Parental/guardian authorisation required |
| Germany | 16 | Parental/guardian authorisation required |
| France | 15 | Parental/guardian authorisation required |
| Netherlands | 16 | Parental/guardian authorisation required |
| Spain | 14 | Parental/guardian authorisation required |
| Ireland | 16 | Parental/guardian authorisation required |
| Denmark, Sweden, Finland | 13 | Parental/guardian authorisation required |

*Always verify current local thresholds as member states can update their legislation.*

### What Article 8 requires

Where a child is **below the relevant national threshold** and you rely on consent:
1. Consent must be **given or authorised by the holder of parental responsibility**
2. You must make **"reasonable efforts" to verify** that parental authorisation exists
3. "Reasonable efforts" is technology-proportionate — you don't have to do full ID checks, but you can't do nothing. Options include:
   - Parent/guardian email confirmation (low friction)
   - Small card charge (can verify adult has a card)
   - Parental callback/OTP
   - Third-party age-assurance provider

### What Article 8 does NOT require

Article 8 only applies when you rely on **consent**. For many core platform activities, you can and should rely on:
- **Contract** (account creation, running the service)
- **Legitimate interests** (safety processing, fraud prevention, core analytics)

For these non-consent bases, Article 8 parental consent requirements don't apply — but you still owe heightened protection and must pass a stronger balancing test.

---

## UK Children's Code (Age Appropriate Design Code)

The ICO's Children's Code applies to any online service **"likely to be accessed by children"** in the UK, regardless of whether you intend it for children. You can only escape scope if you have **robust age verification** that effectively keeps children out.

### The 15 Standards

**1. Best interests of the child**
Every feature must be designed in the best interests of the child, not primarily in the interests of the business (not engagement, growth, or data collection).

**2. Data Protection Impact Assessments (DPIAs)**
Must conduct and document a DPIA for any processing that could affect children. Must be updated when material changes occur to features children use.

**3. Age appropriate application**
Apply the standards proportionately to the age range likely to access each feature. A service accessed mainly by 15-year-olds requires different protections than one accessed mainly by 8-year-olds.

**4. Transparency**
Privacy information must be concise, prominent, and in plain, age-appropriate language. Use layered notices: a simple version plus a detailed one. Provide information children can actually understand.

**5. Detrimental use of data**
Do not use children's data in ways that are detrimental to their wellbeing — e.g. to exploit vulnerabilities, exploit peer pressure, or undermine children's mental health.

**6. Policies and community standards**
Uphold published terms, policies, and community standards for children who use your service.

**7. Default settings**
Default settings for children must be the most privacy-protective available. Children should not have to take action to achieve privacy; they should have to take action to reduce it.

**8. Data minimisation**
Collect only data strictly necessary for the feature. Do not collect data "just in case" or because it might be useful later.

**9. Data sharing**
Do not disclose children's data to third parties unless necessary for the service, or unless the child has a genuine choice and understands what they're agreeing to.

**10. Geolocation**
Geolocation must be off by default for children. Do not display children's precise locations to other users. Do not use location-based features that could expose children to risk.

**11. Parental controls**
If you offer parental controls, design them to support parenting without undermining the child's own right to privacy where appropriate for their age and maturity.

**12. Profiling**
Switch profiling off by default for children. Only allow it where you have a clear justification for each child's profile. Do not use profiling for targeted advertising to children.

**13. Nudge techniques**
Do not use nudge techniques or dark patterns to push children toward providing more data, accepting less privacy, or engaging more than is in their interests. Only use nudges that encourage safer and more privacy-protective choices.

**14. Connected toys and devices**
If your service connects to physical devices used by children (IoT, toys, wearables), apply the same standards to data collected through those devices.

**15. Online tools**
Provide accessible tools for children to exercise their data rights (access, erasure, correction, portability) in a way that is appropriate for their age and understanding.

---

## Age-of-Digital-Consent: Practical Platform Guidance

### The key distinction

There are two separate questions:
1. **What age can a child consent to the ISS itself** (Article 8 threshold — 13–16 depending on country)?
2. **At what age should you apply special protective measures** (Children's Code applies to all under-18)?

These are different. You can have a 15-year-old who can legally consent to using the service in the UK (threshold: 13) but who is still entitled to Children's Code protections — private-by-default, no profiling, no nudges, etc.

### Recommended platform approach

- **Set one minimum age globally** (e.g. 13) as your hard floor, applied everywhere.
- **Apply under-18 protections** (Children's Code standards) to all users under 18, regardless of country.
- **Track consent-age thresholds by country** if you rely on consent for optional features, so you know where under-16 users need parental authorisation before you show them a consent prompt.
- **Rely on non-consent bases** (contract, legitimate interests) for core features wherever possible, so Article 8 parental consent requirements apply minimally.

---

## DPIAs for Services Likely to Be Accessed by Children

A **Data Protection Impact Assessment** is required (UK GDPR Article 35) for processing likely to result in high risk — and services accessed by children almost always qualify.

**What a children's DPIA must cover:**
- Systematic description of processing activities (what data, what purposes, what legal bases)
- Assessment of necessity and proportionality
- Assessment of risks to children's rights and freedoms (including risks specific to children: exploitation, profiling, loss of control of personal data, harm to wellbeing)
- Measures to address the risks (technical and organisational)
- Consultation with the ICO if residual risk remains high after measures are applied

**Features that typically require their own DPIA assessment:**
- Age assurance systems (especially biometric/photo-based)
- Live video calls with minors
- Recommendation algorithms used for minors
- Recording and storing calls involving minors
- Any new feature that processes sensitive data of children

---

## Children's Special Category Data

**Biometric data** (Article 9(1)) includes: fingerprints, face recognition data, voice templates. If your age assurance process involves a selfie matched against a biometric template, this may be special category data requiring explicit consent or another specific Article 9 basis.

**Practical approach:**
- Where possible, use selfies only for visual review/comparison (not biometric template extraction) to avoid special category classification
- Document your technical approach to age estimation clearly — regulators will ask

---

## Retention Limits for Children's Data

The ICO and Children's Code require you to think carefully about how long you retain children's data:

| Data type | Suggested retention |
|---|---|
| Account data (active user) | Retained while account active + short period after deletion |
| Session/call metadata | 90 days for non-incident; longer for flagged/investigated calls |
| Safety logs | Duration of investigation + 2 years for follow-up; indefinitely for serious crimes |
| Age verification records | Only the outcome (verified/unverified + date) — delete raw verification documents promptly |
| Marketing consent records | Until consent withdrawn + short period after |
| COPPA verifiable parental consent | Until the child turns 13 or account is deleted (whichever is sooner if service is 13+) |

---

## Enforcement and Fines

Key enforcement examples:
- **TikTok (ICO, 2023)**: £12.7m fine for allowing ~1.4m UK under-13s to use the platform and processing their data unlawfully
- **Google (CNIL, 2021)**: Ongoing scrutiny of YouTube's handling of children's data
- **FTC (various)**: Multiple COPPA settlements including TikTok $5.7m (2019), YouTube/Google $170m (2019)

Fines under UK GDPR: up to **£17.5m or 4% of global annual turnover**, whichever is higher.
