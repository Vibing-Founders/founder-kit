---
name: orchestrate
description: >
  Orchestrate a site delivery from brief to pull request: read the config, resolve the stage,
  execute the thin brief-to-PR path or the fuller compound-engineering stages (when configured),
  open a PR, and report the human gates (merge, publish, confirm live). Use this skill when
  someone wants to deliver a site change. Triggers on: "orchestrate this site change",
  "deliver this brief", "/site-delivery:orchestrate", "run site delivery for this ticket",
  "open a PR for this change", "take this brief and make a PR".
---

# orchestrate — run a site delivery from brief to PR

One skill, two paths: thin (brief-to-PR with no tracker) or fuller (tracker + compound-engineering stages). The path is determined by `.site-delivery/config.yaml`, not by guessing.

## Procedure

### 1. Read the config

Read `.site-delivery/config.yaml`. If it is missing, **refuse and point to the `onboard` skill** rather than improvising defaults:

> This repository is not configured for site delivery. Run `/site-delivery:onboard` first to create `.site-delivery/config.yaml`.

Validate `schema_version`. If it is not `1`, warn and continue — but name both the version found and the version supported so a later key-level error is diagnosable.

Report every config value you fall back to a default for. Silent defaulting is a bug.

### 2. Read the brief

**Thin path (`tracker.kind: none`):**
- The brief comes from the user's message or argument
- Ask if the brief is incomplete: "What should this site change do?"
- The brief is plain language: "Add a testimonials section to the homepage" or "Update the pricing page to show the new starter plan"

**Fuller path (`tracker.kind: github-project` or `linear`):**
- The brief is a ticket ID (e.g. `SITE-123` or a GitHub issue number)
- Read the ticket through the tracker adapter (see `Tracker adapters` below)
- The brief is the ticket's title, body, and **all comments** — comments can carry instructions the body does not

### 3. Resolve the stage

**Thin path (`tracker.kind: none`):**
- There is only one stage: brief-to-PR
- Skip stage resolution entirely
- Report: "Running thin path: brief to PR with no tracker integration."

**Fuller path (`stages.enabled: true`):**
- Read the ticket's current stage from the tracker (via the adapter's read operation)
- Map the tracker's state to a stage using `stages.map` or `tracker.stage_map` (config files show both patterns; use whichever is present)
- The stage is one of: `brainstorm`, `plan`, `work`, `review`
- If the stage is in `stages.interactive` (default: `[brainstorm]`), **refuse it:**

  > This ticket is in the `brainstorm` stage, which needs question-and-answer with a human. Site delivery cannot run interactive stages through PRs alone. Move it to `plan` or `work` and try again.

- Report which stage was resolved and from which tracker state

### 4. Execute the stage

**Thin path:**

1. Create a feature branch: `{repo.branch_prefix}{brief-slug}` (e.g. `feature/add-testimonials-section`)
2. Take the brief and make the site changes on that branch
3. Commit with a clear message: `feat: {brief summary}`
4. Push the branch to `{repo.url}`
5. Skip to phase 5 (open PR)

**Fuller path (when a stage skill is configured):**

1. Look up the skill for this stage in `stages.skills` (e.g. `brainstorm: compound-engineering:ce-brainstorm`)
2. If the skill is not found or cannot be invoked, **fall back to the thin path** and report the fallback:

   > The config names `{skill-name}` for this stage, but I cannot invoke it. Falling back to the thin brief-to-PR path.

3. If the skill is available, invoke it with the brief and the repository context
4. The stage skill (from compound-engineering) produces a planning artifact or implementation
5. Commit the stage's output with a message naming the stage: `{stage}: {brief summary}`
6. Push the branch

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

When `tracker.kind` is not `none`:
1. Post a comment on the ticket with the PR link and a note: "PR opened: {pr-url}. Ready for review."
2. If the stage is `review`, set the tracker state to the review marker (via `tracker.stage_map` or equivalent)

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
> {- Tracker updated: {ticket-id} moved to {state} (fuller path only)}

Never imply the delivery is complete when the human gates remain. Merge ≠ production. Human runs the locked publish path.

---

## Tracker adapters

When `tracker.kind` is `github-project` or `linear`, interact with the tracker through these operations:

| Operation | What it does |
|---|---|
| **read_brief** | Return the ticket's title, body, and all comments |
| **read_stage** | Return the current stage based on `tracker.stage_map` |
| **set_stage** | Move the ticket to the named stage |
| **post_comment** | Add a comment with the PR link |

**Missing-target behaviour:**

If the configured project, field, state, or option does not exist, **refuse and report it clearly:**

> The config names a GitHub Project called "Widget Co Site Delivery", but I cannot find it. Check the project name in `.site-delivery/config.yaml` and run onboard again if it is wrong.

Never guess a substitute. A ticket parked in the wrong column is worse than a ticket left alone with a clear error message.

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
7. **Thin path is valid.** Do not treat `tracker.kind: none` as incomplete. It is the designed default for non-coders who want brief-to-PR without tracker overhead.
8. **Report defaults.** If a config value falls back to a default, say so. Silent defaulting is a bug.

---

## Out of scope

- **No live GraphQL or Linear API calls** during orchestration that the config does not explicitly enable (thin path makes zero tracker calls)
- **No auto CloudAgent launch** (future integration, not wired in v0.0.1)
- **No publish flow execution** (always human-run, never agent-triggered)
- **No "confirm live" verification** (human checklist item, not agent-verifiable)
- **No merging** (human gate always)
