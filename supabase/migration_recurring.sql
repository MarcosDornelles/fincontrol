-- Cole e rode este comando no SQL Editor do Supabase para adicionar o suporte a despesas recorrentes
alter table public.transactions add column if not exists is_recurring boolean not null default false;
