# File conventions

Founders may be working in a code repository or a plain folder. All paths are relative
to the current project folder. Never write to an absolute path.

## Finding the ICP

1. Look for `ideal-customer-profile.md` anywhere in the project (skip dependency and build
   folders such as `node_modules`). Also check for files whose top heading is an ideal
   customer profile, in case it was named differently.
2. If you find one, its folder is the **research folder**. Keep everything there, even if
   it is not `customer-research/`.
3. If you find more than one and it is not a marketplace set (see `marketplace.md`), ask
   the founder which is current.
4. If there is none, the research folder is `customer-research/` in the project root.
   Create it when you first write.

## Layout

```
customer-research/
  ideal-customer-profile.md                 # the ICP (master file for a marketplace)
  ideal-customer-profile-<segment>.md       # marketplace only, one per side
  interviews/
    <name>-<YYYY-MM-DD>/
      raw.md                                # the input exactly as provided
      analysis.md                           # bias flags, pain points, fit, persona signals
      insights.md                           # patterns, priorities, qualifying questions, gaps
  competitors/
    <YYYY-MM-DD>-<topic>.md                 # written by the competitors skill
```

- `<name>` is the customer's name or pseudonym, lowercase with hyphens (`priya-n`,
  `harbour-lane-studio`).
- Dates are `YYYY-MM-DD`. If the conversation has no date, use today's date and say so.
- All file and folder names are lowercase with hyphens.
- If the same person is interviewed again on another date, that is a new folder.
- For survey exports or a batch of short feedback, use a descriptive name instead of a
  person, such as `interviews/onboarding-survey-2026-03-04/`.

## Privacy

Transcripts can hold personal details. Before saving `raw.md`, tell the founder the file
will contain what they pasted, and offer to replace surnames, emails and phone numbers
with placeholders. Quotes in the ICP should identify people by first name or pseudonym
only.

## ICP file header

Every ICP file (and every marketplace segment file) starts with:

```markdown
# Ideal Customer Profile: <business or segment name>

- **Business type:** B2B | B2C | Marketplace (<side A> / <side B>)
- **Last updated:** YYYY-MM-DD
- **Based on:** <n> conversations (list, or link to interviews/)

## Version log

| Version | Date | What changed | Evidence |
|---|---|---|---|
| 0.3 | 2026-05-12 | Added pain "chasing late invoices"; renamed persona to "Invoice-Chasing Imogen" | interviews/imogen-2026-05-12 |
| 0.2 | 2026-05-02 | Added negative persona "The Hobby Shooter" | interviews/tom-2026-05-02 |
| 0.1 | 2026-04-20 | First draft | interviews/sam-2026-04-20 |
```

Bump the minor number for each update. Newest entry first.

## ICP body order

1. Profile (company profile for B2B, individual profile for B2C; see
   `b2b-b2c-structures.md`)
2. Pain points: each with quotes, type, severity, spontaneous/prompted, and
   `Possible Solutions`
3. Goals, decision-making, budget, success measures, tools or digital habits
4. Buyer personas (linking to pain points by name, not repeating them)
5. Negative personas
6. Qualifying questions
7. Research gaps

## Telling the founder

Every response that writes files ends with a short list of the paths written or changed,
relative to the project, for example:

```
Files written:
- customer-research/interviews/imogen-2026-05-12/raw.md
- customer-research/interviews/imogen-2026-05-12/analysis.md
- customer-research/interviews/imogen-2026-05-12/insights.md
- customer-research/ideal-customer-profile.md (updated to v0.3)
```
