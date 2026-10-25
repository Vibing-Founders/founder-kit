create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) default auth.uid(),
  full_name text not null,
  email text not null,
  phone text,
  dog_name text
);
alter table public.customers enable row level security;
create policy "Customers can view their own record"
  on public.customers for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Customers can create their own record"
  on public.customers for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Customers can update their own record"
  on public.customers for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
