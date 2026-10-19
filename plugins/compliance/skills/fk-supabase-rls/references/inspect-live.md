# Inspecting a live database, read-only

Use these only when a Supabase MCP server (or other database access the founder has given) is
available. Every query here is a `select` against catalog views. None of them reads a row of the
founder's own data, and none changes anything.

If the MCP server offers a security advisor (for example `get_advisors` with type `security`), run
it first and include what it reports. Then run the queries below with its read-only SQL tool. If
the only SQL tool can also write (for example `execute_sql` on a server not started in read-only
mode), still run only these `select` statements, and suggest the founder restart the server in
read-only mode (`--read-only`, or `read_only=true` in the server URL) before anyone uses it for
checks like this.

Never call `apply_migration`, never run `create`, `alter`, `drop`, `grant`, `revoke`, `insert`,
`update`, `delete` or `truncate`, and never `select` from the founder's tables.

## Tables in exposed schemas, and whether RLS is on

```sql
select n.nspname as schema,
       c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname in ('public')          -- add any other schema exposed through the API
order by 1, 2;
```

## Every policy

```sql
select schemaname, tablename, policyname, permissive, roles, cmd, qual as using_expr, with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, cmd, policyname;
```

## What the API roles are granted

RLS only matters where the role has a grant; a table with no grant to `anon` cannot be read by
`anon` at all.

```sql
select table_schema, table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
group by 1, 2, 3
order by 1, 2, 3;
```

## Views (these can bypass RLS)

A view runs with its owner's rights unless it was created `with (security_invoker = true)`
(Postgres 15 and later), so it can return rows the caller's policies would hide.

```sql
select n.nspname as schema, c.relname as view_name, c.reloptions
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('v', 'm')
  and n.nspname = 'public';
```

A view whose `reloptions` does not include `security_invoker=true` is worth a finding when it
selects from a protected table.

## `security definer` functions callable through the API

```sql
select n.nspname as schema, p.proname as function_name, p.prosecdef as security_definer,
       has_function_privilege('anon', p.oid, 'execute') as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.prosecdef desc, p.proname;
```

For a `security definer` function the API roles can execute, read its definition
(`select pg_get_functiondef('public.<name>'::regproc);`) and check that it filters by
`auth.uid()` or checks a role itself.

## Storage buckets

```sql
select id, name, public from storage.buckets;
```

A `public` bucket serves every file to anyone with the URL, whatever the storage policies say.
That is fine for product photos and wrong for invoices or ID documents.
