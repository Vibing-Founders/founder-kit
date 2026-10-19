create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  bookkeeper_id uuid not null references auth.users (id) default auth.uid(),
  client_id uuid not null references auth.users (id),
  amount_pence int not null,
  due_date date not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid'))
);
alter table public.invoices enable row level security;

create policy "Bookkeepers can create invoices"
  on public.invoices for insert to authenticated
  with check ((select auth.uid()) = bookkeeper_id);
