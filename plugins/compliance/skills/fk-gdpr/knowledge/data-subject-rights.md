# GDPR Data Subject Rights

> Reference guide to the eight rights of data subjects under UK GDPR / EU GDPR (Articles 12–22), including obligations, timelines, and platform implementation notes.

---

## Overview

Data subjects (your users) have **eight rights** under GDPR. You must:
1. Inform users of their rights (in your privacy notice)
2. Have processes to handle requests without undue delay
3. Respond **within one month** (extendable to three months for complex requests)
4. Not charge a fee (unless requests are manifestly unfounded or excessive)
5. Verify the identity of the requester before actioning sensitive requests

---

## The Eight Rights

### 1. Right to Be Informed (Articles 13–14)

**What it is**: Users must be told how you use their data, proactively, before or at the time of collection.

**What you must provide:**
- Identity and contact details of the controller (and DPO if applicable)
- Purposes and lawful basis for each processing activity
- Legitimate interests relied on (if using Article 6(1)(f))
- Recipients or categories of recipients
- Any transfers to third countries and safeguards
- Retention periods (or criteria used to determine them)
- Details of data subject rights
- Right to withdraw consent (if processing based on consent)
- Right to lodge a complaint with the ICO/supervisory authority
- Whether provision of data is statutory/contractual and consequences of not providing it
- Existence of automated decision-making, including profiling

**For children**: Must be in clear, age-appropriate language. The ICO requires a child-friendly summary layer. Consider a simple "What we do with your data" explanation alongside the full privacy policy.

**Timing:**
- Data collected directly from data subject: inform at time of collection
- Data collected from third parties: inform within one month (or before first communication if sooner)

---

### 2. Right of Access (Article 15) — Subject Access Request (SAR)

**What it is**: Data subjects can request a copy of all personal data you hold about them plus information on how you use it.

**What you must provide:**
- Confirmation of whether you process their personal data
- Copy of the personal data itself
- The supplementary information (same as Right to Be Informed: purposes, lawful basis, retention, recipients, etc.)
- Information about automated decision-making

**Timeline**: Respond within **one month**. Extendable to **three months** for complex or numerous requests (notify the data subject within the first month explaining the extension).

**Format**: Electronic format if the request was made electronically. Common formats: PDF, CSV, JSON export.

**Exemptions (UK GDPR has more than EU GDPR):**
- Legal professional privilege
- Crime and taxation
- Management information (pre-decisional)
- Regulatory functions
- Must still provide what you can, even if exemptions apply to some data

**Platform implementation notes:**
- Build a "Download your data" feature covering all data you hold
- Ensure it covers: account data, session metadata, messages, safety logs where not exempt, bookings, payment history (minus card numbers)
- Create an internal SAR handling process with logged response times
- Assign responsibility (often the DPO or privacy lead)

---

### 3. Right to Rectification (Article 16)

**What it is**: Users can ask you to correct inaccurate or incomplete personal data.

**Timeline**: Without undue delay (typically interpret as one month).

**What this means in practice:**
- Provide easy in-app ways to update profile information (name, email, DOB)
- For data held in logs or archives that cannot be edited: document the correction and note it in the record
- If you've shared inaccurate data with third parties, notify them

**Note on DOB and age band**: A user asking to "correct" their DOB to gain access to adult features is a different situation — you can require verification before accepting DOB changes.

---

### 4. Right to Erasure / Right to Be Forgotten (Article 17)

**What it is**: Users can request deletion of their personal data in certain circumstances.

**When the right applies:**
- Data no longer necessary for the original purpose
- Consent withdrawn and no other lawful basis
- Objection to processing and no overriding legitimate grounds
- Data unlawfully processed
- Legal obligation to erase

