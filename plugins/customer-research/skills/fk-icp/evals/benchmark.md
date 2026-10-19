# Skill Benchmark: fk-icp

**Model**: claude-opus-5-5
**Date**: 2026-10-19T06:14:18Z
**Evals**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (1 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 61% ± 31% | +0.39 |
| Time | 108.0s ± 65.5s | 57.4s ± 17.5s | +50.6s |
| Tokens | 62914 ± 8029 | 49518 ± 1698 | +13396 |

## Notes

- One run per configuration (with skill / without skill), so there is no variance estimate: ± is the spread across evals, not across repeated runs.
- Founder turn-taking was simulated: analyse evals (1-4, 9) got one scripted reply ('Go ahead. No need to anonymise anything.'); evals 5-8 and 10 were single turns.
- Evals 4, 6 and 9 do not discriminate: the baseline also passes, because the fixture ICP or config already shows the expected format or location.
- Without the skill, runs paraphrased quotes, skipped Possible Solutions sections, kept marketplaces in one file, wrote a full interview script, and wrote files without asking when research lived in a legacy folder.
