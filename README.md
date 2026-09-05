# FinControl — MVP

## Setup

1. Crie um projeto em https://supabase.com
2. No SQL Editor, rode `supabase/schema.sql` (cria tabelas + RLS)
3. Em Project Settings > API, copie a URL e a anon key
4. `cp .env.local.example .env.local` e preencha
5. Em Authentication > Providers, confirme Email habilitado (desative "Confirm email" se quiser testar sem verificação)
6. `npm install`
7. `npm run dev`

## Segurança

RLS ativo em `accounts`, `locations`, `transactions`. Toda linha exige `user_id = auth.uid()` — um usuário nunca lê/escreve dados de outro, mesmo via API direta. Nenhuma query no código usa `service_role`; tudo passa pela sessão do usuário (`anon key` + cookies).

## Regra de saldo

Saldo de cada conta = saldo inicial + lançamentos com `date <= hoje`. Lançamentos com `date` futura aparecem em "A vencer" e só entram no saldo quando a data chegar.
