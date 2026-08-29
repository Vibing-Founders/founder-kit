# Project configuration contract

Every project-specific fact this plugin needs lives in one file in the adopting repository:

```
.agent-delivery/config.yaml
```

Nothing in the plugin hardcodes a tracker, a test runner, a planning workflow, a file path, or
a credential. If a skill needs to know something about *your* project, it is a key below.

`onboard` writes this file. `dispatch` and the sandbox runbook read it. A human can edit it at
any time; it is plain YAML and every key has a default.

> **v1 stability.** This format is unstable and may change without a migration path until a
> second external project adopts it. Pin the plugin version if that matters to you.

## Precedence

Three layers, highest first:

1. **An explicit argument to a skill** — `dispatch <ticket> --stage implement` beats everything.
2. **This config file.**
3. **The documented default** below.

A skill that falls back to a default for a value that changes its behaviour says so in its
report. Silent defaulting is a bug.

## Schema version

```yaml
schema_version: 1
```

Both skills read `schema_version` first. On a version they do not recognise they **warn, naming
both the version they found and the version they support, and continue** — a renamed key later
produces a confusing key-level error, and a version warning up front is what makes that
diagnosable. `schema_version` is the only key whose absence is itself reported: an omitted
version is treated as `1` with a note.

---

## `repo` — how the sandbox builds this project

```yaml
repo:
  clone_dir: my-project          # REQUIRED. Directory name of the clone inside the sandbox.
  install: npm ci                # default: npm ci
  post_install: []               # default: [] — codegen and similar, run after install
  test_command: npx vitest run   # default: npx vitest run — must accept file paths as arguments
  lint_command: npm run lint     # default: none — skipped when unset
  typecheck_command: npm run type-check   # default: none — skipped when unset
```

`clone_dir` has no default and no safe guess. The sandbox's setup script starts **outside** the
clone, so a wrong or missing value kills the session before any agent runs, with nothing in the
log to read. `onboard` detects it from the repository name and writes it explicitly.

`test_command` must accept file paths appended to it, because the runbook runs the tests a change
touches rather than the whole suite.

## `tracker` — where tickets live

```yaml
tracker:
  kind: github                   # github | linear. REQUIRED.
  review_marker:
    # kind: github
    project: Delivery            # project board name or number
    field: Status                # the board's single-select field
    option: In review            # the option standing for "ready for human review"
    # kind: linear
    state: In Review             # workflow state name
```

`kind` selects one adapter file under `_shared/trackers/`. Adding a third tracker is one new file
there and no edit anywhere else.

### The tracker contract

Every adapter implements exactly three operations, and nothing outside `_shared/trackers/` names
a tracker directly:

| Operation | Contract |
|---|---|
| **read the brief** | Return the ticket's title, body, **and every comment**. A comment can carry an instruction that the body does not; an adapter that returns the body alone is incomplete. |
| **set the review marker** | Move the ticket to the project's declared review marker. What that *is* differs per tracker — a workflow state, a board column — but it is one operation to the caller. |
| **post a comment** | Add a comment to the ticket. |

### Missing-target behaviour

When the configured state, board, field, or option does not exist, the adapter **reports it and
leaves the ticket unchanged**. It never guesses a similarly-named substitute — a ticket parked in
the wrong column is worse than a ticket left alone with a clear message.

One exception, and it is an addition rather than a guess: when the issue exists but is not yet an
item on the configured board, the adapter **adds it and then sets the field, reporting both
actions**.

## `stages` — which skill runs for a ticket

```yaml
stages:
  artifact_glob: docs/plans/*.md      # default — assumes compound-engineering
  readiness_key: artifact_readiness   # default — assumes compound-engineering
  map:                                # readiness value -> stage. default — assumes compound-engineering
    requirements-only: plan
    implementation-ready: implement
  skills:                             # stage -> skill the run invokes. default — assumes compound-engineering
    plan: compound-engineering:ce-plan
    implement: compound-engineering:ce-work
  interactive: [brainstorm]           # default: [brainstorm] — stages that are refused, never dispatched
  default_stage: null                 # default: null
```

**Every default in this block assumes [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) is the planning workflow.** A project using anything else overrides
`artifact_glob`, `readiness_key`, `map`, and `skills` — four values, no code. The plugin itself
depends on none of it: with `default_stage` set and `readiness_key` unset, stage resolution never
looks for a planning artifact at all.

`interactive` names stages that need question-and-answer with a human. A sandbox can only
round-trip through comments, so `dispatch` **refuses** these with the reason rather than firing
something structurally unable to finish.

`default_stage` is what a project with no machine-readable readiness signal supplies. When it is
`null` and no readiness value can be read, `dispatch` asks for an explicit `--stage` instead of
guessing.

## `risk_brakes` — where a run must halt

```yaml
risk_brakes:
  paths: []                      # default: [] — globs; touching one halts the run
  changes: [migration]           # default: [migration]
```

A run that reaches a risk brake **stops and opens a draft pull request with the blocker stated
first**. It does not proceed and flag it afterwards.

