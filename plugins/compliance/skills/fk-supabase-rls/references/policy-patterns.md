# Policy patterns: what goes wrong and the fix

Each pattern has how to spot it, the usual severity, and the fix as SQL. Severity is a starting
point: raise it when the table holds personal or payment data, lower it when the table only holds
data that is public anyway (a list of services and prices, say). Table and column names below come
from invented example apps; use the founder's own names in the report.

Two facts that most findings rest on:

- **The anon key is public.** It is in the browser bundle of every Supabase app. Anything the
  `anon` role can do, anyone on the internet can do, with no login. Anything `authenticated` can
  do, anyone who signs up can do, and sign-up is usually open.
- **Policies are permissive by default and add up.** If any one permissive policy allows a row, the
  row is allowed. One `using (true)` policy undoes every careful policy beside it on the same
  table and command.

Postgres behaviour to keep straight:

- `select` and `delete` policies use `using` (which existing rows the user can see or remove).
- `insert` policies use `with check` only (which new rows the user may create).
- `update` policies use both: `using` picks the rows the user may change, `with check` limits what
  the changed row may look like. If an `update` (or `for all`) policy has no `with check`, Postgres
  applies the `using` expression to the new row as well.
- `to public` (or no `to` clause) means every role, **including `anon`**.
- With RLS enabled and no policy for a command, that command returns no rows or fails for `anon`
  and `authenticated`. The service role ignores RLS altogether.

---

## 1. RLS disabled on an exposed table

**Spot it:** `create table public.customers (…)` with no later
`alter table public.customers enable row level security`; or `relrowsecurity = false` live; or the
security advisor's "RLS disabled in public" lint.

**Severity:** critical when the table holds personal or business data; low when it is genuinely
public reference data (and then the fix is still to enable RLS with a public read policy, so that
nobody can *write* to it).

**Why:** with RLS off, the `anon` key can read, insert, change and delete every row through the
API, because Supabase grants the API roles access to tables in `public` by default.

**Fix:** enable RLS, then add only the policies the app needs.

```sql
alter table public.customers enable row level security;

-- Example: each signed-in customer sees and edits only their own record
create policy "Customers can view their own record"
  on public.customers for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Customers can update their own record"
  on public.customers for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

Enabling RLS with no policies makes the table unreadable from the app. Check the query inventory
first and add a policy for every legitimate query in the same change, or the app breaks.

---

## 2. `using (true)` for `anon` or `public`

**Spot it:** `create policy … for select to anon using (true)`, or `to public using (true)`, on a
table with personal or business data. Often named "Enable read access for all users", the
dashboard's template name.

**Severity:** critical for personal data (anyone can read every row with no login); low for
data meant to be public.

**Fix:** drop it and replace it with a policy scoped to the owner, or restrict to the columns that
are meant to be public through a view (pattern 9).

```sql
drop policy "Enable read access for all users" on public.bookings;

create policy "Owners can view their bookings"
  on public.bookings for select to authenticated
  using ((select auth.uid()) = customer_id);
```

If one page genuinely needs to show something to logged-out visitors (for example which time slots
are taken), give it a narrow view or function that returns only that, not the whole table.

---

## 3. `using (true)` for `authenticated`, or no ownership check

**Spot it:** `to authenticated using (true)`, `using (auth.role() = 'authenticated')`, or
`using (auth.uid() is not null)` on a table where each row belongs to one user.

**Severity:** high (any logged-in user can read or change other users' rows; signing up is
usually all it takes). Critical if sign-up is open and the table holds sensitive personal data.

**Fix:** compare the row's owner column with `auth.uid()`.

```sql
drop policy "Authenticated users can update profiles" on public.profiles;

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
```

---

## 4. Insert or update that does not tie the row to the user

**Spot it:** `for insert to authenticated with check (true)`, an insert policy with no `with check`,
or an `update` policy whose `with check` lets the owner column change. The app sends `user_id`
(or `author_id`, `owner_id`, `organisation_id`) from the browser.

**Severity:** high. Any logged-in user can create rows in someone else's name (fake reviews,
bookings, messages that appear to come from another user) or move rows into another account.

**Why:** the browser decides what it sends. A value such as `user_id: user.id` in the client code
proves nothing, because anyone can send a different one.

**Fix:**

```sql
drop policy "Authenticated users can create reviews" on public.reviews;

create policy "Users can create reviews as themselves"
  on public.reviews for insert to authenticated
  with check ((select auth.uid()) = author_id);
```

Giving the owner column a default of `auth.uid()` (`alter table public.reviews alter column
author_id set default auth.uid();`) also stops the app having to send it, but the `with check` is
what enforces it.

---

## 5. Missing tenant check in a multi-tenant app

**Spot it:** rows belong to an organisation, team, workspace or practice
(`organisation_id`, `team_id`, `practice_id`), and the policy checks only that the user is logged
in, or only checks `auth.uid()` against a creator column when colleagues should also see the row.

**Severity:** high (another tenant's users can read or change this tenant's data).

**Fix:** check membership through the membership table.

```sql
create policy "Members can view their organisation's clients"
  on public.clients for select to authenticated
  using (
    organisation_id in (
      select organisation_id from public.memberships
      where user_id = (select auth.uid())
    )
  );
