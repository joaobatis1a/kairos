-- ============================================================
-- Chamados de suporte (substitui o chat único por empresa)
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_16.
--
-- Espelha o práxis: cada chamado tem título e status (aberto/encerrado),
-- qualquer membro da equipe (dono ou barbeiro) pode abrir um, e responder
-- um chamado encerrado reabre ele automaticamente (via trigger, funciona
-- tanto quando quem responde é a empresa quanto quando é o suporte).
--
-- As tabelas suporte_mensagens/suporte_leituras antigas ficam no banco
-- (histórico), só não são mais usadas pelo código.

create table public.chamados (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  autor_id uuid references auth.users(id) on delete set null,
  autor_nome text not null default '',
  titulo text not null,
  status text not null default 'aberto' check (status in ('aberto', 'encerrado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chamados_company_id_idx on public.chamados(company_id, updated_at desc);

create table public.chamado_mensagens (
  id uuid primary key default gen_random_uuid(),
  chamado_id uuid not null references public.chamados(id) on delete cascade,
  autor_id uuid references auth.users(id) on delete set null,
  origem text not null check (origem in ('empresa', 'suporte')),
  autor_nome text not null default '',
  mensagem text not null,
  created_at timestamptz not null default now()
);

create index chamado_mensagens_chamado_id_idx on public.chamado_mensagens(chamado_id, created_at);

create table public.chamado_leituras (
  chamado_id uuid not null references public.chamados(id) on delete cascade,
  lado text not null check (lado in ('empresa', 'suporte')),
  last_read_at timestamptz not null default now(),
  primary key (chamado_id, lado)
);

alter table public.chamados enable row level security;
alter table public.chamado_mensagens enable row level security;
alter table public.chamado_leituras enable row level security;

create policy "Equipe ve os chamados da propria empresa"
  on public.chamados for select
  using (company_id = public.current_company_id());

create policy "Equipe abre chamado pra propria empresa"
  on public.chamados for insert
  with check (company_id = public.current_company_id() and autor_id = auth.uid());

create policy "Equipe encerra ou reabre chamado da propria empresa"
  on public.chamados for update
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

create policy "Equipe ve mensagens dos chamados da propria empresa"
  on public.chamado_mensagens for select
  using (exists (select 1 from public.chamados c where c.id = chamado_id and c.company_id = public.current_company_id()));

create policy "Equipe escreve mensagem nos chamados da propria empresa"
  on public.chamado_mensagens for insert
  with check (
    origem = 'empresa'
    and autor_id = auth.uid()
    and exists (select 1 from public.chamados c where c.id = chamado_id and c.company_id = public.current_company_id())
  );

create policy "Equipe ve leitura dos chamados da propria empresa"
  on public.chamado_leituras for select
  using (exists (select 1 from public.chamados c where c.id = chamado_id and c.company_id = public.current_company_id()));

create policy "Equipe marca leitura dos chamados da propria empresa"
  on public.chamado_leituras for insert
  with check (lado = 'empresa' and exists (select 1 from public.chamados c where c.id = chamado_id and c.company_id = public.current_company_id()));

create policy "Equipe atualiza leitura dos chamados da propria empresa"
  on public.chamado_leituras for update
  using (lado = 'empresa' and exists (select 1 from public.chamados c where c.id = chamado_id and c.company_id = public.current_company_id()));

create or replace function public.chamado_ao_responder()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chamados
  set status = 'aberto', updated_at = now()
  where id = new.chamado_id;
  return new;
end;
$$;

create trigger trg_chamado_ao_responder
after insert on public.chamado_mensagens
for each row execute function public.chamado_ao_responder();
