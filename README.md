# VibingFounders — Plugin Marketplace

A Claude plugin marketplace hosting bootstrapping founder focused plugins for website, platform, and app builders.

---

> **Legal disclaimer**
>
> The content produced by these plugins — including compliance assessments, checklists, Legitimate Interests Assessments, Data Protection Impact Assessments, Children's Risk Assessments, and any other outputs — is **for informational purposes only**. It does not constitute legal advice and should not be relied upon as such.
>
> Compliance with applicable law depends on your specific facts, business model, jurisdiction, and circumstances, which an AI tool cannot fully assess. You should have any compliance documentation reviewed by a qualified legal professional — a solicitor, barrister, or specialist data protection or regulatory counsel — before relying on it.
>
> Use of these plugins does not create a solicitor-client relationship or any other professional relationship between you and the plugin authors.
>
> **Not suitable for regulated industries**: If your project operates in a heavily regulated sector — financial services, healthcare, insurance, legal services, or similar — you face additional sector-specific regulatory obligations that these plugins do not address. Do not use these plugins as a substitute for specialist compliance advice in those contexts.
>
> Laws and regulatory guidance change. The information in these plugins reflects the legislation and guidance available at the time of writing and may not reflect subsequent amendments, new guidance, or regulatory decisions.
>
> No warranty is given as to the accuracy, completeness, or currency of any information produced by these plugins. You use this content entirely at your own risk.

---

## Install this marketplace

```
/plugin marketplace add Vibing-Founders/VibingFounders
```

Once added, you can install any plugin from this marketplace:

```
/plugin add compliance@VibingFounders
```

---

## Available Plugins

| Plugin | Description | Skills |
|--------|-------------|--------|
| `compliance` | Online safety, GDPR, and application security compliance for platform builders | `online-safety`, `gdpr`, `application-security` |

---

## Plugin Details

### `compliance`

Provides a starting point for exploring the regulations most relevant to platform builders:

- **UK Online Safety Act 2023** — illegal content duties, children's safety, risk assessments
- **EU Digital Services Act 2022** — platform obligations, transparency, content moderation
- **UK GDPR & EU GDPR** — data protection, lawful basis, data subject rights
- **UK Children's Code** — age-appropriate design for services likely accessed by children
- **US COPPA** — children's online privacy protection for US-facing platforms
- **OWASP Top 10** — application security baseline

### Skills

**`/online-safety`** — Assess your platform against UK OSA and EU DSA obligations
```
/online-safety assess my video-sharing platform
/online-safety checklist for a forum with user-generated content
/online-safety strategy-check for a consumer app that might have teen users
```

**`/gdpr`** — GDPR compliance for UK and EU data processing
```
/gdpr assess my user data handling
/gdpr checklist for a SaaS product collecting EU user data
/gdpr lawful-basis for sending marketing emails
```

**`/application-security`** — OWASP-based security assessment and checklists
```
/application-security assess my API
/application-security checklist for a new feature handling payments
```

---

## Repository Structure

```
plugins/
  compliance/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Legislation and cross-cutting knowledge
      online-safety/    # UK OSA, EU DSA skills
      gdpr/             # UK/EU GDPR skills
      application-security/  # OWASP skills
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to add a new plugin to this marketplace.

To add or update legislation in the compliance plugin, see [LEGISLATION.md](./LEGISLATION.md).
