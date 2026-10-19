# Skill Benchmark: fk-coach

**Model**: claude-opus-5-5
**Date**: 2026-10-19T06:14:18Z
**Evals**: 1, 2, 3, 4, 5 (1 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 61% ± 27% | +0.39 |
| Time | 54.3s ± 16.0s | 34.3s ± 15.0s | +20.0s |
| Tokens | 62051 ± 2968 | 48886 ± 2410 | +13164 |

## Notes

- One run per configuration (with skill / without skill), so there is no variance estimate: ± is the spread across evals, not across repeated runs.
- Founder turn-taking was simulated: evals 2 and 4 got one scripted reply ('Agreed, go with what you suggest.'); evals 1, 3 and 5 were single turns.
- Eval 2's 'weak evidence' and 'scorecard' assertions do not discriminate much, because the fixture journey.md already records that the pain was prompted and both criteria are not yet met.
- Without the skill, runs asked lists of questions, wrote no coaching files on a first conversation, set four or five next actions instead of three, and recommended no tools.
