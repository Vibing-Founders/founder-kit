# Recommending tools

Point the founder at the tool that helps with their next action. Recommend; never run
another skill yourself. Other plugins may not be installed, so always give the install
command. Recommend at most one or two tools at a time, tied to a specific next action.

If a plugin is missing, the founder first needs the marketplace:

```
/plugin marketplace add Vibing-Founders/founder-kit
```

## Founder Kit

| Tool | Helps with | Stages | Install |
|---|---|---|---|
| `core:fk-setup` | Setting the project up for working with agents (rules, docs folders, settings), and checking an existing project for gaps. Recommend it once when the founder is working in a project folder that has no `.vf-founder-kit/config.yaml` yet, or before they start building | Any; usually first, or before 3 to 4 | `/plugin install core@founder-kit` |
| `founder-coach:fk-strategy` | The big choices: who to serve first, the wedge, 3 to 5 strategic bets with kill criteria, what not to do yet, and choosing between options. Keeps `strategy.md` | 1 to 3 especially; review at any stage | Already in this plugin |
| `customer-research:fk-segments` | Desk research ranking which customer segments to talk to first, ending in who to contact and how | 1 to 2 | `/plugin install customer-research@founder-kit` |
| `customer-research:fk-icp` | Analysing interview transcripts; ideal customer profile, personas, who not to sell to, what to ask next | 2 onwards | `/plugin install customer-research@founder-kit` |
| `customer-research:fk-competitors` | Who else solves the problem, including spreadsheets and doing nothing; where a small team can win | 1 to 3 | `/plugin install customer-research@founder-kit` |
| `customer-research:fk-fact-check` | Checking claims on a landing page or pitch before using them; checking research | 3, and any research | `/plugin install customer-research@founder-kit` |
| `compliance:fk-supabase-rls` | A read-only check that row-level security in a Supabase app protects customer data | 4 onwards, any app on Supabase | `/plugin install compliance@founder-kit` |
| `compliance` (`fk-gdpr`, `fk-online-safety`, `fk-application-security`, `fk-dpia`) | Data protection, online safety and security obligations. Informational, not legal advice | Founder operations track, usually from 3 or 4 | `/plugin install compliance@founder-kit` |
| `site-delivery` (`fk-onboard`, `fk-orchestrate`) | Landing pages and website changes for founders who do not code, from a plain brief to a pull request | 3 to 4 | `/plugin install site-delivery@founder-kit` |
| `agent-delivery` (`fk-onboard`, `fk-dispatch`) | Handing planned tickets to cloud agents, for founders with a codebase and a ticket tracker | 4 onwards | `/plugin install agent-delivery@founder-kit` |

## From other marketplaces

**`interview-script`** in `pm-product-discovery`, from [pm-skills](https://github.com/phuryn/pm-skills)
by Paweł Huryn (free, MIT). Prepares a customer interview. Use it for stage 2 interview
preparation, feeding in the research gaps from `fk-icp` if there are any. Tell the founder
to drop its hypothetical questions ("If you could wave a magic wand…"): answers to them are
weak evidence. "Tell me about the last time…" questions are better.

```
/plugin marketplace add phuryn/pm-skills
/plugin install pm-product-discovery@pm-skills
```

**`strategy-red-team`** in `pm-execution`, from pm-skills. Attacks a plan's load-bearing
assumptions and returns the cheapest test and a kill criterion for each. Use it for a deeper
adversarial pass once `fk-strategy` has a finished `strategy.md`.

**`opportunity-solution-tree`** in `pm-product-discovery`, from pm-skills. Maps opportunities
to solutions and experiments. Use it once the wedge is chosen and the founder is weighing
several ways to solve the problem (stages 2 to 4).

```
/plugin marketplace add phuryn/pm-skills
/plugin install pm-execution@pm-skills
/plugin install pm-product-discovery@pm-skills
```

## By next action

- **"Who should I talk to first?"** → `fk-segments`, then `interview-script` to prepare.
- **"Which segment / what's our wedge / what's our strategy / should we do X or Y?"** →
  `fk-strategy`; then `strategy-red-team` for a deeper stress test.
- **"I need to talk to customers"** → `interview-script` to prepare, then `fk-icp` with
  the transcript.
- **"I've done interviews, what do they tell me?"** → `fk-icp`.
- **"Who else does this?"** → `fk-competitors`.
- **"I need a landing page to test the offer"** → `site-delivery`, then `fk-fact-check` on
  the copy.
- **"Do I need a privacy policy / what about children's data?"** → `compliance`.
- **"Is my Supabase data safe?"** → `fk-supabase-rls`.
- **"I have tickets and want agents to build them"** → `agent-delivery`.

No tool fits? Say so, and coach the next action directly. Never invent a tool.
