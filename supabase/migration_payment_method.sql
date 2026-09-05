-- Cole e rode este comando no SQL Editor do Supabase para adicionar a forma de pagamento nas transações
alter table public.transactions add column if not exists payment_method text check (payment_method in ('pix', 'boleto', 'credit', 'debit', 'cash'));
