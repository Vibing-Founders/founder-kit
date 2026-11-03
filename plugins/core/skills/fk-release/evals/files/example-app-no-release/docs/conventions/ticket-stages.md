# Ticket stages

Tickets live on the Delivery board. Move a ticket when its work reaches a stage, as the
Ticket stages rule in `CLAUDE.md` says. The stage map is recorded in the `tracker` key of
`.vf-founder-kit/config.yaml`.

| Stage | Column | Move it when | Who moves it |
|---|---|---|---|
| Planned | Planned | Its implementation plan is written | The agent that wrote it |
| In progress | In Progress | A branch or worktree is opened for it, or it is dispatched | The agent starting work |
| Human review | Human Review | Its pull request is open and ready for review (not draft) | The agent that opened it |
| For release | For Release | Its pull request is merged | Whoever merges |
| Released, measuring impact | Measure Impact | It is deployed to production | Whoever releases (`/core:fk-release`) |
| Done | Done | Its impact has been checked | The founder |

Columns not in this table are left alone. A stage not in this table is skipped: say so, and do
not pick a similar column.

## How to move a ticket

Moving a card needs the `project` scope on the GitHub CLI. Add it once with
`gh auth refresh -s project`.

1. Find the project: `gh project list --owner example-org --format json`. Take the `number`
   (PROJECT_NUMBER) and `id` (PROJECT_ID) of the project titled `Delivery`.
2. Find the field and the column:
   `gh project field-list PROJECT_NUMBER --owner example-org --format json`. Take the `id` of the
   field named `Status` (FIELD_ID), and the `id` of its option named as the column (OPTION_ID).
3. Find the ticket's card:
   `gh project item-list PROJECT_NUMBER --owner example-org --limit 1000 --format json`, and take
   the `id` (ITEM_ID) of the item whose content URL is the issue's URL.
4. Set the column:
   `gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id FIELD_ID --single-select-option-id OPTION_ID`

If the board, the field or the column does not exist, say which, and leave the ticket where it is.
