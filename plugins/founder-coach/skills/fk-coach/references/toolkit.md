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
| `customer-research:fk-icp` | Analysing interview transcripts; ideal customer profile, personas, who not to sell to, what to ask next | 2 onwards | `/plugin install customer-research@founder-kit` |
| `customer-research:fk-competitors` | Who else solves the problem, including spreadsheets and doing nothing; where a small team can win | 1 to 3 | `/plugin install customer-research@founder-kit` |
| `customer-research:fk-fact-check` | Checking claims on a landing page or pitch before using them; checking research | 3, and any research | `/plugin install customer-research@founder-kit` |
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

## By next action

- **"I need to talk to customers"** → `interview-script` to prepare, then `fk-icp` with
  the transcript.
- **"I've done interviews, what do they tell me?"** → `fk-icp`.
- **"Who else does this?"** → `fk-competitors`.
- **"I need a landing page to test the offer"** → `site-delivery`, then `fk-fact-check` on
  the copy.
- **"Do I need a privacy policy / what about children's data?"** → `compliance`.
- **"I have tickets and want agents to build them"** → `agent-delivery`.

No tool fits? Say so, and coach the next action directly. Never invent a tool.
