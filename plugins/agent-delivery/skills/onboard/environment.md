# Phase 3 — the cloud environment

The cloud environment is a form on a hosted service with two fields: environment variables in
`.env` format, and a bash setup script that runs before the agent starts. **No skill can fill this
in.** What this phase does is generate both fields exactly, so the human pastes rather than
composes — and walks them through the one decision that must not be automated.

Work through 1 → 5 in order. Step 2 gates step 3.

---

## 1. Establish what the environment must carry

Read the config written in phase 2.

| Variable | Needed when | What it is |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | `database.enabled` | Management token. Creates and deletes branches. **Account-wide and production-capable** — see §5 |
| `SUPABASE_PROJECT_REF` | `database.enabled` | The production project's reference. Forbidden to the run except for branch create and delete |
| `BRANCH_FUNCTION_SECRETS` | `database.enabled` and the project has deployed functions | The forwarded secret set, as plain `KEY=value` lines. **Step 2 decides its contents** |
| A tracker credential | Always | Whatever the tracker adapter needs, at the scope phase 1 recorded. The GitHub adapter needs `project` scope, which is **not** in a default login |

If `database.enabled` is false, only the tracker credential applies and this phase is short.

---

## 2. Confirm the forwarded secret set — the step that must not be automated

A disposable preview branch starts with no function secrets beyond the ones the provider creates.
Anything the project's functions need has to be forwarded. **Forwarding the wrong key means an
automated run, in a disposable environment, reaching a real external service.**

So the set is proposed by this skill and **confirmed by a human, key by key**.

### 2a. Collect the candidates

Grep the functions directory for environment reads (`Deno.env.get`, `process.env`, or the
platform's equivalent) and collect every distinct key name. Include keys read from shared modules
the functions import — those are easy to miss and fail loudly later.

### 2b. Classify each one

| Class | Meaning | Default proposal |
|---|---|---|
| **Inert** | Its effect stays inside the branch — internal shared secrets, feature flags, non-privileged configuration | Forward |
| **Side-effecting** | Its effect reaches an external service that does something in the real world: **mail, payments, SMS, push, storage, anything that charges or contacts a person** | Do not forward, or forward alongside a suppression flag |
| **Suppressible** | A flag the project already has that turns a side-effecting path into a no-op | Forward, set to its suppressing value, and mark it safety-critical |
| **Unused by tests** | Read by functions the test suite never exercises | Omit |

The last class is the common case and the one people get wrong in both directions. A project's
functions typically read far more keys than its tests exercise. **The gap is not a bug.** Do not
propose the full set for completeness.

### 2c. Present and record

Show the human a table of every candidate: key, class, proposed action, and the reason. For every
side-effecting key, state explicitly what it would reach if forwarded unsuppressed.

**Record the decision taken for each key** — forwarded, forwarded-with-suppression, or omitted —
in the onboarding report. That record is what makes the set auditable later, and what stops the
next person "fixing" a deliberate omission.

Only after the human has confirmed do you generate the block in step 3.

> A suppression flag in the forwarded set is safety-critical. It goes in the generated block with a
> comment saying so, and the runbook tells the run never to override it.

---

## 3. Generate the variable block

Emit `.env`-format lines, **key names with empty or placeholder values**. Never a real value —
this file is generated into a chat, and the form's stored values are visible to anyone with access
to the environment.

```
# Paste into the cloud environment's "Environment variables" field.
# Fill in each value from your provider's dashboard. Do not commit this anywhere.

SUPABASE_ACCESS_TOKEN=
SUPABASE_PROJECT_REF=

# Forwarded function secrets, confirmed <date>. Plain KEY=value lines, no quoting,
# no comments inside the value. This is the COMPLETE set to forward.
# SUPPRESS_EMAIL is safety-critical: it makes the mail path a no-op. Do not remove it.
BRANCH_FUNCTION_SECRETS="SUPPRESS_EMAIL=true
INTERNAL_API_SECRET=
STRIPE_WEBHOOK_SECRET="
```

Adapt the contents to what step 2 confirmed. The keys shown above are illustrative — a project
with no mail path has no suppression flag, and a project with no functions has no
`BRANCH_FUNCTION_SECRETS` at all.

---

## 4. Generate the setup script

**The first executable line changes into the clone.** The setup script starts in the home
directory, not the repository. An install command that runs before that `cd` kills the session
before the agent starts, and the run reports a zero-turn execution error with an empty log — the
agent never ran, so no prompt instruction can catch it.

Generate this, substituting `repo.clone_dir`, `repo.install`, and `repo.post_install`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# The setup script starts in the home directory, NOT the repository clone.
# This cd must come before anything else, or the session dies with zero turns
# and an empty log.
cd "$HOME/<clone_dir>"

<install command>
<each post_install command>

# Install the runbook so the run can invoke the skill rather than fetching the
# file. The fetch fallback still exists, but this is what makes it a fallback.
claude plugin marketplace add Vibing-Founders/founder-kit
claude plugin install agent-delivery@founder-kit -y
```

Two things to say when you hand it over:

- The plugin install is what makes skill invocation the **primary** path. Without it the run falls
  back to fetching the runbook over HTTPS on every dispatch — which works, but means a network
  failure at the wrong moment costs a run.
- If the install command needs a flag the project's CI uses, it is already in `repo.install`. A
  sandbox install that diverges from CI's fails differently and wastes a run.

---

## 5. Hand over — what the human must do

State these plainly, in order, as steps only they can perform. Do not imply the setup is complete
until they confirm.

1. Create the cloud environment, or open the existing one.
2. Paste the variable block into the environment-variables field and **fill in the values**.
3. Paste the setup script into the setup-script field.
4. Record the environment's name and put it in `dispatch.environment` — the environment **is** the
   tier declaration, and dispatch needs its name.
5. Grant the tracker credential its extra scope if phase 1 recorded one (`gh auth refresh -s
   project` for the GitHub adapter).

### What the management token can reach

Say this explicitly rather than burying it:

- The token is **account-wide and production-capable**. It is not a test credential. It can reach
  every project on the account it was minted from.
- The environment form's values are **readable by anyone with access to that environment**. Treat
  the form as unsuitable for any secret you cannot revoke.
- **Mint it on an account holding only the projects this plugin should reach.** That is the only
  control that bounds the blast radius; the plugin's own rules (§4.2 of the runbook) are
  behavioural and bound what a well-behaved run does, not what a compromised token can do.
- **If you suspect a leak:** revoke the token in the provider's dashboard, mint a replacement, and
  paste the new value into the environment form. Runs in flight will fail on their next management
  call, which is the desired outcome. Nothing else needs changing — no config, no repository file.
