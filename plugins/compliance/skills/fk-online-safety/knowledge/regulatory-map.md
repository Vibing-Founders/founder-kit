# Regulatory Map: Online Safety for Consumer Platforms

Covers UK, EU, and US obligations for platforms serving users aged 13+ (and excluding under-13s).

---

If you're a company letting 13–17s and adults use a social/comms product globally, your real constraints are:

- **UK:** UK GDPR + Data Protection Act 2018, the **Children's Code** (Age Appropriate Design Code), and the **Online Safety Act** (OSA).
- **EU:** GDPR + ePrivacy, the **Digital Services Act** (DSA), and **AVMSD** if you're a "video-sharing platform".
- **US:** **COPPA** (under-13s) + a patchwork of **state privacy / age-appropriate design / age-verification laws**.

---

## 1. UK

### 1.1 UK GDPR + Data Protection Act 2018

**What it is**
Core data protection regime (UK-flavoured GDPR). Special focus on children through guidance and Article 8 rules on child consent for "information society services" (ISS).

**When it applies**
- Established in the UK = always in scope.
- Applies to any personal data, worldwide, if processed in the context of your UK establishment.

**Key compliance points**
- **Lawful basis per processing activity.** Don't lean lazily on consent; use **contract** or **legitimate interests** where appropriate, but be careful with anything "high risk" (profiling, behavioural ads).
- **Children's consent:** if you *do* rely on consent for an ISS:
  - Under **13** → you need **parental authorisation**.
  - 13–17 can consent themselves *if* they understand it; you still owe higher protection.
- **Data minimisation & purpose limitation.** Collect only what you actually need; don't collect DOB, location, biometrics "just in case".
- **DPIA:** almost certainly required — minors + profiling + online comms ticks most "high risk" boxes.
- **Transparency:** privacy notice that a 13-year-old can realistically read; layered, with a simple front-layer for teens.

---

### 1.2 Children's Code (Age-Appropriate Design Code)

**What it is**
ICO's Children's Code — 15 standards for services "likely to be accessed by children", legally enforceable via UK GDPR / DPA. Applies to *all under-18s*, not just <13.

**When it applies**
Any site/app that *could realistically* be used by children in the UK — unless you robustly keep minors out.

**Key compliance points**

1. **Best interests of the child by design.** You must be able to argue, feature by feature, that the design doesn't put growth/engagement ahead of child welfare.
2. **High privacy by default for under-18s.** No public profiles by default; minimal visibility; no default discoverability/searchability.
3. **Data minimisation & profiling controls.** Switch **off** profiling & behavioural advertising for children by default. No "nudge" patterns pushing kids to lower privacy or share more data.
4. **Geolocation & tracking.** Geolocation **off by default** and never shown in real-time to strangers. No dark patterns to re-enable.
5. **Age-appropriate transparency & UX.** Explanations in plain, child-friendly language. Clear, prominent reporting and blocking tools.
6. **Robust governance.** DPIA specifically addressing children. Internal policies, training, and ongoing reviews of features that materially affect under-18s.

---

### 1.3 UK Online Safety Act 2023 (OSA)

**What it is**
Online safety regime for "user-to-user" and search services. Duties around **illegal content**, **child safety**, and **age assurance**. Ofcom is actively enforcing.

**When it applies**
If you allow users to interact (DMs, comments, group chats, video calls, UGC), you're very likely a regulated "user-to-user service".

**Key compliance points**

1. **Do risk assessments** for:
   - Illegal content (CSAM, grooming, threats, etc.).
   - Harmful content to children (self-harm, eating disorders, porn, etc.).
2. **Have proportionate safety measures:**
   - Reporting tools, blocking/muting, content moderation (human + automated).
   - Escalation paths for high-harm cases.
3. **Enforce age limits & age assurance:**
   - If parts of your service are adults-only, you need **"highly effective" age assurance** to keep under-18s out.
4. **Design out known harm patterns:**
   - Feeds, recommendations, livestreams, algorithmic amplification.
5. **Document everything:**
   - Risk assessments, safety policies, training, audit trails for how you respond to harm.

---

## 2. EU

### 2.1 EU GDPR + ePrivacy

**What it is**
GDPR (EU version) with **Article 8** rules on child consent for ISS, plus the ePrivacy Directive for cookies/tracking.

**Key differences from UK**
- Default rule: under **16** need parental consent where you rely on consent for ISS; member states can set it between **13–16**, so you must handle a **13–16 sliding scale** depending on user's country.
- ePrivacy: consent for non-essential cookies, analytics, tracking — stricter in practice when dealing with kids.

