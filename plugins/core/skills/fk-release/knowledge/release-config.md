# The shared `release` key

> **Kept in step by hand.** `site-delivery` carries the same schema in
> `plugins/site-delivery/skills/_shared/config-schema.md` (the `release` section), because each
> plugin installs on its own and no file is shared across plugins. When this file changes, change
> that one in the same pull request.

`release` is a top-level key of `.vf-founder-kit/config.yaml`, beside `docs_root` and `tracker`.
It is shared rather than owned: `core` (`fk-setup` writes it, `fk-release` reads it) and
`site-delivery` (`fk-onboard` writes it, `fk-orchestrate` reads it) both use it.

```yaml
release:
  branch: main                    # the branch that is released
  targets:                        # run in this order
    - kind: supabase-migrations
      project_ref: <project-ref>
      cli: npx supabase           # how this repo calls the Supabase CLI
    - kind: supabase-functions
      project_ref: <project-ref>
      cli: npx supabase
    - kind: lovable               # manual: the founder clicks Publish and confirms
      project_id: <lovable-project-id>   # optional, for the report only
    # - kind: command
    #   name: Deploy API
    #   run: <command>
    # - kind: manual
    #   say: <a step only a person can do>
```

## Keys

| Key | Meaning |
|---|---|
| `branch` | The branch that is released. Only what is merged here and pushed to `origin` goes live. Default: the repository's main branch, reported as a default |
| `targets` | The release steps, **run in the order listed** |

## Target kinds

These five are all that v1 supports. Any other `kind` is reported by name and the release is
refused before anything changes.

| Kind | Keys | What it does |
|---|---|---|
| `supabase-migrations` | `project_ref` (required), `cli` (default `supabase`) | Applies pending migrations in `supabase/migrations/` to the project with `db push`. See `supabase.md` |
| `supabase-functions` | `project_ref` (required), `cli` (default `supabase`) | Deploys **every** edge function in `supabase/functions/`. See `supabase.md` |
| `lovable` | `project_id` (optional, shown in the report only) | Manual. The founder publishes in the Lovable editor and confirms it is live. See `lovable.md` |
| `command` | `name` (required), `run` (required) | Runs `run` from the repository root. A non-zero exit is a failure |
| `manual` | `say` (required) | Manual. Tells the founder exactly what `say` says and waits for them to confirm it is done |

`cli` is how this repository calls the Supabase CLI: `supabase` when it is installed globally,
`npx supabase` when it is a dev dependency, and so on. Never put a secret in any key: no access
token, database password or API key. Those come from the founder's environment or a CLI login.

## Order rules

Checked before anything runs.

- **`supabase-functions` before `supabase-migrations` is refused.** The reason: functions would go
  live before the schema they use, and every request that touches a new column fails until the
  migration lands. Say which entries are out of order and that the fix is to swap them in
  `release.targets`.
- **`lovable` should come after every Supabase target.** If it does not, warn and ask: the
  frontend would go live against an old backend. Fold the warning into the release plan, so the
  founder answers it with the single "Release this?" question.
- `command` and `manual` targets may go anywhere. The founder put them where they are.

## Writing the key

`fk-setup` (core) and `fk-onboard` (site-delivery) write `release` **only when it is missing**,
and change an existing one only with the founder's say-so. They keep every other key and section
of the file exactly as it was, and create the file if it does not exist. This is the same rule as
for `tracker`. `fk-release` never writes it.

## Migrating from `site-delivery.publish`

Earlier versions of `site-delivery` kept a `publish` block in its own section. When `release` is
missing and `site-delivery.publish` exists, map it:

| `publish.kind` | `release.targets` |
|---|---|
| `lovable` | `- kind: lovable` with `project_id: <publish.project_id>` when set |
| `supabase+lovable` | `- kind: supabase-migrations` and `- kind: supabase-functions`, both with `project_ref: <publish.supabase_project_ref>`, then `- kind: lovable` with `project_id: <publish.lovable_project_id>` |
| `sst-web` | One `- kind: command`, `name: Deploy site`, `run: npx sst deploy --stage <publish.stage>`, prefixed with `AWS_PROFILE=<publish.aws_profile> ` when `aws_profile` is set |

`branch` is `site-delivery.repo.main_branch` when set, otherwise `main`, reported as a default.
`cli` is left out (so it defaults to `supabase`) unless the repository shows how it calls the CLI,
for example `supabase` in `devDependencies` (then `npx supabase`).

- **`fk-setup` and `fk-onboard`** show the founder exactly what will be written, then write
  `release` and remove `site-delivery.publish` only after they confirm. Until then the old block
  stays, and the skills that read `release` map it in memory.
- **`fk-release`** (core) and **`fk-orchestrate`** (site-delivery) never write the file. They
  apply the mapping in memory for that run, say so, and say that `/core:fk-setup` or
  `/site-delivery:fk-onboard` will migrate it.
- When both exist, `release` wins and `site-delivery.publish` is reported as ignored.
