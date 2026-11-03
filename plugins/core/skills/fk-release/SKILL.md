---
name: fk-release
description: >
  Release what is merged on the release branch to production in a safe order, then move released
  tickets to the Measure Impact stage. Reads the shared `release` key in
  .vf-founder-kit/config.yaml, checks the checkout is clean and level with origin, shows a plan
  (pending migrations, the functions that will deploy, manual steps such as publishing in
  Lovable, the tickets that will move) and asks once before changing anything. Supabase
  migrations always go before functions, and every function is deployed, never a named one. If a
  step fails after production has changed, it investigates and fixes forward straight away.
  The only Founder Kit skill that deploys, and it runs only when the founder asks.
  Triggers on: "release", "ship to production", "deploy what's merged", "/core:fk-release".
disable-model-invocation: true
---

# fk-release — release what is merged, in a safe order

Every project gets the same steps; only the targets differ. The targets and their order come from
the shared `release` key in `.vf-founder-kit/config.yaml`. Read
[`knowledge/release-config.md`](./knowledge/release-config.md) for the schema, and the knowledge
file for each target kind in the plan:

| Target kind | Read |
|---|---|
| `supabase-migrations`, `supabase-functions` | [`knowledge/supabase.md`](./knowledge/supabase.md) |
| `lovable` | [`knowledge/lovable.md`](./knowledge/lovable.md) |
| `command`, `manual` | This file |

v1 supports these five kinds and no others.

This is the only Founder Kit skill that deploys to production. It runs only when the founder
invokes it, never on Claude's own judgement. The delivery plugins stop at the pull request.

## Hard rules

- **Release only what is merged on `release.branch` and pushed to origin.** Nothing from a feature
  branch, a worktree or an unpushed commit.
- **Migrations before functions, always. Deploy all functions, never a named subset.** When the
  founder asks for one function ("deploy just `send-email`"), deploy all of them and say why: a
  shared module may have changed under the others.
- **One confirmation before the first change.** No further confirmations, except manual steps and
  a hotfix merge.
- **Never claim something is live that was not verified or confirmed.** The report says, per
  target, how it was verified, or that the founder confirmed it.
- **The skill saves no files of its own.** Its outputs are deploys, ticket moves, a hotfix pull
  request when needed, and the report. It never writes `.vf-founder-kit/config.yaml`.
- **Never print or ask for a secret in the conversation.** Logins and secret values are the
  founder's to type in their own terminal (see `knowledge/supabase.md`).

---

## Step 1: Read the config

Read `release` and `tracker` from `.vf-founder-kit/config.yaml`. Also read `docs/DEPLOYMENT.md`
and `docs/conventions/ticket-stages.md` when they exist (`docs/` is `docs_root` when that is set).

- **No `release` key, but `site-delivery.publish` exists.** Map it as `release-config.md` says,
  for this run only. Do not write the file. Say: "Your release steps are still in the old
  `site-delivery.publish` block. I'm using them for this release; `/core:fk-setup` or
  `/site-delivery:fk-onboard` will move them to the shared `release` key."
- **No `release` key and no `site-delivery.publish`.** Stop, change nothing, and say: "This project
  has no release steps set up yet. Run `/core:fk-setup` to set them up, then run
  `/core:fk-release` again."
- **Both exist.** Use `release`; say `site-delivery.publish` is ignored.
- **A target with an unsupported `kind`**, or missing a required key: name it, say the five kinds
  v1 supports, and stop before anything changes.

When `docs/DEPLOYMENT.md` disagrees with the config (a different order, a step the config lacks),
the config wins. Say so in the plan, and that re-running `/core:fk-setup` regenerates the doc.

## Step 2: Check the checkout

Run, from the repository root:

```
git fetch origin
git status --porcelain
git rev-parse --abbrev-ref HEAD
git rev-list --left-right --count HEAD...origin/<branch>
```

All of these must hold. If any fails, stop, change nothing, and say what to do:

| Check | If it fails |
|---|---|
| On `release.branch` | "You're on `<current>`. Switch to `<branch>` (`git switch <branch>`) and run this again." |
| Working tree clean (`status --porcelain` prints nothing) | "There are uncommitted changes. Commit them through a pull request, or stash them, then run this again." |
| Not ahead of `origin/<branch>` (left count 0) | "This checkout has `<n>` commit(s) that are not on origin. Releasing now would ship work nobody has merged. Push them through a pull request, or reset to origin, then run this again." |
| Not behind `origin/<branch>` (right count 0) | "Origin has `<n>` merged commit(s) this checkout does not. Releasing now would miss them. Run `git pull`, then run this again." |

Do not pull, reset or stash for the founder at this step. A release starts from a checkout the
founder has put right.

## Step 3: Plan, and ask once

