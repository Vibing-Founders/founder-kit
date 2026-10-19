# Skill Benchmark: fk-segments

**Model**: <model-name>
**Date**: 2026-10-19T06:20:40Z
**Evals**: 1, 2, 3, 4, 5, 6 (1 run each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 71% ± 25% | +0.29 |
| Time | 433.4s ± 368.0s | 32.2s ± 8.0s | +401.2s |
| Tokens | 87661 ± 28755 | 46991 ± 868 | +40670 |

## Notes

- One run per configuration, so the ± figures show spread across evals, not repeat runs.
- With skill passed every assertion. The baseline missed the scored ranking, linked quotes, sourced/hypothesis labels, the saved file and the `interview-script` / `fk-icp` next steps (eval 2); gave a rough TAM when asked (eval 6); and narrowed the existing ICP itself instead of pointing to `fk-icp` (eval 5).
- Evals 1 (vague problem) and 3 (favourite ranks low) did not discriminate: the baseline also asked one question and also pushed back on the favourite.
- With-skill research runs took 7 to 16 minutes. Several hit the host's concurrent-subagent limit and researched some segments inline, and some could not fetch Reddit or ran out of web searches; the outputs said so and marked unverified points as hypotheses.
- After this iteration the skill was tightened on what counts as **sourced** (first-hand, read, linked), on falling back to inline research when only some subagents start, on keeping hypothesis-only scores visible in the ranking, and on a search budget per segment. Those changes are not yet benchmarked.
