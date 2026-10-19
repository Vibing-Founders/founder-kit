# Skill Benchmark: fk-fact-check

**Model**: claude-opus-5-5
**Date**: 2026-10-19T06:14:18Z
**Evals**: 1, 2, 3, 4, 5 (1 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 66% ± 16% | +0.34 |
| Time | 261.8s ± 143.6s | 72.3s ± 37.1s | +189.5s |
| Tokens | 75228 ± 10877 | 58042 ± 8644 | +17187 |

## Notes

- One run per configuration (with skill / without skill), so there is no variance estimate: ± is the spread across evals, not across repeated runs.
- Tokens and time are the executor agent's own; with-skill runs that dispatched research subagents do not include those subagents' tokens, so their real cost is higher. Some with-skill runs hit a concurrent-subagent limit and ran the research or analyst prompt inline, as the skill's fallback allows.
- Founder turn-taking was simulated: evals 1-4 got one scripted reply ('Go ahead, check them all.') after the claim list; eval 5 was a single turn that should stop at the list.
- Eval 1 'deadline-supported' was replaced by 'deadline-checked' after grading: the claim as worded ('must file ... online by 31 January') overstates the rule, since paper returns due 31 October are allowed, so expecting Supported was wrong. The with-skill run marked it Contradicted with that reason and was regraded as a pass.
- Without the skill, runs mostly skipped the pause before research, wrote no report file, and gave no counts by status, confidence or source reliability.
