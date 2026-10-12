-- ADR 0004: shared identity/FK spine; feature owners add reviewed business fields.
-- Member-only checkout is enforced by future server operations, not by these tables alone.
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.products (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  -- shortcut: nullable until Catalog/Custom/Checkout approve sellable identity constraints.
  variant_id bigint references public.product_variants (id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index product_variants_product_id_idx on public.product_variants (product_id);
create index orders_customer_id_idx on public.orders (customer_id);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_variant_id_idx on public.order_items (variant_id);
create index payments_order_id_idx on public.payments (order_id);

alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- No application access until feature owners approve grants, policies and server contracts.
revoke all on table public.customers, public.products, public.product_variants,
  public.orders, public.order_items, public.payments from public, anon, authenticated;
revoke all on sequence public.products_id_seq, public.product_variants_id_seq
  from public, anon, authenticated;
