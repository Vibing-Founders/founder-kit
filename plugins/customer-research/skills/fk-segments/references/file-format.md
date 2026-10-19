# The segments file

One file, `<research folder>/segments.md` (by default `docs/customer-research/segments.md`).
It sits beside the ICP, which this skill reads but never writes:

```
docs/customer-research/
  segments.md                  # written by fk-segments: hypotheses from desk research
  ideal-customer-profile.md    # written by fk-icp: evidence from interviews
  interviews/
  competitors/
  fact-checks/
```

If `segments.md` exists, update it in place and add a line to its "What changed" table.

## Header

```markdown
# Customer segments: <problem in a few words>

- **Last updated:** YYYY-MM-DD
- **Status:** hypotheses from desk research. Nothing here is evidence about your customers
  until you have interviewed them.
- **Interviews so far:** none | <n>, see ideal-customer-profile.md

## What changed

| Date | What changed |
|---|---|
| 2026-10-19 | First shortlist from the problem and three seed guesses |
```

Newest entry first.

## Sections, in order

1. **The problem and your guesses**: the problem in the founder's words, and their seed
   guesses.
2. **Ranking**: the scoring table from `ranking.md` (with "(your guess)" marked), the
   shortlist, and one line on each dropped group. If the founder's favourite ranked low,
   say so here.
3. **Segment profiles**: one subsection per shortlisted segment, in rank order, using the
   profile from `agents/segment-researcher.md`. Mark any segment already **backed by
   interviews** and link to the ICP.
4. **Across segments**: shared patterns, conflicting needs, segments that combine well.
5. **Who to talk to, and how**: for the top two or three: how many, exactly where (with
   links), the outreach message, and what would change the ranking. Then the next step
   (`interview-script` to prepare, `fk-icp` to analyse).
6. **Open questions**: what desk research could not answer, and what interviews must test.
7. **Sources**: every link, with the date it was seen.

Every claim in the file is labelled **sourced** (link and date) or **hypothesis**.
