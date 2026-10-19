create table public.profiles (
  id uuid primary key references auth.users (id),
  display_name text not null,
  role text not null check (role in ('business', 'bookkeeper'))
);
alter table public.profiles enable row level security;
create policy "Profiles are visible to signed-in users"
  on public.profiles for select to authenticated
  using (true);
create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  bookkeeper_id uuid not null references public.profiles (id),
  author_id uuid not null references public.profiles (id),
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Reviews are public"
  on public.reviews for select to anon, authenticated
  using (true);
create policy "Authenticated users can create reviews"
  on public.reviews for insert to authenticated
  with check (true);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id),
  recipient_id uuid not null references public.profiles (id),
  body text not null,
  sent_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "Participants can read their messages"
  on public.messages for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Signed-in users can send messages"
  on public.messages for insert to authenticated
  with check (auth.role() = 'authenticated');
