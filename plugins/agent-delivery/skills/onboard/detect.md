# Phase 1 — detect

Produce a **detection report** before writing anything. Every line of it is either "detected, and
here is the evidence" or "not detected, defaulting to X". That distinction is the whole point of
this phase: a wrong default and a wrong detection produce identical config and completely
different debugging.

Read the repository. Do not ask the human anything you can read.

## 1. Repository and build

| What | How to detect | Config key |
|---|---|---|
| Clone directory | The repository's own directory name (`basename $(git rev-parse --show-toplevel)`). Confirm it matches the remote's repo name — a clone renamed locally would produce a setup script that works on this machine and nowhere else | `repo.clone_dir` |
| Install command | **Read the CI workflow first.** Whatever CI actually runs is the answer, flags included (`--legacy-peer-deps` and friends) — a sandbox install that diverges from CI's fails differently, and the difference costs a run to diagnose. Only when there is no CI does a lockfile decide it: `package-lock.json` → `npm ci`; `pnpm-lock.yaml` → `pnpm install --frozen-lockfile`; `yarn.lock` → `yarn install --immutable`; `bun.lockb` → `bun install --frozen-lockfile` | `repo.install` |
| Post-install steps | Scripts CI runs between install and test: code generation, route manifests, schema types. Read the CI workflow rather than guessing from script names | `repo.post_install` |
| Test command | The `test` script, reduced to a form that **accepts file paths** — `vitest run`, `jest`, `pytest`. A script wrapping the runner with a fixed path list cannot take arguments; name the underlying runner instead | `repo.test_command` |
| Lint / type-check | The corresponding scripts, if they exist. Omit the keys when they do not | `repo.lint_command`, `repo.typecheck_command` |

> **A lockfile and CI can disagree, and it is not rare.** A repository can carry a `bun.lockb`
> from local use while CI installs with `npm ci --legacy-peer-deps`. Inferring from the lockfile
> there produces a setup script that works on someone's laptop and fails in the sandbox. When they
> disagree, CI wins, and **say in the report that they disagreed** — it usually means the lockfile
> is stale, which is the human's problem to know about.

## 2. Tracker

| Signal | Conclusion |
|---|---|
| A `.github/` directory and issues referenced as `#123` in commit messages | `kind: github` |
| Ticket identifiers shaped `ABC-123` in branch names or commit messages, or a Linear connector present | `kind: linear` |
| Both | Ask. Do not pick by count |

Then read [`../_shared/trackers/<kind>.md`](../_shared/trackers/) and fill in that adapter's
config block. Two things it will tell you that detection cannot:

- **The review marker.** For GitHub this is a board, a field, and an option; for Linear a workflow
  state. You can list the candidates — `gh project list --owner <owner>`, or the team's workflow
  states — but **which one means "ready for human review" is the human's answer**. Present the
  candidates and ask.
- **Any extra credential scope.** Record it for phase 3; the GitHub adapter needs `project` scope,
  which is not in a default login and fails with an unhelpful permissions error.

## 3. Planning artifacts and the stage map

Look for a directory of planning documents carrying a machine-readable readiness field —
conventionally `docs/plans/*.md` with `artifact_readiness:` in YAML frontmatter.

- **Found** → write `stages.artifact_glob` and `stages.readiness_key` from what you actually found,
  and record the readiness values present in the repository so `stages.map` covers them. Do not
  ask the human for a key you can read out of a file.
- **Found, but a different convention** → same, with that convention's glob and key.
- **Not found** → set `stages.default_stage` and **say so explicitly in the report**: this project
  supplies its stage per dispatch rather than resolving it from an artifact. Leave `readiness_key`
  unset so stage resolution never looks for one.

Check whether the compound-engineering plugin is present (`.compound-engineering/`, or plan
frontmatter naming `ce-unified-plan`). When it is, the defaults in `stages` already fit and you can
leave the whole block out — but still **report that they were defaulted**, not detected.

## 4. Risk brakes

Read the repository's own instruction file (`CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`) for
surfaces it already describes as consequential — payment paths, authentication, a subsystem with
its own reliability documentation. Propose these as `risk_brakes.paths` and let the human confirm.

`risk_brakes.changes` defaults to `[migration]`. Ask whether payments and auth belong too; a
project without either says no and the answer is cheap.

## 5. The database tier

First: does this project need it at all? A `supabase/` directory with a `migrations/` folder is the
signal. Without one, set `database.enabled: false` and skip to the report — phase 4 will be skipped
entirely.

With one, detect **how the suite resolves its database target**. This is the part most likely to
be got wrong, because it is spread across several layers:

1. **The variable names the suite reads.** Grep the test helpers and application config for the
   environment variables naming the database URL and its keys. There are usually several aliases
   for the same value (a server-side name and a bundler-prefixed one); collect them all into
   `database.test_env`. **Names only, never values.**
2. **Any config that injects a dotenv file into the test environment.** This is the trap. A test
   runner config that spreads a parsed `.env` file into the test environment **beats exported shell
   variables inside the workers** — so a run that exports branch values can still be silently
   redirected to whatever that file says. Read the test runner's config for an `env:` block built
   from file contents, and record every file it reads in `database.secrets_files`.
   - If such a file exists and could ever hold a *connection* variable rather than only function
     secrets, say so loudly in the report. It is the single failure mode that produces a green run
     against the wrong database.
3. **Tests that open a direct Postgres connection.** Grep for imports of the Postgres client
   package. Record the count and the files; phase 4 decides what to do about them. Do not install
   anything yet.
4. **The region and the production project reference.** The region is in the Supabase project's
   settings and the human has it. The project reference is not a secret, but it is also not
   guessable — ask.

## 6. Report

Emit the detection report before writing any file. Structure it as three lists:

- **Detected** — value, key, and the evidence (file and line).
- **Defaulted** — value, key, and what would have had to exist for it to be detected.
- **Needs a human answer** — the review marker, the project reference, the region, risk-brake
  confirmation, and anything ambiguous. Ask these as one batch, not one at a time.

Only then move to phase 2 and write the config.
