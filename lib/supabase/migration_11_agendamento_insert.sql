-- ============================================================
-- Insert de agendamento: só cliente logado, só o próprio whatsapp
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_10.
--
-- A policy "Inserção pública de agendamentos" era `with check (true)`:
-- qualquer request anônimo com a anon key conseguia inserir agendamento
-- com company_id / barbeiro_id / preço forjados, ou em nome de outra
-- pessoa. O fluxo real (criarAgendamento em app/actions/agendamentos.ts)
-- já exige login e usa o whatsapp do cadastro do cliente; a policy passa
-- a refletir isso.

drop policy if exists "Inserção pública de agendamentos" on public.agendamentos;

create policy "Cliente logado cria agendamento pra si"
  on public.agendamentos for insert
  with check (
    cliente_whatsapp = (select c.whatsapp from public.clientes c where c.id = auth.uid())
  );
