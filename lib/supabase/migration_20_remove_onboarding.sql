-- Remove o checklist de "primeiros passos" do dashboard (pedido do usuário).
alter table public.companies drop column if exists onboarding_dismissed;
