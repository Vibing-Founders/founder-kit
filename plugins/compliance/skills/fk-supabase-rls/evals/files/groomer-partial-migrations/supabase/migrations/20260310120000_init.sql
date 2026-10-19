create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  name text not null,
  breed text,
  photo_path text
);
alter table public.pets enable row level security;
create policy "Owners manage their pets"
  on public.pets for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
