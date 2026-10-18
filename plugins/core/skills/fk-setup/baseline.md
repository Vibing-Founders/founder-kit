# Founder Kit project baseline

**Baseline version: 1**

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
Find Things table. `docs/` here means the project's `docs_root` from `.vf-founder-kit/config.yaml`
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
| `docs/conventions/` | Coding conventions, including `local-dev.md` (B7) |
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
in `CLAUDE.md`, not here.

```yaml
core:
  baseline_version: 1            # the baseline this project was last checked against
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

---

## Change log

| Version | Change |
|---|---|
| 1 | First baseline: B1–B8 |
