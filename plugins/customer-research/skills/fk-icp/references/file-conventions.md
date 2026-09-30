# File conventions

Founders may be working in a code repository or a plain folder. All paths are relative
to the current project folder. Never write to an absolute path.

## The research folder

Which folder to use (default `docs/customer-research/`, configurable in
`.vf-founder-kit/config.yaml`) is decided by `../../_shared/docs-location.md`. Follow it
first. Then, inside the research folder:

1. Use `ideal-customer-profile.md` if it exists. Also check for files whose top heading is
   an ideal customer profile, in case it was named differently.
2. If there is more than one and it is not a marketplace set (see `marketplace.md`), ask
   the founder which is current.
3. If there is none, create the folder when you first write.

## Layout

Inside the research folder (shown here at the default location):

```
docs/customer-research/
  ideal-customer-profile.md                 # the ICP (master file for a marketplace)
  ideal-customer-profile-<segment>.md       # marketplace only, one per side
  interviews/
    <name>-<YYYY-MM-DD>/
      raw.md                                # the input exactly as provided
      analysis.md                           # bias flags, pain points, fit, persona signals
      insights.md                           # patterns, priorities, qualifying questions, gaps
  competitors/
    <YYYY-MM-DD>-<topic>.md                 # written by the fk-competitors skill
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
- docs/customer-research/interviews/imogen-2026-05-12/raw.md
- docs/customer-research/interviews/imogen-2026-05-12/analysis.md
- docs/customer-research/interviews/imogen-2026-05-12/insights.md
- docs/customer-research/ideal-customer-profile.md (updated to v0.3)
```
