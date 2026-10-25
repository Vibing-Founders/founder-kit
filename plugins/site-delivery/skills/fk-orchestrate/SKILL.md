---
name: fk-orchestrate
description: >
  Orchestrate a site delivery from brief to pull request: read the config, resolve the stage,
  execute the thin brief-to-PR path or the fuller compound-engineering stages (when configured),
  open a PR, and report the human gates (merge, publish, confirm live). Use this skill when
  someone wants to deliver a site change. Triggers on: "orchestrate this site change",
  "deliver this brief", "/site-delivery:fk-orchestrate", "run site delivery for this ticket",
  "open a PR for this change", "take this brief and make a PR".
---

# fk-orchestrate — run a site delivery from brief to PR

One skill, two paths: thin (brief-to-PR with no tracker) or fuller (tracker + compound-engineering stages). The path is determined by `stages.enabled` in the `site-delivery` section of `.vf-founder-kit/config.yaml`, not by guessing.

## Procedure

### 1. Read the config

Read the `site-delivery` section of `.vf-founder-kit/config.yaml` (other plugins' sections may sit in the same file; ignore them).

- **Section missing, old file present:** earlier versions kept this config in `.site-delivery/config.yaml`. Use that file, and say in your report that it is deprecated and that running `/site-delivery:fk-onboard` will migrate it.
- **Both present:** the section wins. Say in your report that the old `.site-delivery/config.yaml` is being ignored.
- **Neither present:** **refuse and point to the `fk-onboard` skill** rather than improvising defaults:

> This repository is not configured for site delivery. Run `/site-delivery:fk-onboard` first to add a `site-delivery` section to `.vf-founder-kit/config.yaml`.

**Read the tracker from the shared top-level `tracker` key** of the same file, not from the `site-delivery` section. It holds `kind` (`github`, `linear` or `none`; the old `github-project` is read as `github`), the board, and `stage_map`, which maps the kit's fixed stages to this project's columns. When it is missing but the old `site-delivery.tracker` exists, use that, and say in your report that the old location is deprecated and that `/site-delivery:fk-onboard` will migrate it. When neither exists, the tracker is `none`; report that as a default. See [`../_shared/config-schema.md`](../_shared/config-schema.md) for both shapes.

The thin path makes no tracker calls, even when a `tracker` key exists for other plugins. If `stages.enabled` is `true` but the tracker is `none`, stop and say the fuller path needs a tracker to read the ticket from; point at `/site-delivery:fk-onboard`.

Validate `schema_version`. If it is not `1`, warn and continue — but name both the version found and the version supported so a later key-level error is diagnosable.

Report every config value you fall back to a default for. Silent defaulting is a bug.

### 2. Read the brief

**Thin path (`stages.enabled: false`):**
- The brief comes from the user's message or argument
- Ask if the brief is incomplete: "What should this site change do?"
- The brief is plain language: "Add a testimonials section to the homepage" or "Update the pricing page to show the new starter plan"

**Fuller path (`stages.enabled: true`, with `tracker.kind` `github` or `linear`):**
- The brief is a ticket ID (e.g. `SITE-123` or a GitHub issue number)
- Read the ticket through the tracker adapter (see `Tracker adapters` below)
- The brief is the ticket's title, body, and **all comments** — comments can carry instructions the body does not

### 3. Resolve the stage

**Thin path (`stages.enabled: false`):**
- There is only one stage: brief-to-PR
- Skip stage resolution entirely
- Report: "Running thin path: brief to PR with no tracker integration."

**Fuller path (`stages.enabled: true`):**

Resolve the stage to run, which is one of `brainstorm`, `plan`, `work`, `review`, in this order:

1. An explicit `--stage` argument.
2. The ticket's planning artifact, when one matches `stages.artifact_glob`: its `stages.readiness_key` value, mapped through `stages.map` (for example `implementation-ready` → `work`).
3. The ticket's column. Read it through the adapter, find which canonical stage `tracker.stage_map` gives it, and run the next step:

   | Ticket's stage | Stage to run | Why |
   |---|---|---|
   | Not mapped (a `Backlog` or `Todo` column) | `brainstorm` | Nothing exists for it yet |
   | `brainstormed` | `plan` | Requirements exist; the plan is next |
   | `planned` | `work` | The plan exists; building is next |
   | `in_progress` | `work` | Building has started |
   | `human_review` | `review` | A pull request is waiting |
   | `for_release`, `released_measure_impact`, `done` | None — stop | The work is merged; say so and change nothing |

   On the old `site-delivery.tracker` location, the old `stage_map` (column → stage) gives the stage directly, as it always did.
- If the stage is in `stages.interactive` (default: `[brainstorm]`), **refuse it:**

  > This ticket is in the `brainstorm` stage, which needs question-and-answer with a human. Site delivery cannot run interactive stages through PRs alone. Move it to `plan` or `work` and try again.

- Report which stage was resolved, and from what: the argument, the artifact and its field, or the column and its canonical stage

### 4. Execute the stage

**Thin path:**

1. Create a feature branch: `{repo.branch_prefix}{brief-slug}` (e.g. `feature/add-testimonials-section`)
2. Take the brief and make the site changes on that branch
3. Commit with a clear message: `feat: {brief summary}`
4. Push the branch to `{repo.url}`
5. Skip to phase 5 (open PR)

**Fuller path (when a stage skill is configured):**

1. Look up the skill for this stage in `stages.skills` (e.g. `brainstorm: compound-engineering:ce-brainstorm`). When the stage is `work`, **set stage `in_progress`** on the ticket before starting
2. If the skill is not found or cannot be invoked, **fall back to the thin path** and report the fallback:

   > The config names `{skill-name}` for this stage, but I cannot invoke it. Falling back to the thin brief-to-PR path.

3. If the skill is available, invoke it with the brief and the repository context
4. The stage skill (from compound-engineering) produces a planning artifact or implementation
5. Commit the stage's output with a message naming the stage: `{stage}: {brief summary}`
6. Push the branch
7. Move the ticket to match what now exists: after `brainstorm`, **set stage `brainstormed`**; after `plan`, **set stage `planned`**. The `human_review` move comes with the pull request, in phase 5

**Experimental changes rule:**

If `delivery_rules.experimental_changes: false` (the default), **refuse any change not in the brief:**

> This brief asks for X. You want me to also add Y, which is not in the brief. The `experimental_changes` rule is off, so I cannot invent features. Add Y to the brief or turn on experimental changes in the config.

### 5. Open the pull request

Create a PR against `{repo.main_branch}` with:

**Title:**
- Thin path: the brief summary (e.g. "Add testimonials section to homepage")
- Fuller path: the ticket title (e.g. "SITE-123: Add testimonials section")

**Body:**

```markdown
## Brief

{brief-text}

## Stage

{thin-path OR stage-name}

## Changes

{summary-of-files-changed}

## Delivery gates (all required)

- [ ] **Human merge gate**: Review this PR and merge it yourself. I never auto-merge.
- [ ] **Human publish gate**: After merge, run your publish flow ({publish.kind}) yourself. I never trigger deploys.
- [ ] **Confirm live**: After publish, confirm the change is live on the site.

## Config

- Repository: `{repo.url}`
- Tracker: `{tracker.kind}`
- Publish: `{publish.kind}`
- Experimental changes: `{delivery_rules.experimental_changes}`
```

**Draft or ready:**
- If the stage is `review`, open as a regular PR (ready for review)
- Otherwise, open as a draft PR

**Tracker integration (fuller path only):**

1. Post a comment on the ticket with the PR link and a note: "PR opened: {pr-url}." Add "Ready for review." only when the PR is not a draft.
2. When the PR is ready (not draft), **set stage `human_review`**. A draft PR leaves the ticket where it is.

Name the ticket in the PR body with `Refs #<number>` (GitHub) or the Linear identifier, not `Closes #<number>`: GitHub closes the issue at merge, before the human has published.

### 6. Report the outcome

Report what was done and what the human must do next:

> **Pull request opened:** {pr-url}
>
> **Your next steps:**
> 1. Review the PR and merge it when ready
> 2. Run your publish flow for `{publish.kind}` (I never trigger deploys)
> 3. Confirm the change is live on the site
>
> **Config used:**
> - Path: {thin OR fuller with stage-name}
> - Tracker: {tracker.kind}
> - Publish: {publish.kind}
> - Experimental changes: {on OR off}
>
> **What I did:**
> - Branch: `{branch-name}`
> - Commits: {commit-count} commit(s)
> - Files changed: {file-count} file(s)
> - PR state: {draft OR ready}
> {- Tracker updated: {ticket-id} moved to {column} (fuller path only), and any stage skipped because no column is mapped for it}

Never imply the delivery is complete when the human gates remain. Merge ≠ production. Human runs the locked publish path.

---

## Tracker adapters

On the fuller path, with `tracker.kind` `github` or `linear`, interact with the tracker through these operations:

| Operation | What it does |
|---|---|
| **read_brief** | Return the ticket's title, body, and all comments |
| **read_stage** | Return the ticket's column (or workflow state) and the canonical stage `tracker.stage_map` gives it, or "not mapped" |
| **set_stage `<stage>`** | Look `<stage>` up in `tracker.stage_map` and move the ticket to that column or state |
| **post_comment** | Add a comment with the PR link |

When the project has `docs/conventions/ticket-stages.md` (written by `core`'s `fk-setup`), follow its procedure for moving a ticket. Otherwise:

- **GitHub:** `gh project list --owner <owner> --format json` to find the project named in `tracker.board.project`; `gh project field-list <number> --owner <owner> --format json` for the field in `tracker.board.field` and the option named by the column; `gh project item-list <number> --owner <owner> --limit 1000 --format json` for the issue's item (adding it with `gh project item-add` if it is not on the board, and saying so); then `gh project item-edit --id <item-id> --project-id <project-id> --field-id <field-id> --single-select-option-id <option-id>`. This needs the `project` scope on the `gh` login (`gh auth refresh -s project`); without it the error reads as a plain permissions failure.
- **Linear:** set the issue's workflow state by name, looking it up within the issue's own team.

**An unmapped stage** — `stage_map` has no entry for it — is skipped and reported: "no column mapped for `planned`; ticket left where it is". Never guess.

**Missing-target behaviour:**

If the mapped board, field, column or state does not exist, **report it clearly and leave the ticket unchanged:**

> The config names a GitHub Project called "Widget Co Site Delivery", but I cannot find it. Check `tracker.board.project` in `.vf-founder-kit/config.yaml` and run `/site-delivery:fk-onboard` again if it is wrong.

When the stage cannot be read at all for that reason, stop for that ticket. When only a move fails, carry on with the delivery and report the move that did not happen. Never guess a substitute. A ticket parked in the wrong column is worse than a ticket left alone with a clear error message.

---

## Hard delivery rules (enforced here)

From `delivery_rules`, these are always checked:

### 1. Human merge gate (`human_merge_gate: true`, default)

PRs are opened as draft or regular, **never merged by this skill**. The report always states:

> Review and merge the PR yourself. I never auto-merge.

### 2. Human publish gate (`human_publish_gate: true`, default)

Publish is **never triggered**. The report always states:

> After merge, run your publish flow for `{publish.kind}` yourself. I never trigger deploys.

No matter what the user asks ("deploy it now", "publish after merge"), refuse and restate the rule:

> The `human_publish_gate` rule is on. You run the publish flow yourself. I cannot trigger deploys.

### 3. Confirm live (`confirm_live: true`, default)

The report always states:

> After publish, confirm the change is live on the site.

This is a human checklist item, not something the skill can verify.

### 4. Experimental changes (`experimental_changes: false`, default)

When off, refuse any change not in the brief:

> This brief asks for X. You want me to also add Y, which is not in the brief. The `experimental_changes` rule is off, so I cannot invent features. Add Y to the brief or set `experimental_changes: true` in the config.

---

## Reference files

| File | When to read |
|---|---|
| `../_shared/config-schema.md` | Phases 1 and 2 — whenever a key's meaning or default is in question |
| `../_shared/config.example.yaml` | Phase 1 — to understand the structure of thin vs fuller path configs |

---

## Rules

1. **Never clone the site repo onto this machine.** All git operations go to `{repo.url}` via remote commands (push, open PR). The agent never clones the full site repository.
2. **Merge ≠ production.** Human runs the locked publish path. Never imply the change is live until the human confirms it.
3. **Never invent experiments.** When `experimental_changes: false`, stick to the brief. Refuse additions not in the brief.
4. **Never auto-merge.** When `human_merge_gate: true` (the default), PRs are opened, never merged by the agent.
5. **Never trigger publish.** When `human_publish_gate: true` (the default), the human runs the publish flow. The agent never calls Lovable APIs, `sst deploy`, or similar.
6. **Confirm live is a human step.** The agent cannot verify a site is live. The human confirms it after publish.
7. **Thin path is valid.** Do not treat `tracker.kind: none`, or a missing `tracker` key, as incomplete. It is the designed default for non-coders who want brief-to-PR without tracker overhead.
8. **Report defaults.** If a config value falls back to a default, say so. Silent defaulting is a bug.

---

## Out of scope

- **No live GraphQL or Linear API calls** during orchestration that the config does not explicitly enable (thin path makes zero tracker calls)
- **No auto CloudAgent launch** (future integration, not wired in v0.0.1)
- **No publish flow execution** (always human-run, never agent-triggered)
- **No "confirm live" verification** (human checklist item, not agent-verifiable)
- **No merging** (human gate always)
