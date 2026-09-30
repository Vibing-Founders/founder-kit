# Site delivery configuration contract

Every project-specific fact this plugin needs lives in one file in the adopting repository:

```
.site-delivery/config.yaml
```

Nothing in the plugin hardcodes a tracker, a publish platform, or a workflow stage. If a skill needs to know something about *your* project, it is a key below.

`fk-onboard` writes this file. `fk-orchestrate` reads it. A human can edit it at any time; it is plain YAML and every key has a default.

> **v1 stability.** This format is unstable and may change without a migration path until the plugin is used by multiple external projects. Pin the plugin version if that matters to you.

## Precedence

Three layers, highest first:

1. **An explicit argument to a skill** — `fk-orchestrate <brief> --stage brainstorm` beats everything.
2. **This config file.**
3. **The documented default** below.

A skill that falls back to a default for a value that changes its behaviour says so in its report. Silent defaulting is a bug.

## Schema version

```yaml
schema_version: 1
```

Both skills read `schema_version` first. On a version they do not recognise they **warn, naming both the version they found and the version they support, and continue** — a renamed key later produces a confusing key-level error, and a version warning up front is what makes that diagnosable. `schema_version` is the only key whose absence is itself reported: an omitted version is treated as `1` with a note.

---

## `repo` — the site repository

```yaml
repo:
  url: https://github.com/Vibing-Founders/my-site   # REQUIRED. The site repository URL.
  main_branch: main                                  # default: main
  branch_prefix: feature/                            # default: feature/ — branch naming prefix
```

`url` is the only truly required value and has no safe default. The orchestration skill opens a pull request against this repository, never cloning it onto an agent machine.

`main_branch` is the base branch for PRs. Override when your repository uses `master`, `production`, or similar.

`branch_prefix` controls how feature branches are named. The thin path creates branches like `feature/brief-slug`.

---

## `tracker` — where briefs and tasks live (optional)

```yaml
tracker:
  kind: none                     # none | github-project | linear. default: none
  
  # kind: github-project
  project: My Site Delivery      # project board name or number
  field: Status                  # the board's single-select field
  stage_map:                     # field option -> stage
    Brainstorm: brainstorm
    Plan: plan
    Implement: work
    Review: review
  
  # kind: linear
  team_key: SITE                 # Linear team key (e.g. SITE-123)
  stage_map:                     # workflow state -> stage
    Brainstorm: brainstorm
    Plan: plan
    In Progress: work
    In Review: review
```

**Thin path:** `kind: none` (the default) means no tracker integration. Briefs come from user input, and PR creation is the only output. No ticket status updates, no comment posting.

**Fuller path:** Set `kind: github-project` or `linear` to enable tracker reads, status updates, and comment posting. When a tracker is configured, stage resolution reads the ticket state and the orchestration includes richer compound-engineering stages.

### The tracker contract

When `kind` is not `none`, the adapter must implement:

| Operation | Contract |
|---|---|
| **read the brief** | Return the ticket's title, body, and every comment. Comments can carry instructions the body does not. |
| **read current stage** | Return which stage the ticket is in, based on `stage_map`. |
| **set stage** | Move the ticket to the named stage. |
| **post a comment** | Add a comment to the ticket with the PR link and any delivery notes. |

### Missing-target behaviour

When the configured project, field, or state does not exist, the adapter **reports it and refuses to proceed** for that ticket. It never guesses a substitute.

---

## `publish` — where the site goes live

```yaml
publish:
  kind: lovable                  # lovable | sst-web | supabase+lovable. REQUIRED.
  
  # kind: lovable
  project_id: ""                 # Lovable project identifier (anonymized in examples)
  
  # kind: sst-web
  stage: production              # SST stage name
  aws_profile: ""                # AWS profile for deployment
  
  # kind: supabase+lovable
  supabase_project_ref: ""       # Supabase project reference
  lovable_project_id: ""         # Lovable project identifier
```

**This block is declarative only in v0.0.1.** The orchestration skill reports which publish kind is configured and states that the human runs the locked publish path. It never triggers a deployment.

`kind` must be set. Values without real project IDs are accepted; the examples show anonymized stubs.

---

## `stages` — compound-engineering integration (optional)

```yaml
stages:
  enabled: false                 # default: false — thin path only
  artifact_glob: docs/plans/*.md # default — assumes compound-engineering planning artifacts
  readiness_key: artifact_readiness   # default — assumes compound-engineering
  map:                           # readiness value -> stage
    requirements-only: plan
    implementation-ready: work
  skills:                        # stage -> skill to invoke
    brainstorm: compound-engineering:ce-brainstorm
    plan: compound-engineering:ce-plan
    work: compound-engineering:ce-work
    review: compound-engineering:ce-review
```

**Thin path (default):** `enabled: false` means the orchestration runs a simple brief-to-PR path with no compound-engineering stages. Suitable for non-coders who want Claude to take a plain-language brief and open a PR.

**Fuller path:** Set `enabled: true` when you have compound-engineering installed and want brainstorm/plan/work/review stages. Requires a `tracker` (not `none`) so the stage can be read from ticket state.

When `enabled: false`, the other keys in this block are ignored.

---

## `delivery_rules` — what the PR must include

```yaml
delivery_rules:
  human_merge_gate: true         # default: true — never auto-merge
  human_publish_gate: true       # default: true — human confirms and runs publish
  confirm_live: true             # default: true — human confirms site is live after publish
  experimental_changes: false    # default: false — refuse experimental changes not in brief
```

All default to their safe values. These are the hard delivery constraints:

1. **`human_merge_gate: true`** — PRs are always opened as draft or regular PRs, never merged by the agent. Human reviews and merges.
2. **`human_publish_gate: true`** — Publish is never triggered by the agent. Human runs the locked publish path after merge.
3. **`confirm_live: true`** — After publish, human confirms the change is live.
4. **`experimental_changes: false`** — The agent refuses to invent features or experiments not described in the brief.

These rules are documented in the fk-orchestrate skill and enforced there.

---

## `agent_delivery_integration` — optional sandbox dispatch

```yaml
agent_delivery_integration:
  enabled: false                 # default: false
  environment: ""                # cloud environment name for agent-delivery
```

**Out of scope for v0.0.1.** This block is a stub for future integration where implementers may invoke `agent-delivery:fk-dispatch` for sandbox execution of implementation slices. Not wired in this release.

When `enabled: false`, this block is ignored.

---

## Example configurations

See `config.example.yaml` for complete examples:
- Thin path (no tracker, no stages)
- GitHub Project tracker with fuller stages
- Linear tracker with fuller stages
- All three publish kinds (anonymized)
