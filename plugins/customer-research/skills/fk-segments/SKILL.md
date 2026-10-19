---
name: fk-segments
description: >
  Turns "here's a problem, and I think these people have it" into a ranked shortlist of
  customer segments to talk to first, and exactly where and how to reach them, using desk
  research before a founder has interviewed anyone. Ranks groups by pain, willingness to
  pay and how reachable they are within about three months, profiles the top few with
  quotes from real public posts, and ends with who to talk to, how many, where to find
  them and an outreach message. Use it whenever a founder has an idea or a problem but no
  customer conversations yet. Triggers on: "who should I talk to first", "who has this
  problem", "which customer segment should I target", "find my first customers",
  "who would pay for this", "where do I find people with this problem",
  "I have an idea, who is it for?", "which niche should I start with",
  "who are my early adopters".
---

# Segments

Before a founder has talked to customers, desk research can turn a problem and a few guesses
about who has it into **a ranked shortlist of who to talk to first, and how to reach them**.
The output ends in "go and talk to these people", not a report to admire.

This skill produces hypotheses. Interviews turn them into evidence, and that is `fk-icp`'s job:
the founder uses the shortlist to book conversations, then brings the transcripts to `fk-icp`.

## Rules that apply throughout

- **Label every claim.** Each one is **sourced** (with its own link and the date seen) or
  **hypothesis**. Sourced means you read the page and it says this: a headline you could not
  open, a site named without a link, or a pattern drawn from one post is a hypothesis.
  Nothing in this skill's output is evidence about the founder's customers until someone has
  been interviewed, so say that plainly in the file.
- **No market sizing.** No TAM, market share, persona percentages, number-of-customers
  guesses or revenue estimates. They give a bootstrapper false confidence and do not change
  who to call this week. If the founder asks for them, decline in a sentence, say why, and
  offer what helps instead (the ranking and who to talk to).
- **Push back on founder bias.** If the research suggests the founder's favourite group
  ranks low, say so directly and show why. They may still choose it, but knowingly.
- **No go-to-market tactics yet.** No ads, funnels, landing pages or pricing pages. The goal
  is conversations.
- **Never write the ICP files.** `fk-icp` owns `ideal-customer-profile*.md`. Read them; do
  not edit them.
- **Plain language.** The founder may not be technical. No jargon without a short
  explanation.

## 1. Gather the inputs

Work out the **research folder** by following `../_shared/docs-location.md` (by default
`docs/customer-research/`). Then look for:

- **An existing ICP** (`ideal-customer-profile.md`, and any `ideal-customer-profile-<side>.md`)
  and the `interviews/` folder. If the founder already has interviews behind a segment, mark
  that segment as **backed by interviews** wherever it appears. If interviews already cover
  the groups they are asking about, tell them they are past desk research: the next step is
  more conversations and `fk-icp` (to analyse them), not another shortlist. Offer to
  shortlist only groups the interviews have not covered.
- **An earlier `segments.md`.** If one exists, update it rather than starting over, and
  record what changed in its header.
- **The founder profile**, read-only: `<founder-coach folder>/founder-profile.md`, by
  default `docs/founder-coach/founder-profile.md` (the folder follows the same rules as
  `docs-location.md`, with `founder-coach.root`). Its "audiences and networks" line changes
  how reachable a segment is: a group the founder already has a way into scores higher on
  reach. Tell the founder you used it. It may not exist; carry on without it.

You need two things from the founder:

1. **The problem**, in a sentence or two.
2. **One to three guesses at who has it** (for example "freelance designers, solo
   developers, small agency owners").

If either is too vague to research (for example "an app to help people be more
productive", with no guess at who), ask **one** clarifying question that would unlock the
research, and stop until they answer. Otherwise go: restate the problem and seeds in two
lines and carry on.

## 2. Broad scan

List every group that plausibly has the problem, including adjacent groups the founder did
not name. Aim for breadth (often 8 to 15 groups) before depth. Name groups specifically
enough to find them ("freelance wedding photographers", not "creatives").

## 3. Rank and narrow to 3 to 6

Score each group on **pain intensity**, **willingness and ability to pay** and
**reachability within about three months**, as set out in `references/ranking.md`. Show the
scoring table, keep three to six groups, and give a one-line reason for every group you
drop. Say where the founder's own seeds landed.

## 4. Research each shortlisted segment

The research is done by the prompt in `references/agents/segment-researcher.md`, once per
segment.

- **If your host offers a subagent or agent tool**, dispatch one general-purpose subagent
  per shortlisted segment, **in parallel**, each seeded with that file's full contents and
  its "Brief" section filled in for that segment. Each runs in its own context and returns
  a compact profile, which keeps long search results out of this conversation.
- **Otherwise**, follow that prompt yourself, inline, one segment at a time. Do the same for
  any segment whose subagent could not start (hosts often limit how many run at once), and
  say which segments were researched which way.

It needs web search. If none is available, tell the founder, then write the profiles from
what you know with **every** point marked **hypothesis**, and say the quotes still need
finding.

When the profiles come back, check them: every quote has a link and date and is no more
than about 25 words (trim longer ones); facts and hypotheses are labelled as defined above;
"where to reach them" names specific places with links; nothing sizes the market. Fix or
drop what fails.

Then revisit the scores. If the research changes a score, re-rank and say why. If a segment
came back with little or no first-hand evidence, keep its scores marked hypothesis and say
so next to its rank, so the founder can see when a higher-ranked group rests on less
evidence than a lower one.

## 5. Cross-segment view

Shared patterns (pains, workarounds or gathering places several segments share), conflicting
needs (what would please one and put off another), and segments that combine well (one
outreach channel, one offer). Keep it short.

## 6. Who to talk to, and how

This is the part that matters. For the **top two or three** segments:

- **How many people**: usually 5 per segment, enough to see a pattern.
- **Exactly where to find them**: named communities, subreddits, forums, newsletters,
  events, directories or LinkedIn job titles, with links, starting with any the founder
  already has a way into.
- **A short outreach message** the founder can adapt: who they are, that they are
  researching a problem (not selling), and a request for 20 minutes to hear how the person
  handles it today. Ask about the problem and past behaviour; never pitch, never describe
  the product, never ask "would you use…".
- **What would change the ranking**: what an interview would have to reveal to drop or
  promote this segment.

Then the next step:

1. Prepare the conversations with the `interview-script` skill from the free
   [pm-skills](https://github.com/phuryn/pm-skills) marketplace
   (`/plugin marketplace add phuryn/pm-skills`, then
   `/plugin install pm-product-discovery@pm-skills`), feeding it the "what would change the
   ranking" points. Drop its hypothetical questions ("If you could wave a magic wand…");
   answers to them are weak evidence. Use "Tell me about the last time…" instead.
2. Bring the transcripts to `fk-icp` (`/customer-research:fk-icp analyse this interview`),
   which turns them into an evidence-based ideal customer profile.

## 7. Save the file

Write `<research folder>/segments.md` in the format in `references/file-format.md`. Then tell
the founder, in plain language, the top segments, the first people to contact, and end with
the files written, using paths relative to the project, for example:

```
Files written:
- docs/customer-research/segments.md
```
