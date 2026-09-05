# Kairos

Plataforma multi-tenant de agendamento para barbearias, feita em Next.js (App Router) + Supabase.

## Stack

- Next.js 16 (App Router), React 19
- Supabase: Postgres + Auth + Storage + Realtime
- Resend (e-mail transacional)
- Vercel (deploy + cron)

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto Supabase

Crie um projeto em [supabase.com](https://supabase.com). No **SQL Editor**, rode os arquivos de `lib/supabase/` **nesta ordem**:

1. `schema.sql`
2. `migration_02_realtime_sessao.sql`
3. `migration_03_audit_log.sql`
4. `migration_04_onboarding.sql`
5. `migration_05_realtime_agendamentos.sql`
6. `migration_06_logo_empresa.sql`
7. `migration_07_notificacoes.sql`
8. `migration_08_avisos.sql`
9. `migration_09_storage.sql`
10. `migration_10_barbeiros_publicos.sql`
11. `migration_11_agendamento_insert.sql`
12. `migration_12_suporte.sql`
13. `migration_13_agenda.sql`
14. `migration_14_agenda_tz.sql`

`migration_01_destaques.sql` é código morto (funcionalidade abandonada) — **não rode**.

Depois, crie sua conta de manutenção (acesso a `/manutencao`, onde se cria a primeira empresa/barbearia):

```sql
insert into public.maintenance_accounts (email) values ('seu-email@exemplo.com');
```

Esse e-mail precisa corresponder a um usuário que existe em Supabase Auth (crie a conta pelo próprio app, em `/auth/login`, antes ou depois de rodar esse insert).

### 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — em Project Settings > API
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` em dev
- `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TEST_EMAIL` — resend.com (em sandbox, sem domínio verificado, os e-mails de clientes reais caem no `RESEND_TEST_EMAIL`)
- `CRON_SECRET` — qualquer string aleatória, usada para autenticar o cron de lembretes

### 4. Rodar

```bash
npm run dev
```

## Estrutura multi-tenant

- `companies` — cada barbearia (tenant)
- `profiles` — dono/barbeiro, sempre vinculado a uma `company_id`
- `clientes` — contas de cliente, compartilhadas entre todas as barbearias (não são por tenant)
- `maintenance_accounts` — superadmins da plataforma, acessam `/manutencao`
- `invite_codes` — código de convite de uso único para onboarding de uma empresa

Isolamento entre tenants é feito via RLS (Row Level Security) no Postgres, usando a função `current_company_id()` (`lib/supabase/schema.sql`).

## Buckets de Storage

- `logos` — logo da empresa, pasta `<company_id>/`, só o owner escreve
- `avatares` — foto de perfil do cliente, pasta `<user_id>/`, só o próprio usuário escreve

Ambos são criados e têm as policies definidas em `migration_06_logo_empresa.sql` (logos) e `migration_09_storage.sql` (avatares + criação dos buckets).
