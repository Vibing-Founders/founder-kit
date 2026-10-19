# `strategy.md` format

One Markdown file in the coaching folder (see `../../_shared/docs-location.md`), beside
`founder-profile.md` and `journey.md`. **Two pages at most**: if it grows longer, something has
not been chosen. Cut, merge or move detail into open questions.

Rules:

- **Evidence only.** Record what the founder said, showed or decided, and what their research
  found. Where something is a guess, label it as one; where it is unknown, say "unknown" or put
  it in open questions. Never invent traction, quotes or numbers.
- **Plain language.** No market sizing, TAM, market share, valuation or investor framing.
- **Dates** as `YYYY-MM-DD`, using today's date for anything decided in this conversation.
- **Update, don't duplicate.** Edit the sections in place. History goes in the change log, not
  in struck-through text.
- **Draft label.** Until the founder has confirmed the draft, put `Status: draft` under the
  title; change it to `Status: agreed` when they say it reflects their choices.

## Template (with an invented example)

```markdown
# Strategy

Last updated: 2026-10-19 · Status: draft

## Diagnosis

Freelance photographers who chase late client payments lose a weekend or more every tax
season matching payments to invoices (4 of 7 interviewees raised this unprompted). Most put up
with a spreadsheet. Priya has about 15 hours a week, low risk appetite and one route to
customers: a photography meet-up group of about 60 people.

## Guiding policy

Win photographers who chase late payments first, by selling payment matching as a
done-for-you service through the meet-up group before building software.

## Coherent actions

1. Offer monthly payment matching by hand at a fixed £30 a month to five photographers.
2. Write down the steps for each customer, so repeated steps can be automated later.
3. Post one lesson a fortnight in the meet-up group's chat to grow an audience.

## Wedge

- **Customer:** UK freelance wedding and event photographers who invoice clients directly and
  do their own books.
- **Problem they own:** matching late, part-paid client payments to invoices at tax time.
- **Hero use case:** a photographer forwards a month of bank statements and invoices and gets
  back a matched ledger and a list of who still owes them.

## Value proposition

Know who owes you, every month, without a weekend of spreadsheets: cheaper than an
accountant, less work than doing it yourself.

## Strategic bets

### B1. Photographers will pay for done-for-you payment matching
- **Hypothesis:** …
- **What must be true:** …
- **How we'll test it:** …
- **Kill or pivot criteria:** …

(3 to 5 bets; see bets-and-kill-criteria.md)

## Not doing yet

- No app or software until five customers pay for the manual service (because building first
  skips the offer test).
- Not serving other creative freelancers (videographers, designers) until photographers work.
- No accountant partnerships: they take time and do not bring a paying customer closer yet.

## Phased path

**Now (to about 2026-12):** prove photographers pay for the outcome, by hand. **Next:**
automate the steps that repeat across customers and keep the price. **Later:** move customers
onto a simple tool and open it to the next group of freelancers.

## Open questions

Prioritised; the ones only the founder can answer.

1. Would you rather keep the day job and grow slowly, or aim to replace it within a year?
   (Changes how many customers the service can take.)
2. Is £30 a month a price you would be comfortable asking for in person?
3. …

## Change log

Newest first.

| Date | What changed | Why | From |
|---|---|---|---|
| 2026-10-19 | First draft | Founder asked for a strategy | founder-profile.md, journey.md, ideal-customer-profile.md |
```

## Section notes

- **Last updated:** today's date on every write.
- **Diagnosis, guiding policy, coherent actions:** see `strategy-kernel.md`. Three to five
  coherent actions.
- **Wedge:** one customer, one problem, one hero use case: the single situation where the
  product is most obviously worth paying for. Narrower is better.
- **Value proposition:** one or two sentences, in words the customer would use, against what
  they do today (including doing nothing).
- **Strategic bets:** 3 to 5, labelled `B1`… Each with hypothesis, what must be true, how
  we'll test it, kill or pivot criteria. See `bets-and-kill-criteria.md`.
- **Not doing yet:** at least one hard choice, each with a short "because". These are the
  things the founder might be tempted by. "Not yet" is fine; it does not mean never.
- **Phased path:** a short narrative (now, next, later), not a backlog or a feature list. Tie
  each phase to what must be proven before moving on.
- **Open questions:** prioritised, most important first. Only questions the founder can
  answer (goals, trade-offs, constraints, choices) or that a named test will answer.
- **Change log:** newest first. One row per write: date, what changed, why, and which input it
  came from (a file, "interview notes pasted 2026-10-19", "founder's decision").
