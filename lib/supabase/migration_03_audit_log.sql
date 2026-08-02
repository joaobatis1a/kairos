-- Log de auditoria: registra ações sensíveis pra o dono conseguir ver
-- "quem fez o quê" — hoje não existe nenhum histórico disso.
--
-- Diferente do padrão do práxis (audit_log populado só por triggers de
-- banco, sem código client-side envolvido): aqui a escrita acontece dentro
-- das próprias server actions (ver lib/auditoria.ts), não via trigger.
-- Motivo: várias mutações do kairos (salvarHorarios, transferirOwner,
-- alternarBarbeariaAtiva) já usam o client admin (service role) por
-- decisão de arquitetura existente, e auth.uid() sempre retorna null
-- numa conexão service-role — um trigger baseado em auth.uid() logaria
-- "autor desconhecido" nesses casos. A troca é: perde a garantia de "não
-- dá pra pular o log escrevendo direto no banco", mas ganha o autor
-- correto em 100% dos casos hoje cobertos.
--
-- Rode isso uma vez no SQL editor do Supabase.

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  ator_nome text not null default '',
  acao text not null,
  detalhes text not null default '',
  created_at timestamptz not null default now()
);

create index audit_log_company_id_idx on public.audit_log(company_id, created_at desc);

alter table public.audit_log enable row level security;

create policy "Owner vê o audit log da própria empresa"
  on public.audit_log for select
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

-- Sem policy de insert/update/delete pra usuários comuns: só o client
-- admin (service role, usado dentro das próprias server actions) escreve.
