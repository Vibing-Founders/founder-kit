create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes int not null,
  price_pence int not null
);
alter table public.services enable row level security;
create policy "Anyone can view services"
  on public.services for select to anon, authenticated
  using (true);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  full_name text not null,
  email text not null,
  phone text,
  home_address text,
  dog_name text,
  dog_notes text,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id),
  service_id uuid not null references public.services (id),
  starts_at timestamptz not null,
  notes text
);
alter table public.appointments enable row level security;
create policy "Customers can view their appointments"
  on public.appointments for select to authenticated
  using (customer_id in (select id from public.customers where user_id = auth.uid()));
create policy "Customers can book for themselves"
  on public.appointments for insert to authenticated
  with check (customer_id in (select id from public.customers where user_id = auth.uid()));
