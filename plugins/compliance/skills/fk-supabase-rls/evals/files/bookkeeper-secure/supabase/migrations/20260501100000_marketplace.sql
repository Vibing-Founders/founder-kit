create table public.profiles (
  id uuid primary key references auth.users (id) default auth.uid(),
  display_name text not null,
  email text not null
);
alter table public.profiles enable row level security;
create policy "Users view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Users create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  bookkeeper_id uuid not null references auth.users (id) default auth.uid(),
  headline text not null,
  hourly_rate_pence int not null,
  published boolean not null default false
);
alter table public.listings enable row level security;
create policy "Published listings are public"
  on public.listings for select to anon, authenticated
  using (published);
create policy "Bookkeepers view their own listings"
  on public.listings for select to authenticated
  using ((select auth.uid()) = bookkeeper_id);
create policy "Bookkeepers create their own listings"
  on public.listings for insert to authenticated
  with check ((select auth.uid()) = bookkeeper_id);
create policy "Bookkeepers update their own listings"
  on public.listings for update to authenticated
  using ((select auth.uid()) = bookkeeper_id)
  with check ((select auth.uid()) = bookkeeper_id);
create index on public.listings (bookkeeper_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users (id) default auth.uid(),
  recipient_id uuid not null references auth.users (id),
  body text not null,
  sent_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "Participants read their messages"
  on public.messages for select to authenticated
  using ((select auth.uid()) in (sender_id, recipient_id));
create policy "Users send messages as themselves"
  on public.messages for insert to authenticated
  with check ((select auth.uid()) = sender_id);
create index on public.messages (sender_id);
create index on public.messages (recipient_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  payer_id uuid not null references auth.users (id),
  amount_pence int not null,
  provider_ref text not null unique,
  paid_at timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "Payers view their own payments"
  on public.payments for select to authenticated
  using ((select auth.uid()) = payer_id);
-- inserts come only from the payment webhook edge function (service role)
create index on public.payments (payer_id);
