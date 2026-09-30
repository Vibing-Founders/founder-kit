---
name: fk-icp
description: >
  Builds and maintains an evidence-based ideal customer profile (ICP), buyer personas,
  negative personas (who not to sell to) and qualifying questions from real customer
  interviews and feedback, and keeps them as living documents. Use this skill whenever a
  founder shares a customer interview transcript, call notes, survey answers or customer
  feedback, or asks about their customers, pain points, personas or who to target.
  Triggers on: "analyse this customer interview", "analyze this call transcript",
  "what did this customer say", "extract pain points", "update our ICP",
  "ideal customer profile", "who is my ideal customer", "create personas",
  "negative personas", "who should we not sell to", "qualifying questions",
  "what are our customers' top pains", "update the <name> persona",
  "review our ICP", "what should I ask in my next customer interview".
---

# Ideal Customer Profile

Turns what customers actually said into an ideal customer profile a bootstrapping founder
can use to decide who to talk to next, who to sell to, and who to walk away from.

The profile is only as good as its evidence. Everything in it must trace back to
something a real customer said or did.

## Principles (apply in every mode)

1. **Evidence only.** Never invent a characteristic, pain or preference the customer did
   not express in their own words. No market sizing, no share-of-market or persona
   percentages, no revenue or lifetime-value estimates. If something is unknown, say so
   and add it to research gaps.
2. **Customer stories over opinions.** What someone did last Tuesday outweighs what they
   say they would do. "Would you pay for…?" answers are weak evidence; a story about the
   workaround they built is strong evidence.
3. **Filter interviewer bias.** Flag leading questions, answers the interviewer suggested,
   and the interviewer's own opinions. Label each finding **spontaneous** or **prompted**,
   and down-weight anything that only appeared after prompting. See
   `references/interviewer-bias.md`.
4. **Word-for-word quotes.** Every pain point carries at least one exact customer quote,
   with who said it and when.
5. **Possible Solutions.** Every pain point has a section headed exactly
   `Possible Solutions`, listing approaches that could address it.
6. **Pain points live in one place.** All pain points sit in the ICP's pain point
   section. Personas reference them; they never hold their own copy.
7. **Memorable names.** Personas get descriptive names that capture who they are
   (for example "Deadline-Juggling Duncan" or "The Weekend Batch Cook"), never
   "Persona A", "Primary" or "Secondary".
8. **B2B or B2C.** Businesses buying need a company profile; individuals buying need a
   personal profile. Detect which applies before writing. See
   `references/b2b-b2c-structures.md`.
9. **Marketplaces.** If the business serves two sides that meet through it (buyers and
   sellers, hosts and guests, clients and freelancers), keep a master ICP plus one file
   per side, cross-referenced. See `references/marketplace.md`.
10. **Version tracking.** The ICP file header records what changed, when, and from which
    conversation.
11. **Always end with research gaps.** Every response ends with what the founder should
    ask in their next conversations, and, if files were written, exactly where.

## Where files live

Before writing anything, look for an existing ICP file in the current project (a file
named `ideal-customer-profile.md`, or a file whose title is an ideal customer profile).
If one exists, keep using its folder. Otherwise use `customer-research/` in the project
root. Paths are always relative to the project, never absolute. Full layout, naming and
the file header format are in `references/file-conventions.md`.

## Pick the mode

Work out which of these four the founder wants. If it is unclear, ask one short question.

| The founder… | Mode |
|---|---|
| shares a transcript, call notes, survey answers or feedback | **Analyse** |
| asks a question about their customers | **Answer** |
| asks to change a named persona or section | **Update** |
| asks whether their ICP is any good, or what is missing | **Review** |

Any mode that needs the existing ICP and cannot find it should ask the founder where it
is (or whether one exists yet) before going further.

### Analyse

For an interview or piece of feedback:

1. **Identify the conversation.** Get the customer's name (ask if missing; a first name
   or a pseudonym is fine) and date (use today's date if none is given). Save the raw
   input exactly as provided, after offering to replace surnames and contact details
   with placeholders (see `references/file-conventions.md`).
2. **Check the business shape.** On the first analysis, or if the ICP does not say yet,
   decide B2B or B2C and whether it is a marketplace. State the decision and why.
3. **Flag interviewer bias.** Before extracting anything, list leading questions,
   suggested answers and interviewer opinions, quoting them.
4. **Extract pain points.** For each: a word-for-word quote, type (practical, emotional
   or social), how severe it seems from the customer's own language, spontaneous or
   prompted, and a `Possible Solutions` section.
5. **Assess ICP fit.** How well does this customer match the current ICP? What would
   this conversation change about it?
6. **Persona signals.** Which buyer persona does this person match, or do they suggest a
   new one? What negative-persona warning signs appear? See
   `references/personas-and-qualifying-questions.md`.
7. **Patterns across interviews.** Compare with earlier conversations: what is new,
   what is reinforced, what contradicts earlier findings.
8. **Prioritise.** Rank pain points by how often they come up and how strongly people
   feel them. Spontaneous evidence counts more than prompted.
9. **Qualifying questions.** Add or refine questions that spot a good-fit customer and
   screen out a poor fit.
10. **Update the ICP file(s)** with version tracking, then report what changed.

End with: research gaps, what the founder should decide next (see below), and the list
of files written.

### Answer

Read the existing ICP (and segment files, for a marketplace). Answer from it, citing the
quotes and conversations behind each point. Say how confident the answer is based on how
many conversations support it. If the ICP cannot answer the question, say so plainly and
turn it into a research gap. Do not fill the hole with guesses.

### Update

Change only the named persona or section. For every change, show before and after, give
the evidence (quote and conversation) that justifies it, and add a line to the version
log in the file header. If the founder asks for a change that no conversation supports,
make it only if they confirm, and mark it in the file as **founder assumption, not yet
evidenced** so it can be tested later.

### Review

Check the existing ICP against every principle above and list the gaps: pain points
without quotes, pains without `Possible Solutions`, pains sitting inside personas,
generic persona names, invented or unsupported claims, market-size or revenue guesses,
prompted evidence treated as strong, missing negative personas or qualifying questions,
wrong B2B/B2C structure, a marketplace in a single file, a missing version log. Rank the
gaps by how much they would mislead the founder, then suggest what to fix first and what
to ask customers to close each gap.

## What to decide next

This skill describes customers; it does not choose the strategy. When findings raise a
bigger question, name the decision for the founder rather than making it for them. For
example:

- Two personas both look promising: which one will you sell to first?
- The strongest pain is not the one the product was built for: do you change what you
  are building, or keep looking for people with the original pain?
- A negative persona keeps showing up in sign-ups: what will you change in your
  marketing or pricing so they self-select out?

## Plain language

Founders using this may not be technical. Explain what you are doing in everyday words,
avoid jargon (or explain it the first time), and always say where files were saved using
the path relative to their project folder.
