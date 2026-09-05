-- ============================================================
-- Chat de suporte: barbearia <-> plataforma
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_11.
--
-- Uma conversa contínua por empresa (não é ticket com status). Cada
-- mensagem sabe de que lado veio: 'empresa' (o dono da barbearia) ou
-- 'suporte' (conta de manutenção). O lado do suporte não tem profile,
-- então current_company_id() é null pra ele e as policies abaixo não se
-- aplicam — o suporte lê/escreve via admin client nos server actions,
-- gated por ehContaManutencao (mesmo padrão de app/actions/manutencao.ts).

create table public.suporte_mensagens (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  autor_id uuid references auth.users(id) on delete set null,
  origem text not null check (origem in ('empresa', 'suporte')),
  autor_nome text not null default '',
  mensagem text not null,
  created_at timestamptz not null default now()
);

create index suporte_mensagens_company_id_idx on public.suporte_mensagens(company_id, created_at);

-- Última leitura de cada lado, pra contar não lidas.
create table public.suporte_leituras (
  company_id uuid not null references public.companies(id) on delete cascade,
  lado text not null check (lado in ('empresa', 'suporte')),
  last_read_at timestamptz not null default now(),
  primary key (company_id, lado)
);

alter table public.suporte_mensagens enable row level security;
alter table public.suporte_leituras enable row level security;

create policy "Equipe vê a conversa de suporte da própria empresa"
  on public.suporte_mensagens for select
  using (company_id = public.current_company_id());

create policy "Owner escreve na conversa de suporte da própria empresa"
  on public.suporte_mensagens for insert
  with check (
    company_id = public.current_company_id()
    and autor_id = auth.uid()
    and origem = 'empresa'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Equipe vê a leitura de suporte da própria empresa"
  on public.suporte_leituras for select
  using (company_id = public.current_company_id());

create policy "Equipe marca a leitura de suporte da própria empresa"
  on public.suporte_leituras for insert
  with check (company_id = public.current_company_id() and lado = 'empresa');

create policy "Equipe atualiza a leitura de suporte da própria empresa"
  on public.suporte_leituras for update
  using (company_id = public.current_company_id() and lado = 'empresa');