`changes` values are `migration`, `payments`, `auth`. Declare the ones your project treats as
too consequential for unattended work. `paths` is for surfaces that are consequential for reasons
a category cannot express — name them as globs.

## `database` — the disposable-database tier

```yaml
database:
  enabled: false                 # default: false. When false, every key below is ignored.
  provider: supabase             # default: supabase — the only provider in v1
  instance_size: small           # default: small
  region: eu-west-2              # REQUIRED when enabled
  branch_name_prefix: run-       # default: run-
  function_secrets_var: BRANCH_FUNCTION_SECRETS   # default
  secrets_files: []              # default: [] — repo paths the run writes the forwarded set to
  branch_ref_var: SUPABASE_BRANCH_REF             # default — see the note below
  test_env:                      # variable NAMES the suite reads. Never values.
    url: []
    anon_key: []
    service_role_key: []
  shim:
    enabled: auto                # auto | true | false. default: auto — install only if needed
    path: test/helpers/pg-http-shim.ts            # default
    test_config: vitest.config.pghttp.ts          # default
  test_overrides:                # applied only when the suite targets a branch
    max_workers: null            # default: null — leave the suite's own setting alone
    hook_timeout_ms: null        # default: null
```

**`instance_size` is a correctness key, not a cost key.** The Postgres-over-HTTPS shim opens one
database connection per query, and the branch's own functions open their own. An undersized branch
starves both under a parallel suite, and the symptom is misleading — functions returning 500,
which reads as a missing secret rather than exhausted connection slots. Match the size to your
suite's concurrency; `small` is the smallest size proven to survive a parallel run alongside the
shim.

**`branch_ref_var` names what your *suite* reads.** Rename it freely for your own code. The
shipped shim, however, reads `SUPABASE_BRANCH_REF` and `SUPABASE_PROJECT_REF` by those fixed
names, because it is a file copied into your repository rather than something that can read this
config at runtime. So the run exports **both**: the name you set here, and `SUPABASE_BRANCH_REF`.
If you install the shim and set a different `branch_ref_var`, nothing breaks — the two simply
carry the same value.

**`test_env` carries names only.** These are the environment variables your suite already reads to
find its database. The run exports them pointing at its own preview branch. No value ever appears
in this file, in a dispatched prompt, or in a report.

**`secrets_files`** are repository paths the run writes the forwarded secret set to, for tooling
that reads a file rather than the environment. Every path listed here must be matched by the
repo's ignore rules; `onboard` refuses to declare the tier ready otherwise.

**`test_overrides`** exist because a remote branch is slower than a local database in ways that
look like failures: hooks time out on latency, and a worker count tuned for a local stack
oversubscribes a branch's connection slots. They apply only when the suite targets a branch.

The run carries them to the suite as two environment variables, which the shipped alternate test
config reads:

| Key | Variable the run exports |
|---|---|
| `max_workers` | `AGENT_DELIVERY_MAX_WORKERS` |
| `hook_timeout_ms` | `AGENT_DELIVERY_HOOK_TIMEOUT_MS` |

A project running **without** the shim never loads that config, so its run passes the same values
on the test command line instead (`--maxWorkers=N` and the runner's timeout flag). Either way the
values come from these two keys.

### Prerequisites when `database.enabled: true`

The plugin checks these during onboarding rather than assuming them:

- **Supabase branching is enabled** on the production project.
- **The Supabase GitHub integration is installed**, so preview branches build from the
  repository's migrations rather than the production project's stored migration history. These
  two sources diverge, and a green local database reset proves nothing about the other one.
- **The Supabase connector is available to the run.** The run obtains its branch's API URL and
  publishable keys through the connector's project-URL and publishable-key operations,
  specifically to avoid the branch-detail endpoint, which returns credentials it has no use for.
- **A cloud environment exists** carrying the management token, the production project reference,
  and the forwarded function-secret set. `onboard` generates its contents; a human pastes them.

## `close_out` — what a finished run does to the ticket

```yaml
close_out:
  review_marker: true            # default: true
  manual_test_checklist: true    # default: true
  defect_record: true            # default: true
```

All three default on. Each is independently switchable off. With all three off, a run opens a
pull request and touches the tracker not at all.

`defect_record` applies only to tickets the tracker reports as defects. A project with no
defect-recording practice sets it `false`, and the run says it skipped it rather than inventing a
record format.

## `dispatch` — how a run is fired

```yaml
dispatch:
  environment: ""                # cloud environment name. REQUIRED when database.enabled is true
  model: claude-sonnet-5         # default: claude-sonnet-5
  runbook_url: https://raw.githubusercontent.com/Vibing-Founders/founder-kit/main/plugins/agent-delivery/skills/_shared/sandbox-runbook.md
```

**The environment is the tier declaration.** Selecting the environment that carries the database
credentials and setup script is what puts a run at the database tier; there is no separate switch.
A project with `database.enabled: false` leaves `environment` empty and gets the default one.

`runbook_url` is the fallback path only. The run's first move is to invoke the plugin's skill; it
fetches this URL only when that invocation is unavailable.
