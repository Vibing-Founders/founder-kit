# Tracker adapter — GitHub Issues

Selected by `tracker.kind: github`. Implements the three-operation contract defined in
[`../config-schema.md`](../config-schema.md#the-tracker-contract). Nothing outside this file knows
that GitHub is involved.

Uses the `gh` CLI, which is available both locally and inside a sandbox.

## Configuration this adapter reads

The shared top-level `tracker` key of `.vf-founder-kit/config.yaml`:

```yaml
tracker:
  kind: github
  board:
    project: Delivery       # project board name, or its number
    field: Status           # the board's single-select field
  stage_map:                # canonical stage -> the option (column) on that field
    in_progress: In Progress
    human_review: Human Review
    # ...any other stages the project uses
```

**The old location.** When there is no top-level `tracker` but `agent-delivery.tracker` exists,
read `review_marker.project` and `review_marker.field` as the board, and `review_marker.option`
as the `human_review` column. No other stage is mapped. See
[`../config-schema.md`](../config-schema.md#the-old-location).

## Credential scope

Reading and commenting need ordinary repository access. **Setting a stage needs the `project`
scope**, which is not in the default `gh` login and fails with a permissions error rather
than an obviously-missing-scope one:

```
gh auth refresh -s project
```

A dispatched run needs the same scope on whatever credential it carries. `fk-onboard` records this as
a required entry in the environment block.

---

## Operation 1 — read the brief

Return the title, the body, **and every comment**. A comment can carry an instruction the body does
not; returning the body alone is an incomplete read.

```bash
gh issue view <number> --json number,title,body,labels,state,url,comments
```

`--json comments` returns the full comment list with authors and timestamps. Do not substitute
`gh issue view <number>` without `--json` — its human-readable output truncates.

**Defect detection**, which `close_out.defect_record` depends on: the issue carries a label the
project uses for defects (`bug` conventionally). Read it from `labels` in the same call.

## Operation 2 — set stage `<stage>`

On GitHub a stage is a **project-board column**: the item's single-select field set to the option
that `stage_map` names for `<stage>`. That is a board-item property, not an issue property, so the
issue stays open and its own state is untouched.

First look `<stage>` up in `tracker.stage_map`. **If it has no entry, stop**: report "no column
mapped for `<stage>`; ticket left where it is" and make no call.

Then four steps, and the middle two are the ones that fail:

1. **Resolve the project.** `gh project list --owner <owner> --format json` and match
   `board.project` against the title, or use it directly when it is a number. Record the
   project's `id` and `number`.
2. **Resolve the field and option.**
   ```bash
   gh project field-list <number> --owner <owner> --format json
   ```
   Find the field whose name matches `board.field`, then the option within it whose name matches
   the column from `stage_map`. Record both ids.
3. **Ensure the issue is an item on the board.**
   ```bash
   gh project item-list <number> --owner <owner> --limit 1000 --format json
   ```
   Without `--limit` the list stops at 30 items, and an issue further down looks missing.
   If the issue's URL is not among the items, add it and record the new item id:
   ```bash
   gh project item-add <number> --owner <owner> --url <issue-url>
   ```
   **Report both actions** — adding the item and setting the field — so the reader knows the issue
   was not previously tracked on that board.
4. **Set the field.**
   ```bash
   gh project item-edit --id <item-id> --project-id <project-id> \
     --field-id <field-id> --single-select-option-id <option-id>
   ```

**When the project, field, or option does not exist**, report which one and leave the ticket
unchanged. A mapped column that has been renamed on the board is a missing option. Do not fall back to a similarly-named board or column, and do not fall back to closing
the issue or applying a label — the configured target is the contract, and a ticket parked
somewhere unexpected is worse than one left alone with a clear message.

## Operation 3 — post a comment

```bash
gh issue comment <number> --body-file <path>
```

Use `--body-file` rather than `--body`. A manual-test checklist is multi-line Markdown, and passing
it as a shell argument mangles it.

---

## Adding a third tracker

Copy this file's shape: state the config block it reads, then the three operations, then the
missing-target behaviour. Register the new `kind` in `../config-schema.md`. No file under
`skills/fk-dispatch/` changes.
