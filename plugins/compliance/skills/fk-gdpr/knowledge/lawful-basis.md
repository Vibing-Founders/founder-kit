# GDPR Lawful Bases for Processing

> Reference guide to the six lawful bases under UK GDPR / EU GDPR Article 6, with practical guidance for platform features.

---

## The Six Lawful Bases

You must identify a lawful basis **before** you start processing. You must record your basis and be able to explain it to data subjects. You cannot switch bases retroactively.

---

### 1. Consent (Article 6(1)(a))

**Definition**: The data subject has given clear, freely given, specific, informed, and unambiguous agreement.

**Requirements for valid consent:**
- **Freely given**: no imbalance of power; no bundling consent with service access (unless strictly necessary)
- **Specific**: separate consent for each distinct purpose
- **Informed**: clear explanation of what data, why, and who will use it
- **Unambiguous**: positive opt-in action (no pre-ticked boxes; no silence)
- **Withdrawable**: must be as easy to withdraw as to give; withdrawal must not be penalised

**When to use it:**
- Marketing emails and push notifications (especially to adults who've opted in)
- Non-essential analytics and tracking (e.g. behavioural advertising cookies)
- Optional features where you want to give users clear control
- Secondary uses of data (e.g. using recordings for product improvement)

**When NOT to use it:**
- Where you can rely on a stronger basis (contract, legitimate interests) — consent is the weakest basis because it can be withdrawn
- As a default "safe option" — misusing consent undermines user trust and creates compliance burden
- Where there's a clear imbalance of power (employees, etc.)

**Children and consent:**
- UK: Under 13 → parental authorisation required
- EU: Under 16 (default, can be lowered to 13 by member state) → parental authorisation required
- For teens who can consent themselves: must still be child-friendly, genuinely understood, not exploitative
- See `childrens-data.md` for detail

---

### 2. Contract (Article 6(1)(b))

**Definition**: Processing is necessary to perform a contract with the data subject, or to take pre-contractual steps at their request.

**Requirements:**
- Must be *necessary* for the contract — not just useful or convenient
- The data subject must be a party to the contract (not a third party)
- Processing must be required to actually deliver the service

**When to use it:**
- Account creation and management (storing name, email, profile)
- Booking a session / processing a payment (transaction data)
- Delivering a video call (session metadata, participant identity for the call to work)
- Identity verification required to use the service (e.g. age verification to access features)
- Sending transactional emails (booking confirmations, receipts)

**When NOT to use it:**
- Marketing (you have a contract, but marketing isn't necessary to perform it)
- Analytics beyond what's needed to run the feature
- Storing data longer than needed to perform the contract

**Platform note**: For creator–fan platforms, the core service (booking, call delivery, payment processing) is clearly contractual. Age verification to gate access to features is typically justified here.

---

### 3. Legal Obligation (Article 6(1)(c))

**Definition**: Processing is necessary to comply with a legal obligation you're subject to.

**Requirements:**
- The legal obligation must be in EU/UK law (not your own internal policies)
- Must be necessary, not just helpful

**When to use it:**
- Retaining financial records (accounting law, AML requirements)
- Responding to court orders, law enforcement requests
- CSAM reporting obligations (mandatory under various national laws)
- Tax record-keeping

**Platform note**: Use this for data you're legally required to keep — don't stretch it to justify retention of user data that isn't legally mandated.

---

### 4. Vital Interests (Article 6(1)(d))

**Definition**: Processing is necessary to protect someone's life or the life of a third party.

**When to use it:**
- Life-threatening emergencies (very narrow)
- Not relevant for routine platform operations

**Platform note**: Rarely applicable in day-to-day platform operations. Could theoretically apply if you received a credible safeguarding emergency, but not a basis to rely on for regular processing.

---

### 5. Public Task (Article 6(1)(e))

**Definition**: Processing is necessary for a task in the public interest or exercise of official authority.

**When to use it:**
- Public authorities and certain regulated bodies
- Not typically applicable to private consumer platforms

**Platform note**: Generally not relevant for commercial consumer platforms.

---

### 6. Legitimate Interests (Article 6(1)(f))

**Definition**: Processing is necessary for your (or a third party's) legitimate interests, unless those interests are overridden by the data subject's rights and interests.

**Requirements — the three-part test (Legitimate Interests Assessment / LIA):**
1. **Purpose test**: Is there a genuine legitimate interest? (Can be commercial, organisational, or third-party interests)
2. **Necessity test**: Is the processing necessary for that purpose? Is it the minimum needed?
3. **Balancing test**: Do the data subject's rights and interests override your interests? Consider: nature of data, reasonable expectations, impact on the data subject, safeguards in place

**When to use it:**
- Fraud detection and prevention
- Network/information security
- Safety processing (behavioural risk scoring, incident logging, safeguarding)
- Personalisation that users would reasonably expect
- Internal analytics to improve the service
- Some forms of direct marketing to existing customers (B2B more than B2C)

**When NOT to use it:**
- Processing that would surprise or disturb data subjects
- Processing children's data where impact is higher — must apply extra weight to children's rights
- As a lazy default when another basis fits

**Children and LI:**
- You can rely on legitimate interests for children's data, but the **balancing test tips harder** — children's interests carry more weight
- Safeguarding, safety logging, and incident response for children's services often pass the LI test with appropriate safeguards
- Behavioural advertising, profiling, or non-essential processing will generally **fail** the balancing test for children

> For full LIA guidance, the three-part test in detail, a documentation template, and when an LIA triggers a DPIA — see `knowledge/legitimate-interests-assessment.md`.

---

## Quick Reference: Common Platform Activities

| Activity | Recommended Basis | Notes |
|---|---|---|
| **Account & identity** | | |
| Account creation (name, email, DOB) | Contract | Necessary to provide the service |
| Login / session tokens / authentication | Contract | Necessary to maintain the authenticated session |
| Password reset and account recovery | Contract | Necessary to restore access to the contracted service |
| Profile updates (name, bio, avatar) | Contract | Maintaining the user's account as contracted |
| Account deletion and data removal | Legal obligation + Contract | Erasure rights under Art. 17; fulfilling the termination of contract |
| Suspended / banned account records | LI (safety + legal defence) | Retention needed to prevent re-registration and to defend enforcement decisions; define a proportionate retention period |
| Appeal and dispute records | LI (legal defence) | Reasonable to retain records of decisions in case of challenge |
| **Payments & transactions** | | |
| Processing a payment | Contract | Core transactional; also Legal obligation for financial records |
| Retaining financial records and invoices | Legal obligation | Companies Act / HMRC requirements (typically 6–7 years) |
| Fraud detection and chargeback prevention | LI (fraud prevention) | Recognised legitimate interest; conduct LIA; data minimisation applies |
| Creator / seller payouts | Contract | Delivering contracted remuneration |
| **Communications** | | |
| Transactional emails (receipts, booking confirmations, password resets) | Contract | Necessary to perform the service |
| Service notification emails (downtime, policy changes, security alerts) | LI (service operation) | Users reasonably expect operational communications; keep to genuine service matters |
| Marketing emails to opted-in users | Consent | Freely given, specific, withdrawable; also consider PECR (UK) / ePrivacy |
| Push notifications — operational | Contract / LI | Delivery of service; LIA needed if not strictly necessary |
| Push notification curfews for minors | LI (child welfare) | Clearly in children's best interests; low privacy impact |
| SMS / WhatsApp / in-app messaging | Consent or Contract | Depends on purpose — transactional = Contract; marketing = Consent |
| **Content & user-generated data** | | |
| Storing user-generated content (posts, uploads, messages) | Contract | User submitted it as part of using the service |
| Content moderation decisions and action logs | LI (safety + legal defence) | Necessary to enforce T&Cs and defend against regulatory or legal challenge |
| Automated content scanning for illegal content (CSAM hash-matching) | Legal obligation + LI | Required under OSA / national law; LI in child protection also applies |
| Proactive content classifiers (hate speech, self-harm, spam) | LI (safety + service integrity) | Must document LIA; proportionate detection; not used for unrelated profiling |
| User reports of harmful content and outcomes | LI (safety + legal defence) | Necessary for trust & safety operations and regulatory accountability |
| **Safety, security & trust** | | |
| Safety logging and behavioural risk scoring | LI (safety) | Proportionate for child-safety services; document LIA; short retention for non-incidents |
| Recording sessions / calls for safety review | LI (safety) | Needs strong safeguards; short retention policy for recordings not flagged |
| Incident reports involving children | LI (child safeguarding) | Legitimate interest in child protection; balance against privacy; retain for safeguarding purposes |
| Referrals to law enforcement / NCMEC | Legal obligation + LI | Mandatory reporting obligations under national law and OSA |
| Responding to law enforcement requests / court orders | Legal obligation | Police orders, court orders, regulatory demands |
| Fraud and abuse pattern detection (account-level) | LI (fraud + security) | Widely recognised; conduct LIA; minimise scope |
| IP address logging (access logs, server logs) | LI (security + service operation) | Short retention periods; not used for tracking or profiling without stronger basis |
| **Analytics & product** | | |
| Essential analytics (page load errors, crash reports, uptime monitoring) | LI (service operation) | Users expect the service to function; keep to aggregated/pseudonymised where possible |
| Error logging including user identifiers | LI (service operation) | Minimum necessary; short retention; access restricted to engineering |
| Product analytics (feature usage, funnel analysis) | LI (product improvement) or Consent | Pseudonymised aggregate data = LI likely fine; individual-level behavioural tracking = Consent or at minimum a robust LIA |
| A/B testing and product experimentation | LI (product improvement) or Consent | Depends on what data is processed; personalised experiments may need Consent; purely functional tests may rely on LI |
| Non-essential tracking / behavioural analytics | Consent | Cannot rely on LI for non-essential cookies or cross-site tracking (see PECR / ePrivacy) |
| Behavioural advertising | Consent | LI fails for minors under DSA/Children's Code; requires explicit consent for adults |
| User surveys and feedback collection | Consent or LI | Voluntary surveys = LI (users choose to respond); contact for research = Consent if unsolicited |
| **Age & identity verification** | | |
| Age assurance at sign-up (self-declared DOB) | Contract | Necessary to apply minimum age requirement |
| Enhanced age verification (ID check, credit card, third-party) | Contract + Legal obligation | Necessary for age-gated service; OSA may impose legal obligation for some services |
| Parental consent verification for under-13s | Legal obligation (GDPR Art. 8) | Required to rely on consent for ISS processing by under-13s |
| **Third parties & data sharing** | | |
| Sharing data with payment processors | Contract (necessary sub-processing) | Processor relationship; DPA required |
| Sharing data with cloud / infrastructure providers | Contract (necessary sub-processing) | Processor relationship; DPA required; international transfer rules apply if outside UK/EU |
| Sharing data with analytics/advertising SDKs | Consent (if non-essential) | Third-party tracking beyond what is necessary for the service requires Consent; review carefully |
| Responding to subject access requests | Legal obligation | Right of access under Art. 15; must comply |
| Data portability exports | Legal obligation | Right to portability under Art. 20 where basis is Consent or Contract |
| **Customer support** | | |
| Support tickets and correspondence | Contract + LI | Processing necessary to resolve the contracted service issue; LI in retaining records for quality and legal defence |
| Support data retention after account closure | LI (legal defence) | Retain for a defined period (e.g. limitation period) to defend claims; do not retain indefinitely |

---

## GDPR Article 8 — Children's Consent for Information Society Services

When you rely on **consent** specifically for information society services offered to children:

| Jurisdiction | Age threshold | Below threshold |
|---|---|---|
| UK (UK GDPR) | 13 | Parental authorisation required |
| EU default | 16 | Parental authorisation required |
| EU member states (can lower to 13) | 13–15 (varies by country) | Parental authorisation required |

**Reasonable efforts to verify:**
- You must make "reasonable efforts" to verify parental authorisation, taking available technology into account
- "Reasonable efforts" is proportionate — not the same as full ID verification in all cases
- ICO guidance: consider using parental email confirmation, small card charge, callback to parent, or third-party age-assurance provider

**Practical approach for most platforms:**
Design core functionality to rely on **contract and legitimate interests** (not consent) where possible, so Article 8 parental consent requirements only kick in for optional/higher-risk uses.

---

## Records and Documentation

You must maintain a **Record of Processing Activities (ROPA)** (Article 30) documenting:
- Categories of data and data subjects
- Purposes of processing
- **Lawful basis for each activity**
- Recipients and transfers
- Retention periods

This is an audit document — Ofcom and the ICO may ask to see it.
