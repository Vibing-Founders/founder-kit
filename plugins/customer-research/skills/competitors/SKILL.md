---
name: competitors
description: >
  Researches the competitive landscape for a startup idea or product and returns an
  analysis a bootstrapping founder can use to position and sell: direct and indirect
  competitors, the "do nothing / spreadsheet" alternative, pricing, positioning, what
  their customers complain about, and where a small team can win. Uses the founder's
  ideal customer profile when one exists. Triggers on: "who are my competitors for …",
  "competitor research", "competitive landscape", "what else is out there for …",
  "alternatives to …", "how do I position against …", "who else does this",
  "is anyone already doing …", "compare me to …", "what do customers hate about …",
  "where can I win against …".
---

# Competitors

Finds out who and what a founder is really up against, and where a small team can win.
The output is for positioning and selling, not an investor deck: no market sizing, no
"total addressable market", no funding-round gossip unless it changes what a customer
experiences.

## 1. Scope the question with the founder

Before researching, make sure you know:

- **The idea or product**, in a sentence.
- **Who it is for**: the target customer.
- **What they already know**: competitors they have heard of, tools customers mentioned.
- **Where they sell**: country or region, if it matters for pricing or availability.

First, look for an ideal customer profile in the project: `ideal-customer-profile.md`
(usually in `customer-research/`), plus any `ideal-customer-profile-<segment>.md` files
beside it for a marketplace. If it exists, read it and use it for "who it is for":
the target customer, their top pain points, the tools and workarounds they mentioned,
and the negative personas. Tell the founder you are using it. Tools customers named in
interviews are competitors, including spreadsheets and paper.

Ask only for what is missing, in one short message. If the founder has already given
enough, restate your understanding in two or three lines and carry on.

## 2. Run the research

The research is done by the prompt in `references/agents/competitor-researcher.md`.

- **If your host offers a subagent or agent tool**, dispatch a general-purpose subagent
  seeded with that file's full contents, with the scope from step 1 filled into its
  "Brief" section. The research then runs in its own context and returns a digest,
  which keeps long search results out of this conversation.
- **Otherwise**, follow that prompt yourself, inline, with the same brief.

Either way it needs web search. If no web search is available, tell the founder, then
produce what you can from the ICP and their own knowledge, clearly marked as unverified.

## 3. Check the digest

Before writing it up, check that:

- every claim about a competitor has a source link;
- verified facts and inferences are labelled differently;
- anything older than about 12 months (pricing pages, reviews, feature lists) is flagged
  as possibly stale;
- the "do nothing / spreadsheet" alternative is covered;
- customer complaints come from real reviews, forums or social posts, with links;
- no market-size, revenue or valuation estimates slipped in.

Fix or remove anything that fails.

## 4. Write it up

Save to the research folder: if an ICP file was found, use its folder; otherwise
`customer-research/` in the project root. File:
`competitors/<YYYY-MM-DD>-<topic>.md`, lowercase with hyphens, for example
`customer-research/competitors/2026-05-14-photographer-bookkeeping.md`.

Sections, in order:

1. **Summary**: the three to five things the founder most needs to know.
2. **Landscape**: direct competitors, indirect competitors, and the "do nothing /
   spreadsheet / hire someone" alternatives, each in a line.
3. **Profiles**: for each competitor, positioning (in their own words), pricing, who
   they target, strengths, weaknesses, and **what their customers complain about**, with
   quotes and links.
4. **Comparison**: a table across the dimensions that matter to the target customer
   (taken from the ICP's pain points when available), not a generic feature list.
5. **Where a bootstrapper can win**: gaps a small team could own. Tie each one to
   evidence (a complaint pattern, an ignored customer group, a pricing gap) and, where an
   ICP exists, to a named pain point or persona.
6. **Sources**: every link, with the date it was checked.

Then tell the founder, in plain language, the headline findings and where the file was
written.

## What to decide next

Do not choose the strategy for the founder. End by naming the decisions the research
points to, for example:

- Which gap will you build your pitch around first?
- Will you price against the leader, or against the spreadsheet?
- Is there a competitor whose unhappy customers you could talk to this week?

And list any research gaps: things the web could not answer that customer
conversations could (the `icp` skill in this plugin can analyse those conversations).

## Plain language

Assume the founder is not technical. No jargon without a short explanation. Say where
the file was saved using the path relative to their project folder.
