# Kit Map

What Founder Kit is for, what each part does, and how the parts fit together. Read this before
proposing an addition; [CONTRIBUTING.md](./CONTRIBUTING.md) then says how to build it. The
`triage-suggestion` maintainer skill assesses every suggestion against this file, so when the kit
changes shape, change this file in the same pull request.

## Who the kit is for

Bootstrapping founders building a website, platform or app, often with a small team or none, and
often without a developer or a lawyer on hand. Some write code and some do not.

## What belongs in the kit

<!-- DRAFT: these principles were inferred from the existing plugins. Maintainer to confirm or rewrite. -->

An addition belongs when all of these hold:

1. **A founder problem, not a project problem.** It would be useful in more than one founder's
   project without editing the skill.
2. **It carries knowledge Claude does not reliably have unaided.** Current law, hard-won
   operational detail (see `agent-delivery`'s sandbox runbook), or a method with rules that guard
   against a known failure (see `fk-icp` weighing prompted answers less).
3. **It names no hard dependency the founder must already have.** Trackers, planning workflows and
   providers are configured per project; where only one is supported, the plugin says so.
4. **It is honest about its limits.** Claims are cited, facts are separated from inference, and
   legal content keeps the disclaimer in [README.md](./README.md).
5. **It leaves out what another free tool already does well.** Point to it instead (see "Works
   well with" under `customer-research` in the README).

It does not belong when it is a one-off fix for a single project, a general coding helper with no
founder angle, or advice for a regulated sector the kit says it does not cover.

## The parts

| Plugin | The founder's question | Skills | Saves to |
|---|---|---|---|
| `core` | How should my project be set up for working with agents, and what is it missing? | `fk-setup` | `CLAUDE.md`, `docs/`, `scripts/`, `.claude/settings.json`, `.gitignore` |
| `customer-research` | Who is my customer, who else serves them, and can I back up what I say? | `fk-icp`, `fk-competitors`, `fk-fact-check` | `docs/customer-research/` |
| `compliance` | Which rules apply to what I am building, and where do I fall short? | `fk-online-safety` (modes `assess`, `checklist`, `strategy-check`, `cra`), `fk-gdpr` (modes `assess`, `checklist`, `lia`), `fk-application-security` (modes `assess`, `checklist`), `fk-dpia` | — |
| `site-delivery` | How do I get a change to my website made without writing code? | `fk-onboard`, `fk-orchestrate` | A pull request |
| `agent-delivery` | How do I hand a planned ticket to a cloud agent and trust the result? | `fk-onboard`, `fk-dispatch` | A pull request, with the ticket closed out |

Maintainer skills in `.claude/skills/` work on the kit itself and are not shipped to founders:
`add-legislation`, `update-legislation`, `triage-suggestion`.

## How the parts fit together

Each plugin installs and works on its own. No skill requires another plugin to be installed. They
connect in these ways:

- **One front door.** `core` is the recommended first install. Its `fk-setup` skill lays the
  project baseline and, on every run, reports which other installed Founder Kit plugins still need
  their own setup. It points to their `fk-onboard` skills and does not run them. Things every
  founder needs regardless of which other plugins they use belong in `core`; anything tied to one
  problem area belongs in that area's plugin.

- **One config file.** `.vf-founder-kit/config.yaml` in the founder's project holds a section per
  plugin plus the shared `docs_root`. A skill writes only its own plugin's section. `compliance`
  does not use it today.
- **One docs convention.** Skills that save files use `docs/<plugin-name>/` unless the config or
  the request says otherwise.
- **Research feeds research.** `fk-competitors` uses the ideal customer profile from `fk-icp` when
  one exists; `fk-fact-check` can check a `fk-competitors` report.
- **Two delivery paths, split by who is driving.** `site-delivery` is the plain-language path for
  a founder who does not code, from brief to pull request. `agent-delivery` is the path for a
  repository with planned tickets and tests, run in a cloud sandbox against a disposable database.
  Cloud environment setup is `agent-delivery`'s job, not `site-delivery`'s.
- **Optional planning stages.** Both delivery plugins can run fuller stages through the
  `compound-engineering` plugin when the project configures it. Neither requires it.
- **Shared legislation.** Acts used by more than one compliance skill live in
  `plugins/compliance/skills/_shared/legislation/`; see
  [LEGISLATION.md](./plugins/compliance/LEGISLATION.md).
- **Onboard, then act.** A plugin that needs per-project setup has an `fk-onboard` skill that
  writes its config section, and its other skills read that section. `fk-setup` is the project-wide
  step before those.
- **Default companions, not dependencies.** `fk-setup` enables `compound-engineering` and two
  `pm-skills` plugins by default and lets the founder name alternatives.

## Gaps and direction

<!-- Maintainer to fill in: areas wanted next, and areas deliberately left out. Triage uses this to
     tell "not yet" from "not ever". -->

- Wanted next: _to be written_
- Deliberately out of scope: regulated sectors (financial services, healthcare, insurance, legal
  services), per the README disclaimer
