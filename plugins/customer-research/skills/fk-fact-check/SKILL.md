---
name: fk-fact-check
description: >
  Checks the factual claims in a piece of content against evidence and says which ones
  hold up: Supported, Contradicted or Unsubstantiated, with sources and a suggested
  rewrite for each problem claim. Works on a founder's own landing page, pitch, sales
  email or ad, on a competitor's marketing, and on AI-generated research such as a
  competitor report. Flags superlatives like "the only" or "the fastest" that need
  evidence, and marks claims that only the founder's own data can back up. Triggers on:
  "fact-check this", "is this claim true", "check the claims on my landing page",
  "can I say …", "can I claim …", "verify these stats", "is this statistic right",
  "check my pitch for claims I can't back up", "are my competitor's claims true",
  "fact-check my competitor report".
---

# Fact Check

Tells a founder which claims in a piece of content hold up, which are wrong, and which
cannot be backed up yet, and what to say instead. A false claim costs credibility with
the first customers; one you cannot back up can also be a problem under advertising
rules.

The method follows the three-step pipeline (extract claims, research evidence, judge
each claim) described in Ravi Manjunatha's article
[Building a Trustworthy AI: Automated Fact-Checking with Google's Agent Development Kit](https://medium.com/google-cloud/building-a-trustworthy-ai-automated-fact-checking-with-googles-agent-development-kit-292e84967261).

## 1. Understand the content

Before extracting anything, make sure you know:

- **The content**: pasted text, a file in the project, or a page the founder links to.
  If it is a link, fetch the page and check with the founder that you have the right text.
- **Whose content it is**: the founder's own (landing page, pitch, email, ad), someone
  else's (a competitor's marketing, an article), or research the founder was handed
  (including a report from this plugin's `fk-competitors` skill). This changes how
  claims are judged: see "The founder's own claims" below.
- **Where it will be used**, if it is the founder's own: country or region, and whether
  it is advertising. Rules about backing up claims differ by place.

First, work out the **research folder** by following `../_shared/docs-location.md`
(by default `docs/customer-research/`, configurable in `.vf-founder-kit/config.yaml`).
If the content is the founder's own, look there for an ideal customer profile,
`ideal-customer-profile.md` (plus any `ideal-customer-profile-<segment>.md` for a
marketplace), and the `interviews/` folder. Customer quotes in them can support claims
about customers. Tell the founder you are using them.

Ask only for what is missing, in one short message.

## 2. Pull out the claims

Do this yourself, in the conversation. Pick out specific statements that could be
checked:

- numbers, percentages and prices ("used by 2,000 photographers", "40% cheaper");
- dates and time periods ("since 2019", "set up in 5 minutes");
- awards, certifications, rankings and named standards ("rated 4.8 on the App Store",
  "HMRC-recognised", "GDPR compliant");
- comparisons ("2x faster than a spreadsheet", "half the price of X");
- statements about customers or the market ("most freelancers do their books once a
  year", "shift workers skip an average of four meals a week").

Leave out opinion and puffery ("beautiful", "a joy to use", "best-in-class") unless it is
tied to something measurable. But **do** list unqualified superlatives and absolutes
("the only app that…", "the fastest", "guaranteed", "never", "100%") and mark them
**superlative**: a reader takes them as factual, so they need evidence like any other
claim.

Rewrite each claim as one short, standalone sentence, keeping the original wording
alongside. Tag each one:

- **own** (the founder's own claim) or **third-party**;
- **superlative**, where it applies;
- **needs own data** for a founder's claim that only their own records could prove
  ("saves you 5 hours a week", "our customers get paid 10 days sooner").

Check at most **15 claims** in one run. If there are more, pick the ones that matter most
(headline and pricing claims, numbers, comparisons with named competitors, superlatives)
and list the rest as "not checked this run".

**Show the founder the numbered list and stop.** Ask whether to add, drop or narrow any
claim before you research. Carry on only when they reply. If they narrow a claim ("just
check the UK figure"), check the narrowed version.

## 3. Research the evidence

The research is done by the prompt in `references/agents/evidence-researcher.md`.

- **If your host offers a subagent or agent tool**, dispatch a general-purpose subagent
  seeded with that file's full contents, with the tagged claim list filled into its
  "Brief" section. For more than about six claims, split them into batches and run the
  batches in parallel. Each runs in its own context and returns an evidence digest.
- **Otherwise**, follow that prompt yourself, inline, with the same brief.

Either way it needs web search. If no web search is available, tell the founder and stop:
a fact-check without evidence would only repeat your own guesses.

For the founder's own claims about customers, add any matching ICP or interview quotes to
the evidence yourself, labelled **founder's customer interviews**, with the file they
came from. Do not add anything else from this conversation.

## 4. Judge each claim

The verdicts come from the prompt in `references/agents/fact-check-analyst.md`, dispatched
the same way (a fresh subagent where your host offers one, otherwise inline). Give it
**only** the tagged claims and the evidence digests. It must not see this conversation or
the founder's hopes for the answer, so its verdict rests on the evidence alone. If you run
it inline, set aside what you know from the conversation and judge only from the evidence
digests.

It returns, for each claim, one of:

- **Supported**: the evidence confirms it outright (the exact figure for a number, the
  named award for an award claim).
- **Contradicted**: the evidence conflicts with it.
- **Unsubstantiated**: the evidence is missing, vague or not enough to confirm it.

Every claim that is not Supported gets a one-sentence reason.

## 5. Check the verdicts

Before writing it up, check that:

- every claim from the agreed list has a verdict, in the same order;
- every source has a link, a date and a reliability note;
- no founder claim was marked Contradicted just because no public evidence exists;
- every superlative that is not Supported says what evidence it would need;
- verified facts and inferences are labelled differently;
- every Contradicted or Unsubstantiated claim in the founder's own content has a rewrite
  that says only what the evidence supports.

Fix or send back anything that fails.

## The founder's own claims

When the content is the founder's:

- **Claims only their data can prove** are marked **Unsubstantiated: needs your own
  evidence**, never Contradicted for lack of public sources. Say what would back it up:
  customer quotes, usage figures, a before-and-after from a real customer, a simple timed
  test.
- **Claims about customers** are checked against the ICP and interview quotes. When a
  quote supports the claim, cite it (who, when, which file). One or two quotes support a
  claim about "some" customers, not "most" customers; say so.
- **Every problem claim gets a rewrite.** For example, for a bookkeeping tool for
  freelance photographers:
  - "The only bookkeeping app built for photographers" becomes "Bookkeeping built for
    photographers", unless the research shows there is no other.
  - "Saves you 5 hours a week" becomes "Our beta users told us it saves them hours at tax
    time", once there are quotes that say so.
- **Say this plainly**, once: advertising claims should be ones you can back up with
  evidence when asked. This report helps with that; it is not legal advice.

For a competitor's content, no rewrites are needed. Instead, say which Contradicted or
Unsubstantiated claims matter for how the founder positions against them.

## 6. Write it up

Save to the research folder from step 1. File: `fact-checks/<YYYY-MM-DD>-<topic>.md`,
lowercase with hyphens, for example
`docs/customer-research/fact-checks/2026-06-02-landing-page.md` at the default location.

Sections, in order:

1. **Summary**: what was checked and whose it is, counts by status, and the three to five
   claims most worth fixing (or, for a competitor, most worth knowing about).
2. **Claims**: for each claim, in order:
   - **Claim**: the original wording (and the narrowed version, if the founder narrowed it)
   - **Status**: Supported, Contradicted or Unsubstantiated (with "needs your own
     evidence" where that applies)
   - **Reason**: one sentence, for anything not Supported
   - **Evidence**: a short summary, with verified facts and inferences labelled
   - **Sources**: link, date, reliability
   - **Confidence**: high, medium or low
   - **Suggested rewrite**: for the founder's own problem claims
3. **Not checked**: claims left out of this run, and why.
4. **Sources**: every link, with the date it was checked.

For the founder's own content, add the not-legal-advice line from above under the summary.

Then tell the founder, in plain language, the headline findings and where the file was
written:

```
Files written:
- docs/customer-research/fact-checks/2026-06-02-landing-page.md
```

## Working with the other skills

- **`fk-competitors`** reports can be fact-checked: point this skill at the file in
  `competitors/`. Useful before building a pitch on a competitor's price or a complaint
  pattern.
- **`fk-icp`** evidence can back up claims about customers. If a claim needs customer
  evidence you do not have yet, turn it into a research gap and suggest asking about it in
  the next customer conversation; `fk-icp` can analyse the transcript.

## What to decide next

Do not rewrite the founder's page for them without asking. End by naming the decisions,
for example:

- Which contradicted claims will you take down or change first?
- Do you want to collect the evidence for "saves 5 hours a week", or soften it now?
- Is a competitor's unsupported claim something to challenge in your own marketing, or
  better left alone?

## Plain language

Assume the founder is not technical. No jargon without a short explanation. Say where
the file was saved using the path relative to their project folder.
