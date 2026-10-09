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

Start with `core`, then run its setup skill in your project:

```
/plugin install core@founder-kit
/core:fk-setup
```

Every other plugin is optional and works on its own. Install the ones you need:

```
/plugin install compliance@founder-kit
```

Every skill name starts with `fk-` (for example `/compliance:fk-gdpr`, `/agent-delivery:fk-dispatch`). If you installed a plugin when its commands had no prefix (`/compliance:gdpr`, `/agent-delivery:dispatch` and so on), update or reinstall it to get the new names:

```
/plugin marketplace update founder-kit
/plugin install compliance@founder-kit
```

---

## Available Plugins

| Plugin | Description | Skills |
|--------|-------------|--------|
| `core` | Start here. Sets a project up with a baseline for working with Claude Code agents, and checks an existing project for gaps whenever you re-run it | `fk-setup` |
| `compliance` | Online safety, GDPR, and application security compliance for platform builders | `fk-online-safety` (+ `cra` mode), `fk-gdpr` (+ `lia` mode), `fk-application-security`, `fk-dpia` |
| `agent-delivery` | Hand a planned ticket to a Claude cloud sandbox and get back a pull request whose tests ran against a real database | `fk-onboard`, `fk-dispatch` |
| `site-delivery` | Smart non-coding founder toolkit for delivering website changes through a thin brief-to-PR path with optional tracker integration | `fk-onboard`, `fk-orchestrate` |
| `customer-research` | Understand your customers well enough to validate an idea and sell it: an evidence-based ideal customer profile from real conversations, competitor research you can act on, and a fact-check of the claims you make and meet | `fk-icp`, `fk-competitors`, `fk-fact-check` |

---

## Plugin Details

### `core`

The starting point for Founder Kit. Install it first; the other plugins are optional alongside it.

Starting a project with agents means re-creating the same rules, docs folders and supporting
scripts each time, and missing some. `core` carries that baseline once, so a new project starts
with it and an older one can be checked against it.

```
/plugin install core@founder-kit
```

### Skills

**`/core:fk-setup`** — set a project up, or check what an existing one is missing
```
/core:fk-setup set up this new project
/core:fk-setup check my project setup
/core:fk-setup what's new in the baseline since I last ran this?
```

Audits the project against the baseline, shows you what is present, missing or different, and
applies only what you approve:

- a `CLAUDE.md` with development commands, a directory map and standing rules, filled in with your
  project's own commands
- the **worktree rule**, so branch work happens in its own git worktree, plus what makes a fresh
  worktree usable: a script that links your env files from the main checkout rather than copying
  them, the ignore entries, and a "First time in a worktree" guide
