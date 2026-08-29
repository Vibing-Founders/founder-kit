# Founder Kit — Plugin Marketplace

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
/plugin marketplace add Vibing-Founders/founder-kit
```

Once added, you can install any plugin from this marketplace:

```
/plugin add compliance@founder-kit
```

---

## Available Plugins

| Plugin | Description | Skills |
|--------|-------------|--------|
| `compliance` | Online safety, GDPR, and application security compliance for platform builders | `online-safety`, `gdpr`, `application-security`, `dpia`, `lia`, `cra` |
| `agent-delivery` | Hand a planned ticket to a Claude cloud sandbox and get back a pull request whose tests ran against a real database | `onboard`, `dispatch` |

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

**`/dpia`** — Full Data Protection Impact Assessment under Article 35 UK/EU GDPR
```
/dpia do we need a DPIA for our recommendation engine?
/dpia run a DPIA on our codebase
/dpia for our new user profiling feature
```

**`/lia`** — Legitimate Interests Assessment for Article 6(1)(f) lawful basis
```
/lia for sending marketing emails to existing customers
/lia assess our behavioural analytics processing
/lia for sharing user data with third-party ad partners
```

**`/cra`** — Children's Risk Assessment under the UK Online Safety Act 2023
```
/cra for my social platform
/cra children's risk assessment for a forum with user-generated content
/cra assess a consumer app that might have teen users
```

---

### `agent-delivery`

Hand a planned ticket to a Claude cloud sandbox and get back a pull request whose tests actually ran against a real database — without rebuilding the sandbox path for each project.

Running a delivery stage in a cloud sandbox works, but the proof is expensive and most of what it teaches is invisible from the outside: a sandbox has no Docker daemon, so a local database stack is impossible there; raw TCP to Postgres does not route; tools with hand-rolled network dialers hang and fail while `curl` answers instantly; and a setup script starts outside the repository clone, which kills the session before any agent runs. None of that is discoverable by reasoning. This plugin carries that knowledge once, so a second project does not rediscover it at the same cost.

Everything project-specific — tracker, stage map, risk paths, close-out steps, database tier — is declared in `.agent-delivery/config.yaml` in your own repository. The plugin names no planning workflow, tracker, or test runner as a hard dependency.

> **v1 scope**: the disposable-database tier is Supabase only, and the config format may change without a migration path until a second external project adopts it.

### Skills

**`/agent-delivery:onboard`** — take a repository from unprepared to a verified first dispatch
```
/agent-delivery:onboard this repo for cloud dispatch
/agent-delivery:onboard set up the database tier and prove it works
/agent-delivery:onboard check my agent-delivery setup
```

Detects your stack, tracker and planning artifacts; writes the config; generates the cloud environment's variable block and setup script for you to paste; installs the Postgres-over-HTTPS shim only if your tests need it and the preconditions hold; and proves the database tier by building a throwaway preview branch green and deleting it. It never writes a secret value anywhere, and it reports which values were defaulted rather than detected.

**`/agent-delivery:dispatch`** — run a stage on a ticket in a cloud sandbox
```
/agent-delivery:dispatch ABC-123 to the cloud
/agent-delivery:dispatch run this ticket in a sandbox
/agent-delivery:dispatch what happened to the run for ABC-123
```

Resolves the stage from the plan's readiness (sweeping branches and worktrees, not just your checkout), refuses a stage that needs a human in the loop, composes a self-contained prompt carrying no secrets, fires the run, then verifies its claims and reports them with provenance — separating what the run said from what was confirmed. After every database-tier run it reconciles preview branches and deletes any the run leaked.

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
  agent-delivery/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Sandbox runbook, config contract, tracker adapters
      onboard/          # Detection, environment artifacts, database preflight
      dispatch/         # Stage resolution, prompt contract, close-out
```

---

## Feedback

Found a bug, have a suggestion, or want to request a skill, agent, plugin, or legislation update? [Open a GitHub issue](https://github.com/Vibing-Founders/founder-kit/issues) — all feedback is welcome.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to add a new plugin to this marketplace.

To add or update legislation in the compliance plugin, see [LEGISLATION.md](./plugins/compliance/LEGISLATION.md).
