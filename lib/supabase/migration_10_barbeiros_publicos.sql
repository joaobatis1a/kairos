-- ============================================================
-- Barbeiros públicos via função, não via policy aberta
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_09.
--
-- A policy "Leitura pública de barbeiros ativos" (using ativo = true) fazia
-- TODA linha de profiles ativa — de qualquer empresa — ser lida por qualquer
-- um com a anon key, expondo nome/whatsapp/company_id/role da plataforma
-- inteira via `GET /rest/v1/profiles`. O storefront só precisa de id + nome
-- dos profissionais de UMA empresa; isso vira uma função security definer
-- (mesmo padrão de agendamentos_ocupados) e a policy aberta é removida.

create or replace function public.barbeiros_publicos(p_company_id uuid)
returns table(id uuid, nome text)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.nome
  from public.profiles p
  where p.company_id = p_company_id
    and p.ativo = true
    and coalesce(trim(p.nome), '') <> ''
    and (p.role = 'barber' or (p.role = 'owner' and p.atende_como_barbeiro = true))
  order by p.nome
$$;

grant execute on function public.barbeiros_publicos(uuid) to anon, authenticated;

drop policy if exists "Leitura pública de barbeiros ativos" on public.profiles;