**Key compliance points**
- **Geolocation of users** (at least to country) so you can apply correct parental consent age thresholds and honour local DPA guidance.
- **No behavioural advertising or cross-site tracking on minors** without valid consent (in practice: just don't do it).

---

### 2.2 Digital Services Act (DSA)

**What it is**
EU-wide regime for online intermediaries. For platforms "accessible to minors", specific duties around risk assessments, design, and **no targeted ads to minors**.

**When it applies**
If you have **EU users** and you're an "online platform" (you host and disseminate user content), you're in scope.
VLOPs/VLOSEs (45M+ EU users) face much stricter obligations.

**Key compliance points**
- **Risk assessments** focused on minors: algorithmic feeds, addictive patterns, exposure to harmful content.
- **No targeted advertising to minors** based on profiling.
- **Default safety & privacy settings** for minors (privacy/safety/security by design).
- **Easy, anonymous reporting tools** for illegal content, especially CSAM.

---

### 2.3 Audiovisual Media Services Directive (AVMSD)

**What it is**
Special regime for **video-sharing platforms** (VSPs). Requires measures to protect minors from content likely to impair their development and from illegal content (terrorism, CSAM, etc.).

**When it applies**
If your service's main thing is sharing video (especially public/live) and you have EU users, you may be classified as a VSP.

**Key compliance points**
- Content classification & controls (labelling, age-gating).
- Reporting & takedown mechanisms for harmful audiovisual content.
- Advertising rules in video (no certain ads targeting kids, restrictions on HFSS foods, etc.).

---

## 3. US

### 3.1 COPPA (Children's Online Privacy Protection Act)

**What it is**
Federal law governing online collection of personal data from **children under 13**. Applies to child-directed services and "mixed-audience" services with actual knowledge of under-13s.

**When it applies**
- You intentionally serve under-13s **or**
- You have "actual knowledge" that under-13s are using the service.

**Key compliance points**

Decide your position:
- **Adults + 13–17 only** → you need **real age-gating** to keep under-13s out.
- **Mixed-audience including under-13s** → full COPPA compliance required.

If mixed-audience:
- **Verifiable parental consent** before collecting any personal info from a child.
- **Child-specific privacy notice** and direct parental notice.
- **Parental rights**: access, deletion, withdrawal of consent.
- **Data minimisation & security** geared to kids.

Note: FTC issued COPPA rule amendments in 2025 tightening requirements — verify current requirements with counsel.

---

### 3.2 State Privacy + Teen/Age-Appropriate Laws

Federal law currently has no comprehensive teen-privacy statute. Instead:

- **State consumer privacy laws** (CA, CO, CT, VA, etc.) with extra obligations for minors (opt-in for "sale"/"sharing", heightened consent, etc.).
- **Age-appropriate design code style laws** in Nebraska, Vermont and others (privacy-by-default, risk assessments, limits on profiling/sales for minors).
- **State age-verification laws** targeting content "harmful to minors" (rapidly proliferating across states).

**Practical approach for UK-primary platforms:**
Set a **conservative baseline**:
- Treat 13–17-year-olds as a **protected cohort** — no sale/sharing of their data for targeted ads; no addictive dark-pattern features targeted at teens.
- Maintain **US-specific notices & rights handling** for privacy laws.
- If hosting any content that could be "harmful to minors" under state laws: geoblock certain states or implement age verification.

---

## 4. Actionable Framework

### 4.1 Define age bands and policy

You need a crisp internal policy:

| Band | Policy |
|---|---|
| `<13` | Hard block or full parental-consent flow |
| `13–15` | Maximum protection; no ad profiling; strong supervision tools |
| `16–17` | Still minors; more functionality but with safeguards |
| `18+` | Standard adult experience |

Tie *everything* (onboarding, UI, moderation, ads, analytics) back to these bands.

---

### 4.2 Age-assurance strategy

- **Risk-based mix:**
  - Low-risk areas: soft self-declaration + behavioural signals + device-level hints.
  - High-risk (adult content, high-risk comms): stronger age checks (third-party providers, payment card checks).
- Must work for both **UK OSA duties** and **US COPPA/state laws**.
- Document your model: why is this "highly effective enough" for the content you host.

---

### 4.3 Data & ads policy for minors

Conservative baseline that satisfies UK Children's Code, EU DSA, and US state laws:
- **No behavioural advertising to anyone under 18.** If monetising teens, contextual advertising only.
- **No data "sale" or "sharing" for profiling of minors.**
- **Minimise data:** no precise location, contacts, or unnecessary biometrics from minors; short retention windows.

---

### 4.4 Safety, moderation, and reporting

Show regulators you've done the homework on harms:

**Risk assessments:**
- UK Online Safety Act: illegal content + child harms.
- EU DSA: systemic risks to minors.
- Internal opportunity vs risk mapping for grooming, harassment, self-harm, image-based abuse, etc.

**Controls in product:**
- Easy access to **block**, **report**, **mute**.
- Defaults: 13–17s can't be messaged by strangers; discoverability controlled.
- Strong policies for CSAM, grooming, extortion — including escalation to NCMEC (US) / IWF (UK).

**Operational capability:**
- Trained moderation staff.
- Law-enforcement response playbook.
- Logging and audit trails for major safety incidents.

---

### 4.5 Governance, documentation, and people

- **DPIA(s)** covering children + profiling + online comms, and cross-border transfers.
- **Records of processing** (Article 30 / UK equivalent).
- Consider appointing a **DPO** (or privacy officer) and **Safety lead** for OSA/DSA work.
- **Vendor management:** DPAs/SCCs with processors; check their own children/safety posture.
