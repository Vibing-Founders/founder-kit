---
name: fk-onboard
description: >
  Guide a smart non-coding founder through configuring site delivery: a plain-language wizard
  that writes the site-delivery section of .vf-founder-kit/config.yaml with their site repo,
  publish platform, and optional tracker integration, and migrates an older standalone config
  file on request. Defaults to the thin brief-to-PR path that requires no GitHub Project or
  Linear setup. Use this skill when someone wants to set up, configure, or get started with
  site delivery. Triggers on: "onboard my site for delivery", "set up site-delivery",
  "/site-delivery:fk-onboard", "configure site delivery for my project", "prepare my site repo
  for Claude PRs", "how do I set up site-delivery", "check my site-delivery config".
---

# fk-onboard — configure a site repository for delivery

A plain-language wizard that writes the `site-delivery` section of `.vf-founder-kit/config.yaml` through conversation, not forms. This skill's job is to make the thin path the natural default and the fuller path an opt-in choice.

## What "done" means

Onboarding is complete when:

1. The `site-delivery` section of `.vf-founder-kit/config.yaml` exists with all required values (`repo.url` and `publish.kind`), and, for the fuller path, the shared top-level `tracker` key exists with a board (GitHub) and a `stage_map`.
2. Every value was either provided by the user or is a documented default that was **reported as a default**.
3. The user knows which path they chose: thin (no tracker) or fuller (tracker + compound-engineering stages).
4. Re-running on an already-configured repository detects the existing config, reports what would change, and asks before overwriting.

Never declare the configuration ready without showing the user what was written and confirming it matches their intent.

## The wizard conversation

Work through these steps in order. This is a conversation, not a form dump.

### 0. Check for an old config file

Earlier versions of this plugin kept the config in its own file, `.site-delivery/config.yaml`. If it exists, offer to migrate it before asking anything else:

> I found your site-delivery settings in `.site-delivery/config.yaml`, the old location. Founder Kit plugins now share one file, `.vf-founder-kit/config.yaml`. Shall I copy your settings into it, unchanged?

If they agree:

1. Copy the old file's content into the `site-delivery` section **unchanged**. Do not rewrite, default, or merge in any values while migrating.
2. Show them exactly what you wrote.
3. Ask whether to delete the old `.site-delivery/config.yaml`. Delete it **only after they confirm**. If they say no, leave it, and tell them it is now ignored because the new section wins.

If the `site-delivery` section already exists as well, do not overwrite it from the old file: say the old file is ignored, show any differences between the two, and offer only to delete it.

**An old tracker block inside the section.** Earlier versions also kept the tracker inside the `site-delivery` section (`tracker.kind`, `project`, `field`, `team_key` and a `stage_map` from column to stage). The tracker is now the shared top-level `tracker` key, which `core` and `agent-delivery` read too. If the section has one and there is no top-level key, offer to migrate it:

1. Copy `project` and `field` into `tracker.board`, unchanged, and write `kind: github` for `github-project`.
2. The column the old map sent to `review` becomes `stage_map.human_review`, unchanged.
3. The old map's other columns said where a stage *runs*, not what *exists*, so they do not translate one-to-one. Propose a stage for each (for example, the column where `work` ran → `in_progress`) and ask them to confirm or correct it. Leave out anything they are unsure of.
4. Show them exactly what you wrote, and remove the old `tracker` block from the section **only after they confirm**.

If a top-level `tracker` key already exists, leave it as it is: say the old block is ignored and offer only to remove it.

After migrating, carry on with the steps below only if they want to change something; otherwise go to step 6.

### 1. Detect or ask for the site repository

**If running in a repository context:**
- Detect the repository URL and main branch from git config
- Report what was detected: "I see this is `https://github.com/Vibing-Founders/my-site` on branch `main`"
- Ask: "Is this the site repository you want to configure for delivery?"
- If yes, use the detected values; if no, ask for the correct URL

**If no repository context (e.g. running in a chat without a local clone):**
- Ask: "What is the URL of your site repository?" (e.g. `https://github.com/username/my-site`)
- Ask: "What is your main branch?" (default: `main`)

**Branch prefix:**
- State the default: "I'll use `feature/` as the branch prefix for PRs."
- Ask: "Is that okay, or would you prefer a different prefix?"

