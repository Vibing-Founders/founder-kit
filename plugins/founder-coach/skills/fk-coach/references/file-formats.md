# File formats

Two Markdown files in the coaching folder (see `../../_shared/docs-location.md`). Keep them
short and readable: the founder should be able to open them and see where they are at a
glance.

Rules for both:

- **Evidence only.** Record what the founder said or showed, not guesses. Write
  "unknown" or "not asked yet" rather than filling a gap.
- **Dates** as `YYYY-MM-DD`, using today's date for anything that happened in this
  conversation.
- **Update, don't duplicate.** Edit the existing sections; do not append a second copy.
- **Show the founder** what was written the first time, and summarise changes after that.

## `founder-profile.md`

One section per founder, then a short team section. Teams of two are common.

```markdown
# Founder profile

Last updated: 2026-09-30

## Priya (founder)

- **Background:** Eight years as a product designer at an agency; freelance photographer
  friends.
- **Skills and superpowers:** Interviewing users, prototyping, clear writing.
- **What makes her unusual:** Did her own bookkeeping as a freelancer for three years.
- **Audiences and networks she can reach:** A photography meet-up group (about 60
  people); former agency colleagues.
- **Constraints:** About 15 hours a week (works three days a week); runway: not asked yet;
  risk appetite: low, wants to keep the day job for now.
- **What she wants the business to be:** A calm side income that could replace the day
  job within two years.
- **Founder type(s):** Designer.
- **Time sinks to watch:** Polishing the brand and screens before a payment test;
  mocking up features nobody has asked for.

## Team

- **Who does what:** Solo for now.
- **How decisions are made:** Priya decides.
- **Gaps:** No one to sell or build yet; plans to use no-code tools.
```

A second founder gets their own `## <name> (co-founder)` section with the same fields.
The team section then covers who does what, how they decide, and whose time sinks the
other watches for.

## `journey.md`

```markdown
# Journey

Last updated: 2026-09-30

## Current stage

**2. Validate the problem.** Since 2026-09-02.

## Exit criteria

| Criterion | Status | Evidence |
|---|---|---|
| Several people describe the pain unprompted | Not yet | 4 interviews; 1 raised late payments without being asked, 3 only when asked |
| They show they'd pay | Not yet | "I'd probably pay" from 2 people, in answer to a direct question |

## Current bet

- **Hypothesis:** Freelance photographers who do their own books lose at least a weekend a
  year matching late client payments, and already pay someone to fix it.
- **Test:** Five more interviews asking about the last tax return, no mention of the idea.
- **Kill criteria:** If fewer than three of the five bring up payment matching unprompted
  by 2026-10-21, look at a different pain or group.
- **Review date:** 2026-10-21.

## Next actions

1. Book five interviews through the photography meet-up. By 2026-10-07.
2. Prepare questions about the last time, not hypotheticals. By 2026-10-07.
3. Analyse each transcript the day it happens. By 2026-10-21.

## Decision log

Newest first.

| Date | Decision | Why | Stage change |
|---|---|---|---|
| 2026-09-02 | Milestone met | Problem, group and edge written down; profile done | 1 → 2 |
```

- **Next actions:** at most three, each with a date, each aimed at an unmet criterion.
- **Current bet:** one at a time. If there is no bet yet, write "None yet".
- **Decision log:** one row per decision: persevere, pivot, kill or milestone met. Record
  stage moves in both directions, for example `3 → 2`.
- If the founder is working on more than one idea, keep one journey per idea only if they
  ask; otherwise help them choose one.