```

The membership table needs its own policy (users see their own memberships) and must not let
users insert themselves into any organisation (pattern 4 applies to it too).

---

## 6. Legitimate operation with no policy (the feature breaks)

**Spot it:** the code runs `.from('invoices').select(…)` with the anon client, RLS is enabled on
`invoices`, and no `select` policy (or `for all` policy) covers the role the user has at that
point.

**Severity:** medium. Not a leak: the page shows nothing or fails for users. Founders often
"fix" this by adding `using (true)`, which turns a broken page into a data leak, so the report
must give the narrow policy.

**Fix:** add the narrowest policy that serves the query.

```sql
create policy "Clients can view their own invoices"
  on public.invoices for select to authenticated
  using ((select auth.uid()) = client_id);
```

If the migrations show no policy but the feature reportedly works, the live database probably has
a policy added in the dashboard that the repo does not know about. Say so, and list it under what
could not be verified.

---

## 7. Admin operations without a role check

**Spot it:** an admin page in the code (deleting users, refunding, editing any listing) uses the
anon client, and the policy that lets it work is open to every `authenticated` user. Or the role
check reads `auth.jwt() -> 'user_metadata'`, which each user can edit for themselves through
`supabase.auth.updateUser`.

**Severity:** high (any user can do what an admin can). Critical when the check uses
`user_metadata`, since it looks protected and is not.

**Fix:** check a role the user cannot set themselves: a roles table, or `app_metadata` (only the
service role can write it).

```sql
create policy "Admins can delete listings"
  on public.listings for delete to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = 'admin'
    )
  );
```

Or move the admin operation to a server route or edge function that uses the service role and
checks the caller's role first.

---

## 8. Service-role key in browser code

**Spot it:** `createClient(url, SERVICE_ROLE_KEY)` in a file that runs in the browser (React
components, `src/lib/*` imported by them), an env var with a public prefix holding it
(`VITE_SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`), or a secret key
(`sb_secret_…`) in client code.

**Severity:** critical. The service role ignores RLS. Anyone can copy the key out of the browser
bundle and read, change or delete every table, and every file in storage.

**Fix:** this is not SQL.

1. Rotate the key in the Supabase dashboard (Project Settings → API keys). Removing it from the
   code is not enough: the old bundle has already been served and may be cached or copied.
2. Move every operation that needs it to a server route or edge function that keeps the key in a
   server-only secret (no `VITE_` / `NEXT_PUBLIC_` prefix) and checks who the caller is.
3. Give the browser the anon or publishable key only, and add the RLS policies those queries need.

Treat it as a possible personal data breach for the GDPR section if the key was ever deployed.

---

## 9. Views and `security definer` functions that bypass RLS

**Spot it:** `create view public.booking_summary as select … from public.bookings` without
`with (security_invoker = true)`; or `create function … security definer` callable by `anon` or
`authenticated` that returns rows without filtering on `auth.uid()`.

**Severity:** high, or critical when it returns personal data to `anon`.

**Why:** a view runs as its owner (usually `postgres`, which bypasses RLS) unless it is a
`security_invoker` view. A `security definer` function runs as its owner too.

**Fix:**

```sql
alter view public.booking_summary set (security_invoker = true);
```

```sql
-- Either make the function filter by the caller…
create or replace function public.my_bookings()
returns setof public.bookings
language sql
security invoker
set search_path = ''
as $$
  select * from public.bookings where customer_id = (select auth.uid());
$$;

-- …or, if it must stay security definer, stop the public calling it
revoke execute on function public.export_all_bookings() from anon, authenticated;
```

`set search_path = ''` stops a caller hijacking a `security definer` function through objects in
another schema; add it to every `security definer` function.

---

## 10. Storage buckets

**Spot it:** `.storage.from('invoices')` or `getPublicUrl` on a bucket created `public = true`
that holds private files, or storage policies with no check on the file's folder or owner.

**Severity:** critical for private documents in a public bucket; high for policies any
logged-in user passes.

**Fix:** make the bucket private and scope policies to a per-user folder.

```sql
update storage.buckets set public = false where id = 'invoices';

create policy "Users can read their own invoice files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'invoices'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
```

The `update storage.buckets` line is a fix for a human to run, like all the SQL here. Private
buckets need signed URLs (`createSignedUrl`) in the app instead of `getPublicUrl`.

---

## 11. Tidy-up (low)

- **Over-fetching.** `select('*')` on a table with emails, phone numbers or internal notes, where
  the page shows only a name. RLS controls rows, not columns, so everything selected reaches the
  browser. Fix in the code: select only the columns the page uses (`select('id, name, starts_at')`).
  If other users' rows are readable, also consider a view exposing only the public columns.
- **Broader than needed.** A `for all` policy where the app only reads; `to public` where only
  signed-in users use the table. Replace with a policy per command and role.
- **Unused policies.** Policies for tables or commands no query uses. Drop them, so the next person
  does not have to reason about them.
- **Performance.** `auth.uid()` called per row. Wrapping it as `(select auth.uid())` lets Postgres
  run it once per query. Add an index on the owner column (`create index on public.bookings
  (customer_id);`).

---

## What a well-secured table looks like

```sql
alter table public.bookings enable row level security;

create policy "Customers can view their bookings"
  on public.bookings for select to authenticated
  using ((select auth.uid()) = customer_id);

create policy "Customers can create bookings for themselves"
  on public.bookings for insert to authenticated
  with check ((select auth.uid()) = customer_id);

create policy "Customers can update their bookings"
  on public.bookings for update to authenticated
  using ((select auth.uid()) = customer_id)
  with check ((select auth.uid()) = customer_id);
```

RLS on; one policy per command the app uses; the right role; ownership checked on both sides of an
update; nothing for `anon` unless a logged-out page needs it. When every table looks like this and
the code only uses the anon client in the browser, say the app is well secured. Don't manufacture
findings to fill the report.
