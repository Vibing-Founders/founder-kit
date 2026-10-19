---
name: fk-supabase-rls
description: >
  Checks whether a Supabase-backed app's row-level security (RLS) actually protects its customers'
  data, and explains the answer in plain language a non-coder can act on. Reads the policies (from
  a connected Supabase MCP server in read-only use, or from the migration files in the repo), finds
  every Supabase query in the code, compares what each query needs with what the policies allow,
  and writes a ranked report with the exact SQL fix for each finding. Read-only: it never changes a
  database. Use this skill whenever someone has an app on Supabase (including apps built with
  Lovable, Bolt, v0 or by hand) and asks whether their data is safe, even if they never say "RLS".
  Triggers on: "check my Supabase security", "is my database secure", "check my RLS policies",
  "can anyone read my data", "row level security", "I built this with Lovable, is my data safe?",
  "audit my Supabase policies", "is my anon key safe", "can users see each other's data",
  "review my Supabase policies", "/compliance:fk-supabase-rls".
---

# Supabase RLS Check

Weak or missing row-level security is the most common way apps built on Supabase leak customer
data. The anon key ships in the browser by design, so the only thing standing between a stranger
with the browser's developer tools and a table is that table's RLS policies. A founder who does
not code cannot tell from the dashboard whether those policies are tight. This skill tells them.

Write for a founder who may never have read SQL: plain language first, technical detail in an
appendix for whoever applies the fixes. Calm and direct: a finding is a thing to fix, not a
catastrophe. But when personal data is exposed to anyone on the internet, say so plainly and first.

## Read-only, always

This skill **never changes a database**. That means no migrations applied, no DDL or DML run, no
policies edited through any tool, and no `supabase db push`, `supabase migration up`, `psql`
writes or MCP `apply_migration` / `execute_sql` calls that write. It also does not add fix files to
`supabase/migrations/` or edit the founder's code: the fixes go **in the report**, as SQL, for a
human to review and apply. The reason: a policy change can lock real users out of a live app, or
open it wider, and the founder (or their builder) has to own that change and test it.

If the founder asks you to "just fix it", explain this in a sentence. Lead with the reason, not
with whether you happen to have database access: the answer would be the same if you did. Give
them the SQL in the report ready to hand to their builder or paste into the Supabase SQL editor
themselves, and tell them how to check it worked (see `references/report-format.md`).

Where a Supabase MCP server is connected, use only its read operations, and suggest the founder
run it in read-only mode (for example the `--read-only` flag, or `read_only=true` in its URL).
Any SQL you run to inspect policies is a `select` against catalog views such as `pg_policies`,
`pg_class` (`relrowsecurity`), `information_schema.role_table_grants` and `pg_proc`. The queries
are in `references/inspect-live.md`. Never select rows from the founder's own tables: you are
checking who *could* read the data, not reading it.

Say in the report that the check was read-only and that nothing was changed.

## The steps

### 1. Get the policies

- **A Supabase MCP server is connected:** run its security advisor or linter first if it has one
  (for example `get_advisors` with type `security`); it catches tables with RLS disabled,
  `security definer` views and exposed functions. Then follow `references/inspect-live.md` to list
  every table in the exposed schemas (normally `public`), whether RLS is enabled, and every policy:
  table, command (`select` / `insert` / `update` / `delete` / `all`), roles (`anon`,
  `authenticated`, `public`), `using` and `with check`. Also views, `security definer` functions
  and storage policies.
- **No database access:** rebuild the same picture from the migration files
  (`supabase/migrations/*.sql`, plus `supabase/schema.sql`, `supabase/seed.sql` or similar),
  applying them in filename order, so a later `drop policy` or `alter table … disable row level
  security` wins. Say clearly in the report that **the live database may differ**: policies edited
  in the dashboard never appear in migrations. List what could not be verified (tables, functions,
  buckets or policies the code uses that the migrations never create).

Tables created with `create table` in SQL have RLS **off** until `alter table … enable row level
security` runs. Tables made in the Supabase dashboard's table editor usually have it on. So an
exposed table with no `enable row level security` in the migrations is a finding, and if you
cannot see the live database, say so in the finding.

### 2. Find every Supabase query in the code

Search the code (skip `node_modules`, build output and lock files) for:

- `.from('…')` followed by `.select`, `.insert`, `.update`, `.upsert`, `.delete`
- `.rpc('…')`
- `.storage.from('…')` (bucket uploads, downloads, `getPublicUrl`, `list`)
- edge functions (`supabase/functions/**`) and server routes
- `createClient(` calls, to work out which client each query uses

For each client, decide whether it is the **anon client** (anon or publishable key; runs in the
browser; subject to RLS) or a **service-role client** (service role or secret key; bypasses RLS
entirely; must only ever run on a server). A service-role key reachable from browser code is
itself a critical finding: anyone can lift it from the bundle and read or change every table.
Watch for env vars with a public prefix (`VITE_`, `NEXT_PUBLIC_`, `EXPO_PUBLIC_`,
`PUBLIC_`): the build copies those into the browser.

### 3. Work out what each query needs

For each query: which table, which operation, which rows (only the user's own? their
organisation's? public rows?), which columns, and whether the user is logged in at that point in
the app. Keep it short; this becomes the query inventory in the appendix.

### 4. Compare

For each table and operation, check the policies against what the queries need. Look for:

- RLS disabled on an exposed table (critical when it holds personal or business data);
- policies that allow more than any query needs: `using (true)` for `anon` or `authenticated`,
  no `auth.uid()` ownership check, an `insert` or `update` whose `with check` does not tie the row
  to the user (so users can write rows as someone else), no tenant check in a multi-tenant app;
- legitimate operations with no policy (the feature fails for users);
- public access that should be restricted; admin operations without a role check;
- views and `security definer` functions that bypass RLS;
- over-fetching: `select('*')` returning columns the page never shows, such as emails.

`references/policy-patterns.md` has each pattern, how to spot it, and the fix as SQL. Read it
before writing findings. Do not invent findings: if a table is properly protected, say so. A
well-secured app should get a short report that says it is well secured.

### 5. Report

Follow `references/report-format.md` exactly. In order:

1. the plain-language summary (the worst thing first, in one or two sentences);
2. the read-only statement and where the policies came from (live database or migrations);
3. findings, ranked **critical / high / medium / low**, using the same severity meanings as
   `fk-application-security` (see `../fk-application-security/assess.md`, "Severity guidance");
4. personal data and GDPR, when any finding exposes personal data;
5. what could not be verified;
6. the technical appendix: policy inventory per table, query inventory per table and operation;
7. the disclaimer.

Each finding says what is wrong in one sentence, who could exploit it (anyone / any logged-in user
/ another tenant), what data is at risk, the evidence (policy text, and file and line of the
query), and **the exact fix** as SQL.

## Personal data and GDPR

When a finding exposes personal data (names, emails, phone numbers, addresses, health details,
payment details, anything about a person), say so in the finding. Then, once, in the report's
GDPR section: under UK and EU GDPR an exposure like this may be a personal data breach, which the
founder has to assess and, if it is likely to risk people's rights and freedoms, report to the
regulator (the ICO in the UK) within 72 hours of becoming aware of it. Fixing the policy does not
by itself answer whether data was already accessed. Point to the `fk-gdpr` skill and to
`../_shared/legislation/uk-gdpr.md` and `../_shared/legislation/eu-gdpr.md` (Articles 33 and 34)
rather than restating the law.

Map access-control findings to OWASP **A01:2021 Broken Access Control**, and a leaked service-role
key also to A05:2021 Security Misconfiguration (see
`../fk-application-security/knowledge/owasp-top-10.md`).

## Where the report goes

Save the report as `supabase-rls-<yyyy-mm-dd>.md` in the compliance folder, which is
`docs/compliance/` by default. Work the folder out with `../_shared/docs-location.md` (it follows
`.vf-founder-kit/config.yaml`). Tell the founder the path. Give them the summary and the
critical and high findings in your reply as well, so they do not have to open the file to know
whether to worry.

## Reference files

| File | When to read |
|---|---|
| `references/policy-patterns.md` | Always, before writing findings: bad and good policies and the fix for each |
| `references/report-format.md` | Always, before writing the report |
| `references/inspect-live.md` | When a Supabase MCP server or other read-only database access is available |
| `../_shared/docs-location.md` | Before saving the report |
| `../fk-application-security/assess.md` | For the severity definitions |

The output is informational only. It is not legal advice, not security advice and not a
penetration test. Keep the disclaimer in `references/report-format.md` in every report.
