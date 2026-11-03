# Deployment

Generated from the `release` key of `.vf-founder-kit/config.yaml`. Change the config, not this
file; re-run `/core:fk-setup` to regenerate it.

Release only what is merged on `main` and pushed to origin.

1. **Database migrations** (Supabase project `<project-ref>`): `npx supabase link --project-ref <project-ref>`,
   then `npx supabase db push --linked --dry-run` to see what will apply, then
   `npx supabase db push --linked`.
2. **Edge functions** (Supabase project `<project-ref>`): `npx supabase functions deploy --project-ref <project-ref>`,
   with no function name, so every function is deployed.
3. **Frontend** (Lovable): click **Publish**, then **Publish changes**, and check the live site.

Rules:

- Migrations before functions, always.
- Never push a migration to production ahead of its merge to `main`.
- If `db push` refuses out-of-order migration files, use `--include-all`, never
  `migration repair --status reverted`.
- Deploy all edge functions, never named ones.
- Publish the frontend after the backend.

Run `/core:fk-release` to release.
