# Founder Kit project baseline

**Baseline version: 2**

What a project has once `fk-setup` has run on it. Each item has an id so an audit can report on it
and a founder can decline it. `<angle brackets>` are per-project values: detect them or ask, never
assume. Items marked *(database)* apply only when the project has a database.

Two terms used throughout:

- **Env files** are the project's local env files that are kept out of git, or will be once B5 has
  been applied. An untracked `.env` in a project with no `.gitignore` yet counts.
- **Not set up yet.** Where a per-project value is not decided, write "Not set up yet." in its
  place, followed by what to update when it is. Never guess a value and never leave a placeholder.

When this file changes, raise the version and add a line to the change log at the bottom, saying
which ids were added or changed. That log is how a re-run tells a founder what is new.

---

## B1. `CLAUDE.md` skeleton

Sections, in this order:

1. `# <project name>` and a one- or two-line description
2. `## Development Commands` — install, dev server, lint, type check, build, test. List only the
   commands the project has; do not invent a lint or type-check command for a stack without one.
   If none are decided, the section says "Not set up yet."
3. `## Where to Find Things` — a table mapping topics to the docs in B2
4. `## Directory Structure` — a short annotated tree, leaving out hidden directories,
   dependencies and build output. On a project with no code yet, show what exists (the docs
   layout, `scripts/`) and nothing speculative
5. `## Key Rules` — the rules in B3
6. `## Testing` — the test command and the directory tests live in
7. `## Updating This File` — exactly:
   "When directory structure changes (files moved, renamed, or reorganized), update the Directory
   Structure section above."

## B2. Docs layout

