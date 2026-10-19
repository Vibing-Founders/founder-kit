# Skill Benchmark: fk-supabase-rls

**Model**: claude-opus-5-5
**Date**: 2026-10-19T06:11:49Z
**Evals**: 1, 2, 3, 4, 5, 6, 7, 8 (1 run each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 62% ± 27% | +0.38 |
| Time | 99.0s ± 26.0s | 58.8s ± 27.1s | +40.2s |
| Tokens | 366610 ± 67362 | 185022 ± 50541 | +181588 |

## Notes

- Runs were headless `claude -p` sessions in a copy of each fixture repo; with_skill loaded the compliance plugin with --plugin-dir and the skill triggered on its own in all 8 runs. Graded by headless grader sessions against the saved report, final reply, and a programmatic audit of files created or changed in the project.
- Without the skill, the model wrote a migration file into supabase/migrations/ in 6 of 8 runs and edited source files in 3, which the read-only assertion counts as a failure. No run in either configuration ran a database-writing command (none was possible: no database or MCP server was connected).
- Eval 7 (well-secured app) does not discriminate: both configurations found no serious problems.
- Only the migrations path was exercised; the live-database path (Supabase MCP, security advisor, catalog queries) was not.