### 2. Ask about tracker integration (thin vs fuller path)

**Frame this as a choice, not a requirement:**

> Site delivery has two paths:
>
> **Thin path (recommended for non-coders):** You give Claude a brief in plain language, and it opens a PR. No GitHub Project or Linear setup required. The brief comes from your conversation, not a ticket.
>
> **Fuller path (for teams with planning workflows):** You track work in GitHub Projects or Linear, and Claude reads the ticket, runs compound-engineering stages (brainstorm/plan/work/review), updates ticket status, and posts PR links as comments.
>
> Which path do you want?
> 1. Thin path (no tracker)
> 2. Fuller path with GitHub Project
> 3. Fuller path with Linear

**If they choose thin path (1):**
- Set `stages.enabled: false`
- Write no `tracker` key. If one already exists for other plugins, leave it alone: the thin path makes no tracker calls
- State: "Great, we'll use the thin path. No tracker setup needed."

**If they choose the fuller path (2 or 3), first check for a shared `tracker` key.** If `.vf-founder-kit/config.yaml` already has one (usually written by `/core:fk-setup`), reuse it. Show it in plain words and ask only whether it is still right:

> Your board is already set up: "Delivery", using the Status field. When Claude opens a pull request ready for review, the ticket moves to "Human Review". Is that still right?

Otherwise ask, as below, and write it as the shared top-level `tracker` key. The stages are fixed: `brainstormed`, `planned`, `in_progress`, `human_review`, `for_release`, `released_measure_impact`, `done`. Each maps to one of their columns; a stage they do not use is left out.

**If they choose GitHub Project (2):**
- Set `tracker.kind: github`
- Ask: "What is your GitHub Project board name?" (e.g. "Widget Co Site Delivery") → `tracker.board.project`
- Ask: "What is the status field name?" (default: "Status") → `tracker.board.field`
- Ask which column means each stage, in plain words: "Which column do tickets go in when the brainstorm is written? When the plan is written? While it is being built? When a pull request is ready for you to review? When it is merged? When it is live? When it is finished?" Any they do not have is left out → `tracker.stage_map`
- Set `stages.enabled: true`
- State: "You'll need compound-engineering installed for the fuller path stages."

**If they choose Linear (3):**
- Set `tracker.kind: linear`
- Ask the same plain-words question about their workflow states → `tracker.stage_map`
- Set `stages.enabled: true`
- State: "You'll need compound-engineering installed for the fuller path stages."

Never guess a column from a similar name. If they are unsure about one, leave that stage out: it is skipped and reported later, which is safe; a wrong column moves tickets to the wrong place.

### 3. Ask about publish platform

**Frame the options clearly:**

> Where does your site get published?
> 1. Lovable (hosted site builder)
> 2. SST Web (AWS deployment)
> 3. Supabase + Lovable (database + frontend)

