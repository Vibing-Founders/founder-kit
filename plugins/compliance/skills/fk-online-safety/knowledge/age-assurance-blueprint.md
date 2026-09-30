# Age Assurance System Blueprint

> A concrete, architecture-level blueprint for an age-assurance system suitable for any platform, app, or website where minors (13–17) and adults may interact — including social platforms, marketplaces, communities, communication tools, and live or async content services. This is the minimum viable version that won't get you killed by regulators, while still being practical for a startup.

---

## Contents

1. Core Principles (the constraints we must satisfy)
2. Age Bands & Rules (how the system classifies users)
3. Verification Levels (L0 → L3 trust tiers)
4. The Actual Age-Assurance Flow (step-by-step UX + backend)
5. Signals & Risk Models (how you detect liars)
6. Edge Cases (VPNs, mismatched data, repeated evasion)
7. What to Log & Prove to Regulators
8. Roadmap for Hardening Later (Phase 2 & 3)

---

## 1. Core Principles

Your age-assurance system must satisfy four regulatory expectations (UK OSA, UK Children's Code, EU GDPR Article 8 + DSA, US COPPA/state laws):

### Must reliably block <13s

Unless you run full parental consent COPPA flows, the law expects you to keep under-13s out of ISS services.

### Must distinguish minors (13–17) from adults (18+)

This affects:
- privacy defaults
- contact restrictions
- content access
- ad rules
- safety workflows
- direct/private interaction eligibility (calls, DMs, live sessions)

### Must prevent minors from accessing adult-only areas

Especially private or direct interactions (calls, DMs, live sessions) with adults who have not been verified.

### Must be proportionate to risk and legal basis

Private or direct interactions between users (e.g. private messaging, live video, direct booking, real-time communication features) are **high-risk functionality** → requires **stronger** age assurance than a simple checkbox and, where you rely on **consent** for any child data processing, you must also respect **EU GDPR Article 8**:

- Honour each country's **age-of-digital-consent** (typically 16, but can be 13–16).
- Where a child is below that threshold and you rely on consent, ensure consent is **given or authorised by a parent/guardian**, with **reasonable efforts** to verify that authorisation.
- Where you rely on **non-consent bases** (e.g. contract or legitimate interests with strong safeguards), still treat all **under-18s as children** and apply high-privacy, safety-by-design defaults.

**Practical note on consent vs non-consent bases:**
- Core age assurance and safety processing (collecting DOB, risk-based age checks, logging safety events, gating access to content) will typically sit on **contract / legitimate interests**, not consent, even for 13–17s.
- **Consent flows under Article 8** are mainly reserved for: optional marketing and non-essential notifications to teens; tracking and behavioural advertising; secondary use of biometric-style data or session recordings beyond narrow safety/legal-defence use.

---

## 2. Age Bands & Rules

Define non-negotiable categories:

| Age Band | How Acquired | Allowed Features | Requirements |
|---|---|---|---|
| **<13** | Claimed or suspected | **No account on main product** | Hard block. A separate <13 COPPA/Children's-Code mode, if ever built, would be a distinct product with its own flows. |
| **13–15** | DOB + signals | Teen mode; no unsolicited direct contact; no adult matching | High privacy defaults; no behavioural ads |
| **16–17** | DOB + signals | More flexible but still minor | Direct interactions with adults only if adult is verified |
| **18+ (Unverified)** | DOB + signals | Access to standard 13+ features but **cannot initiate direct contact with minors** or access adult-only areas | Must verify before directly interacting with minors |
| **18+ Verified** | ID check | Can interact with minors *under strict rules* and access adult-only areas | Full KYC-style verification |

These discrete buckets allow rules to be deterministic.

---

## 3. Verification Levels (Trust Tiers)

Multiple levels keep friction low for most users but high assurance where needed.

### L0 — Self-declared Age Only (Insufficient for High-Risk Features)

- Just DOB field
- Not acceptable for accessing private or direct interaction features
- Only allowed for initial limited onboarding before safety checks kick in

### L1 — Risk-Based Age Assurance (Default)

Combines:
- DOB
- Phone verification
- Email domain
- Device fingerprint
- IP → country
- Browser / OS signals
- Behaviour patterns (detected later)

Acceptable for **minors interacting with minors**, but **not strong enough for adult ↔ minor direct interactions**.

### L2 — Soft Verification (Document Check Lite / Photo Match)

Options:
- Selfie + live liveness signal
- Selfie vs estimated age ML
- Card-based age validation (not payment)
- Mobile carrier age affirmation
- Database checks from age-assurance providers

Used to:
- Confirm 13–17 minor categorisation
- Confirm 18+ claims where the user wants access to adult features

### L3 — Hard Verification (Verified Adult)

Required for **any adult interacting with a minor**.

Includes:
- Government ID (passport/driving licence)
- Liveness test
- Fraud checks
- Document validity checks (MRZ, holograms, chip read optional)
- Optionally: sanctions list, PEP screen (not required but good for trust & safety)

Outcome: user becomes **18+ Verified**.

This creates a **tight gate** for adult–minor communication.

---

## 4. The Actual Age-Assurance Flow (End-to-End)

### Step 1 — Onboarding: Ask for DOB

User inputs date of birth.

Store DOB once (day/month/year) and then **always derive the current age and age band on the fly** when needed (so users naturally move from 17 → 18+ over time without a manual flag flip).

If, at signup time, the derived age is:
- `<13` → **block** from the main product. (If you ever build a separate <13 experience, it would use a distinct COPPA/Children's-Code-compliant parental-consent flow.)
- `13–17` → complete onboarding as a user treated as a **minor** wherever age matters.
- `18+` → complete onboarding as an **adult user**; if/when they seek access to high-risk features or adult-only areas, they must then pass **L3 ID verification**.

Record only year/month/day — avoid unnecessary granularity for privacy.

---

### Step 2 — Collect soft signals (risk-based)

Simultaneously collect:
- IP → country
- Device fingerprint
- Email domain → teen indicator
- Mobile number (SMS OTP)
- Behaviour (if registering via mobile, look for patterns typical of minors or adults)

These populate an **initial risk score**.

---

### Step 3 — Age-reality check (automated)

Run a "reality check":
- Does estimated age (via optional selfie model) mismatch claimed age?
- Is the user claiming to be 18 but looks 12?
- Is the user claiming 13–15 but behaving like a VPN adult evader?

Outcome:
- **Pass** → keep them in their age band
- **Uncertain** → require **L2 Soft Verification**
- **Fail** → require **L3 ID verification** or block

---

### Step 4 — Feature gating based on verification level

| Feature | 13–15 | 16–17 | 18+ Unverified | 18+ Verified |
|---|---|---|---|---|
| Receive unsolicited direct contact | ❌ | ❌ | ❌ | ❌ |
| Initiate direct contact with unverified adults | ❌ | ❌ | n/a | n/a |
| Initiate direct contact with verified adults | ✔ Teen safeguards | ✔ Teen safeguards | ❌ | n/a |
| Adult initiating direct contact with minor | n/a | n/a | ❌ | **✔ Only with strict controls** |
| Exchange files/images in private context | ❌ | ❌ | ❌ | ❌ |
| See other user contact info | ❌ | ❌ | ❌ | ❌ |

Media visibility rules (for platforms with selfies/recordings):
- For **13–17s**, media is **private by default** (only in the session context and a personal area).
- Any broader visibility (profile galleries, discovery feeds, promotional use, model-training reuse) must be:
  - **Explicitly opted into** on a **per-item** basis, and
  - **Gated by age band, jurisdiction, and local child-consent rules** where you rely on consent.

---

### Step 5 — Mandatory friction for sensitive transitions

Examples:
- User claims 18 → must pass L2/L3 verification to access high-risk features (direct minor interactions, adult-only areas)
- User claims minor → system automatically enables teen safety mode, cannot be disabled
- If risk signals increase later (VPN, new device, weird behaviour) → prompt user to reverify

---

### Step 6 — Reverification triggers

Regulators expect ongoing assurance, not one-time checks.

Triggers to prompt reverification:
- New device or browser
- Suspicious behavioural patterns
- Attempts to connect with multiple minors
- Report history
- Failed liveness attempts
- "Looking much younger" via selfie age model

---

## 5. Signals & Risk Models

This is the secret sauce that makes the system regulator-credible.

### Identity/age consistency signals

- DOB vs estimated age
- DOB vs email domain (e.g., .ac.uk implies ~18+)
- Phone number origin (prepaid = riskier)
- GEO mismatches
- Device metametrics (low-end Android often minor-associated; repeated resets indicate evasion)

### Behavioural risk signals

- Rapid-fire account creation
- Attempting to message many minors
- Repeated matching attempts after rejection
- Switching age to bypass restrictions
- Logging in via privacy VPN consistently (suspicious but not automatic block)

### Social graph signals

- Whether minors are finding/reporting the user
- Whether they receive reports for sexual content
- Pattern of escalating risk (brief interaction attempts, reattempts, repeatedly seeking minors)

These feed a dynamic **Trust Score** dictating whether additional verification is required.

---

## 6. Edge Cases

### VPN / IP masking
Do not block outright, but increase required verification level (L2 or L3).

### User changing their DOB
Permitted once within 24 hours. After that → L3 verification required.

### Logged-in user using new device
Trigger L2 verification.

### Minor trying to access adult-only feature
Auto-block + warning. Log attempt. Add score to risk model.

### Adult repeatedly trying to contact minors without verification
Auto-flag. Lock account. Require L3 verification or permanently ban.

---

## 7. What to Log (Regulator asks for this)

Your age-assurance engine must produce defensible audit logs:

- DOB at registration
- Age-verification method used
- Verification timestamps
- Risk signals and risk score changes
- Blocks/restrictions automatically applied
- Attempts to access restricted areas
- Attempts to contact minors
- All reverification attempts + success/failure
- All moderation actions linked to user's age status

Regulators don't need session content, but they need **proof that your system works**.

---

## 8. Roadmap: Phase 1 → Phase 2 → Phase 3

### Phase 1 (MVP, still compliant)

- DOB field
- SMS-based verification
- Device fingerprint
- IP detection
- Behaviour-based risk model
- L3 verification for adults initiating direct contact with minors
- Teen mode defaults

### Phase 2 (Stronger assurance, regulator-audit-ready)

- Selfie-based age estimation
- Dynamic reverification
- AI-based grooming signal detection
- Automated blocking of bad patterns
- Identity verification for high-risk user roles by default (e.g. anyone who can initiate contact with minors)
- Teen-safe flows (UI, copy, restrictions)

### Phase 3 (Gold standard, big-platform maturity)

- Chip-based ID verification (NFC)
- Contracted Trust & Safety escalation team
- Automated real-time explicit-content detection
- Continuous monitoring models
- Penetration-tested evasion detection
- On-device child-safety classifiers