**When you can refuse (legitimate grounds to retain):**
- Freedom of expression and information
- Legal obligation (e.g. financial records you're legally required to keep)
- Public health in the public interest
- Archiving, research, or statistical purposes in the public interest
- Legal claims (you can retain data needed for ongoing or potential litigation)
- **Safety investigations**: data retained under legal obligation or legitimate interests for active safety/legal proceedings can be retained despite erasure requests

**Timeline**: Without undue delay (one month standard).

**Platform implementation notes:**
- Build an account deletion flow that erases core personal data
- Define clearly what gets deleted vs. what you retain under exemptions:
  - **Delete**: profile, content, preferences, messages (after retention period), payment details
  - **Retain temporarily**: transaction records (legal obligation, typically 7 years), safety logs for active investigations, CSAM evidence (legal obligation)
  - **Pseudonymise/aggregate**: analytics data that doesn't need to be linked to a real person
- Cascade deletions to third-party processors where possible
- Document what you retained and why if you can't fully erase

---

### 5. Right to Restriction of Processing (Article 18)

**What it is**: Users can ask you to pause or limit processing of their data in certain circumstances, while the data remains stored.

**When the right applies:**
- Accuracy is contested (user disputes it; you need time to verify)
- Processing is unlawful but user prefers restriction to erasure
- You no longer need the data but user needs it for legal claims
- User has objected to processing and you're assessing whether your legitimate grounds override

**What restriction means**: You can still store the data but must not actively process it (no using, sharing, analysing it) — except with consent, for legal claims, to protect others' rights, or for important public interest.

**Timeline**: Apply restriction promptly; notify the user before lifting restriction.

**Platform implementation notes:**
- Implement a "restrict processing" flag at the user level in your data systems
- Ensure restricted user data is not included in analytics, recommendations, or processing pipelines
- Document the restriction and its grounds

---

### 6. Right to Data Portability (Article 20)

**What it is**: Users can receive their data in a **structured, commonly used, machine-readable format** and transmit it to another controller.

**When it applies**: Only when processing is:
- Based on **consent** or **contract** (not legitimate interests or legal obligation)
- Carried out by **automated means**

**What you must provide**: The data the user provided to you (not data you derived or inferred about them — that belongs to you), in machine-readable format (JSON, CSV).

**Timeline**: One month.

**Platform implementation notes:**
- Build a "Download your data" export (JSON or CSV) covering data provided by the user: profile data, booking history, messages they sent, uploaded media, settings
- You do NOT need to export safety logs, internal risk scores, moderation notes
- This often overlaps with the SAR — combining both responses in a single export is sensible

---

### 7. Right to Object (Article 21)

**What it is**: Users can object to processing based on **legitimate interests** or **public task**.

**What happens when they object:**
- You must stop processing **unless** you can demonstrate compelling legitimate grounds that override their interests, rights, and freedoms, or the processing is for legal claims
- For **direct marketing**: objection is absolute — you must stop, no compelling grounds argument available
- For other purposes: you must balance their objection against your grounds

**For profiling related to direct marketing**: objection to processing for direct marketing automatically includes objection to profiling for that purpose.

**Timeline**: Acknowledge promptly; stop processing immediately if objection is to direct marketing.

**Platform implementation notes:**
- Provide a clear "opt out of [purpose]" mechanism in settings for all processing you rely on legitimate interests for
- Direct marketing unsubscribe must work immediately and be permanent
- Log all objections and actions taken

---

### 8. Rights Related to Automated Decision-Making and Profiling (Article 22)

**What it is**: Protection against decisions made solely by automated processing that have legal or similarly significant effects.

**When it applies**: Only automated decisions (no meaningful human involvement) that produce legal effects or similarly significant effects (e.g. credit scoring, job filtering, insurance pricing).

**Rights if it applies:**
- Right to obtain human review
- Right to express their point of view
- Right to contest the decision

**Exemptions**: Allowed if necessary for a contract, authorised by law, or based on explicit consent — but must still provide safeguards and human review option.

**Platform note**: Safety risk scoring and age classification are typically not "solely automated decisions" if there's human review capability in your moderation process. Document this. Automated bans triggered by AI without any human review could be in scope — consider building in human appeal flows.

---

## Handling Requests in Practice

### Process checklist

- ☐ Verify identity of requester (ask for the email address on the account; consider additional verification for high-risk deletions)
- ☐ Log the request with timestamp
- ☐ Respond within one month (calendar days from receipt)
- ☐ If you need an extension (complex/multiple requests): notify within the first month, explain why, new deadline is three months from original request
- ☐ Never charge a fee unless the request is manifestly unfounded or excessive (and even then, you can refuse rather than charge)
- ☐ If you refuse: explain why, provide information about right to complain to the ICO/supervisory authority, and right to seek a judicial remedy
- ☐ Document everything: what was requested, how you responded, what data was affected

### Timelines summary

| Stage | Deadline |
|---|---|
| Acknowledge receipt | Promptly (within a few days is good practice) |
| Substantive response | Within **1 month** of receipt |
| Extension notification | Within **1 month** if you need extension |
| Maximum response time with extension | **3 months** from original receipt |

### Children making requests

- A child who is old enough to understand their rights can exercise them directly (ICO guidance)
- Parents/guardians can also make requests on behalf of younger children
- Consider age of the child and maturity in practice — a 14-year-old SARing their own data is valid; a parent SARing an adult child's data is not unless there's evidence of incapacity

---

## ICO Enforcement Notes

- The ICO investigates complaints from data subjects where controllers have not responded to rights requests
- Typical enforcement: reprimand letters, formal enforcement notices, and in serious cases fines (up to £17.5m or 4% global turnover)
- Common failures: ignoring requests, providing incomplete responses, charging unjustified fees, taking longer than one month without explanation

---

## Cross-Reference

- **Lawful basis for processing**: see `lawful-basis.md`
- **Children's data specifics**: see `childrens-data.md`
- **GDPR legislation full text**: see `../../_shared/legislation/uk-gdpr.md` and `eu-gdpr.md`