- a `docs/` layout for architecture, decisions, plans, solutions and conventions
- the default plugins, [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin)
  for planning and delivery and [pm-skills](https://github.com/phuryn/pm-skills) for product
  work, or your own alternatives if you prefer them

It detects your stack rather than assuming one, never overwrites a file without showing you the
difference first, and never opens your env files. Re-run it at any time: it reports what the
baseline has gained since your last run, and which other Founder Kit plugins you have installed
but not yet set up.

The worktree script needs a POSIX shell (macOS, Linux, cloud sandboxes, WSL). Plugins enabled in
a project's settings do not carry into Claude Code cloud sessions; the rules, docs and script do,
because they are files in your repository.

---

### `compliance`

Provides a starting point for exploring the regulations most relevant to platform builders:

- **UK Online Safety Act 2023** — illegal content duties, children's safety, risk assessments
- **EU Digital Services Act 2022** — platform obligations, transparency, content moderation
- **UK GDPR & EU GDPR** — data protection, lawful basis, data subject rights
- **UK Children's Code** — age-appropriate design for services likely accessed by children
- **US COPPA** — children's online privacy protection for US-facing platforms
- **OWASP Top 10** — application security baseline

### Skills

**`/compliance:fk-online-safety`** — Assess your platform against UK OSA and EU DSA obligations (modes: `assess`, `checklist`, `strategy-check`, `cra`)
```
/compliance:fk-online-safety assess my video-sharing platform
/compliance:fk-online-safety checklist for a forum with user-generated content
/compliance:fk-online-safety strategy-check for a consumer app that might have teen users
```

**`/compliance:fk-gdpr`** — GDPR compliance for UK and EU data processing (modes: `assess`, `checklist`, `lia`)
```
/compliance:fk-gdpr assess my user data handling
/compliance:fk-gdpr checklist for a SaaS product collecting EU user data
/compliance:fk-gdpr assess the lawful basis for sending marketing emails
```

**`/compliance:fk-application-security`** — OWASP-based security assessment and checklists (modes: `assess`, `checklist`)
```
/compliance:fk-application-security assess my API
/compliance:fk-application-security checklist for a new feature handling payments
```

**`/compliance:fk-dpia`** — Full Data Protection Impact Assessment under Article 35 UK/EU GDPR
```
/compliance:fk-dpia do we need a DPIA for our recommendation engine?
/compliance:fk-dpia run a DPIA on our codebase
/compliance:fk-dpia for our new user profiling feature
```

**Legitimate Interests Assessment** — the `lia` mode of `fk-gdpr`, for the Article 6(1)(f) lawful basis
```
/compliance:fk-gdpr lia for sending marketing emails to existing customers
/compliance:fk-gdpr lia for our behavioural analytics processing
/compliance:fk-gdpr lia for sharing user data with third-party ad partners
```

**Children's Risk Assessment** — the `cra` mode of `fk-online-safety`, under the UK Online Safety Act 2023
```
/compliance:fk-online-safety cra for my social platform
/compliance:fk-online-safety cra for a forum with user-generated content
/compliance:fk-online-safety cra for a consumer app that might have teen users
```

---

### `agent-delivery`

Hand a planned ticket to a Claude cloud sandbox and get back a pull request whose tests actually ran against a real database — without rebuilding the sandbox path for each project.

Running a delivery stage in a cloud sandbox works, but the proof is expensive and most of what it teaches is invisible from the outside: a sandbox has no Docker daemon, so a local database stack is impossible there; raw TCP to Postgres does not route; tools with hand-rolled network dialers hang and fail while `curl` answers instantly; and a setup script starts outside the repository clone, which kills the session before any agent runs. None of that is discoverable by reasoning. This plugin carries that knowledge once, so a second project does not rediscover it at the same cost.

Everything project-specific — tracker, stage map, risk paths, close-out steps, database tier — is declared in the `agent-delivery` section of `.vf-founder-kit/config.yaml` in your own repository, a file shared by every Founder Kit plugin. The plugin names no planning workflow, tracker, or test runner as a hard dependency.

Existing `.agent-delivery/config.yaml` and `.site-delivery/config.yaml` files still work (the skills report them as deprecated), and each plugin's `fk-onboard` migrates them into `.vf-founder-kit/config.yaml`, deleting the old file only if you confirm.

> **v1 scope**: the disposable-database tier is Supabase only, and the config format may change without a migration path until a second external project adopts it.

### Skills

**`/agent-delivery:fk-onboard`** — take a repository from unprepared to a verified first dispatch
```
/agent-delivery:fk-onboard this repo for cloud dispatch
/agent-delivery:fk-onboard set up the database tier and prove it works
/agent-delivery:fk-onboard check my agent-delivery setup
```

Detects your stack, tracker and planning artifacts; writes the config; generates the cloud environment's variable block and setup script for you to paste; installs the Postgres-over-HTTPS shim only if your tests need it and the preconditions hold; and proves the database tier by building a throwaway preview branch green and deleting it. It never writes a secret value anywhere, and it reports which values were defaulted rather than detected.

**`/agent-delivery:fk-dispatch`** — run a stage on a ticket in a cloud sandbox
```
/agent-delivery:fk-dispatch ABC-123 to the cloud
/agent-delivery:fk-dispatch run this ticket in a sandbox
/agent-delivery:fk-dispatch what happened to the run for ABC-123
```

Resolves the stage from the plan's readiness (sweeping branches and worktrees, not just your checkout), refuses a stage that needs a human in the loop, composes a self-contained prompt carrying no secrets, fires the run, then verifies its claims and reports them with provenance — separating what the run said from what was confirmed. After every database-tier run it reconciles preview branches and deletes any the run leaked.

---

### `site-delivery`

For smart non-coding founders. Give Claude a brief in plain language and get back a pull request — no GitHub Project or Linear setup required. Optional tracker integration and compound-engineering stages for teams who want fuller planning workflows.

Designed for website delivery through Lovable, SST Web, or Supabase+Lovable. Human always reviews, merges, runs publish, and confirms live — Claude never auto-merges or triggers deploys.

> **v0.0.1 scope**: Thin path (brief-to-PR) and fuller path (tracker + CE stages) scaffold complete. No live tracker API calls or publish flow execution in this release. Human runs the locked publish path. Optional future integration with `agent-delivery:fk-dispatch` for sandbox execution of implementation slices.

### Skills

**`/site-delivery:fk-onboard`** — configure a site repository for delivery
```
/site-delivery:fk-onboard my site for delivery
/site-delivery:fk-onboard set up site-delivery
/site-delivery:fk-onboard check my site-delivery config
```

A plain-language wizard that writes the `site-delivery` section of `.vf-founder-kit/config.yaml` through conversation. Asks for your site repository, publish platform (Lovable/SST/Supabase+Lovable), and whether you want the thin path (no tracker) or fuller path (GitHub Project or Linear integration with compound-engineering stages). Defaults to thin path for non-coders. Reports every defaulted value explicitly.

**`/site-delivery:fk-orchestrate`** — run a site delivery from brief to PR
```
/site-delivery:fk-orchestrate add a testimonials section to the homepage
/site-delivery:fk-orchestrate SITE-123
/site-delivery:fk-orchestrate deliver this brief
```

Reads the config, resolves the stage (thin path: always brief-to-PR; fuller path: reads tracker state and runs the compound-engineering stage), makes the changes, opens a PR, and reports the human gates (review, merge, publish, confirm live). Posts PR link to the tracker when configured. Enforces hard delivery rules: never auto-merge, never trigger publish, refuse experimental changes not in the brief.

---

### `customer-research`

For bootstrapping founders (solo or two-person teams, coders or not) who need to understand their customers well enough to validate an idea and sell it. Works in a code repository or a plain folder. Files go in `docs/customer-research/` in your project by default, and the skills always tell you where they wrote. To use a different folder, ask ("keep my research in docs/my-idea from now on") or set it in `.vf-founder-kit/config.yaml`:

```yaml
docs_root: docs                      # where all Founder Kit plugins keep their docs
customer-research:
  root: docs/some-other/folder       # optional: just this plugin
```

Upgrading from 0.1.0, which wrote to `customer-research/` in the project root? The skills find that research and offer to move it or keep it where it is.

```
/plugin marketplace add Vibing-Founders/founder-kit
/plugin install customer-research@founder-kit
```

You do not need the slash commands: plain requests such as "analyse this customer interview", "who are my competitors for …" or "fact-check this" trigger the right skill.

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

**`/customer-research:fk-fact-check`** — check which claims hold up before you repeat them
```
/customer-research:fk-fact-check check the claims on my landing page: <paste copy>
/customer-research:fk-fact-check can I say we're "the only bookkeeping app built for photographers"?
/customer-research:fk-fact-check fact-check my competitor report for the meal-planning app
```

Pulls the checkable claims out of your landing page, pitch, sales email, a competitor's marketing or a research report (numbers, dates, awards, comparisons, statements about customers) and flags superlatives such as "the only" or "guaranteed" as needing evidence. You edit the list before anything is researched. A research agent gathers supporting and contradicting evidence with dated, reliability-rated sources, then an independent analyst that sees only the claims and the evidence marks each one Supported, Contradicted or Unsubstantiated. For your own content, claims only your data can prove are marked "needs your own evidence" rather than wrong, quotes from your ideal customer profile can back up claims about customers, and every problem claim gets a rewrite that says only what the evidence supports. Not legal advice. The pipeline follows Ravi Manjunatha's article [Building a Trustworthy AI: Automated Fact-Checking with Google's Agent Development Kit](https://medium.com/google-cloud/building-a-trustworthy-ai-automated-fact-checking-with-googles-agent-development-kit-292e84967261).

### Works well with

These free skills from [pm-skills](https://github.com/phuryn/pm-skills) by Paweł Huryn fill gaps
this plugin leaves on purpose:

- **`interview-script`**: a full guide to prepare a customer interview. Give it the research
  gaps from `fk-icp`, then bring the transcript back to `fk-icp`. Drop its hypothetical
  questions ("If you could wave a magic wand…"); `fk-icp` treats the answers as weak evidence.
- **`competitive-battlecard`**: responses to objections once you are on sales calls, built on
  the `fk-competitors` research.

```
/plugin marketplace add phuryn/pm-skills
/plugin install pm-product-discovery@pm-skills   # interview-script
/plugin install pm-go-to-market@pm-skills        # competitive-battlecard
```

---

## Repository Structure

```
plugins/
  core/
    .claude-plugin/plugin.json
    skills/
      fk-setup/         # Project baseline: audit, propose, apply (baseline.md is the versioned list)
    tests/              # Unit tests for the worktree setup script
  compliance/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Legislation and cross-cutting knowledge
      fk-online-safety/ # UK OSA, EU DSA (includes the cra mode)
      fk-gdpr/          # UK/EU GDPR (includes the lia mode)
      fk-application-security/  # OWASP
      fk-dpia/          # Article 35 Data Protection Impact Assessment
  agent-delivery/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Sandbox runbook, config contract, tracker adapters
      fk-onboard/       # Detection, environment artifacts, database preflight
      fk-dispatch/      # Stage resolution, prompt contract, close-out
  site-delivery/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Config schema, examples
      fk-onboard/       # Plain-language wizard for the site-delivery config section
      fk-orchestrate/   # Brief-to-PR thin path or fuller CE stages
  customer-research/
    .claude-plugin/plugin.json
    skills/
      _shared/          # Where research lives (docs-location rules)
      fk-icp/           # Ideal customer profile, personas, qualifying questions
      fk-competitors/   # Competitor research with a bundled research agent
      fk-fact-check/    # Claim checking with bundled research and analyst agents
```

---

## Feedback

Found a bug, have a suggestion, or want to request a skill, agent, plugin, or legislation update? [Open a GitHub issue](https://github.com/Vibing-Founders/founder-kit/issues) — all feedback is welcome.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) to add a new plugin to this marketplace.

To add or update legislation in the compliance plugin, see [LEGISLATION.md](./plugins/compliance/LEGISLATION.md).
