-- Enable PostgreSQL Crypto Extension
create extension if not exists "pgcrypto";

-- Create Custom Types
create type user_status as enum ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');
create type portfolio_type as enum ('STOCKS', 'CRYPTO', 'FOREX', 'MIXED');
create type transaction_type as enum ('BUY', 'SELL');
create type notification_type as enum ('SYSTEM', 'PRICE_ALERT', 'NEWS', 'PORTFOLIO');

-- Create Users Table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  encrypted_password text not null,
  full_name text not null,
  status user_status default 'ACTIVE',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create Profiles Table
create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  avatar_url text,
  risk_tolerance int check (risk_tolerance between 1 and 5),
  investment_goal text,
  preferred_currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create Portfolios Table
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  type portfolio_type not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create Assets Table
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  symbol text not null,
  quantity numeric not null check (quantity > 0),
  purchase_price numeric not null check (purchase_price > 0),
  current_price numeric not null check (current_price > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create Transactions Table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete cascade,
  type transaction_type not null,
  quantity numeric not null check (quantity > 0),
  price numeric not null check (price > 0),
  total_amount numeric not null check (total_amount > 0),
  executed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Create Notifications Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Create Price Alerts Table
create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  symbol text not null,
  target_price numeric not null,
  is_triggered boolean default false,
  created_at timestamptz default now(),
  triggered_at timestamptz
);

-- Create Functions
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create Triggers
create trigger users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger portfolios_updated_at
  before update on public.portfolios
  for each row
  execute function public.handle_updated_at();

create trigger assets_updated_at
  before update on public.assets
  for each row
  execute function public.handle_updated_at();

-- Create RLS Policies
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.assets enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.price_alerts enable row level security;

-- Users Policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Profiles Policies
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Portfolios Policies
create policy "Portfolios are viewable by owner"
  on public.portfolios for select
  using (auth.uid() = user_id);

create policy "Portfolios are insertable by owner"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Portfolios are updatable by owner"
  on public.portfolios for update
  using (auth.uid() = user_id);

create policy "Portfolios are deletable by owner"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- Assets Policies
create policy "Assets are viewable by portfolio owner"
  on public.assets for select
  using (
    exists (
      select 1 from public.portfolios
      where id = assets.portfolio_id
      and user_id = auth.uid()
    )
  );

create policy "Assets are insertable by portfolio owner"
  on public.assets for insert
  with check (
    exists (
      select 1 from public.portfolios
      where id = portfolio_id
      and user_id = auth.uid()
    )
  );

create policy "Assets are updatable by portfolio owner"
  on public.assets for update
  using (
    exists (
      select 1 from public.portfolios
      where id = assets.portfolio_id
      and user_id = auth.uid()
    )
  );

create policy "Assets are deletable by portfolio owner"
  on public.assets for delete
  using (
    exists (
      select 1 from public.portfolios
      where id = assets.portfolio_id
      and user_id = auth.uid()
    )
  );

-- Transactions Policies
create policy "Transactions are viewable by portfolio owner"
  on public.transactions for select
  using (
    exists (
      select 1 from public.portfolios
      where id = transactions.portfolio_id
      and user_id = auth.uid()
    )
  );

create policy "Transactions are insertable by portfolio owner"
  on public.transactions for insert
  with check (
    exists (
      select 1 from public.portfolios
      where id = portfolio_id
      and user_id = auth.uid()
    )
  );

-- Notifications Policies
create policy "Notifications are viewable by owner"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Notifications are updatable by owner"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Price Alerts Policies
create policy "Price alerts are viewable by owner"
  on public.price_alerts for select
  using (auth.uid() = user_id);

create policy "Price alerts are insertable by owner"
  on public.price_alerts for insert
  with check (auth.uid() = user_id);

create policy "Price alerts are updatable by owner"
  on public.price_alerts for update
  using (auth.uid() = user_id);

create policy "Price alerts are deletable by owner"
  on public.price_alerts for delete
  using (auth.uid() = user_id); 