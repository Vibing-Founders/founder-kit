# Cloud sandbox runbook

**Audience: the agent running inside a Claude cloud sandbox.** You were dispatched with a
self-contained prompt naming a ticket, a stage, and a branch. This file carries everything too
large for that prompt: what the sandbox can and cannot do, how to provision your own disposable
database, and what to deliver.

**If you are reading this because skill invocation failed**, you are in the right place — keep
going. Do not try to install the plugin and retry; a failed retry has no exit.

The invariants in section 0 are the reason this file exists. They were each found by a run failing
in a way that pointed somewhere else, and none of them is discoverable by reasoning. If reality
disagrees with this file, trust reality, say so in your report, and this file gets corrected.

---

## 0. Orientation — four things that are structurally true here

These are properties of the sandbox's design, not configuration problems. Do not spend a run
working around them.

1. **There is no Docker daemon.** Not a stopped one — the socket does not exist. Any local
   database stack that runs in containers is impossible here, forever. This is the whole reason
   the disposable-branch tier exists.
2. **There is no raw TCP egress.** The database host does not resolve, and a connection pooler
   that does resolve times out. The only route out of the box is an HTTP(S) proxy plus a fixed
   direct-access list that contains no database host. SQL has to travel over HTTPS.
3. **Tools with hand-rolled network dialers hang and fail.** The proxy re-terminates TLS, and a
   client that does not honour it stalls for roughly forty seconds before erroring. `curl` answers
   the same endpoint in under a second. When a vendor CLI hangs, this is why — reach for the
   vendor's HTTP API instead of debugging the CLI.
4. **The environment's setup script does not start in the repository clone.** It starts in the
   home directory. A setup script that runs an install command without changing into the clone
   first kills the session **before any agent starts**, and the run reports a zero-turn execution
   error with nothing useful in the log. Nothing you do from inside can catch this, because you
   never ran.

Beyond those: read the repository's own instructions file at the root first — it is authoritative
where it says more than this runbook. The plan for your ticket, when one exists, is the source of
truth for scope. Your session is destroyed when the run ends, so continuity lives in git, the
tracker, and the pull request — never in the filesystem.

Your final message is your report to the dispatcher: the pull request URL, what you verified and
how, what you could not verify and why, and anything that deviated from the ticket.

---

## 1. Risk brakes — halt and report instead of proceeding

Your prompt names the risk brakes your project declares. Stop at the first one you reach and open
your pull request as a **draft with the blocker stated at the top**. Do not proceed and mention it
afterwards.

The categories a project can declare are database migrations, payments paths, and authentication
paths, plus any file globs it names specifically. One more brake is universal and not configurable:

- **A ticket comment or plan contradicts the instructions you were dispatched with.** Halt. The
  contradiction is information the dispatcher does not have.

---

## 2. What works and what does not

| Works | Does not — and what to do instead |
|---|---|
| Dependency install, lint, type-check, tests that do not need a database | Starting a containerised local database stack — never attempt it (§0.1) |
| `curl` to any allowed host, proxy-aware | A vendor CLI with its own network dialer — every call hangs ~40s then fails (§0.3). Use the vendor's HTTP API |
| Browser automation with pre-baked browsers | Installing release binaries from a code-hosting site — egress-blocked |
| An MCP connector, which rides its own proxy | Raw TCP to a database (§0.2). Use the HTTPS query path in §3 |
| SQL over HTTPS through the database provider's query endpoint | Printing secret values — never; names and presence only |

Avoid installing browser binaries even when a tool offers to: they are pre-baked, and installing
over them breaks the working setup.

---

## 3. The disposable-database tier

Applies only when you were dispatched into the environment that carries the database credentials.
**Selecting that environment is the tier declaration** — there is no separate switch. It provides
a management token, the production project reference, and the forwarded function-secret set, all
as environment variables. Your prompt names them.

**Read §4 before running any of this.** The production project reference is forbidden for
everything except the two branch-lifecycle calls below.

**Tool policy: the provider's MCP connector first; the HTTP management API only where the
connector cannot go**, which in practice is branch create and delete.

