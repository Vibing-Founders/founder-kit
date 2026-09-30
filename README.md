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
/plugin install compliance@founder-kit
```

---

## Available Plugins

| Plugin | Description | Skills |
|--------|-------------|--------|
| `compliance` | Online safety, GDPR, and application security compliance for platform builders | `online-safety`, `gdpr`, `application-security`, `dpia`, `lia`, `cra` |
| `agent-delivery` | Hand a planned ticket to a Claude cloud sandbox and get back a pull request whose tests ran against a real database | `onboard`, `dispatch` |
| `site-delivery` | Smart non-coding founder toolkit for delivering website changes through a thin brief-to-PR path with optional tracker integration | `onboard`, `orchestrate` |
| `customer-research` | Understand your customers well enough to validate an idea and sell it: an evidence-based ideal customer profile from real conversations, and competitor research you can act on | `fk-icp`, `fk-competitors` |

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

### `site-delivery`

For smart non-coding founders. Give Claude a brief in plain language and get back a pull request — no GitHub Project or Linear setup required. Optional tracker integration and compound-engineering stages for teams who want fuller planning workflows.

Designed for website delivery through Lovable, SST Web, or Supabase+Lovable. Human always reviews, merges, runs publish, and confirms live — Claude never auto-merges or triggers deploys.

> **v0.0.1 scope**: Thin path (brief-to-PR) and fuller path (tracker + CE stages) scaffold complete. No live tracker API calls or publish flow execution in this release. Human runs the locked publish path. Optional future integration with `agent-delivery:dispatch` for sandbox execution of implementation slices.

### Skills

**`/site-delivery:onboard`** — configure a site repository for delivery
```
/site-delivery:onboard my site for delivery
/site-delivery:onboard set up site-delivery
/site-delivery:onboard check my site-delivery config
```

A plain-language wizard that writes `.site-delivery/config.yaml` through conversation. Asks for your site repository, publish platform (Lovable/SST/Supabase+Lovable), and whether you want the thin path (no tracker) or fuller path (GitHub Project or Linear integration with compound-engineering stages). Defaults to thin path for non-coders. Reports every defaulted value explicitly.

**`/site-delivery:orchestrate`** — run a site delivery from brief to PR
```
/site-delivery:orchestrate add a testimonials section to the homepage
/site-delivery:orchestrate SITE-123
/site-delivery:orchestrate deliver this brief
```

Reads the config, resolves the stage (thin path: always brief-to-PR; fuller path: reads tracker state and runs the compound-engineering stage), makes the changes, opens a PR, and reports the human gates (review, merge, publish, confirm live). Posts PR link to the tracker when configured. Enforces hard delivery rules: never auto-merge, never trigger publish, refuse experimental changes not in the brief.

---

### `customer-research`

For bootstrapping founders (solo or two-person teams, coders or not) who need to understand their customers well enough to validate an idea and sell it. Works in a code repository or a plain folder. Files go in `customer-research/` in your project, or next to your existing ideal customer profile if you already have one, and the skills always tell you where they wrote.

```
/plugin marketplace add Vibing-Founders/founder-kit
/plugin install customer-research@founder-kit
```

You do not need the slash commands: plain requests such as "analyse this customer interview" or "who are my competitors for …" trigger the right skill.

### Skills

**`/customer-research:fk-icp`** — ideal customer profile and personas from real conversations
```
/customer-research:fk-icp analyse this customer interview: <paste transcript>
/customer-research:fk-icp what are our customers' top pains?
/customer-research:fk-icp update the Night-Shift Nadia persona with these notes
/customer-research:fk-icp review our ICP and tell me what's missing
```

Turns interview transcripts and feedback into an ideal customer profile, buyer personas, negative personas (who not to sell to) and qualifying questions, kept as a living document with a version log. Every pain point carries the customer's own words and a Possible Solutions section. It flags leading questions and weighs prompted answers less, never invents characteristics or estimates market size, detects B2B versus B2C, and splits two-sided marketplaces into a master profile plus one file per side. Every answer ends with what to ask in your next conversations.

**`/customer-research:fk-competitors`** — competitor research a bootstrapper can act on
```
/customer-research:fk-competitors who are my competitors for a bookkeeping tool for freelance photographers?
/customer-research:fk-competitors where could a meal-planning app for shift workers win?
```

Scopes the question with you (using your ideal customer profile if one exists), then runs web research in a separate research agent where your tool supports it. Covers direct and indirect competitors and the "do nothing / spreadsheet" alternative, each competitor's positioning, pricing, target customer and what their own customers complain about, and ends with where a small team can win. Every claim is cited, facts are separated from inference, and stale information is flagged.

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
  site-delivery/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Config schema, examples
      onboard/          # Plain-language wizard for .site-delivery/config.yaml
      orchestrate/      # Brief-to-PR thin path or fuller CE stages
  customer-research/
    .claude-plugin/plugin.json
    skills/
      fk-icp/           # Ideal customer profile, personas, qualifying questions
      fk-competitors/   # Competitor research with a bundled research agent
```

---

## Feedback

Found a bug, have a suggestion, or want to request a skill, agent, plugin, or legislation update? [Open a GitHub issue](https://github.com/Vibing-Founders/founder-kit/issues) — all feedback is welcome.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to add a new plugin to this marketplace.

To add or update legislation in the compliance plugin, see [LEGISLATION.md](./plugins/compliance/LEGISLATION.md).
