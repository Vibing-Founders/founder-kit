create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  starts_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "own bookings" on public.bookings
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
