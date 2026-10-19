create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) default auth.uid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  home_address text,
  dog_name text not null,
  starts_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;

-- the calendar on the home page needs to show which slots are taken
create policy "Enable read access for all users"
  on public.bookings for select to anon, authenticated
  using (true);

create policy "Users can create their own bookings"
  on public.bookings for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can cancel their own bookings"
  on public.bookings for delete to authenticated
  using (auth.uid() = user_id);
