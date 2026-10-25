---
name: fk-setup
description: >
  Sets up a project with the Founder Kit baseline for working with Claude Code agents, or checks a
  project that is already set up against the current baseline and offers to fill the gaps. The
  baseline is a CLAUDE.md with standing rules (including the worktree rule and, for a project with
  a GitHub Projects board or Linear, the rule that keeps tickets in step with the work), a docs
  layout, the default plugins, ignore entries and a worktree setup script. Detects the project's stack rather
  than assuming one, shows a diff before changing any existing file, and is safe to re-run at any
  time. Also reports other Founder Kit plugins that are installed but not yet onboarded. Use this
  skill when someone starts a new project, or wants to know what their project setup is missing.
  Triggers on: "set up this new project", "set up this project for Founder Kit", "apply the project
  baseline", "/core:fk-setup", "check my project setup", "what is my project missing", "is my
  setup up to date", "what's new in the baseline", "add the worktree rule to this project", "map
  my board's columns", "keep my tickets in step with the work".
  NOT for configuring cloud dispatch or site delivery: those are the `fk-onboard` skills of the
  `agent-delivery` and `site-delivery` plugins, which this skill points to when they apply.
---

# fk-setup — give a project the Founder Kit baseline, and keep it current

There is one flow for a new project and for one set up a year ago: **audit, propose, apply what is
approved, record**. A new project is the case where everything is missing.

The baseline is defined in [`baseline.md`](./baseline.md), next to this file. Read it in full
every time. It is the single source of the rule text, the file list and the version, and it
changes between releases of this plugin. Do not work from memory of an earlier run.

## Ground rules

- **Add only what the baseline lists.** No extra rules, sections, scripts, hooks or config. If
  something looks missing from the baseline itself, say so at the end under "Suggestions" and let
  the founder decide; do not add it.
- **Never overwrite.** A file that already exists is changed only after the founder has seen the
  exact difference and agreed. This applies most of all to `CLAUDE.md` and
  `.claude/settings.json`. Add to what is there; do not reorder or reword the founder's own text.
- **Never read out, copy, move or create an env file.** Name env files; do not open them. The
  setup script links them, and only inside a worktree.
- **Detect or ask. Do not assume a stack.** No package manager, framework or backend is the
  default.
- **Say what was detected and what was defaulted.** A wrong default and a wrong detection look the
  same in the output and are fixed in different places.

---

## Step 1: Read the baseline and the project's record

1. Read `baseline.md`. Note the baseline version.
2. Read the `core` section of `.vf-founder-kit/config.yaml` if the file exists. It holds the
   values from the last run, the baseline version the project was checked against, and any items
   the founder declined. Values recorded there are the founder's answers: reuse them, and do not
   ask again unless the project has visibly changed (a recorded command no longer exists).
   Read the top-level `tracker` key as well: it holds the ticket stage map (B9). When it is
   missing but an old `agent-delivery.tracker` section exists, read that instead, as B9 describes,
   and note that it will be offered for migration.
3. If the directory is not a git repository, say so and offer to run `git init`. The worktree
   items need git; the rest do not.

## Step 2: Detect the project's values

Read the project before asking anything. For each value, record the evidence.

| Value | Where to look |
|---|---|
| Project name and description | An existing `CLAUDE.md` or `README`, the manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `composer.json`, …), then the directory name |
| Install, dev, lint, type check, build, test commands | The CI workflow first: what CI runs is the answer, flags included. Then manifest scripts, a `Makefile` or `justfile`, then the lockfile to pick the package manager. If CI and the lockfile disagree, CI wins, and say that they disagreed |
| Start-local-services command | A compose file, a `supabase/` directory, a `Procfile`, manifest scripts named for a database or services |
| Database, and its migration tool | A migrations directory, an ORM or database client in the dependencies, a `supabase/` or `prisma/` directory |
| Where tests live | Existing test files or the test runner's config. On a project with none, the stack's usual directory, reported as defaulted |
| Env files | Names only: `.env*` files present (tracked or not), env patterns in `.gitignore`, env files the code or scripts load. Check nested app directories in a monorepo |
| Main branch | `git symbolic-ref --short HEAD`, or the remote's default branch |
| Naming conventions | Existing source files, when there are enough to show a pattern |
| Directory structure | The tree, two levels deep, leaving out dependencies and build output |

