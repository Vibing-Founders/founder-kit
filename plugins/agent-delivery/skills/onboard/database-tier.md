# Phase 4 — prove the database tier

Run this only when `database.enabled` is true.

The tier is declared ready **only after a preview branch has been built green, run a real test
green, and been deleted, in this project**. Not after the config looks right, and not because a
local database reset passes — a local reset and a preview branch replay different sources, so one
says nothing about the other.

Order matters: the shim decision (1–3) comes before the preflight (5–7), because the preflight
runs a real test file and that file may need the shim.

---

## 1. Does this project need the shim at all?

The shim exists for tests that open a **direct Postgres connection**, because a sandbox has no raw
TCP route to the database. Tests that reach the database only through the provider's client library
travel over HTTPS already and need nothing.

```bash
grep -rlE "from ['\"]pg['\"]|require\(['\"]pg['\"]\)" <test dir>
```

**No matches** → set `database.shim.enabled: false`, install nothing, and **say so in the report**:
*"This project's tests reach the database only through the client library, so the tier needs no
shim and no alternate test config."* Skip to step 4. A silent skip reads like an oversight.

**Matches** → continue to step 2. Record the count and the file list; the report names them.

---

## 2. Precondition scan — run it before copying anything

The shim diverges from a real Postgres client in five ways, documented in its header. Three of
them are enforced at runtime; two can only be caught by reading the tests. **Scan for all five
before installing**, because a shim installed into a suite that violates one produces a confusing
failure rather than an honest one.

Scan the files found in step 1.

| # | Precondition | How to scan | On a hit |
|---|---|---|---|
| 1 | **No dollar-quoted SQL.** Parameter substitution is textual, so `$$ … $$` or `$tag$ … $tag$` would be corrupted | Search the SQL strings for `$$` or `$<word>$` | **Stop. Do not install.** Report the file and the statement |
| 2 | **No literal `$N`-shaped token outside a parameter position.** Substitution cannot tell a placeholder from a `$1` inside a string literal | For each `query()` call, count the distinct `$N` tokens and compare with the length of the params array. A `$N` where `N` exceeds the params length, or any `$N` in a call passing no params, is a literal | **Stop. Do not install.** Report the file and the statement |
| 3 | **No affected-row assertion on a non-returning write.** The endpoint returns rows, not a command tag, so `rowCount` is the returned-row count and a write without `RETURNING` reports 0 | Find `insert`/`update`/`delete` statements with no `returning`, then check whether the call's result has `rowCount` or `rowsAffected` asserted | **Stop. Do not install.** Report the file and the assertion |
| 4 | **No connection as another database role.** Every statement runs as the endpoint's own role | Search for a client constructed with a `user` option, or a connection string carrying one, that is not the endpoint role | **Stop. Do not install.** Report the file. (The shim also throws at runtime, but an install-time report is the useful one) |
| 5 | **Transactions are used for grouping, not isolation.** `begin`/`commit`/`rollback` are no-ops, so a suite that rolls back to undo its fixtures leaves its writes behind | Search for `rollback`, then read each hit. The question is whether the suite **depends** on it to undo writes. A rollback whose failure is swallowed — `catch (…) {}` around it, or a chained `.catch(() => undefined)` — is best-effort recovery and fine. A rollback the fixtures rely on, typically unguarded in a `finally` or teardown hook with no other cleanup, is not | **Stop. Do not install.** Report the hook |

**A hit is a stop, not a warning.** Report the incompatibility and what it would cause, and leave
the repository unmodified. The adopter's options are to change the test or to run that file
against a real Postgres connection in CI — both are theirs to choose, and neither is something to
decide for them by installing anyway.

Say which preconditions were checked and passed, not just that the scan passed. A scan reported as
a single "clean" line is indistinguishable from a scan that did not run.

---

## 3. Install the shim

Only with a clean scan. Copy both assets to the paths `database.shim.path` and
`database.shim.test_config` record, creating directories as needed:

- [`assets/pg-http-shim.ts`](assets/pg-http-shim.ts) → `database.shim.path`
- [`assets/vitest.config.pghttp.ts`](assets/vitest.config.pghttp.ts) → `database.shim.test_config`

