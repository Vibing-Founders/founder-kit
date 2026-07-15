# founder-kit

A Claude Code plugin marketplace (`.claude-plugin/marketplace.json`). Each plugin under `plugins/<name>/` bundles skills for a specific problem area — currently just `compliance` (GDPR, UK Online Safety Act, OWASP, DPIA/LIA/CRA assessments for platform builders).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the required plugin/skill directory structure and PR checklist. See [plugins/compliance/LEGISLATION.md](./plugins/compliance/LEGISLATION.md) for how to add or update legislation reference files.

## Eval conventions

When using `/skill-creator` on a skill in this repo:

- Eval prompts/assertions: `skills/<skill>/evals/evals.json` (sibling to that skill's `SKILL.md`). For a subcommand without its own directory (e.g. `cra` lives in `online-safety/cra.md`), namespace the file: `online-safety/evals/cra-evals.json`.
- Raw run output (`iteration-N/`, transcripts, timing/grading): `<skill-name>-workspace/` as a sibling of the skill directory. Matched by `.gitignore` (`*-workspace`) — never commit this, it's large and reproducible.
- Latest benchmark summary: after an iteration finishes, copy `benchmark.json`/`benchmark.md` from the workspace into `skills/<skill>/evals/`, overwriting the previous snapshot, so `git log` on that file shows how the skill's scores changed over time.

## Legal content

Everything the `compliance` plugin's skills produce (assessments, checklists, DPIAs, LIAs, CRAs) is informational only, not legal advice — see the disclaimer in README.md. Don't soften or remove that disclaimer when editing skill output templates.
