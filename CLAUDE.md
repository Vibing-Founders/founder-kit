# founder-kit

A Claude Code plugin marketplace (`.claude-plugin/marketplace.json`). Each plugin under `plugins/<name>/` bundles skills for a specific problem area — `compliance` (GDPR, UK Online Safety Act, OWASP, DPIA/LIA/CRA assessments for platform builders) `agent-delivery` (dispatching planned tickets into Claude cloud sandboxes with a disposable database), `site-delivery` (brief-to-PR website delivery for non-coding founders) and `customer-research` (ideal customer profile, personas, competitor research and fact-checking).

See [KIT-MAP.md](./KIT-MAP.md) for who the kit is for, what belongs in it and how the plugins fit together — update it in the same PR when a plugin or skill is added, removed or changes purpose. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the required plugin/skill directory structure, where a new addition should go, and the PR checklist. Suggestions for additions are assessed with the `triage-suggestion` maintainer skill, which produces a proposal for review and builds nothing until it is approved. See [plugins/compliance/LEGISLATION.md](./plugins/compliance/LEGISLATION.md) for how to add or update legislation reference files.

## Eval conventions

When using `/skill-creator` on a skill in this repo:

- Eval prompts/assertions: `skills/<skill>/evals/evals.json` (sibling to that skill's `SKILL.md`). For a subcommand without its own directory (e.g. `cra` lives in `fk-online-safety/cra.md`), namespace the file: `fk-online-safety/evals/cra-evals.json`.
- Raw run output (`iteration-N/`, transcripts, timing/grading): `<skill-name>-workspace/` as a sibling of the skill directory. Matched by `.gitignore` (`*-workspace`) — never commit this, it's large and reproducible.
- Latest benchmark summary: after an iteration finishes, copy `benchmark.json`/`benchmark.md` from the workspace into `skills/<skill>/evals/`, overwriting the previous snapshot, so `git log` on that file shows how the skill's scores changed over time.

## Tests

Most of this repo is Markdown that Claude reads, and evals are how that gets checked. A few plugins
also ship **executable assets** — code copied into an adopting repository — and those get real unit
tests, because a reader cannot verify a safety guard by looking at it.

- Runner: **`npm test`** (`node --test`). Zero dependencies, no lockfile, no `node_modules` —
  Node's runner is built in and strips TypeScript types natively, so `.ts` tests run unbuilt.
  Needs Node >= 22.18, where type stripping is on by default.
- Location: `plugins/<name>/tests/*.test.ts`. Deliberately **not** inside `skills/**/assets/`,
  since files there are copied verbatim into adopting repos.
- What earns a test: shipped executable assets, especially anything that refuses, guards, or
  validates. Skill instructions and knowledge files are covered by evals instead.

Run the full suite from the repo root before opening a PR.

## Legal content

Everything the `compliance` plugin's skills produce (assessments, checklists, DPIAs, LIAs, CRAs) is informational only, not legal advice — see the disclaimer in README.md. Don't soften or remove that disclaimer when editing skill output templates.
