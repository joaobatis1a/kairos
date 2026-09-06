-- ============================================================
-- Correções de segurança (auditoria set/2026)
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_15.

-- 1) Realtime de UPDATE não estava disparando pra profiles/companies
-- (só DELETE funcionava, confirmado ao vivo). Causa provável: sem
-- REPLICA IDENTITY FULL, o Realtime não consegue montar o payload de
-- forma confiável pra UPDATE. Sem isso, desativar um barbeiro/dono não
-- derrubava a sessão dele na hora — só remover (delete) derrubava.
alter table public.profiles replica identity full;
alter table public.companies replica identity full;

-- 2) RLS de profiles sem "with check" — a policy de update só validava
-- QUAL linha (auth.uid() = id), não O QUE podia mudar nela. Sem isso,
-- um barbeiro autenticado podia, em teoria, chamar a API do Supabase
-- direto (fora do Next.js) e virar owner da própria empresa, ou se
-- reativar sozinho depois de desativado, só fazendo update na própria
-- linha. Agora role/company_id/ativo só mudam pelo client admin
-- (verificarOwner/garantirOwner já fazem isso em app/actions).
drop policy if exists "Usuário atualiza o próprio perfil" on public.profiles;

create policy "Usuário atualiza dados do próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and company_id = (select p.company_id from public.profiles p where p.id = auth.uid())
    and ativo = (select p.ativo from public.profiles p where p.id = auth.uid())
  );

-- 3) Conta de manutenção removida também precisa de kill-switch em tempo
-- real (hoje só profiles/companies tem). Sem policy nenhuma, o Realtime
-- nunca autoriza a própria conta a ver a mudança na linha dela.
alter publication supabase_realtime add table public.maintenance_accounts;

create policy "Conta de manutenção vê a própria linha"
  on public.maintenance_accounts for select
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- 4) Cargos e permissões: hoje é tudo-ou-nada (dono vê tudo, barbeiro vê só
-- o próprio). Isso dá ao dono controle fino sobre o que a equipe enxerga,
-- sem precisar de um terceiro papel (gestor) que a Kairos não tem.
alter table public.companies
  add column if not exists permissoes jsonb not null default '{"ver_agendamentos_todos": false, "ver_faturamento": false}'::jsonb;