Create each of these as a stub: a title and one line saying what belongs there. A directory gets a
`README.md` stub, because git does not track an empty directory. List every one in the Where to
Find Things table, and give `docs/conventions/ticket-stages.md` its own row ("Moving a ticket on
the board") when B9 applies. `docs/` here means the project's `docs_root` from `.vf-founder-kit/config.yaml`
when that is set.

| Path | What belongs there |
|---|---|
| `docs/ARCHITECTURE.md` | Structure, dependency rules, data flow |
| `docs/DEPLOYMENT.md` | How releasing works |
| `docs/TESTING_GUIDELINES.md` | How tests are written and run |
| `docs/decisions/` | Architecture decision records |
| `docs/solutions/` | Past problems and their fixes |
| `docs/plans/` | Requirements, brainstorms and implementation plans, active and completed |
| `docs/features/` | Feature specs |
| `docs/research/` | Research |
| `docs/conventions/` | Coding conventions, including `local-dev.md` (B7) and `ticket-stages.md` (B9) |
| `docs/scratchpads/` | Working notes |
| `docs/changelogs/CHANGELOG.md` | Changelog |
| `CONCEPTS.md` (project root) | Shared domain vocabulary |

## B3. Key Rules

Written into the Key Rules section of `CLAUDE.md`, in this order, as a bulleted list: one bullet
per rule, starting with the rule's name in bold. The rule text is quoted below; the quote marker
is not part of it.

### B3.1 Worktrees — must be present

> **Worktrees**: Branch work gets its own worktree. When work needs a branch, create the worktree
> with it (`EnterWorktree`, or the `<worktree skill>` skill) and do the whole change there — not
> only when someone asks. Never check a feature branch out in the main checkout. A fresh worktree
> needs `<install command> && <worktree setup command>`, then `<start local services command>`
> before tests (see "First time in a worktree" in `docs/conventions/local-dev.md`). Setup symlinks
> `<env files>` from the main checkout — do not hand-copy them: a real file shadows the link and
> silently stops tracking the original. Doc-only commits (a plan, a changelog entry, a doc fix)
> never open a branch or a worktree — they land wherever you already are.

Filling it in:

- `<worktree skill>` is `ce-worktree` with the default workflow plugin (B4). With an alternative,
  use the worktree skill the founder names; if they have none, write "(`EnterWorktree`)" alone.
- `<worktree setup command>` is `sh scripts/worktree-setup.sh <env files>` (B6).
- `<env files>` is the list of env files, each in backticks. Write "hand-copy it" for one file and
  "hand-copy them" for several.
- When the project has no install step, drop it and the `&&`. When it has no local services to
  start, the sentence ends after the setup command: "A fresh worktree needs
  `<install command> && <worktree setup command>` (see …)."
- When the project has no env files, drop the sentence from "Setup symlinks" to "tracking the
  original", and the setup command with it.
- Keep the doc-only sentence in every case. Without it, agents open a branch and a worktree for a
  one-line doc fix.

Why it is prose and not a hook: Claude Code only creates a worktree when `CLAUDE.md` or the person
asks for one, so without this rule agents do branch work in the main checkout. Do not add a hook
to enforce it.

Do not assign a dev-server port per worktree. If the port has to be on an auth provider's redirect
allowlist, a derived port silently breaks sign-in. Leave the port as the project has it.

### B3.2 General

> **General**: Don't remove existing features when adding new ones. Fix errors only — don't change
> unrelated code. Reuse existing components before creating duplicates.

### B3.3 Releasing

> **Releasing**: <what deploys on merge, what does not, and the manual steps in order>

Ask the founder. If releasing is not decided yet, write "Not set up yet. Update this rule and
`docs/DEPLOYMENT.md` when it is." rather than guessing.

### B3.4 Database migrations *(database)*

> **Database migrations**: Always create migrations with `<migration tool command>` — never
> hand-rolled filenames or timestamps. Never push a migration to production ahead of its merge to
> `<main branch>`.

### B3.5 Testing *(database)*

> **Testing**: No mocking of the project's own database — use a real one for service tests. Mock
> external services.

### B3.6 Naming

> **Naming**: <file and string conventions>

That is: how files are named, and how strings such as identifiers and keys are written. Detect from existing files where there are enough to show a pattern; otherwise ask. On an empty
project with no preference given, write the stack's usual convention and say it was defaulted.

### B3.7 Ticket stages *(tracker)*

Applies when `tracker.kind` in `.vf-founder-kit/config.yaml` is `github` or `linear`. Not
applicable when it is `none`.

> **Ticket stages**: Keep each ticket's <column or state> on <board or "Linear"> in step with the
> work, without being asked. Move it when:
> - <column for brainstormed> — a requirements or brainstorm doc for it is written. The agent
>   that wrote it moves it.
> - <column for planned> — its implementation plan is written. The agent that wrote it moves it.
> - <column for in_progress> — a branch or worktree is opened for it, or it is dispatched. The
>   agent starting work moves it.
> - <column for human_review> — its pull request is open and ready for review (not draft). The
>   agent that opened it moves it.
> - <column for for_release> — its pull request is merged. Whoever merges moves it.
> - <column for released_measure_impact> — it is deployed to production. Whoever releases moves
>   it.
> - <column for done> — its impact has been checked. The founder moves it.
>
> Plans, branch names and pull requests name their ticket, so the next session can find it. Link
> a pull request to its issue with `Refs #` and the number, not `Closes #`: GitHub closes the issue
> at merge, before it is released. When starting work on a ticket whose <column or state> is behind the work, bring it
> up to date and say so. Never move a ticket backwards without saying why. A stage with no
> <column or state> is skipped and said so; never pick a similar one. How to move a ticket:
> `docs/conventions/ticket-stages.md`.

Filling it in:

- Each `<column for …>` is that stage's value in `tracker.stage_map`, in backticks, exactly as
  the board spells it. Write a line only for a mapped stage; leave the others out entirely.
- `<column or state>` is "column" for GitHub and "workflow state" for Linear. `<board>` is the
  board's name from `tracker.board.project`.
- Keep the `Refs #` sentence only on GitHub, and only when the map has a stage after
  `for_release`. Otherwise merging is the last move and `Closes #` does no harm.

Why it is a rule and not left to the plugins: most work happens in ordinary local sessions, where
no Founder Kit skill is running. Without the rule, a ticket is planned, built, reviewed and merged
while it sits in the column it started in. The list form, one line per stage, is deliberate: an
audit compares each line's column name against the map.

## B4. Plugins

In `.claude/settings.json`, register the marketplace and enable the plugin for each of these,
keeping every other key in the file as it was.

| Purpose | Default | Marketplace (GitHub) | Enable |
|---|---|---|---|
| Planning and delivery workflow, including the worktree skill | `compound-engineering` | `EveryInc/compound-engineering-plugin` | `compound-engineering@compound-engineering-plugin` |
| Product discovery (interview scripts and similar) | `pm-product-discovery` | `phuryn/pm-skills` | `pm-product-discovery@pm-skills` |
| Go-to-market (battlecards and similar) | `pm-go-to-market` | `phuryn/pm-skills` | `pm-go-to-market@pm-skills` |

Enabling a plugin in project settings does not install it. After writing the settings, run
`claude plugin list --json`. A plugin installed at any scope that applies to this project,
including user scope, counts as installed. For each enabled plugin that is not installed, give the founder
the command to run: `claude plugin install <plugin>@<marketplace> --scope project`. Do not run
installs for them unasked.

Plugins declared in a repository's settings do not carry into Claude Code cloud sessions. Nothing
else in the baseline depends on them there: the rules, docs and script are files in the
repository, and the worktree rule names `EnterWorktree` before any plugin's skill.

The founder may use something else for either purpose. Ask once. If they give no alternative, use
the default. If they name one, enable it when they can give its marketplace and plugin name, and
otherwise leave installing it to them and say so. Record the choice (B8) so a re-run does not
offer the default again.

```json
{
  "extraKnownMarketplaces": {
    "compound-engineering-plugin": {
      "source": { "source": "github", "repo": "EveryInc/compound-engineering-plugin" }
    },
    "pm-skills": {
      "source": { "source": "github", "repo": "phuryn/pm-skills" }
    }
  },
  "enabledPlugins": {
    "compound-engineering@compound-engineering-plugin": true,
    "pm-product-discovery@pm-skills": true,
    "pm-go-to-market@pm-skills": true
  }
}
```

## B5. Ignore entries

In the project's tracked `.gitignore`:

```
.claude/worktrees/
.claude/settings.local.json
.claude/*.patch
<env file patterns, for example .env*>
```

- `.claude/worktrees/` must be there, or every worktree shows up as untracked content in the main
  checkout.
- A pattern such as `.env*` also ignores a committed example file. When the project has one (or
  the founder wants one), add an exception such as `!.env.example`.
- If an env file is already tracked by git, do not untrack it. Tell the founder: it may hold
  secrets that are now in the history.

## B6. Worktree setup script

Copy `assets/worktree-setup.sh` to `scripts/worktree-setup.sh`, unchanged, and make it executable.
It links the named env files from the main checkout into a worktree. It does nothing in the main
checkout, leaves a real file or a link pointing elsewhere alone with a warning, and changes
nothing on a second run. It needs a POSIX shell: macOS, Linux, cloud sandboxes and WSL. In Git
Bash on Windows it refuses rather than copy.

Skip this item when the project has no env files.

## B7. `docs/conventions/local-dev.md`

Must contain this section, with the project's commands. When the file is new, give it the title
`# Local development` and this section only.

```markdown
## First time in a worktree

A new worktree has the tracked files and nothing else: no installed dependencies and no env files.

1. `<install command>`
2. `sh scripts/worktree-setup.sh <env files>` — links the env files from the main checkout
3. `<start local services command>`
4. `<test command>` — confirms the worktree works

Env files are links to the main checkout's copies. Do not replace a link with a real file: it
shadows the link and silently stops tracking the original. If the setup script cannot run here,
make the link by hand from the worktree root:
`ln -s "$(dirname "$(cd "$(git rev-parse --git-common-dir)" && pwd -P)")/<env file>" <env file>`
```

Leave out any step the project does not have.

## B8. Recorded setup

The `core` section of `.vf-founder-kit/config.yaml`, a tracked file. Write only this section; keep
every other key and section as it was; create the file if it does not exist. Under `commands`,
write only the keys the project has and leave the others out. Releasing and naming are recorded
in `CLAUDE.md`, not here. The ticket stage map is not recorded here either: it lives in the
shared top-level `tracker` key (B9), because `agent-delivery` and `site-delivery` read it too.

```yaml
core:
  baseline_version: 2            # the baseline this project was last checked against
  workflow_plugin: compound-engineering    # or the founder's alternative
  worktree_skill: ce-worktree    # omit when the alternative has none
  product_plugins: [pm-product-discovery, pm-go-to-market]   # or the founder's alternative
  has_database: false
  env_files: [.env]              # gitignored env files linked into worktrees; [] when none
  commands:                      # any of: install, start_services, dev, lint, typecheck, build,
    install: uv sync             #   test, migration
    test: uv run pytest
  declined: []                   # baseline ids the founder said no to, e.g. [B3.6]
```

## B9. `docs/conventions/ticket-stages.md` *(tracker)*

Applies when `tracker.kind` is `github` or `linear`. Not applicable when it is `none`.

The file is written into the project, so moving a ticket works in any session, with or without
Founder Kit installed, in the same way `local-dev.md` (B7) does. It holds the project's stage
table and the exact procedure for its tracker.

### The shared `tracker` key

`fk-setup` records the map as the top-level `tracker` key of `.vf-founder-kit/config.yaml`,
beside `docs_root`. Write only that key and keep everything else in the file as it was.

```yaml
tracker:
  kind: github                 # github | linear | none
  board:                       # github only
    project: Delivery          # project board name or number
    field: Status              # the board's single-select field
  stage_map:                   # canonical stage -> this project's column (github) or state (linear)
    brainstormed: Brainstormed
    planned: Planned
    in_progress: In Progress
    human_review: Human Review
    for_release: For Release
    released_measure_impact: Measure Impact
    done: Done
```

The stage keys are fixed, in this order, and mean the same in every project:

| Key | Meaning |
|---|---|
| `brainstormed` | Requirements or a brainstorm exist for the ticket |
| `planned` | An implementation plan exists |
| `in_progress` | Someone, or an agent, is building it |
| `human_review` | A pull request is open and ready for a human |
| `for_release` | Merged, waiting to go to production |
| `released_measure_impact` | In production; impact is being checked |
| `done` | Finished |

A stage the project does not use is left out of `stage_map`. Columns not in the map, such as
`Backlog` or `Todo`, are never touched. The key is called `stage_map`, not `stages`, because
`agent-delivery` already uses `stages` for something else.

**The old location.** Earlier versions of `agent-delivery` kept the tracker in its own section,
as `agent-delivery.tracker` with `kind` and `review_marker`. When there is no top-level
`tracker` but that exists, read it: `review_marker.project` and `review_marker.field` are the
board (github), and `review_marker.option` (github) or `review_marker.state` (linear) is the
`human_review` stage. No other stage is mapped. Migrating copies those values unchanged into the
top-level key, shows what was written, and removes the old keys only after the founder confirms.

### The file

Title `# Ticket stages`, then:

```markdown
Tickets live on <board, or "Linear">. Move a ticket when its work reaches a stage, as the
Ticket stages rule in `CLAUDE.md` says. The stage map is recorded in the `tracker` key of
`.vf-founder-kit/config.yaml`.

| Stage | <Column or State> | Move it when | Who moves it |
|---|---|---|---|
| Brainstormed | <column> | A requirements or brainstorm doc for it is written | The agent that wrote it |
| Planned | <column> | Its implementation plan is written | The agent that wrote it |
| In progress | <column> | A branch or worktree is opened for it, or it is dispatched | The agent starting work |
| Human review | <column> | Its pull request is open and ready for review (not draft) | The agent that opened it |
| For release | <column> | Its pull request is merged | Whoever merges |
| Released, measuring impact | <column> | It is deployed to production | Whoever releases |
| Done | <column> | Its impact has been checked | The founder |

Columns not in this table are left alone. A stage not in this table is skipped: say so, and do
not pick a similar column.

## How to move a ticket

<the procedure for this tracker, below>

If the board, the field or the column does not exist, say which, and leave the ticket where it
is. Never move it to a similarly named column instead: a ticket in the wrong column is worse than
one left alone with a clear message.
```

Write a table row only for a mapped stage.

**The procedure for GitHub**, with the owner, project and field filled in:

```markdown
Moving a card needs the `project` scope on the GitHub CLI. It is not in the default login, and
without it the commands fail with a permissions error that does not mention the scope. Add it
once with `gh auth refresh -s project`.

Words in capitals are looked up each time.

1. Find the project: `gh project list --owner <owner> --format json`. Take the `number`
   (PROJECT_NUMBER) and `id` (PROJECT_ID) of the project titled `<project>`.
2. Find the field and the column:
   `gh project field-list PROJECT_NUMBER --owner <owner> --format json`. Take the `id` of the
   field named `<field>` (FIELD_ID), and the `id` of its option named as the column in the table
   above (OPTION_ID).
3. Find the ticket's card:
   `gh project item-list PROJECT_NUMBER --owner <owner> --limit 1000 --format json`, and take
   the `id` (ITEM_ID) of the item whose content URL is the issue's URL (ISSUE_URL). Without
   `--limit` the list stops at 30 items, and a card further down looks missing. If the issue is not on
   the board, add it with `gh project item-add PROJECT_NUMBER --owner <owner> --url ISSUE_URL`,
   which returns the ITEM_ID, and say that you added it.
4. Set the column:
   `gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id FIELD_ID --single-select-option-id OPTION_ID`
```

`<owner>`, `<project>` and `<field>` are filled in from the config and the repository's remote.
The words in capitals stay as written.

**The procedure for Linear:**

```markdown
Use the Linear connector. Set the issue's workflow state to the state named in the table above,
looking the state up by name within the issue's own team. Workflow states belong to a team, and
two teams can have states with the same name; setting another team's state moves the issue
nowhere visible. Match on the state's name, not its type.
```

---

## Change log

| Version | Change |
|---|---|
| 1 | First baseline: B1–B8 |
| 2 | Added B3.7 (Ticket stages rule) and B9 (`docs/conventions/ticket-stages.md`), both for projects with a tracker. Changed B2 (lists `ticket-stages.md`) and B8 (the stage map lives in the shared `tracker` key, and `baseline_version` is now 2) |
