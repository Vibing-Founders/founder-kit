# Releasing to Supabase

How `fk-release` runs the `supabase-migrations` and `supabase-functions` targets. `<cli>` is the
target's `cli` value (`supabase` by default, often `npx supabase`). `<project-ref>` is its
`project_ref`.

> **Kept in step by hand.** `agent-delivery` carries overlapping Supabase facts in
> `plugins/agent-delivery/skills/_shared/sandbox-runbook.md` (migrations and function deploys on
> a preview branch). Each plugin installs on its own, so neither file references the other at run
> time. When a Supabase fact changes in one, check the other in the same pull request.

Every command and flag below was checked against the Supabase CLI reference and guides listed
under "Sources". If the CLI on the founder's machine disagrees (an unknown flag, a different
message), trust the CLI, say so in the report, and stop before production changes.

## The four rules

Each was learned by a release going wrong.

1. **Migrations before functions, always.** A function deployed ahead of the column or table it
   uses fails every request that touches it until the migration lands. `fk-release` refuses a
   config that lists `supabase-functions` before `supabase-migrations`.
2. **Never push a migration to production ahead of its merge to the release branch.** A migration
   applied from a feature branch is recorded in the production history table. Every other branch
   then has a local history that does not match production, and `db push` refuses for all of
   them. `fk-release` only releases what is merged on `release.branch`.
3. **When `db push` refuses out-of-order migration files, use `--include-all`, never
   `migration repair --status reverted`.** Out of order means a merged migration's timestamp is
   older than the newest one production has already applied (two branches merged in a different
   order from the one they were created in). The CLI stops with "Found local migration files to be
   inserted before the last migration on remote database." `--include-all` applies those older
   files too. `migration repair --status reverted` instead deletes history records, which hides
   what production has actually run and leaves the next push to re-run or skip SQL wrongly.
4. **Deploy all edge functions, never named ones.** A change to a shared module in
   `supabase/functions/_shared/` changes every function that imports it, and a named deploy leaves
   the others running the old code. Run `functions deploy` with no function name. When the founder
   asks for just one function, deploy all of them and say why.

## Before the run: the CLI login and the link

The CLI needs a login to reach the project: `supabase login` (a personal access token), or the
`SUPABASE_ACCESS_TOKEN` environment variable. If a command fails because it is not logged in, ask
the founder to run `<cli> login` themselves. Never ask them to paste the token into the
conversation.

`db push` and `migration list` act on the **linked** project and have no `--project-ref` flag. So
before the migrations target:

1. Link the repository to the target's project:

   ```
   <cli> link --project-ref <project-ref>
   ```

   `link` may ask for the database password. That is the founder's to type in their terminal;
   never ask for it in the conversation. Linking changes local state only, not production, so
   doing it again for a project that is already linked is safe.
2. Never run a migrations command against a project ref other than the target's.

## `supabase-migrations`

**Plan (dry run, changes nothing):**

```
<cli> db push --linked --dry-run
```

It prints the migrations that would be applied without applying them. List them in the plan by
filename. If it reports the out-of-order error, the plan says so and the run uses `--include-all`
(rule 3): re-run the dry run with `--include-all` to show the full list.

No pending migrations is normal: the target is then a no-op, reported as "nothing to apply".

**Run:**

```
<cli> db push --linked
```

Add `--include-all` only when the dry run showed the out-of-order error. Do not add
`--include-seed` or `--include-roles`: a release applies migrations, not seed data or roles.

The CLI records each migration in the remote history table after it succeeds, and a later push
skips what is already recorded. So when a push fails partway, the migrations before the failing one
are applied and live. Production has changed: follow "Partial release" in `SKILL.md`.

**Verify:**

```
<cli> migration list --linked
```

It shows a LOCAL and a REMOTE column of migration timestamps. Verified means every LOCAL
timestamp also appears in REMOTE: no migration is pending. Any row with LOCAL only is not verified.

## `supabase-functions`

**Plan:** list the directories in `supabase/functions/` that hold an `index.ts` (leave out
`_shared/` and other directories starting with `_`). Those are the functions that will deploy.
Also take a baseline for verifying:

```
<cli> functions list --project-ref <project-ref>
```

Note each function's `VERSION` and `UPDATED_AT (UTC)`.

**Run:**

```
<cli> functions deploy --project-ref <project-ref>
```

