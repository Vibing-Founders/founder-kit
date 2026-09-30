# Benchmark: TikTok Age Verification & Teen Safety Policies

> Analysis of TikTok's teen safety approach — one of the most studied and cited examples in the industry. Useful as a benchmark when designing your own age assurance and teen safety systems.

---

## 1. Global Age Requirements & Verification

TikTok's **Terms of Service require users to be at least 13 years old** (with higher minimums in certain regions, e.g. 16 in some EU member states under local digital consent rules).

**Age gate at sign-up:**
- Users must enter a birthdate when creating an account
- Anyone under the minimum age is blocked from signing up
- **TikTok prevents quick re-tries**: if a user enters an underage DOB, they are blocked from immediately trying again with a different birthdate (rate-limiting / device-level lock for a period)

**Multi-layered age assurance approach** — not just upfront ID checks:
- Proprietary ML systems analyse profile content, device/browser signals, and behaviour to detect likely underage users after onboarding
- Moderators and AI review accounts flagged as likely underage and ban them proactively
- TikTok has described removing tens of millions of suspected underage accounts globally per year

---

## 2. Teen-Specific Feature Restrictions by Age Band

TikTok applies automatic restrictions based on self-declared age. Key restrictions:

### Under 13
- Blocked from creating an account on the main TikTok product
- A separate supervised "younger users" experience exists in some markets

### 13–15
- **Accounts are private by default** — only friends can see content or follow
- **DMs are disabled** — cannot send or receive direct messages
- **Duet/Stitch is disabled** — cannot remix others' content
- **No live streaming** — cannot go live or send/receive gifts
- **No suggested accounts feature** (reduces discoverability)
- **Screen time settings**: prompted to set daily limits; after 60 mins/day, a passcode is required to continue

### 16–17
- DMs enabled, but only friends can DM them (not strangers)
- Can go live (but not receive virtual gifts unless parental consent given)
- Can post public content (but with higher privacy defaults than adults)
- **Suggested accounts** are available but with curated content
- Screen time tools still offered

### 18+
- Full product functionality, including gifts, creator monetisation, live, DMs

---

## 3. Family Pairing (Parental Controls)

TikTok's **Family Pairing** allows a parent/guardian account to link to a teen's account:

**What parents can control:**
- **Screen time limits** — set daily maximums; lock with a passcode
- **Restricted mode** — filter out content that may not be appropriate for all audiences
- **Direct messages** — disable DMs entirely for the teen
- **Discoverability** — control whether the teen's account is public or private
- **Content preferences** — limit certain content topics

**How it works:**
- Parent and teen both need TikTok accounts
- Linked via QR code scan
- Changes made by the parent apply to the teen's account in real-time
- Teen cannot override parental controls without the parent's passcode

**Limitations (acknowledged by TikTok):**
- Relies on the teen's account having an accurate age — if they signed up with a false DOB, they may not be in the correct age tier
- Parents need their own TikTok account
- Not available in all markets

---

## 4. Default Settings for Minors (Privacy & Safety)

As of the most recent public disclosures:

| Setting | Under 16 | 16–17 |
|---|---|---|
| Account visibility | Private (default, locked) | Private (default, can change) |
| DMs | Disabled | Friends only |
| Discoverability in search | Reduced / off by default | Available |
| Live streaming | Disabled | Available (no gifts without consent) |
| Duet/Stitch | Disabled (13–15) | Available |
| Ads personalisation | Off by default | Off by default |
| Screen time prompts | Yes (60 min threshold) | Yes |
| Safety popups | Yes (at onboarding and periodically) | Yes |

---

## 5. Content Moderation for Teen-Related Content

**Automated systems:**
- Keyword and phrase detection for grooming cues, sexual language, external contact solicitation
- CSAM hash matching (PhotoDNA and equivalent)
- Live stream monitoring with human + AI review
- Age-appropriate content ranking — teens see less graphic or disturbing content in their For You feed

**Human moderation:**
- Large global moderation workforce reviewing flagged content
- Escalation to NCMEC (US), IWF (UK), and local law enforcement for CSAM
- Priority queuing for reports from or involving minors

---

## 6. Screen Time & Wellbeing Tools

**Innovations TikTok has introduced (worth benchmarking):**
- **Daily screen time limits** with passcode protection (for teens, 60 min default; under 13: 60 min hard cap in supervised mode)
- **Notification curfews**: no push notifications sent between 9pm–8am for under-16 accounts (UK, and rolled out elsewhere)
- **Break reminders**: prompts to take a break after extended viewing
- **Sleep reminders**: for users under 16 in certain markets
- **Wellbeing summary screen**: weekly report on usage patterns surfaced in-app
- **"Take a break" feature**: pauses the feed and prompts a mindful pause

These features emerged from regulatory pressure (UK OSA / Children's Code) and are now being adopted across the industry.

---

## 7. Age Assurance — Lessons from Enforcement Pressure

TikTok has faced regulatory action in multiple jurisdictions regarding underage users:
- **FTC (US)**: $5.7m settlement in 2019 for COPPA violations (collecting data from under-13s without parental consent); further scrutiny ongoing
- **ICO (UK)**: £12.7m fine in 2023 for allowing estimated 1.4m UK children under 13 to use the platform and misusing their data
- **EU/DSA**: Under investigation by multiple national DSCs for child protection provisions

**Key lesson from enforcement**: Self-declared age + no follow-up is not enough. Regulators expect *proactive* detection of underage users, not just blocking at signup.

---

## 8. What Other Platforms Should Take from TikTok's Model

### Do copy:
- **Rate-limiting DOB retries** at signup (prevents trivial evasion)
- **Private-by-default + DMs-off** for 13–15 as a hard default
- **Family Pairing / parental controls** as a safety feature (not just a legal checkbox)
- **Notification curfews** for under-16 (9pm–8am)
- **Post-signup behavioural detection** for age inconsistencies
- **Screen time limits with passcode** for teen accounts

### Avoid:
- Relying solely on DOB input without any secondary signals
- Treating verified-adult status as permanent (reverification triggers matter)
- Weak CSAM detection at scale

### Adapt for your context:
- TikTok is a video feed / UGC platform; platforms with private or real-time direct interactions between users have different and often higher risk surfaces than a broadcast-style feed
- TikTok's scale allows ML-heavy approaches; smaller platforms should focus on structural controls (verified-only access, mandatory call gating) rather than hoping ML will catch bad actors
