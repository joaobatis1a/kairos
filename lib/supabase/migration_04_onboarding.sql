-- ============================================================
-- Checklist de onboarding do dashboard
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase.
-- Guarda se o dono já dispensou o card de "primeiros passos" do dashboard.
-- O progresso em si (tem serviço? tem horário? tem barbeiro?) é calculado
-- na hora a partir das tabelas existentes, não precisa de mais colunas.

alter table public.companies
  add column if not exists onboarding_dismissed boolean not null default false;
