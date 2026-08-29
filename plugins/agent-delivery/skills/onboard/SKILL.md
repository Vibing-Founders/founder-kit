---
name: onboard
description: >
  Prepare a repository to dispatch tickets into a Claude cloud sandbox: detect the stack,
  tracker and planning artifacts, write .agent-delivery/config.yaml, generate the cloud
  environment's variable block and setup script for a human to paste, conditionally install
  the Postgres-over-HTTPS shim, and prove the disposable-database tier with a throwaway
  preview branch before any real work is dispatched. Use this skill when someone wants to set
  up, configure, or verify cloud dispatch for a repository. Triggers on: "onboard this repo
  for agent delivery", "set up cloud dispatch", "/agent-delivery:onboard", "configure the
  sandbox for this project", "prepare this repo for cloud runs", "why isn't dispatch working
  here", "check my agent-delivery setup", "set up the database tier", "verify preview branches
  work for this project". NOT for firing a run on a ticket — that is the `dispatch` skill.
---

# onboard — take a repository from unprepared to a verified first dispatch

This skill does what it can and instructs the human through what it cannot. Roughly an hour of
the setup is genuinely manual — a form on a hosted service that no skill can fill in. **The
problem was never the hour; it was not knowing which hour to spend, or which failures are your
own fault.** This skill's job is to remove that uncertainty.

## What "done" means

Onboarding is complete when:

1. `.agent-delivery/config.yaml` exists and every value in it was either detected or is a
   default that has been **reported as a default**.
2. The human has pasted the generated variable block and setup script into the cloud
   environment form.
3. If the database tier is on: a throwaway preview branch has been created, built green, run one
   existing database-backed test file green, and been deleted.

Anything less is reported as not ready, naming what is missing. **Never declare the tier ready on
inference.** A green local database reset proves nothing about whether a preview branch builds —
they replay different sources.

## Phases

Work through these in order. Each reports its outcome rather than failing silently.

### 1. Detect — read `detect.md`

Identify the stack, tracker, planning artifacts, and how the suite finds its database. Produce a
detection report before writing anything.

### 2. Write the config

From the detection report, write `.agent-delivery/config.yaml`, using
[`assets/config.example.yaml`](assets/config.example.yaml) as the shape and
[`../_shared/config-schema.md`](../_shared/config-schema.md) as the reference.

**Report every value that was defaulted rather than detected.** A default that happens to be
right and a detection that happens to be right look identical in the file and completely
different when they turn out to be wrong.

**Re-running against an already-configured repository reports what would change and asks before
overwriting.** Someone may have hand-edited it since; silently reverting that is worse than
stopping.

### 3. Generate the environment artifacts — read `environment.md`

Generate the variable block and the setup script, and walk the human through the confirmation
this skill cannot skip: which function secrets get forwarded to a disposable branch, and which are
suppressed because their effect reaches the outside world.

### 4. Prove the database tier — read `database-tier.md`

Only when `database.enabled` is true. Scan for direct Postgres use, conditionally install the
shim, and run the preflight that turns "preview branches should work here" into a checked fact.

Skip this phase entirely when the tier is off, and say so.

## Reference files

| File | When to read |
|---|---|
| `detect.md` | Phase 1 — always |
| `environment.md` | Phase 3 — always |
| `database-tier.md` | Phase 4 — only when `database.enabled` is true |
| `../_shared/config-schema.md` | Phase 2, and whenever a key's meaning or default is in question |
| `../_shared/trackers/<kind>.md` | Phase 1, to confirm the detected tracker's config block and any extra credential scope it needs |
| `../_shared/sandbox-runbook.md` | Not read during onboarding. It is what the *run* follows; skim it to understand what you are preparing for |

## Rules

1. **Never write a secret value anywhere.** Not into the config, not into the generated block,
   not into a report, not into a commit. The generated variable block names keys and leaves the
   values for the human to fill in on the hosted form. This is not a style preference — the
   environment form's values are visible to anyone with access to that environment.
2. **Report defaults as defaults.** See phase 2.
3. **Do not guess `repo.clone_dir`.** Detect it from the repository, and state it. A wrong value
   kills every run before the agent starts, with nothing in the log to read.
4. **Stop at the first gate that fails**, report it, and say what the human must do. Do not
   continue in the hope that a later phase makes it moot.
5. **The human owns the hosted form.** No skill can fill it in. Say exactly which steps are
   theirs, in order, rather than implying the setup is complete when it is not.
