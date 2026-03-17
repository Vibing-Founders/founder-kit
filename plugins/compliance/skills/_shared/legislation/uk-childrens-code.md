# UK Age Appropriate Design Code (Children's Code)
> **Source**: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/
> **Compiled**: From training knowledge (August 2025 cutoff) — verify against current official text
> **Enforcement body**: Information Commissioner's Office (ICO)
> **Scope**: Providers of "information society services" that are likely to be accessed by children (under 18) in the UK. Enforcement is via UK GDPR / Data Protection Act 2018.

## Quick Reference

| Threshold / Penalty | Detail |
|---|---|
| Age threshold | Under 18 years |
| Enforcement basis | UK GDPR / DPA 2018 |
| Maximum fine | £17.5 million or 4% of global annual turnover (whichever is higher) |
| "Likely to be accessed by children" | Objective test — terms of service prohibitions do not eliminate duty |
| Number of standards | 15 |
| Came into force | 2 September 2020 (12-month transition); enforceable from September 2021 |

---

## Overview

The Age Appropriate Design Code (commonly "Children's Code" or "AADC") is a statutory code of practice issued by the ICO under section 123 of the Data Protection Act 2018. It sets 15 standards that providers of online services must meet when children are likely users. The Code does not create separate legal obligations — rather, compliance with the standards constitutes good practice in meeting the requirements of UK GDPR. Failure to follow the Code is evidence of a UK GDPR breach.

