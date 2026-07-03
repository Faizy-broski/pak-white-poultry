-- Pak White Poultry — Supabase schema
-- Run this in the Supabase SQL editor, or via `supabase db push` if you keep it under supabase/migrations.

-- ────────────────────────────────────────────────────────────
-- Extensions
-- ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- profiles — one row per auth.users, admins and customers alike
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  address text,
  city text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  two_factor_enabled boolean not null default false,
  notify_new_orders boolean not null default true,
  notify_status_changes boolean not null default true,
  notify_weekly_summary boolean not null default true,
  notify_sms boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used throughout RLS policies below
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- plans — subscription plans customers can buy
-- ────────────────────────────────────────────────────────────
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  frequency text not null check (frequency in ('Daily', 'Weekly', 'Monthly')),
  eggs_per_delivery int not null check (eggs_per_delivery > 0),
  deliveries_per_cycle int not null check (deliveries_per_cycle > 0),
  cycle_price numeric(10, 2) not null check (cycle_price > 0),
  discount_percent int not null default 0 check (discount_percent between 0 and 90),
  popular boolean not null default false,
  status text not null default 'Draft' check (status in ('Active', 'Draft', 'Archived')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- customer_subscriptions — who's subscribed to which plan (drives subscriber counts)
-- ────────────────────────────────────────────────────────────
create table if not exists public.customer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete cascade,
  status text not null default 'Active' check (status in ('Active', 'Cancelled')),
  created_at timestamptz not null default now(),
  unique (customer_id, plan_id)
);

-- ────────────────────────────────────────────────────────────
-- orders
-- ────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  eggs int not null check (eggs > 0),
  box_label text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  status text not null default 'Pending'
    check (status in ('Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled')),
  payment text not null check (payment in ('Cash', 'UPI')),
  delivery_slot text not null default '',
  rider text,
  plan_id uuid references public.plans (id),
  placed_at timestamptz not null default now()
);

create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_placed_at_idx on public.orders (placed_at desc);

-- Auto-generate a human-friendly order number like PWP-1052
create sequence if not exists public.order_number_seq start 1042;

create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'PWP-' || nextval('public.order_number_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_insert on public.orders;
create trigger on_order_insert
  before insert on public.orders
  for each row execute procedure public.set_order_number();

-- ────────────────────────────────────────────────────────────
-- customer_stats view — powers the Customers admin page without
-- storing derived totals redundantly on profiles
-- ────────────────────────────────────────────────────────────
create or replace view public.customer_stats as
select
  p.id,
  p.full_name as name,
  p.phone,
  p.email,
  p.address,
  coalesce(p.city, '') as city,
  p.status,
  p.created_at,
  coalesce(count(o.id), 0) as total_orders,
  coalesce(sum(o.amount), 0) as total_spent,
  case when count(o.id) > 0 then round(sum(o.amount) / count(o.id)) else 0 end as avg_order,
  max(o.placed_at) as last_order_at,
  case
    when count(o.id) = 0 then 'New'
    when sum(o.amount) >= 5000 or count(o.id) >= 15 then 'VIP'
    else 'Regular'
  end as segment,
  mode() within group (order by o.box_label) as favorite_box
from public.profiles p
left join public.orders o on o.customer_id = p.id
where p.role = 'customer'
group by p.id;

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.plans enable row level security;
alter table public.customer_subscriptions enable row level security;

-- profiles: everyone can read their own row; admins can read/update everyone's
create policy "Profiles: self select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Profiles: self update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- orders: customers see only their own orders; admins see and manage all
create policy "Orders: customer select own" on public.orders
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "Orders: customer insert own" on public.orders
  for insert with check (customer_id = auth.uid() or public.is_admin());

create policy "Orders: admin update" on public.orders
  for update using (public.is_admin());

create policy "Orders: admin delete" on public.orders
  for delete using (public.is_admin());

-- plans: anyone can read Active plans; only admins see Draft/Archived and manage all
create policy "Plans: public read active" on public.plans
  for select using (status = 'Active' or public.is_admin());

create policy "Plans: admin insert" on public.plans
  for insert with check (public.is_admin());

create policy "Plans: admin update" on public.plans
  for update using (public.is_admin());

create policy "Plans: admin delete" on public.plans
  for delete using (public.is_admin());

-- customer_subscriptions: customers manage their own; admins manage all
create policy "Subscriptions: self select" on public.customer_subscriptions
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "Subscriptions: self insert" on public.customer_subscriptions
  for insert with check (customer_id = auth.uid() or public.is_admin());

create policy "Subscriptions: self update" on public.customer_subscriptions
  for update using (customer_id = auth.uid() or public.is_admin());