**If they choose Lovable (1):**
- Set `publish.kind: lovable`
- Ask: "What is your Lovable project ID?" (leave blank if they don't have it yet)
- State: "When you merge a PR, you'll run the Lovable publish flow yourself. The plugin never triggers deploys."

**If they choose SST Web (2):**
- Set `publish.kind: sst-web`
- Ask: "What is your SST stage name?" (default: "production")
- Ask: "What is your AWS profile name?" (leave blank if they don't have it yet)
- State: "When you merge a PR, you'll run `sst deploy` yourself. The plugin never triggers deploys."

**If they choose Supabase + Lovable (3):**
- Set `publish.kind: supabase+lovable`
- Ask: "What is your Supabase project reference?" (leave blank if they don't have it yet)
- Ask: "What is your Lovable project ID?" (leave blank if they don't have it yet)
- State: "When you merge a PR, you'll run the publish flow yourself. The plugin never triggers deploys."

### 4. Confirm delivery rules

State the hard delivery rules that are always enforced:

> Site delivery follows these hard rules (you can override them in the config file later, but the defaults are safe):
>
> 1. **Human merge gate:** PRs are never auto-merged. You review and merge.
> 2. **Human publish gate:** Publish is never triggered by Claude. You run the locked publish path after merge.
> 3. **Confirm live:** After publish, you confirm the change is live.
> 4. **No experiments:** Claude refuses to invent features not in your brief.
>
> These are all set to `true` by default. Sound good?

If they want to change any, note it. Otherwise, use the defaults.

### 5. Write the config file

Using [`../_shared/config-schema.md`](../_shared/config-schema.md) as the reference and [`../_shared/config.example.yaml`](../_shared/config.example.yaml) as the template, write the `site-delivery` section of `.vf-founder-kit/config.yaml` with:

- The repository URL, main branch, and branch prefix
- The publish kind and platform-specific details
- Stages enabled or disabled, which is the path choice
- Delivery rules (defaults unless user changed them)
- `agent_delivery_integration.enabled: false` (stub for future)

For the fuller path, also write the top-level `tracker` key when it did not exist: `kind`, `board` (GitHub only) and `stage_map`. Never write a tracker block inside the `site-delivery` section.

**The file is shared by every Founder Kit plugin. Write only the `site-delivery` section**, plus the `tracker` key when it is new. Keep every other key and section — `docs_root`, other plugins' sections, an existing `tracker` key, comments — exactly as it was. If the file does not exist, create it (and the `.vf-founder-kit/` folder) with just what you are writing.

**Report every defaulted value explicitly:**

> I wrote the `site-delivery` section of `.vf-founder-kit/config.yaml` with:
> - Repository: `https://github.com/username/my-site` (detected)
> - Main branch: `main` (default)
> - Branch prefix: `feature/` (default)
> - Path: thin (no tracker calls)
> - Publish: `lovable` with project ID `[you'll add this]`
> - Stages: disabled (thin path)
> - Delivery rules: all safe defaults (human merge gate, human publish gate, confirm live, no experiments)

### 6. Explain next steps

**For thin path:**

> You're all set! To deliver a site change:
> 1. Give Claude a plain-language brief of what you want changed
> 2. Claude opens a PR against your repository
> 3. You review, merge, and run your publish flow
> 4. You confirm it's live
>
> Run `/site-delivery:fk-orchestrate <brief>` to start a delivery.

**For fuller path:**

> You're configured for the fuller path with tracker integration. To deliver:
> 1. Create a ticket in your tracker (GitHub Project or Linear)
> 2. Write the brief in the ticket body or comments
> 3. Run `/site-delivery:fk-orchestrate <ticket-id>`
> 4. Claude reads the ticket, works out the next stage from its plan or its column, runs it, and moves the ticket along as the work progresses
> 5. When a pull request is ready for you, the ticket moves to your review column
> 6. You review, merge, and run your publish flow
> 7. You confirm it's live
>
> Make sure you have compound-engineering installed for the stages to work.

## Reference files

| File | When to read |
|---|---|
| `../_shared/config-schema.md` | Always — whenever a key's meaning or default is in question |
| `../_shared/config.example.yaml` | Phase 5 — to see the complete structure of each path's config |

## Rules

1. **Never write a secret value anywhere.** Publish platform IDs and AWS profiles are configuration, not secrets. Actual credentials (API keys, tokens) never go in the config file and are never requested by this skill.
2. **Report defaults as defaults.** See phase 5. A value that was defaulted and a value that was detected look identical in the file but completely different when they turn out to be wrong.
3. **Thin path is the default.** Frame the fuller path as an opt-in choice for teams who already have a planning workflow and want richer stages.
4. **Stop and ask rather than guessing.** If a value is ambiguous (e.g. which GitHub Project board name), ask. Do not invent a plausible-sounding name.
5. **Re-running is safe.** Detect an existing config, report what would change, and ask before overwriting. Someone may have hand-edited it since the last onboard.
6. **No tracker means no compound-engineering stages.** When `tracker.kind` is `none` or there is no `tracker` key, `stages.enabled` must be `false`. The fuller path requires a tracker to read stage state from.
7. **Touch only your own section**, plus a new shared `tracker` key. `.vf-founder-kit/config.yaml` is shared. Never change another key or section, never rewrite an existing `tracker` key without the founder's say-so, and never delete an old config file or block without the founder's confirmation.

## Out of scope

- **No live GraphQL or API calls** to GitHub Projects or Linear during onboarding. The tracker configuration is written to the file; the fk-orchestrate skill reads it at runtime.
- **No cloud environment setup** (that's agent-delivery's job, not site-delivery's).
- **No auto-launching cloud agents** (future integration, not wired in v0.0.1).
- **No publish flow execution** (always human-run, never agent-triggered).