No function name: this deploys every function in `supabase/functions/` (rule 4). Do not add
`--prune`: deleting functions that are live but not in the repository is a separate decision for
the founder. Do not add `--no-verify-jwt` unless the project's own deploy instructions already use it.

If deploying fails because Docker is not running, the CLI can bundle on Supabase's side instead:
add `--use-api`. Say in the report that you did.

**Verify:**

```
<cli> functions list --project-ref <project-ref>
```

Verified means every function from the plan is listed with a `VERSION` higher than its baseline
and a newer `UPDATED_AT (UTC)` (or is newly listed, for a new function). A function whose version
did not move was not deployed.

Then check the secrets the functions need. List every name the functions read with
`Deno.env.get('…')` (search `supabase/functions/`), leave out the ones Supabase provides by
default (`SUPABASE_URL`, `SUPABASE_DB_URL`, `SUPABASE_PUBLISHABLE_KEYS`, `SUPABASE_SECRET_KEYS`,
`SUPABASE_JWKS`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and in production `SB_REGION`,
`SB_EXECUTION_ID`, `DENO_DEPLOYMENT_ID`), and compare with the names the project has:

```
<cli> secrets list --project-ref <project-ref>
```

A name the code reads that is not listed fails this target: the function deploys fine and then
fails every request that needs the secret.

**A missing secret.** Ask the founder for the value. Offer first to let them set it themselves, so
the value never enters the conversation:

```
<cli> secrets set NAME=value --project-ref <project-ref>
```

Never write a secret into a file in the repository. Functions read a new secret straight away, so
no redeploy is needed: run `secrets list` again and the target is verified when the name is
there.

## Never

- `migration repair` to hide a migration, with either status. Repair edits history without
  running SQL; it is for a history that is already wrong, and that is a decision for the founder,
  not a release step.
- Roll back an applied migration. Fix forward with a new migration (see "Partial release" in
  `SKILL.md`).
- `db reset` or `--db-url` against production.
- A named function deploy.

## Sources

Checked on 2026-11-03.

- Supabase CLI reference, `supabase db push` (`--dry-run`, `--include-all`, `--include-seed`,
  `--include-roles`, `--linked`): https://supabase.com/docs/reference/cli/supabase-db-push
- Supabase CLI reference, `supabase link` (`--project-ref`, `-p`):
  https://supabase.com/docs/reference/cli/supabase-link
- Supabase CLI reference, `supabase migration list` (LOCAL and REMOTE columns):
  https://supabase.com/docs/reference/cli/supabase-migration-list
- Supabase CLI reference, `supabase migration repair` (`--status applied | reverted`, and that
  `reverted` deletes the history record): https://supabase.com/docs/reference/cli/supabase-migration-repair
- Supabase CLI reference, `supabase functions deploy` (`--project-ref`, `--prune`,
  `--no-verify-jwt`, `--use-api`): https://supabase.com/docs/reference/cli/supabase-functions-deploy
- Supabase CLI reference, `supabase functions list` (`--project-ref`):
  https://supabase.com/docs/reference/cli/supabase-functions-list
- Supabase CLI reference, `supabase secrets set`, `supabase secrets list`, `supabase login` and
  `SUPABASE_ACCESS_TOKEN`: https://supabase.com/docs/reference/cli/supabase-secrets-set,
  https://supabase.com/docs/reference/cli/supabase-secrets-list,
  https://supabase.com/docs/reference/cli/supabase-login
- Supabase guide, "Environment variables" (the default secrets, `secrets set` and `secrets list`,
  and that functions read a new secret without a redeploy):
  https://supabase.com/docs/guides/functions/secrets
- Supabase guide, "Deploy to Production" (`supabase functions deploy` with no name deploys every
  function in the `functions` folder): https://supabase.com/docs/guides/functions/deploy
- The out-of-order error text is from the CLI source, not the docs (`ErrMissingRemote` in
  `pkg/migration`): https://pkg.go.dev/github.com/supabase/cli@v1.200.1/pkg/migration
- The `functions list` column names (`ID`, `NAME`, `SLUG`, `STATUS`, `VERSION`,
  `UPDATED_AT (UTC)`) are from the CLI source, not the docs:
  https://github.com/supabase/cli/blob/develop/apps/cli/src/commands/functions/list/list.format.ts
