# Report format

Use this structure for every report, in this order. The summary is for the founder; the appendix
is for whoever applies the fixes. Write the summary and findings so a founder who has never read
SQL knows what is wrong, how bad it is and what to hand to their builder.

## Severity

Use the same four levels as `fk-application-security` (`../fk-application-security/assess.md`):

| Level | Meaning here | Example |
|---|---|---|
| **Critical** | Anyone on the internet can read or change personal or business data with no login, or the whole database is open (a service-role key in the browser). Fix before any more traffic. | RLS off on `customers`; `using (true)` for `anon` on `bookings` |
| **High** | Any logged-in user, or another tenant, can read or change data that is not theirs, or act as an admin. Fix before launch. | `profiles` update with no ownership check; reviews insertable in someone else's name |
| **Medium** | A legitimate feature fails because no policy allows it, or a narrow exposure needs specific conditions. Fix next. | The app reads `invoices` and no policy allows it |
| **Low** | Tidy-up and defence in depth. Fix in the backlog. | `select('*')` fetching emails the page never shows; unused policies |

Rank findings by severity, then by how sensitive the data is.

## Template

```markdown
# Supabase data access check: [App name]

**Date:** [yyyy-mm-dd]
**Checked against:** [the live database, read-only, through the Supabase MCP server | the migration
files in this repository (`supabase/migrations/`, N files); the live database was not checked]

## Summary

[One to three sentences, worst first, in plain language. For example: "Anyone on the internet can
read every customer's name, phone number and address from your `customers` table, with no login.
That is the first thing to fix. Two other problems let logged-in users change each other's
bookings." Or, for a well-secured app: "Your tables are protected: each customer can only see and
change their own data, and nothing is open to logged-out visitors. There are two small tidy-ups
below."]

| Critical | High | Medium | Low |
|---|---|---|---|
| N | N | N | N |

**Nothing was changed.** This check is read-only: it did not change your database, apply any
migration or edit your code. Each fix below is SQL for you or your builder to review, test and
apply.

[Only when checked from migrations:] **Your live database may be different.** Policies added or
edited in the Supabase dashboard never appear in migration files. See "What could not be
verified" below.

---

## Findings

### Critical

#### 1. [Plain-language title, e.g. "Anyone can read all your customers' details"]

- **What's wrong:** [one sentence]
- **Who could do this:** [Anyone, no login needed | Any logged-in user | A user of another
  organisation]
- **Data at risk:** [tables and columns, e.g. `customers`: name, email, phone, home address.
  Say "personal data" where it is.]
- **Evidence:** [the policy text or the missing statement, with the migration file; and the query,
  as `src/pages/Customers.tsx:14`]
- **OWASP:** A01:2021 Broken Access Control
- **Fix:**

  ```sql
  [the exact SQL]
  ```

  [One line on anything the fix needs alongside it, e.g. "Add the select policy in the same change,
  or the customers page will show nothing."]

[Repeat per finding, grouped under ### High, ### Medium, ### Low. Omit a heading with no findings.]

---

## Personal data and GDPR

[Only when a finding exposes personal data.] [Findings N and M] expose personal data ([what
kinds]). Under UK and EU GDPR, an exposure like this may be a personal data breach. You need to
assess it, including whether anyone actually accessed the data (your Supabase API logs may show
this), and if it is likely to risk people's rights and freedoms, report it to the regulator (the
ICO in the UK) within 72 hours of becoming aware of it; you may also need to tell the people
affected. Fixing the policy does not answer that question. Run `fk-gdpr` for help, and see
Articles 33 and 34 in the compliance plugin's legislation files.

---

## What could not be verified

- [e.g. "The live database: checked from migrations only."]
- [e.g. "`get_available_slots` is called with `.rpc()` in `src/pages/Book.tsx:22` but is not
  created in any migration, so its definition and permissions are unknown."]
- [e.g. "Storage bucket `pet-photos` is used but not created in migrations, so whether it is public
  is unknown."]

To check these, connect a Supabase MCP server in read-only mode and run this skill again, or ask
your builder to run the queries in the appendix in the Supabase SQL editor.

---

## How to apply and check the fixes

1. Hand this report to your builder, or paste each SQL block into the Supabase SQL editor
   yourself, on a test or branch database first if you have one.
2. If the app is built with an AI app builder, ask it to "add a migration with this SQL" so the
   repository and the live database stay in step.
3. Check: sign in as one test user and confirm you cannot see a second test user's data; sign out
   and confirm the pages that should need a login show nothing.
4. Run this check again.

---

## Appendix: technical detail

### Policy inventory

| Table | RLS | Command | Roles | `using` | `with check` | Source |
|---|---|---|---|---|---|---|
| `bookings` | on | select | anon | `true` | | `20260301_init.sql` |

### Query inventory

| Table | Operation | Client | Logged in? | Rows needed | Columns | Where |
|---|---|---|---|---|---|---|
| `bookings` | select | anon | yes | own | `*` | `src/pages/MyBookings.tsx:12` |

[Also: `.rpc()` calls, storage buckets, edge functions and which key each uses.]

---

*This report was produced with AI assistance and is for informational purposes only. It is not
legal advice, not security advice and not a penetration test: it reviews policies and code as
written and does not attempt to break into the app. Have the fixes reviewed by someone qualified
before relying on them, and have any personal data breach assessment reviewed by a qualified data
protection professional.*
```

## In the reply to the founder

After saving, give the founder in the chat: the summary, the counts, the critical and high
findings in one line each, the read-only line, and the path the report was saved to:

```
Report saved:
- docs/compliance/supabase-rls-2026-10-19.md
```