Then adjust the copied config's two marked constants to match this repository: the base config's
location, and the shim's path if it differs from the default. The file says which lines.

Set `database.shim.enabled: true`. The runbook and the preflight both read these paths, so they
must be recorded rather than assumed.

---

## 4. Confirm no secret can reach git

Before any branch exists, check the paths a run will write secrets to.

For every entry in `database.secrets_files`, confirm the repository's ignore rules match it:

```bash
git check-ignore -v <path>
```

**An unmatched path means the tier is not ready.** Report the exact missing ignore entry so the
adopter can add one line and re-run. Do not proceed to the preflight, and do not "fix" it by
writing to `.gitignore` yourself — an ignore rule is a repository-wide decision.

A file that is ignored cannot be committed by accident. A file that is not, can, and the failure
mode is a secret in public history.

---

## 5. The preflight branch

This is what turns "preview branches build from this repository's migrations" from an assumption
into a checked fact for *this* project.

1. **Push a throwaway git branch.** A git-associated preview branch builds from the pushed ref, so
   the branch must exist remotely first. Name it obviously disposable.
2. **Create the preview branch git-associated with that ref**, at `database.instance_size` in
   `database.region`. Creating it from the pushed ref — rather than dashboard-style with no git
   association — is the point: it exercises the same build source a real dispatch uses.
3. **Poll to a terminal state**, reading only the status field. Never fetch the branch-detail
   endpoint; it returns credentials in every response and nothing you need is only there.
4. **Then poll the applied-migration count until it settles.** The status flag turns green before
   replay finishes, and a schema sampled on that signal is partial. Judge nothing until the count
   stops increasing.

**On a migrations failure: report the first failing migration by name, and stop.** The tier is not
ready. This is the failure the whole preflight exists to catch, and its usual cause is worth
naming in the report: preview branches build from the repository's migrations only when the
provider's GitHub integration is installed. Without it they replay the production project's stored
migration history, which can differ from the repository's files and need not replay cleanly.

Then go to step 7 — the branch is deleted either way.

---

## 6. Run one real test file

A branch that builds is not the same as a branch the suite can use.

1. Pick **one existing database-backed test file** — the smallest one that genuinely touches the
   database. Do not write a new test; the point is to exercise this project's real setup path.
2. Export the branch's values under the names `database.test_env` records, plus the branch-ref
   variable. Obtain the URL and keys through the provider's MCP connector, not the branch-detail
   endpoint. Pipe them into the environment; never print them.
3. If the file needs the shim, run it with the alternate config.
4. **Time it.** Then run the same file locally and time that too.

**Green → the tier is ready.** Report both timings side by side. The remote run is roughly twice
the local one, and worse for tests that exercise deployed functions. The adopter should learn that
from a number here rather than from a dispatch that looks hung.

**Red → the tier is not ready.** Report the failing test *and how the suite resolved its database
target* — which variables it read and what they were pointing at. That second part is what makes
the failure diagnosable, because the most common cause is not the branch: it is a test-runner
config spreading a dotenv file into the test environment, which outranks exported shell variables
inside the workers and silently aims the suite somewhere else.

---

## 7. Clean up — in both outcomes

Delete the preview branch, then list branches and confirm it is gone. Delete the throwaway git
branch, locally and on the remote.

**This runs whether the preflight passed, failed, or was interrupted after step 5.2.** A preflight
that dies between creating the branch and judging it still leaves a live branch costing money. If
you cannot confirm the deletion, say so explicitly and name the branch so a human can remove it.

**Never delete a branch named `main`.**

---

## 8. Report

State, in this order:

1. Whether the shim was installed, and **why it went that way** — needed and clean, needed and
   blocked by precondition *N*, or not needed at all.
2. Which preconditions were checked.
3. Whether the secrets paths are ignored.
4. Whether the preflight branch built, and how many migrations replayed.
5. The test file that ran, its result, and the two timings.
6. Whether the branch and the throwaway git branch were confirmed deleted.
7. **Ready, or not ready and what is missing.** One line, unambiguous.
