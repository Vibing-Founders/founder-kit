# Tracker adapter — Linear

Selected by `tracker.kind: linear`. Implements the three-operation contract defined in
[`../config-schema.md`](../config-schema.md#the-tracker-contract). Nothing outside this file knows
that Linear is involved.

Uses the Linear MCP connector, which is available to a local session and, because a dispatched run
inherits the connector set, inside a sandbox too. Operation names below are the connector's
capabilities; use whichever names your connector exposes for them.

## Configuration this adapter reads

```yaml
tracker:
  kind: linear
  review_marker:
    state: In Review        # workflow state name
```

Linear models the review marker directly as a workflow state, so this adapter needs one config
value where the GitHub one needs three.

## Credential scope

The connector's own authorisation covers all three operations. There is no separate scope to
grant, and no additional entry in the environment block.

---

## Operation 1 — read the brief

Return the title, the description, **and every comment**. A comment can carry an instruction the
description does not; returning the description alone is an incomplete read.

Fetch the issue by its identifier, then list its comments — in most connectors these are two
operations, and a run that performs only the first has a partial brief. Include the issue's labels
and its team, which the next operation needs.

**Defect detection**, which `close_out.defect_record` depends on: the issue's type or label marks
it as a defect. Read it in the same pass.

## Operation 2 — set the review marker

Update the issue's workflow state to the one named by `review_marker.state`.

Two things to know:

1. **Workflow states are per-team.** Resolve the state by name *within the issue's own team*, not
   globally. A workspace can carry several states with the same name belonging to different teams,
   and setting the wrong team's state silently fails or moves the issue nowhere visible.
2. **Match on the state's name, not its type.** Several states share the type that means "in
   review"; the configured name is the contract.

**When the named state does not exist on that team**, report it and leave the issue unchanged. Do
not substitute the nearest state by name or type, and do not fall back to a label or a comment —
the configured target is the contract, and a ticket parked in an unexpected state is worse than one
left alone with a clear message.

## Operation 3 — post a comment

Create a comment on the issue with the given Markdown body. Linear renders Markdown, so a
manual-test checklist posts as checkboxes without conversion.

---

## Adding a third tracker

Copy this file's shape: state the config block it reads, then the three operations, then the
missing-target behaviour. Register the new `kind` in `../config-schema.md`. No file under
`skills/fk-dispatch/` changes.
