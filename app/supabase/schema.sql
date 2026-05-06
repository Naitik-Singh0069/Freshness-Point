create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  slug text primary key,
  name text not null,
  category text not null,
  description text not null default '',
  price_paise integer not null check (price_paise >= 0),
  badge text,
  image_url text not null default '',
  is_combo boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  access_token text not null unique,
  customer_name text not null,
  customer_mobile text not null,
  city text not null,
  address text not null,
  landmark text not null default '',
  pincode text not null,
  instructions text not null default '',
  payment_method text not null check (payment_method in ('cod', 'online')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed', 'refunded')),
  order_status text not null check (order_status in (
    'payment_pending',
    'awaiting_confirmation',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'completed',
    'cancelled',
    'rejected',
    'payment_failed'
  )),
  subtotal_paise integer not null check (subtotal_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  currency text not null default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  confirmed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  item_slug text not null,
  item_name text not null,
  unit_price_paise integer not null check (unit_price_paise >= 0),
  quantity integer not null check (quantity > 0),
  line_total_paise integer not null check (line_total_paise >= 0),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_menu_items_active on public.menu_items(is_active, sort_order, name);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(order_status, payment_status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_menu_items_updated_at on public.menu_items;
create trigger trg_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