### The tracker and its stage map

Skip this when the top-level `tracker` key is already recorded, unless Step 4 finds it out of date.

- **GitHub.** When the repository's remote is on GitHub, list the boards:
  `gh project list --owner <owner> --format json`. If exactly one is listed, propose it;
  otherwise ask which one. Then read its fields:
  `gh project field-list <number> --owner <owner> --format json`, and take the single-select field
  named `Status`, or ask which field when there is none or several.
- **Linear.** When ticket identifiers shaped `ABC-123` appear in branch names or commit messages,
  or a Linear connector is present, list the team's workflow states through the connector.
- **Both, or neither.** Ask. "We don't use a tracker" is a normal answer: record `kind: none`,
  and B3.7 and B9 are Not applicable.

If `gh` fails with a permissions error, the login is probably missing the `project` scope. Say
so, and give the command, `gh auth refresh -s project`, rather than carrying on as though there
were no board.

Propose a stage map by matching the board's column names to the stages in B9: ignore case and
spacing, and accept obvious synonyms ("In review" or "Review" → `human_review`, "Doing" →
`in_progress`, "Measure impact" or "Released" → `released_measure_impact`, "Ready to release" or
"Merged" → `for_release`). Show the proposal as a table of stage and column, with every column
that matched nothing and every stage with no column listed as unmapped. Do not guess a match
that is not obvious: an unmapped stage is skipped and reported later, which is safe; a wrong one
moves tickets to the wrong place.

Then ask the founder, **in one message**, only for what could not be detected and what only they
can know:

- the commands above that the project does not reveal (on an empty project, usually all of them;
  "not decided yet" is an acceptable answer, and that item is then written as not set up yet);
- how releasing works: what deploys on merge, what does not, and the manual steps in order;
- naming conventions, when there is no code to read them from;
- the board and field, when there was not exactly one, and whether the proposed stage map is
  right (they confirm or correct it; the unmapped items are shown so they can fill them);
- the plugin choice in Step 3.

## Step 3: Ask about plugins

The baseline enables `compound-engineering` for planning and delivery workflow, and two
[pm-skills](https://github.com/phuryn/pm-skills) plugins for product discovery and go-to-market.
Unless the project's record already holds a choice, ask once, in the same message as Step 2:

> The baseline uses compound-engineering for planning and worktrees, and pm-skills
> (pm-product-discovery, pm-go-to-market) for product work. Use those, or do you have alternatives
> you prefer for either?

No alternative given means the default. For an alternative, follow B4 in `baseline.md`: ask for
its marketplace and plugin name if it should be enabled in settings, and for the name of its
worktree skill if it has one.

## Step 4: Audit

Check every baseline item against the project and give the founder one table. Use exactly these
statuses:

| Status | Meaning |
|---|---|
| Present | There, and matches the baseline |
| Missing | Not there |
| Different | There, but not as the baseline has it. Say how in a few words |
| Not applicable | Does not apply to this project (no database, no env files). Say why |
| Declined | The founder said no on an earlier run. Listed, not proposed again |

Audit to the level a founder would act on: each `CLAUDE.md` section, each Key Rule, each docs
path, each plugin, each ignore entry, the script, the `local-dev.md` section. For the worktree
rule, check the parts as well as its presence: the doc-only sentence, the reference to
`local-dev.md`, and commands that match the project's current ones. A script that differs from
`assets/worktree-setup.sh` is Different.

For B3.7 and B9, also check them against the board. Read the board's columns (or the team's
workflow states) again: a mapped column that has been renamed or deleted makes B9 and the map
Different, naming the column. The rule's column names must match `stage_map` line for line, and
`ticket-stages.md` must have the same table; a mismatch is Different. When the tracker is still in
the old `agent-delivery.tracker` location, report it as Different and say migration is offered.

When the project's recorded baseline version is lower than the current one, start with a line
saying what is new, taken from the change log in `baseline.md`: "New since your last check
(baseline 1 → 2): …". From 1 to 2, that is the Ticket stages rule (B3.7) and
`docs/conventions/ticket-stages.md` (B9).

