# Skill Benchmark: fk-competitors

**Model**: claude-opus-5-5
**Date**: 2026-10-19T06:24:57Z
**Evals**: 1, 2, 3 (1 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 94% ± 10% | 26% ± 25% | +0.68 |
| Time | 387.0s ± 321.5s | 91.1s ± 50.7s | +295.8s |
| Tokens | 69778 ± 18586 | 61986 ± 10620 | +7792 |

## Notes

- One run per configuration (with skill / without skill), so there is no variance estimate: ± is the spread across evals, not across repeated runs.
- Iteration 2 re-ran only evals 1 and 3 with the skill, after two fixes: the report check now requires every 'where a bootstrapper can win' point to name the ICP pain point or persona it serves, and one-line landscape mentions to carry a link. Eval 2 (both configurations) and the without-skill runs of evals 1 and 3 are carried over from iteration 1, where with the skill passed 15 of 17 assertions (90% mean pass rate).
- Eval 3 with the skill still misses 'every competitor claim has a source link' on a single unlinked comparison-table cell ('Mealime: Partly (scales portions)'); the landscape links that failed in iteration 1 are now present.
- Eval 3's 'decisions-not-strategy' assertion was reworded so that pointing to fk-icp for follow-up conversations, which the skill itself asks for, no longer reads as a failure.
- Tokens and time are the executor agent's own and exclude any research subagent it dispatched. Web search was unavailable (budget used up) during the iteration-2 runs, which worked from page fetches only; some iteration-1 runs hit a concurrent-subagent limit and researched inline.
- Without the skill, runs listed competitors before asking who the app was for, quoted no complaints with links, used product-by-product rather than pain-based comparison rows, and chose the strategy for the founder.
