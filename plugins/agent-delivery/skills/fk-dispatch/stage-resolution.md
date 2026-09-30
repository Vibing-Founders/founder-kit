# Stage resolution

The stage decides which skill the run invokes and what it must deliver. It is **read from the
planning artifact, not guessed** — and the resolution is stated before anything is fired.

## The rule

```
explicit --stage argument   →  use it, say it was explicit
else readiness value found  →  stages.map[value], say where it was read from
else stages.default_stage   →  use it, say it was the configured default
else                        →  stop and ask for an explicit --stage
```

Read `stages.artifact_glob` and `stages.readiness_key` from the `agent-delivery` section of
`.vf-founder-kit/config.yaml` (or the deprecated old file, per `SKILL.md`). With
`readiness_key` unset, skip straight to `default_stage` — a project with no planning workflow never
looks for an artifact.

## Finding the plan — look across branches, not just the checkout

**A plan on a feature branch is the normal case, not the exception.** Resolving against the current
checkout alone produces a false "no plan found", which silently downgrades the stage and invites a
run to re-decide something the plan already settled. That failure is expensive and it does not look
like a failure — it looks like a run that did more thinking than expected.

Sweep in this order and stop at the first hit:

1. **The current checkout** — `grep -rl <ticket-id> <artifact_glob>`.
2. **Other worktrees** — `git worktree list`, then the same search in each.
3. **Every branch, local and remote** — `git branch -a`, then
   `git log <default-branch>..<branch> --name-only` for files matching the glob, or
   `git grep -l <ticket-id> <branch> -- <artifact glob>`.

Only after all three come back empty is "no plan" a finding. Say which of the three you searched.

When more than one plan matches, do not pick by recency — report the candidates and ask.

## Reading the readiness value

Read `stages.readiness_key` from the artifact's metadata: YAML frontmatter for a Markdown plan,
the header block for an HTML one.

- **A value present in `stages.map`** → that stage.
- **A value absent from `stages.map`** → stop. Report the value and the mapped values that exist.
  Do not fall through to the default; an unmapped readiness value means the project's plans moved
  on and the config did not, and guessing a stage there is how a run gets pointed at the wrong work.
- **The key present but empty, or the artifact carrying a progress-like value** (`active`,
  `in_progress`, `completed`, `done`) → stop and ask. Those are not readiness values.

## Refusing a stage

A stage listed in `stages.interactive` is **refused, not dispatched**. Say which stage resolved,
that it is configured as interactive, and why: it needs question-and-answer with a human, and a
sandbox can only round-trip through ticket comments. A run that cannot finish should not start.

Refusal is a complete, successful outcome of this skill. Report it as one — not as an error, and
not with an offer to dispatch it anyway.

Also refuse, with the reason, when:

- The resolved stage has no entry in `stages.skills`.
- The artifact says the work is already finished.

## State the resolution before firing

One line, before anything is created:

> `ABC-123` is `implementation-ready` (read from `docs/plans/2026-08-14-abc-123-plan.md`,
> frontmatter `artifact_readiness`) → dispatching the **implement** stage, which invokes
> `compound-engineering:ce-work`.

The point is that a wrong inference is visible **before** it costs a run, and an explicit
`--stage` always overrides it.
