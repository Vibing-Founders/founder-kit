# The prompt contract

The sandbox starts with **zero conversational context**. It has the connectors a local session has,
but nothing you know. Everything it needs to act correctly has to be in the prompt or reachable
from it.

Two rules govern everything below: **the prompt is self-contained**, and **the prompt never carries
a secret value**.

## What the prompt must carry

| # | Element | Why it cannot be left out |
|---|---|---|
| 1 | **Ticket identifier, title, and full body** | The run cannot resolve an identifier you paraphrased |
| 2 | **Every comment carrying an instruction** | A comment routinely amends or contradicts the body. A prompt built from the body alone dispatches the wrong work, confidently |
| 3 | **The resolved stage and the skill to invoke**, with the fallback in §"Naming the skill" | Without it the run picks its own approach |
| 4 | **The deliverable** — what "done" looks like for this stage | A plan stage that starts implementing is a wasted run, and vice versa |
| 5 | **The branch name**, composed by the dispatcher | Two runs choosing their own names collide; a name without the ticket id cannot be traced back |
| 6 | **The runbook pointer**, with the fetch fallback | See below |
| 7 | **The repository's own instruction file**, named — "read `CLAUDE.md` at the root first; it is authoritative where it says more than the runbook" | The runbook is generic; the repository's rules are not |
| 8 | **The risk brakes** from `risk_brakes` | The run has to know where to halt before it gets there |
| 9 | **At the database tier:** that the environment provides the management token, the production project reference, and the forwarded secret set — **by variable name** — and that the runbook's choreography governs | The run needs to know the variables exist and what they are for. It does not need their values, and must not receive them |
| 10 | **The close-out steps that are enabled**, and their targets | A step not named is off. See `close-out.md` |
| 11 | **The pull request title convention and any commit trailer** the repository requires | Cheap to state, annoying to fix afterwards |

## What the prompt must never carry

- **Any secret value.** Not a token, not a key, not a password, not a webhook secret. The
  environment carries values; the prompt carries names. A prompt is stored, logged, and readable
  wherever the run is visible.
- **A guessed ticket identifier.** If you could not fetch the ticket, stop.
- **A claim you have not verified.** In particular, never assert that a connector or tool is
  absent — the run inherits the full connector set, and a prompt asserting otherwise has told it
  something false about its own environment. That was learned the expensive way: a run told its
  tracker access was unavailable duly skipped the ticket housekeeping it was supposed to do.

## Naming the skill, with a fallback

The environment's setup script installs this plugin before the agent starts, so invocation is the
live primary path. Write the instruction so a registry failure degrades instead of derailing:

> Invoke the `<skill name>` skill and follow it. If skill invocation is unavailable, find its
> `SKILL.md` on disk and follow the file directly.

## The runbook pointer

Same shape, and it matters more, because the runbook carries the knowledge the prompt is too small
to hold:

> Follow the `agent-delivery` plugin's sandbox runbook. Invoke the `agent-delivery:dispatch`
> skill's runbook, or read
> `plugins/agent-delivery/skills/_shared/sandbox-runbook.md` from the installed plugin. **If skill
> invocation is unavailable**, fetch it and follow it:
> `curl -sSL https://raw.githubusercontent.com/Vibing-Founders/founder-kit/main/plugins/agent-delivery/skills/_shared/sandbox-runbook.md`
> **Do not install the plugin mid-run and retry the invocation.**

That last sentence is load-bearing. Whether a mid-session plugin install becomes invocable in the
same session is unverified, and a failed retry leaves the run with nowhere to go — where the fetch
always has somewhere to go.

## Size

The firing mechanism's input has a size cap well below a full instruction set. That cap is the
reason the runbook is **referenced rather than inlined**, and the reason this contract is a list of
what must be present rather than a template to pad out.

Confirm the actual cap on first use with a real project and record it here.

> **Measured cap:** not yet recorded. Establish it during the first live dispatch and write the
> number in this line.

If a prompt approaches the cap, cut in this order: the ticket body's non-instructive prose first,
then quoted code, then comments that carry no instruction. **Never cut** the stage, the deliverable,
the branch name, the risk brakes, or the runbook pointer.
