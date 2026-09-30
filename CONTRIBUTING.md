# Contributing a Plugin

This document explains how to add a new plugin to the founder-kit marketplace.

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
`.founder-kit/config.yaml`, a file shared by every Founder Kit plugin:

```yaml
docs_root: docs            # all Founder Kit plugins: <docs_root>/<plugin-name>
<plugin-name>:
  root: docs/some/folder   # optional: this plugin only
```

Resolve the folder in this order: a location the founder gives in the request, then
`<plugin-name>.root`, then `<docs_root>/<plugin-name>`, then `docs/<plugin-name>`. Paths are
relative to the project root. Only write the config file when the founder asks for a lasting
change, and keep its other keys. Plugins read it themselves rather than using Claude Code's
`userConfig`, because that is per user (not per project) and Claude Code only. See
`plugins/customer-research/skills/_shared/docs-location.md` for a worked example.

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
- [ ] Plugin added to README.md plugins table
- [ ] Plugin details section added to README.md
- [ ] All legislation files cite official sources
- [ ] No personally identifiable information in any committed file
- [ ] Eval prompts (if any) committed to `evals/evals.json`; workspace/run output left untracked
- [ ] Latest `evals/benchmark.{json,md}` copied in if an eval iteration was run for this change
- [ ] `npm test` passes, and any shipped executable asset has tests covering its guards
