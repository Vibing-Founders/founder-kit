# Contributing a Plugin

This document explains how to add a new plugin to the founder-kit marketplace.

## Where does a new thing go?

Pick the smallest unit that meets the goal. Work down this list and stop at the first that fits.

| If the addition is… | It is a… | It goes in… |
|---|---|---|
| A fact, rule, benchmark or reference an existing skill should know | Knowledge file | `skills/<skill>/knowledge/`, or `skills/_shared/` when more than one skill uses it |
| A law, act or regulation | Legislation file | See [plugins/compliance/LEGISLATION.md](./plugins/compliance/LEGISLATION.md) |
| Another output from the same inputs and knowledge an existing skill already uses | Mode of that skill | A sibling file such as `fk-online-safety/cra.md`, routed from that skill's `SKILL.md` |
| A different job for the same founder, in a problem area a plugin already covers | New skill | `plugins/<existing-plugin>/skills/fk-<name>/` |
| Something every founder needs whichever other plugins they use | Part of `core` | `plugins/core/`; a new baseline item goes in `skills/fk-setup/baseline.md` with a version bump |
| A problem area no plugin covers, which a founder could want without the others | New plugin | `plugins/<new-name>/` |
| Code that runs in the adopting repository | Executable asset | `skills/<skill>/assets/`, with tests in `plugins/<name>/tests/` |
| A change to how the kit itself is built or maintained | Convention or maintainer skill | This file, `CLAUDE.md`, or `.claude/skills/` |

A new skill earns its place when a founder would ask for it by name and it has its own trigger
phrases; if it would only ever run as a step inside another skill, make it a mode or a knowledge
file instead. A new plugin earns its place when it has a different audience or install decision
from the existing ones — two skills are not a reason on their own.

Suggestions for additions are filed with the "Suggestion for the kit" issue template and assessed
with the `triage-suggestion` maintainer skill (`.claude/skills/triage-suggestion/`), which produces
a proposal for review before anything is built.

## Plugin directory structure

Every plugin lives under `plugins/<plugin-name>/` and must contain:

```
plugins/
  <plugin-name>/
    .claude-plugin/
      plugin.json       # Required metadata
    skills/
      SKILL.md          # At least one skill
      ...               # Additional skills and knowledge files
```

## Required `plugin.json` fields

```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "One sentence describing what the plugin does and who it is for.",
  "author": {
    "name": "Your Name or Org",
    "url": "https://github.com/your-handle"
  },
  "homepage": "https://github.com/Vibing-Founders/founder-kit",
  "repository": "https://github.com/Vibing-Founders/founder-kit",
  "license": "MIT",
  "keywords": ["relevant", "keywords"],
  "skills": ["./skills/"]
}
```

All fields are required. `keywords` should be an array of lowercase strings.

## Versions

Claude Code decides whether a founder's installed plugin needs updating by comparing version
strings, not commits. **A change merged without a version bump reaches nobody who already has the
plugin**, and nothing reports it.

So, in any pull request that changes a plugin's shipped files (anything under `plugins/<name>/`
except its `tests/` and `evals/`):

1. Raise `version` in `plugins/<name>/.claude-plugin/plugin.json`.
2. Set the same version on the plugin's entry in `.claude-plugin/marketplace.json`.

| Raise | When |
|---|---|
| Patch (`0.1.0` → `0.1.1`) | A fix or a wording change; the skill does the same job better |
| Minor (`0.1.0` → `0.2.0`) | Something new a founder can use: a skill, a mode, a knowledge file, a baseline item |
| Major (`0.1.0` → `1.0.0`) | Something a founder has to act on: a renamed or removed skill, a changed config key or file location |

One bump per pull request is enough, however many commits it has. `npm test` enforces both steps:
it fails when the two files disagree, and when a plugin changed since `main` without its version
going up. The same tests run on every pull request.

If two open pull requests bump the same plugin, the second to merge has to rebase and bump again.

## Skill structure

Each skill is a `SKILL.md` file with YAML frontmatter followed by the skill body:

```markdown
---
name: my-skill
description: >
  Triggers when user asks about X, Y, or Z.
  Use this skill to help with ...
---

# My Skill

[Skill instructions here]
```

**Every skill name starts with `fk-`** (for Founder Kit), and the skill's directory matches its
name: `skills/fk-my-skill/SKILL.md` with `name: fk-my-skill`. In Claude Code a skill is already
namespaced by its plugin (`/my-plugin:fk-my-skill`), but that namespace is lost when a skill is
used in other agent tools, so the prefix is how founders can tell a Founder Kit skill apart.

**Skills that save files work under `docs/` by default.** A plugin keeps its files in
`docs/<plugin-name>/` from the project root, and lets founders override that in
`.vf-founder-kit/config.yaml`, a file shared by every Founder Kit plugin:

