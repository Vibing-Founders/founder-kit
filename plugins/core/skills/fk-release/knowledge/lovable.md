# Releasing a Lovable frontend

How `fk-release` runs the `lovable` target. Checked against Lovable's documentation (see
"Sources").

## What the agent can and cannot do

**Publishing is a manual step in the Lovable editor.** The agent cannot trigger it and cannot
verify it. Lovable does not publish on its own: after the first publish, later changes reach
visitors only when someone publishes again. So the `lovable` target is a step the founder does,
and the founder's confirmation is the only evidence it happened.

**It runs after the backend.** The published frontend calls the database and the edge functions
as soon as it is live. Published first, it calls a schema or a function that is not there yet.
`fk-release` warns when a config lists `lovable` before a Supabase target.

**The code has to be in Lovable first.** Lovable's GitHub sync pulls changes pushed to the branch
it syncs (by default the repository's default branch). A merge to that branch is a push, so the
merged work normally appears in the editor without anyone doing anything. If the editor does not
show the latest merged change, Lovable's documented fix is to push a new commit to the synced
branch, for example an empty commit. Do not do that as part of a release without the founder's
say-so: it is a commit to the release branch.

## What to tell the founder

Say it in this shape, filled in, once the Supabase targets are verified:

> The backend is live. Now publish the frontend in Lovable:
>
> 1. Open your Lovable project (<project name or `project_id`, when the config has one>).
> 2. Check the latest change you merged is there (for example, open the page it changed in the
>    preview). If it is not, tell me before you publish.
> 3. Click **Publish** in the top-right corner of the editor, next to **Share**. On a narrow
>    window it shows only as an icon.
> 4. Click **Publish changes**.
> 5. Open your live site (your `lovable.app` address or your own domain) and check the change is
>    there. A hard refresh helps if you see the old version.
>
> Tell me when it is live, or what you see if it is not.

Wait for the founder's answer. "Done" or "it's live" is a confirmation. Anything else (the change
is missing, an error, "not yet") is not: help them with it, and do not move tickets until they
confirm.

## Things Lovable can do that bypass this release

Lovable's own chat can deploy edge functions and, with the founder's approval in the chat, run
SQL migrations on the connected Supabase project. Those changes go live without passing through
`fk-release` or the release branch. If the plan's dry run shows production already has a
migration the repository does not, or the functions list shows a function the repository does not
have, say so in the plan: something was released outside this path. Do not try to undo it.

Lovable's documentation does not say whether changes synced from GitHub make Lovable deploy edge
functions or migrations itself. `fk-release` deploys the backend through the Supabase CLI and does
not rely on Lovable for it.

## Sources

Checked on 2026-11-03.

- Lovable, "Publish your Lovable project" (the **Publish** button next to **Share**, **Publish
  changes** for later releases, nothing is pushed live automatically, the `lovable.app` address,
  custom domains): https://docs.lovable.dev/features/publish
- Lovable, GitHub integration (changes pushed to the synced branch sync into Lovable, one branch
  at a time, the default branch by default, an empty commit when a push was missed):
  https://docs.lovable.dev/integrations/github
- Lovable, "Connect to Supabase" (Lovable deploys edge functions it writes, and asks for approval
  before running a migration): https://docs.lovable.dev/integrations/supabase