The ICO took its first major enforcement action under the Code in 2023 (TikTok, £12.7 million fine for processing children's data without consent).

---

## Applicability: "Likely to Be Accessed by Children"

A service is "likely to be accessed by children" if it is reasonable to expect that a significant number of children will access it, having regard to:
- The subject matter and purpose of the service.
- The way the service is presented or marketed.
- Evidence about who actually uses the service.
- Whether the service is directed at children.

**Important**: A service cannot avoid the Code by including a minimum age in its terms of service, if in practice children are likely to use it. Providers must take positive steps to assess this.

---

## Standard 1 — Best Interests of the Child

**Requirement**: The best interests of the child should be a primary consideration when designing and developing online services likely to be accessed by children.

**Practical compliance notes**:
- Document how the best interests standard informed design decisions.
- Where there is a tension between commercial interests and children's interests, children's interests should take precedence.
- Conduct child-specific user research or review evidence from child psychology research.
- Ensure product decisions are not solely optimised for engagement or monetisation where this conflicts with wellbeing.
- Appoint a member of leadership with responsibility for children's interests in design.

---

## Standard 2 — Data Protection Impact Assessments

**Requirement**: Undertake a DPIA to assess and mitigate the risks to children arising from data processing before they can access the service.

**Practical compliance notes**:
- A children's DPIA is required even where you have already done a general DPIA.
- It must specifically address: the age range of children likely to access the service, their particular vulnerabilities, and how the proposed data processing affects them.
- Review and update the DPIA when the service changes materially.
- Document the DPIA process, including who was consulted and what decisions were made.
- The DPIA should inform all 15 standards — it is the foundation document.

---

## Standard 3 — Age Appropriate Application

**Requirement**: Take a risk-based approach and apply the standards proportionately, having regard to the age range of children likely to be accessing the service.

**Practical compliance notes**:
- Tailor protections to the likely age of children accessing your service (a service primarily used by teenagers is different from one used by primary school children).
- Use age estimation or age verification where needed to apply age-appropriate settings.
- Do not apply a uniform "child" standard where there is a spectrum — a 7-year-old has different needs from a 16-year-old.
- Default settings should be appropriate for the youngest likely user, unless age is verified.

---

## Standard 4 — Transparency

**Requirement**: Privacy information must be concise, prominent, and in plain language suited to the age of the child. Do not use deceptive or confusing language.

**Practical compliance notes**:
- Provide layered privacy information — brief, child-friendly summary with a link to full policy.
- Use visuals, icons, or video to explain privacy practices to younger children.
- Avoid legal jargon in child-facing privacy notices.
- Make privacy information accessible at the point of data collection, not buried in lengthy documents.
- If the service is used by children of a wide age range, consider age-differentiated explanations.

---

## Standard 5 — Detrimental Use of Data

**Requirement**: Do not use children's personal data in ways that are detrimental to their wellbeing or that go against their best interests, even if technically permissible.

**Practical compliance notes**:
- This goes beyond lawful processing — even lawful processing can be detrimental.
- Do not profile children to serve them addictive or engagement-maximising content that could harm mental health.
- Do not use children's data to exploit vulnerabilities (e.g., targeting children with ads at times of vulnerability or distress).
- Do not sell children's personal data to data brokers or third-party advertisers.
- Regularly review whether data uses are producing harmful outcomes for child users.

---

## Standard 6 — Policies and Community Standards

**Requirement**: Uphold published terms, policies, and community standards including those that set age limits.

**Practical compliance notes**:
- If you say under-18s cannot access a feature, enforce it.
- Do not apply policies inconsistently in ways that disadvantage children.
- Clearly communicate community standards in age-appropriate language.
- Actively enforce child-related policies rather than relying solely on user reporting.

---

## Standard 7 — Default Settings

**Requirement**: Privacy settings must be set to high privacy by default. Do not require children to take action to protect their privacy — privacy should be on by default.

**Practical compliance notes**:
- Default: private accounts (not public).
- Default: location services off.
- Default: direct messaging from strangers off.
- Default: content recommendations based on interests (not behavioural profiling) if the service provides any recommendations.
- Default: no cross-context behavioural advertising.
- Default: notification settings at the minimum level necessary.
- Children should be able to choose to lower privacy settings, but the starting point must be high privacy.

---

## Standard 8 — Data Minimisation

**Requirement**: Collect and retain only the minimum personal data necessary to provide the elements of the service the child is using. Do not collect data speculatively for future use cases.

**Practical compliance notes**:
- Audit all data fields collected from child users — challenge each one with "is this strictly necessary?"
- Do not collect persistent identifiers (e.g., device ID, advertising ID) unless strictly necessary.
- Set retention periods for children's data that are as short as possible.
- Automatically delete children's data when no longer needed (do not hold indefinitely).
- Do not collect additional data purely because a child interacts with more features.

---

## Standard 9 — Data Sharing

**Requirement**: Do not disclose children's personal data to third parties unless it is necessary to provide the service requested by the child, or the child has made an informed choice to share their data.

**Practical compliance notes**:
- Do not share children's data with advertising networks, data brokers, or analytics providers who will use it for commercial purposes beyond the service.
- Where third-party SDKs or plugins are used, ensure they cannot access children's data for their own purposes.
- Do not share children's data with social login providers in ways the child would not expect.
- Review all data sharing agreements and data processing addenda for third-party services.

---

## Standard 10 — Geolocation

**Requirement**: Switch geolocation options off by default. Do not display the geolocation of a child to other users. Only collect geolocation data where necessary and proportionate. Provide an obvious sign to the child when location is being collected.

**Practical compliance notes**:
- Never share a child's precise location with other users by default.
- If the service uses location (e.g., for local events), collect the minimum necessary precision (e.g., city-level rather than street-level).
- Display a persistent, visible indicator when location is active.
- Provide easy access to disable location collection at any time.
- Never retain geolocation data beyond the immediate purpose.

---

## Standard 11 — Parental Controls

**Requirement**: If you provide parental controls, give the child age appropriate information about them.

**Practical compliance notes**:
- This standard is about transparency, not about mandating parental controls.
- If you offer parental oversight features, explain to the child what parents can and cannot see.
- Do not implement parental controls in a covert or deceptive manner.
- Consider age-differentiated approaches: younger children may benefit from more parental oversight; teenagers deserve more privacy.
- Parental controls must not themselves become surveillance tools that collect excessive data about children.

---

## Standard 12 — Profiling

**Requirement**: Switch profiling (including for content recommendation, targeted advertising, or behaviour-based features) off by default. Only allow profiling if a user opts in and there is a compelling reason in the child's best interests.

**Practical compliance notes**:
- Do not use behavioural profiling to personalise content for children by default.
- Do not build personality, interest, or vulnerability profiles on children.
- Do not serve targeted advertising to children based on profiling (this overlaps with the DSA's prohibition — see eu-digital-services-act-2022.md).
- Interest-based recommendations (e.g., "you watched cat videos, here is another cat video") may be acceptable if proportionate; comprehensive behavioural profiling is not.
- Review all ML/AI systems that process children's data to assess whether they constitute profiling.

---

## Standard 13 — Nudge Techniques

**Requirement**: Do not use nudge techniques (dark patterns) to encourage children to provide more personal data than necessary, weaken their privacy settings, or use the service in ways that are not in their best interests.

**Practical compliance notes**:
- Examples of prohibited nudge techniques:
  - Pre-ticked boxes that expand data sharing.
  - Using emotional language to discourage children from choosing privacy-protecting options.
  - Making it much harder to opt out than to opt in.
  - "Streaks" or social pressure mechanisms designed to increase compulsive use.
  - Countdown timers or false urgency to accept privacy-invasive options.
- Conduct regular UX audits from a "dark patterns" perspective.
- Review push notifications, gamification elements, and social comparison features for nudge effects.

---

## Standard 14 — Connected Toys and Devices

**Requirement**: If you provide connected toys or devices, ensure those devices follow these standards. Do not use connected devices to collect more data than is necessary for the service.

**Practical compliance notes**:
- Relevant to IoT products, smart speakers, wearables, and similar devices used by children.
- Device firmware must not silently collect and transmit data without disclosure.
- Ensure device microphones/cameras cannot be activated remotely without child/parent awareness.
- Apply the same data minimisation and default privacy settings to device-collected data.

---

## Standard 15 — Online Tools

**Requirement**: Provide prominent and accessible tools to help children exercise their data rights and report concerns.

**Practical compliance notes**:
- Provide in-app access to: view their data, request deletion, correct inaccuracies, complain about content or data use.
- Tools must be age-appropriate and genuinely usable by children (not buried in settings menus, not written in legal language).
- For younger children, consider whether parental access to these tools is appropriate.
- Link data rights tools from the privacy notice and from profile/settings pages.
- Reporting tools should be quick (ideally one or two taps) and produce a visible acknowledgement.

---

## Interaction with the Online Safety Act 2023

The Children's Code and the Online Safety Act 2023 overlap for services likely to be accessed by children:

- The **Children's Code** focuses on **data protection** — how personal data is processed, retained, and used.
- The **OSA 2023** focuses on **content safety** — what content children can encounter and what age assurance is required.
- Both are enforced by different regulators (ICO vs. Ofcom) but both require a children's risk assessment.
- Providers should produce a unified children's risk assessment that satisfies both.
