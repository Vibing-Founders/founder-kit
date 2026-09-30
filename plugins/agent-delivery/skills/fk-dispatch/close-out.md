# Close-out

What a finished run does to its ticket. The run performs this itself — it has the tracker
connector a local session has, so handing tracker housekeeping back to the dispatcher would be a
step backwards. The dispatcher's job is to name the enabled steps in the prompt and to verify
afterwards.

**This file names no tracker.** Every operation below goes through the three-operation contract in
[`../_shared/config-schema.md`](../_shared/config-schema.md#the-tracker-contract), implemented per
tracker in [`../_shared/trackers/`](../_shared/trackers/). Adding a third tracker changes nothing
here.

## The three steps, in order

| # | Step | Config key | Contract operation |
|---|---|---|---|
| 1 | Set the review marker | `close_out.review_marker` | *set the review marker* |
| 2 | Post the manual-test checklist | `close_out.manual_test_checklist` | *post a comment* |
| 3 | Record the escape cause and the guard — defect tickets only | `close_out.defect_record` | *post a comment* |

Order matters: the marker moves first, so a ticket that reaches a human's review queue is already
carrying the checklist rather than acquiring it a moment later.

**Every step defaults to on.** A step whose key is `false` is not performed, and **the run says in
its report that it was off** — a silently skipped step and a failed step look identical to whoever
reads the ticket afterwards.

With all three off, a run opens a pull request and touches the tracker not at all. That is a
supported configuration, not a degraded one.

## Step 1 — set the review marker

One operation. The target is whatever `tracker.review_marker` names.

**On a missing target** — the configured state, board, field, or option does not exist — report it
and leave the ticket unchanged. Do not substitute a similarly-named one. The adapter files carry
the detail, including the one case that is an addition rather than a substitution: a ticket that is
not yet an item on a configured board is added, then set, with both actions reported.

## Step 2 — post the manual-test checklist

The checklist exists because automated coverage and human confidence are different things. Its
shape is fixed:

1. **What to click, in order.** Concrete steps a person follows without knowing the change: where
   to start, what to do, what they should see. Not "verify the booking flow works" — that is a
   restatement of the ticket, and it tells the reviewer nothing they did not already know.
2. **What automated coverage already exists**, and at which verification tier it ran. This is the
   half people leave out, and it is what stops a reviewer re-testing by hand what the suite already
   proved — and, more importantly, tells them which parts the suite did *not* prove.
3. **What could not be verified in the sandbox, and why.** Carried straight from the run's
   verification tiers. An unnamed gap reads as covered.

Render it as checkboxes. Both trackers render Markdown, so no conversion is needed.

## Step 3 — record the escape, on a defect ticket only

Applies when the tracker reports the ticket as a defect (a label or issue type — the adapter's
brief-read returns it). On any other ticket this step does not apply, and that is not a skip worth
reporting.

Two fields, both about how the defect got out:

- **The escape cause** — not what the bug was, but what let it reach production. The test that did
  not exist, the assertion that was too loose, the path no environment exercised.
- **The guard that shipped with the fix** — the test, assertion, or check added *in the same
  change* that would have caught it. A fix with no guard is worth recording as exactly that, rather
  than leaving the field blank.

**A project with no defect-recording practice sets `close_out.defect_record: false`.** The run then
performs the first two steps and **says it skipped the third** — it does not invent a record
format. An invented format is worse than an absent one: it looks like a practice the project does
not have, and the next person maintains it.

## When a tracker call fails

**Leave the pull request open and report the failure.** Do not retry silently, do not roll back the
steps that succeeded, and do not treat a failed close-out as a failed run — the code is delivered
and the pull request is the deliverable.

Report which steps completed and which did not, so the human finishes the remainder by hand rather
than rediscovering the gap. A half-completed close-out that nobody knows about is the failure worth
avoiding; a half-completed one that is clearly reported is a minor inconvenience.

## What the dispatcher does with this

Two things, and both live in the fk-dispatch skill rather than here:

- **Composing the prompt:** name the enabled steps and their targets. A step not named is off, so
  the run needs no config access to know what to do.
- **Verifying:** read the ticket back through the adapter and confirm the marker and the comments.
  Report what the run claimed and what was confirmed separately — see the fk-dispatch skill's
  verification duty.