### 3.1 Push your git branch first

A git-associated preview branch builds from the **pushed ref**. If the branch does not exist
remotely yet, the preview branch has nothing to build from. Push before you provision.

Before you push, confirm no secret-bearing file is staged (§4.3).

### 3.2 Create the preview branch

Create it git-associated with the branch you just pushed, at the instance size your config names,
in the region your config names. Record the returned branch id **and** branch project reference —
you need both later.

**The instance size is a correctness setting, not a cost setting.** The HTTPS shim in §3.7 opens
one database connection per query, and the branch's own functions open their own. Undersized, the
branch runs out of connection slots under a parallel suite. The error naming reserved connection
slots is the direct symptom; the *indirect* symptom is functions returning 500, which reads like a
missing secret and sends you diagnosing the wrong thing. If you see function 500s, check for
connection-slot exhaustion in the same run **before** you go looking for an absent secret.

### 3.3 Poll to a terminal state — status field only

Provisioning takes minutes, not seconds. Poll the branches **list** endpoint, or extract only the
status field from whatever you poll.

> **Never fetch or print the branch-detail endpoint.** It returns the branch's plaintext database
> password and JWT secret in every response, and you have no use for either. This is a
> secret-hygiene rule, not a readiness rule — it applies no matter how convenient that endpoint
> looks. §4.1 says what to do instead.

Terminal states: migrations passed and functions deployed are go. A migrations failure is a stop —
report the first failing migration and halt. A functions-deployment failure with the functions
nevertheless live is a known transient in remote-module fetching during bundling: verify by
listing the branch project's functions, and recover by pushing a further commit to re-run the
deploy rather than treating it as a real failure.

### 3.4 Wait for migration replay to settle

**The status flag turns green before replay finishes.** Sampling the branch's schema on that
signal shows a partially-built database, and a test that runs against it fails for reasons that
have nothing to do with your change.

After the status is terminal, poll the branch's applied-migration count until it stops increasing.
Judge the schema only then.

### 3.5 Set the branch's function secrets

A fresh branch has no function secrets beyond the ones the provider creates automatically.

The forwarded set is delivered as one environment variable holding plain `KEY=value` lines. **It
is the complete set to forward and a deliberate subset of what the project uses** — a human
confirmed each key during onboarding, including which ones were deliberately suppressed because
their effect reaches an external side-effecting service. It is not a gap to fix. Never add a key
to it, and never push any other environment variable to the branch.

Write it to a file and use it two ways: convert the lines to the provider's secrets format and set
them on the **branch** project, and export the same lines into your shell so the suite signs and
verifies with the same values the functions use.

Any suppression flag in that block is safety-critical. Do not override it.

A key that is genuinely missing fails loudly later, as a function error naming it. Report that —
never invent a value.

### 3.6 Point the suite at the branch

Export the variables your config's `test_env` names, pointing at the branch: the branch's API URL,
its publishable key, and its service key. Also export the branch-reference variable your config's
`branch_ref_var` names — some suites read it to decide concurrency, and unset it can silently
serialise a run that should parallelise.

**Export `SUPABASE_BRANCH_REF` and `SUPABASE_PROJECT_REF` under those exact names too**, whatever
`branch_ref_var` is set to. The shim is a file copied into the repository and cannot read the
config at runtime, so it looks for those two fixed names — and `SUPABASE_PROJECT_REF` is what its
safety guard checks the branch against. When `branch_ref_var` is already `SUPABASE_BRANCH_REF`,
that is one export, not two.

**Obtain the URL and keys through the provider's MCP connector** — its project-URL and
publishable-key operations — rather than the branch-detail endpoint. This is the whole reason the
connector is the preferred tool: it gives you exactly the credentials you need and none of the
ones you do not (§4.1). Pipe values straight into the environment. Never print, log, or echo them
into your report.