1. **Validate the order** (see "Order rules" in `release-config.md`). `supabase-functions` before
   `supabase-migrations`: refuse, with the reason ("functions would go live before the schema they
   use") and the fix (swap the two entries in `release.targets`). Change nothing.
2. **Work out each target**, changing nothing:
   - `supabase-migrations`: link the project and run the dry run (`knowledge/supabase.md`). List
     the pending migrations by filename, or "nothing to apply".
   - `supabase-functions`: list every function that will deploy, and take the version baseline.
   - `lovable`: "You publish in Lovable and tell me when it's live."
   - `command`: the command, exactly as it will run.
   - `manual`: the `say` text.
3. **List the tickets that will move**: every ticket in the `for_release` column (or Linear state),
   looked up through `tracker.stage_map`. On GitHub, `gh project item-list <number> --owner <owner>
   --limit 1000 --format json` returns each item with its field values: keep the items whose
   `tracker.board.field` value is the `for_release` column. On Linear, list the issues in that
   state through the connector. When `tracker` is missing, `kind: none`, or
   `for_release` or `released_measure_impact` is not mapped, say tickets will not be moved and why.
4. **Show the plan** as a numbered list in target order, then the tickets, then any warning (a
   `lovable` target ahead of the backend; the config and `DEPLOYMENT.md` disagreeing; a migration
   or function in production the repository does not have). End with one question:

   > Release this?

Wait for the answer. Anything short of yes changes nothing. A `lovable`-order warning is answered
by the same question: yes means run it in the configured order.

## Step 4: Run the targets in order

Run each target as its knowledge file says, in the order listed, and verify it (Step 5) before
starting the next. Stop at the first failure.

- `command`: run `run` from the repository root. Exit code 0 is success. Show the last lines of
  output on failure.
- `manual` and `lovable`: tell the founder exactly what to do (for `lovable`, the message in
  `knowledge/lovable.md`; for `manual`, the `say` text) and wait for them to confirm it is done.
  These are the only questions after the first confirmation, besides a hotfix merge.

Before the first target succeeds, a failure leaves production as it was: stop and report what
failed and why. After that, see "Partial release".

## Step 5: Verify each target

As far as the agent can:

| Target | Verified when |
|---|---|
| `supabase-migrations` | `migration list --linked` shows no LOCAL-only migration |
| `supabase-functions` | `functions list` shows every planned function at a new version, and `secrets list` has every secret the functions read |
| `command` | It exited 0. The report says that is all that was checked |
| `lovable`, `manual` | The founder confirmed. The agent cannot verify these |

A target that ran but could not be verified counts as failed for moving tickets.

## Step 6: Move the tickets

Only after **every** target succeeded and every manual step was confirmed, move each ticket listed
in the plan from `for_release` to `released_measure_impact`.

- Follow the procedure in `docs/conventions/ticket-stages.md` when it exists.
- Otherwise use the stage map directly. GitHub: `gh project item-edit` with the board's field and
  the option named by `stage_map.released_measure_impact`, as in `ticket-stages.md`; this needs the
  `project` scope (`gh auth refresh -s project`). Linear: set the state by name within the issue's
  own team.
- An unmapped stage is skipped and reported, never guessed. A column or state that does not exist
  is reported and the ticket left where it is.
- No `tracker`, or `kind: none`: skip this step and say so.

Move only tickets that were in `for_release` at plan time. A ticket added to the column during the
release may not be in what was released.

## Step 7: Report

- **Live**: per target, what went live and how it was verified (or that the founder confirmed it).
- **Tickets moved**: each ticket and its new column, or why none moved.
- **Skipped**: anything not done, and why (an unmapped stage, no tracker, nothing to apply).
- **Partial release**, when there was one: what failed, the cause, the fix, and the hotfix pull
  request.

---

## Partial release

**Before anything changes in production, a failure means stop and report.**

**Once production has changed** (any target succeeded, or a migration partly applied), a failure
leaves production in a mixed state: for example, a new schema with old functions. The agent
running the release investigates and fixes it straight away. It does not stop and hand it back.

1. **Find the cause.** Read the error and the target's logs. Tell the founder, in plain language,
   what is live and what is not ("The two migrations are live. The functions are still the old
   version, so the new sign-up form will fail until they deploy.").
2. **Cause outside the code** (an expired CLI login, a missing secret or environment variable, a
   timeout, a rate limit): fix it, asking the founder only for what only they can supply (a secret
   value, a login), then retry the failed target. See `knowledge/supabase.md` for logins and
   secrets.
3. **Cause in the code** (a function that does not build, a failing migration, a command that
   fails on the code): write the fix on a new branch from `release.branch`, run the project's
   tests, and open a pull request marked as a release hotfix (title starting `Release hotfix:`,
   body saying what is live, what failed and why). Ask the founder to merge it now. Once it is
   merged, pull `release.branch`, run the Step 2 checks again, and resume from the failed target,
   running it and every target after it. Only merged work is released, even in a hotfix.
4. **Never roll back an applied migration**, and never use `migration repair` to hide one. If a
   migration itself fails, fix forward with a new migration through the same hotfix path. Create it
   with the project's migration command (for example `<cli> migration new <name>`), never a
   hand-written filename.
5. **Tickets do not move until every target is green.** If the founder will not merge a hotfix
   now, stop, say exactly what is live and what is not, and leave the tickets where they are.

## Out of scope

- Merging pull requests, other than asking the founder to merge a hotfix.
- Rolling back. Production only moves forward.
- Staging or preview environments. `release` describes production.
- Writing or changing the `release` key: that is `/core:fk-setup` or `/site-delivery:fk-onboard`.
