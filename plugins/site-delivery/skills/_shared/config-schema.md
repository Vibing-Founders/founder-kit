# Site delivery configuration contract

Every project-specific fact this plugin needs lives in one place in the adopting repository: the
`site-delivery` section of the shared Founder Kit config file.

```
.vf-founder-kit/config.yaml
```

```yaml
docs_root: docs            # shared by all Founder Kit plugins
site-delivery:
  schema_version: 1
  repo:
    url: https://github.com/Vibing-Founders/my-site
  # ...every key below, one level in
# other plugins' sections (agent-delivery, customer-research, ...) may sit in the same file
```

Nothing in the plugin hardcodes a tracker, a publish platform, or a workflow stage. If a skill needs to know something about *your* project, it is a key below. Key paths in this document (`repo.url`, `stages.enabled`, ...) are relative to the `site-delivery` section, except `tracker`, which is the shared top-level key.

`fk-onboard` writes this section. `fk-orchestrate` reads it. A human can edit it at any time; it is plain YAML and every key has a default.

> **v1 stability.** This format is unstable and may change without a migration path until the plugin is used by multiple external projects. Pin the plugin version if that matters to you.

## Where the config lives, and the old file

**Reading.** Read the `site-delivery` section of `.vf-founder-kit/config.yaml`.

- **Section missing, old file present.** Earlier versions kept this config in its own file, `.site-delivery/config.yaml` (same keys, not nested). If the section is missing and that file exists, use it, and say in the report that `.site-delivery/config.yaml` is deprecated and that running `fk-onboard` will migrate it into `.vf-founder-kit/config.yaml`.
- **Both present.** The section wins. Say in the report that the old `.site-delivery/config.yaml` is being ignored.
- **Neither present.** The project is not configured; point at `fk-onboard`.

**Writing.** The file is shared, so `fk-onboard` writes **only the `site-delivery` section**, plus the top-level `tracker` key when the fuller path needs one and it does not exist yet. It keeps every other key and section — `docs_root`, other plugins' sections, comments — exactly as it was, and creates the file (and the `.vf-founder-kit/` folder) if it does not exist.

**Migrating.** When `fk-onboard` finds the old `.site-delivery/config.yaml`, it offers to migrate it:

1. Copy its content into the `site-delivery` section **unchanged** — no values rewritten, defaulted, or merged with new answers.
2. Show the founder exactly what it wrote.
3. Offer to delete the old file, and delete it **only after the founder confirms**.

If the section already exists as well, migration does not overwrite it: the old file is reported as ignored, any differences between the two are shown, and only deletion is offered.

## Precedence

Three layers, highest first:

1. **An explicit argument to a skill** — `fk-orchestrate <brief> --stage brainstorm` beats everything.
2. **This config section.**
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

## `tracker` — where tickets live, and the stage map (optional, shared)

The tracker is **not** in the `site-delivery` section. It is the shared top-level `tracker` key of
`.vf-founder-kit/config.yaml`, beside `docs_root`, because `core` and `agent-delivery` read the
same map. `core`'s `fk-setup` usually writes it; this plugin's `fk-onboard` writes it when it is
missing and the founder chooses the fuller path.

```yaml
docs_root: docs
tracker:
  kind: github                 # github | linear | none. default: none
  board:                       # github only
    project: Delivery          # project board name or number
    field: Status              # the board's single-select field
  stage_map:                   # canonical stage -> this project's column (github) or state (linear)
    brainstormed: Brainstormed
    planned: Planned
    in_progress: In Progress
    human_review: Human Review
    for_release: For Release
    released_measure_impact: Measure Impact
    done: Done
site-delivery:
  # ...this plugin's own keys
```

`kind: github-project`, the value earlier versions of this plugin used, is read as `github`.

The stage keys are fixed and mean the same in every project. A project maps each one it uses to
its own column or workflow state and leaves the rest out. Columns not in the map, such as
`Backlog` or `Todo`, are never touched.

| Key | Meaning | This plugin sets it |
|---|---|---|
| `brainstormed` | Requirements or a brainstorm exist for the ticket | After the `brainstorm` stage commits its output |
| `planned` | An implementation plan exists | After the `plan` stage commits its output |
| `in_progress` | Someone, or an agent, is building it | When the `work` stage starts |
| `human_review` | A pull request is open and ready for a human | When it opens a ready (not draft) pull request |
| `for_release` | Merged, waiting to go to production | — the human merges |
| `released_measure_impact` | In production; impact is being checked | — the human publishes |
| `done` | Finished | — the founder |

**Thin path:** with `stages.enabled: false` the plugin makes no tracker calls at all, whatever the
`tracker` key says. A missing `tracker` key means `none`; report it as a default. The thin path is
the designed default, not a degraded one.

**Fuller path:** `stages.enabled: true` needs `tracker.kind` of `github` or `linear`. The ticket's
column is read to resolve the stage, and the ticket is moved as the table above says.

### Where the tracker is read from

1. **The top-level `tracker` key.** When it exists, it wins.
2. **The old location, `site-delivery.tracker`.** Earlier versions kept the tracker inside this
   section, with `kind` (`none`, `github-project` or `linear`), `project`, `field`, `team_key`
   and a `stage_map` running the other way: column → this plugin's stage (`Review: review`). When
   there is no top-level key, read it: `project` and `field` are the board, the old map resolves
   the stage as it always did, and the column mapped to `review` is the `human_review` column. No
   other canonical stage is mapped, so those moves are skipped and reported. Say in the report
   that the old location is deprecated and that `fk-onboard` will migrate it.
3. **Neither.** `kind: none`.

**Migrating** the old location, in `fk-onboard`: copy `project` and `field` into `board`, and the
column mapped to `review` into `stage_map.human_review`, unchanged. The old map's other columns
named where a stage *runs*, not what *exists*, so they do not translate one-to-one: propose a
canonical stage for each and let the founder confirm. Show what was written, and remove the old
keys only after the founder confirms. `team_key` is not carried over: Linear issue identifiers
already name their team.

### The tracker contract

When the fuller path is on, the adapter implements:

| Operation | Contract |
|---|---|
| **read the brief** | Return the ticket's title, body, and every comment. Comments can carry instructions the body does not. |
| **read current stage** | Return the ticket's column or workflow state, and the canonical stage `stage_map` gives it (or "not mapped"). |
| **set stage `<stage>`** | Look `<stage>` up in `stage_map` and move the ticket there. A stage with no entry is skipped and reported, and the ticket left where it is. |
| **post a comment** | Add a comment to the ticket with the PR link and any delivery notes. |

### Missing-target behaviour

When the mapped board, field, column or state does not exist, the adapter **reports it and leaves
the ticket unchanged**. It never guesses a similarly named substitute: a ticket in the wrong column
is worse than one left alone with a clear message. If the stage cannot be read at all because the
board is missing, the orchestration stops for that ticket.

One exception, and it is an addition rather than a guess: when the issue exists but is not yet an
item on the configured board, it is **added, then set, and both actions are reported**.

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

`stages.map` here is about planning artifacts (readiness value → stage), not the board. The board's columns are in the shared `tracker.stage_map`.

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
- GitHub board with fuller stages (shared `tracker` key)
- Linear with fuller stages (shared `tracker` key)
- All three publish kinds (anonymized)