```yaml
docs_root: docs            # all Founder Kit plugins: <docs_root>/<plugin-name>
<plugin-name>:
  root: docs/some/folder   # optional: this plugin only
```

The exception is `core`'s `fk-setup`, whose job is the project's own layout: it writes `CLAUDE.md`,
the `docs/` tree, `scripts/` and `.claude/settings.json` directly, and honours `docs_root`.

Resolve the folder in this order: a location the founder gives in the request, then
`<plugin-name>.root`, then `<docs_root>/<plugin-name>`, then `docs/<plugin-name>`. Paths are
relative to the project root. Only write the config file when the founder asks for a lasting
change, and keep its other keys. Plugins read it themselves rather than using Claude Code's
`userConfig`, because that is per user (not per project) and Claude Code only. See
`plugins/customer-research/skills/_shared/docs-location.md` for a worked example.

**Plugin settings beyond the docs folder live in the same file**, in the plugin's own section
(`<plugin-name>:`), rather than in a config file of the plugin's own. A skill that writes the file
writes only its plugin's section, keeps every other key and section exactly as it was, and
creates the file if it does not exist. See `plugins/agent-delivery/skills/_shared/config-schema.md`
for a plugin that keeps its whole config there and migrates an older standalone file.

The `description` field is used by Claude to decide whether to invoke the skill — make it specific and include example trigger phrases.

## Adding knowledge files

Knowledge files live alongside or under the skill that uses them. For knowledge shared across multiple skills, place it under `skills/_shared/`.

```
skills/
  _shared/
    legislation/        # Acts and regulations used by multiple skills
    jurisdiction-map.md # Which rules apply where
  my-skill/
    SKILL.md
    knowledge/          # Knowledge specific to this skill
```

## Adding evals

If you use `/skill-creator` to build or iterate on a skill, keep the eval prompts — they let future iterations be benchmarked against past behavior instead of starting from scratch.

- **Eval prompts/assertions** go in `evals/evals.json` inside the skill's own directory (sibling to its `SKILL.md`):

  ```
  skills/
    my-skill/
      SKILL.md
      evals/
        evals.json
  ```

  For a subcommand that doesn't have its own directory (e.g. `cra` lives in `fk-online-safety/cra.md`), namespace the file instead: `fk-online-safety/evals/cra-evals.json`.

- **Run outputs** (`iteration-N/`, per-run outputs, transcripts, timing/grading data) go in `<skill-name>-workspace/` as a sibling of the skill directory, e.g. `skills/my-skill-workspace/`. This is matched by the top-level `.gitignore` (`*-workspace`) and should stay untracked — it's large, reproducible, and churns every run.
- **Latest benchmark summary**: once an iteration finishes, copy that iteration's `benchmark.json` and `benchmark.md` (produced by `skill-creator`'s `aggregate_benchmark.py`) from the workspace into the skill's own `evals/` folder, overwriting the previous snapshot:

  ```
  cp <workspace>/iteration-N/benchmark.{json,md} skills/my-skill/evals/
  ```

  This is small and tracked in git, so `git log` on `evals/benchmark.md` shows how pass rate, time, and token usage changed as the skill was iterated on — without committing the raw run output.

## Running tests

```
npm test
```

Zero dependencies — this runs `node --test`, Node's built-in runner, which strips TypeScript types
natively. There is no install step, no lockfile, and no `node_modules`. Requires Node >= 22.18,
where type stripping is enabled by default.

Tests live in `plugins/<name>/tests/*.test.ts`, not in `skills/**/assets/` — files under `assets/`
are copied verbatim into an adopting repository, and a test file has no business travelling with
them.

Not everything needs a test. Skill instructions and knowledge files are checked by evals. Write
unit tests for **executable assets a plugin ships**, particularly anything that refuses, guards, or
validates — a reader cannot confirm by inspection that a safety check actually rejects what it
claims to.

## Registering your plugin

After adding your plugin:

1. Add a row to the plugins table in [README.md](./README.md)
2. Add a "Plugin Details" section describing the skills and example usage

## PR checklist

- [ ] `plugins/<name>/.claude-plugin/plugin.json` exists with all required fields
- [ ] At least one `SKILL.md` with valid frontmatter (`name`, `description`)
- [ ] Every new skill name starts with `fk-` and matches its directory name
- [ ] Each changed plugin has a higher `version`, the same in its `plugin.json` and in `marketplace.json`
- [ ] Plugin added to README.md plugins table
- [ ] Plugin details section added to README.md
- [ ] All legislation files cite official sources
- [ ] No personally identifiable information in any committed file
- [ ] Eval prompts (if any) committed to `evals/evals.json`; workspace/run output left untracked
- [ ] Latest `evals/benchmark.{json,md}` copied in if an eval iteration was run for this change
- [ ] `npm test` passes, and any shipped executable asset has tests covering its guards
