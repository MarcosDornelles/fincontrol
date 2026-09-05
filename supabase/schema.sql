-- =========================================================
-- FinControl — Schema + RLS
-- Executar no SQL Editor do Supabase
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------- ACCOUNTS ----------
create table if not exists public.accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('bank', 'wallet')),
  initial_balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- LOCATIONS (cadastro inteligente) ----------
create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ---------- TRANSACTIONS ----------
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14,2) not null check (amount > 0),
  description text,
  date date not null, -- data efetiva/vencimento (rege quando entra no saldo)
  is_recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user_date on public.transactions(user_id, date);
create index if not exists idx_transactions_account on public.transactions(account_id);
create index if not exists idx_locations_user on public.locations(user_id);

-- =========================================================
-- ROW LEVEL SECURITY — privacidade absoluta entre usuários
-- =========================================================

alter table public.accounts enable row level security;
alter table public.locations enable row level security;
alter table public.transactions enable row level security;

-- ACCOUNTS
create policy "accounts_select_own" on public.accounts
  for select using (auth.uid() = user_id);
create policy "accounts_insert_own" on public.accounts
  for insert with check (auth.uid() = user_id);
create policy "accounts_update_own" on public.accounts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "accounts_delete_own" on public.accounts
  for delete using (auth.uid() = user_id);

-- LOCATIONS
create policy "locations_select_own" on public.locations
  for select using (auth.uid() = user_id);
create policy "locations_insert_own" on public.locations
  for insert with check (auth.uid() = user_id);
create policy "locations_update_own" on public.locations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "locations_delete_own" on public.locations
  for delete using (auth.uid() = user_id);

-- TRANSACTIONS
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);