If everything is Present, Not applicable or Declined, say the project is up to date, update the
recorded version, and go to Step 7.

## Step 5: Propose

List what you would do for each Missing and Different item, grouped as:

1. **New files** — the path and one line on what goes in it.
2. **Changes to existing files** — the exact difference for each, as a diff. For `CLAUDE.md`, add
   missing sections in the baseline's order relative to the sections that exist, and add missing
   rules to the end of Key Rules; leave everything else untouched. For `.claude/settings.json`
   and `.gitignore`, add entries and remove nothing.
3. **Different items** — show the project's version beside the baseline's and ask which to keep.
   The founder's wording winning is a normal outcome, not a failure; record the item as declined.

Then ask what to apply: everything, or a subset. Wait for the answer. Record anything they turn
down in `declined`.

## Step 6: Apply

Apply only what was approved, in this order: `.gitignore`, docs layout, the worktree script,
`docs/conventions/local-dev.md`, the shared `tracker` key, `docs/conventions/ticket-stages.md`,
`CLAUDE.md`, `.claude/settings.json`. The tracker key and `ticket-stages.md` come before
`CLAUDE.md` so the rule never points at a file or a map that is not there yet.

- Write the `tracker` key of `.vf-founder-kit/config.yaml` and nothing else in that step. Keep
  every other key and section as it was, and create the file if it does not exist.
- **Migrating the old location.** When the tracker was found in `agent-delivery.tracker`, copy
  its values into the top-level key unchanged (B9 says which is which), show the founder what was
  written, and offer to remove the old `kind` and `review_marker` keys. Remove them only after the
  founder confirms; until then the top-level key wins and the old keys are ignored.

- Copy `assets/worktree-setup.sh` to `scripts/worktree-setup.sh` byte for byte and make it
  executable. Do not adapt it to the project; the env file names are arguments.
- Fill every placeholder with a detected or given value. Never leave `<angle brackets>` in a
  written file. Where a value is not decided yet, use the "not set up yet" wording from
  `baseline.md`.
- Do not commit unless the founder asks. Tell them what changed, and that the script and
  `local-dev.md` reach a new worktree only once they are committed.

Then write the `core` section of `.vf-founder-kit/config.yaml` as B8 describes, with the current
baseline version.

## Step 7: Check the rest of Founder Kit

`fk-setup` sets up the project as a whole; other plugins have their own setup. For each
Founder Kit plugin that is enabled for this project (`claude plugin list --json`, or
`enabledPlugins` in `.claude/settings.json`) and needs per-project setup, check whether its section exists in
`.vf-founder-kit/config.yaml`:

| Plugin | Needs | If its section is missing |
|---|---|---|
| `agent-delivery` | An `agent-delivery` section | "Run `/agent-delivery:fk-onboard` to set up cloud dispatch" |
| `site-delivery` | A `site-delivery` section | "Run `/site-delivery:fk-onboard` to set up site delivery" |

Report these; do not run them. Plugins that are not installed are not gaps: mention the other
Founder Kit plugins in one line at most, and only on a first run.

## Step 8: Report

End with:

- **Done** — what was created and changed.
- **Detected and defaulted** — which values came from the project, which from the founder, and
  which were defaulted.
- **Still open** — items written as "not set up yet", declined items, stages with no column
  ("no column mapped for `for_release`; tickets will be left where they are at that stage"),
  board columns that are not in the map, and anything from Step 7.
- **Try it** — when the worktree items were applied: commit the changes first, then the command
  sequence from `local-dev.md` to run in a new worktree.
- **Plugins to install** — the `claude plugin install … --scope project` command for each enabled
  plugin that `claude plugin list --json` shows as not installed (B4), and a note that plugins do
  not carry into cloud sessions.
- **Suggestions** — anything you think the baseline lacks for this project, kept separate and
  not applied. For a GitHub board, mention that its built-in workflows (the board's Workflows
  settings) can move items automatically when a pull request is merged or an issue is closed. They
  are a backstop for the moves the rule asks for, not a replacement.