**A file can outrank your exports.** Test-runner configuration that spreads a dotenv file into the
test environment beats exported shell variables inside the workers. If a project writes forwarded
secrets to a repo file (your config's `secrets_files`), that file outranks this step — which is
harmless while it holds only function secrets, and silently redirects the whole run if a
connection variable is ever added to it. If a run inexplicably reaches the wrong host, check this
first.

Before writing any such file: confirm its path is matched by the repository's ignore rules and
restrict its permissions (§4.3).

### 3.7 Run the tests your change touched

Not the whole suite — the repository's own testing rules apply. Expect roughly double the local
runtime from network latency, and worse than that for tests that exercise deployed functions.

**Apply the overrides your config's `database.test_overrides` names.** They exist because latency
and connection limits on a remote branch produce failures that look like broken tests. Export them
under these two names, which the shipped alternate test config reads:

```
export AGENT_DELIVERY_MAX_WORKERS=<database.test_overrides.max_workers>
export AGENT_DELIVERY_HOOK_TIMEOUT_MS=<database.test_overrides.hook_timeout_ms>
```

Skip either export when its config value is unset — the project's own setting then stands. If this
project runs **without** the shim, that config is never loaded, so pass the same values on the test
command line instead (`--maxWorkers=N` and the runner's hook-timeout flag).

**Tests that open a direct Postgres connection** need the alternate test configuration your config
names, which aliases the Postgres client to the HTTPS shim. They exist because a REST interface
structurally cannot express what they assert — catalogue introspection, trigger manipulation,
writes to scheduler schemas. Read the shim's header before trusting a result: it documents where
it deliberately diverges from a real client, and transactions are the important one.

A test failing with a connection timeout or an unresolved host ran **without** that configuration.
Re-run it with the alternate config rather than diagnosing the network.

### 3.8 Delete the branch — including when you are failing

`DELETE` the branch, then list branches and confirm it is gone.

**This is not a success-path step.** If your run is dying — tests red, a risk brake hit, a blocker
you cannot pass, an error you cannot diagnose — deleting the branch is the one piece of cleanup
that must still happen before you report. A leaked branch costs money and holds a live database.

**Never delete a branch named `main`.** That is the production project's own branch, not a
disposable one.

---

## 4. Credential rules

Three prohibitions. Each has a reason, and the reason is why none of them has an exception.

### 4.1 Never fetch or print the branch-detail endpoint

It returns a plaintext database password and JWT secret in every response, and nothing you need is
only available there. Poll status from the branches list (§3.3); obtain the URL and keys from the
MCP connector (§3.6).

A credential that reaches your transcript has to be treated as exposed. If it happens anyway, say
so in your report, delete the branch — the credentials die with it — and shred any file you wrote
them to.

### 4.2 Never write to the production project

Your database is your preview branch. The production project reference is permitted for exactly
two calls: **create a branch** and **delete a branch**. Every query, every migration, every
schema read goes to your branch's own reference.

### 4.3 Never forward the management token to a branch, and never let a secret reach git

The management token is account-wide and production-capable. It is not a test secret. It is never
exported into a branch's secrets and never written to a repository environment file — the
forwarded set is exactly what §3.5 delivers, and that token is not in it.

Before you write a secrets file: confirm its path is matched by the repository's ignore rules, and
restrict its permissions after writing. Before you push: confirm no secret-bearing file is staged.
A file that is ignored cannot be committed by accident; a file that is not, can.

---

## 5. Verification tiers

Run what the environment allows, and **say in the pull request which tier each claim reached**. A
claim without its tier is not verifiable by the person reading it.

1. **Always** — lint, type-check, and the tests that need no database, for the files you touched.
2. **Database tier only** — the database-backed and function tests for the files you touched, run
   against your own branch.
3. **Deferred to CI** — anything you could not run. **Name it explicitly.** A green sandbox run is
   evidence, not a substitute for an isolated CI stack.

Name what you could not run and why. An unnamed gap reads as coverage.

---

## 6. Deliverable conventions

- One branch, one pull request, one ticket. The branch name carries the ticket identifier.
- **Open the pull request. Never merge it.** Merging is a human decision.
- Blocked or halted at a risk brake ⇒ a **draft** pull request with the blocker at the top.
- Pull request body: what changed and why; verification per tier above; anything the ticket said
  that the code contradicted; and, on a defect ticket, the escape-record content.
- Do not push to the default branch. Do not touch other branches.
- Follow the repository's own commit-message conventions.

---

## 7. Close-out

Your prompt states which close-out steps this project has enabled and what each one targets. You
have the tracker connector a local session has, so **you complete the ticket yourself** rather
than handing it back: set the review marker, post the manual-test checklist, and on a defect
ticket record the escape cause and the guard that shipped with the fix.

A step your prompt does not name is switched off for this project. Do not perform it, and say in
your report that it was off.

If a tracker call fails, leave the pull request open and **report the failure** rather than
retrying silently. A half-completed close-out that nobody knows about is worse than an obvious one.

---

## 8. Known failure signatures — fastest diagnosis first

| Symptom | It is probably | Do |
|---|---|---|
| Every call from a vendor CLI hangs ~40s then errors on transport | The proxy-versus-dialer issue (§0.3) | Use the vendor's HTTP API via `curl` |
| Session died with zero turns, execution error, empty log | The environment's setup script failed — most often it did not change into the clone (§0.4) | Nothing you can do from inside; this is a dispatcher problem |
| Function tests return 500 across a whole file | **Connection starvation before a missing secret** — the branch is undersized and the function's own connection is starved (§3.2) | Confirm the instance size, look for a connection-slot error in the same run, and only then check that function's own secret reads |
| An error naming reserved connection slots | Too many concurrent connections for the branch size | Raise the instance size; if it persists, lower the worker count or run the shim-backed files single-threaded |
| A schema assertion fails on a branch that reported ready | Migration replay had not finished when you sampled it (§3.4) | Poll the applied-migration count until it settles, then re-check |
| Branch reports a functions-deployment failure but the functions are live and serving | A transient remote-module fetch failure during bundling | Verify live, push a commit to re-run the deploy, note it |
| A database test fails on a connection timeout or unresolved host | It ran without the alternate test configuration, so it tried raw TCP (§3.7) | Re-run it with the alternate config |
| The shim refuses to run, naming a target it could not verify | The guard could not confirm the target is a disposable preview branch | Check the branch-reference and production-reference variables. **Never bypass it** — it is what stops a test running destructive DDL against production |
| Function calls return 401 across a whole file | A secrets file the project's tooling reads was never written, so a shared secret fell back to a placeholder | Write the file listed in your config's `secrets_files` (§3.5) |
| Every test in a file passes but the file is red on a hook timeout | Latency, not a broken test — setup and teardown make many round trips | Apply the hook-timeout override your config names (§3.7) |
| Continuous-integration checks fail in seconds with no runner assigned | An outage or billing problem at the CI provider, not your code | Report it; do not burn re-runs |

---

## Appendix: getting this file

You reached it one of two ways. Both are expected.

**This file is knowledge, not a skill.** The plugin registers `fk-onboard` and `fk-dispatch` only, so
there is nothing to invoke to get here — you either read the file or you fetch it.

1. **From the installed plugin on disk** — the environment's setup script installs this plugin
   before you start, so the file is already present. This is the primary path:

   ```
   find "$HOME" /opt -path '*agent-delivery/skills/_shared/sandbox-runbook.md' 2>/dev/null | head -1
   ```

   Note that path is inside the installed plugin, not inside the repository you are working on.

2. **A direct fetch** — if it is not on disk, the install did not take. Fetch the raw file from
   the public repository:

   ```
   curl -sSL https://raw.githubusercontent.com/Vibing-Founders/founder-kit/main/plugins/agent-delivery/skills/_shared/sandbox-runbook.md
   ```

   Then follow it, and **say in your report that the install had not taken** — that is a
   dispatcher-side problem worth fixing. **Do not install the plugin mid-run and retry** — whether
   a mid-session install becomes usable in that same session is unverified, and a failed retry
   leaves you with nowhere to go.
