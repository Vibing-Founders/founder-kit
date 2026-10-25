# Skill Benchmark: fk-strategy

**Model**: claude-opus-5-5
**Date**: 2026-10-19T06:09:14Z
**Evals**: 1, 2, 3, 4, 5 (1 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 71% ± 14% | +0.29 |
| Time | 97.6s ± 41.1s | 46.6s ± 8.9s | +51.0s |
| Tokens | 229878 ± 110173 | 134467 ± 50496 | +95411 |

## Notes

- One run per configuration, so the ± figures are spread across evals, not run-to-run variance.
- Without the skill the model still does well at reading context, flagging an empty 'not doing' list and not touching journey.md; the assertions for those (eval 1 reads-context/no-tam/coach-files, eval 4 wedge-changed/change-log, eval 5 flags-* ) do not discriminate.
- The skill's lift is in structure and restraint: the full strategy.md format with 3-5 bets and dated kill criteria (eval 1), naming the strategy kernel and fluff (eval 2), laying out trade-offs and leaving the choice to the founder instead of deciding (eval 3), and testable kill criteria on every rewritten bet (eval 4).
- Timing and tokens are not like-for-like: eval 1 ran as subagents (tokens = subagent total), evals 2-5 ran via `claude -p` (tokens include cached system-prompt reads). Read the time/token deltas as rough; the skill does read 4-6 reference files, so it is slower.
- Grading was done by the orchestrating model against the outputs and file diffs, not by an independent grader agent.