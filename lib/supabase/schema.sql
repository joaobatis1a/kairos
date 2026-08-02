-- ============================================================
-- Kairos — schema multi-tenant
-- ============================================================
-- Uma "company" é uma barbearia (tenant). Rode este arquivo inteiro
-- num projeto Supabase novo. Depois, semeie a primeira conta de
-- manutenção (superadmin da plataforma) manualmente:
--
--   insert into public.maintenance_accounts (email) values ('seu-email@exemplo.com');
--
-- Sem isso não existe como acessar /manutencao e criar a primeira empresa.

-- =============================================
-- Empresas (tenants)
-- =============================================

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null default 'Minha Barbearia',
  slogan text not null default '',
  descricao text not null default '',
  telefone text not null default '',
  whatsapp text not null default '',
  endereco text not null default '',
  maps_url text not null default '',
  instagram text not null default '',
  instagram_url text not null default '',
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================
-- Perfis (donos e barbeiros) — sempre pertencem a UMA empresa
-- =============================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  nome text not null default '',
  role text not null default 'barber' check (role in ('owner', 'barber')),
  ativo boolean not null default true,
  atende_como_barbeiro boolean not null default false,
  whatsapp text not null default '',
  created_at timestamptz not null default now()
);

create index profiles_company_id_idx on public.profiles(company_id);

-- Nota: não existe mais trigger de auto-criação de profile no signup.
-- Uma conta só vira profile (owner ou barbeiro) através do fluxo de
-- convite (ver app/actions/manutencao.ts e app/actions/equipe.ts),
-- porque só nesse momento sabemos a qual empresa ela pertence.

-- =============================================
-- Clientes — conta única do kairos, não pertence a uma empresa
-- (o mesmo cliente pode agendar em barbearias diferentes)
-- =============================================

create table public.clientes (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  email text not null default '',
  whatsapp text not null default '',
  created_at timestamptz not null default now()
);

-- =============================================
-- Serviços e horários — configuração de cada empresa
-- =============================================

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  nome text not null,
  descricao text not null default '',
  preco numeric(10,2) not null default 0,
  duracao_min integer not null default 30,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create index servicos_company_id_idx on public.servicos(company_id);

create table public.horarios_config (
  company_id uuid primary key references public.companies(id) on delete cascade,
  dias_abertos integer[] not null default '{1,2,3,4,5,6}', -- 0=dom ... 6=sab
  horarios text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- =============================================
-- Agendamentos
-- =============================================

create table public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  cliente_nome text not null,
  cliente_whatsapp text not null,
  servico_id uuid references public.servicos(id) on delete set null,
  servico_nome text not null,
  servico_preco numeric(10,2) not null default 0,
  barbeiro_id uuid references public.profiles(id) on delete set null,
  data date not null,
  horario time not null,
  status text not null default 'pendente' check (status in ('pendente', 'confirmado', 'finalizado', 'cancelado')),
  observacoes text,
  forma_pagamento text check (forma_pagamento in ('pix', 'dinheiro', 'debito', 'credito')),
  motivo_cancelamento text,
  created_at timestamptz not null default now()
);

create index agendamentos_company_id_idx on public.agendamentos(company_id);
create index agendamentos_barbeiro_id_idx on public.agendamentos(barbeiro_id);

-- Função pública usada pelo storefront pra saber quais horários já
-- estão ocupados, sem expor a tabela agendamentos inteira (nome/whatsapp
-- do cliente) pra qualquer visitante anônimo.
create function public.agendamentos_ocupados(p_barbeiro_id uuid, p_data date)
returns table(horario time)
language sql
stable
security definer
set search_path = public
as $$
  select horario from public.agendamentos
  where barbeiro_id = p_barbeiro_id
    and data = p_data
    and status <> 'cancelado'
$$;

grant execute on function public.agendamentos_ocupados(uuid, date) to anon, authenticated;

-- =============================================
-- Avaliações
-- =============================================

create table public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  agendamento_id uuid not null references public.agendamentos(id) on delete cascade,
  cliente_id uuid not null,
  barbeiro_id uuid references public.profiles(id) on delete set null,
  nota_servico integer not null check (nota_servico between 1 and 5),
  nota_barbeiro integer check (nota_barbeiro between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  unique(agendamento_id)
);

-- =============================================
-- Manutenção (superadmin da plataforma) e convites
-- =============================================
-- Sem policies de acesso via client normal: essas duas tabelas só são
-- lidas/escritas pelo client admin (service role) em app/actions/manutencao.ts
-- e app/actions/equipe.ts, depois de checar permissão em TypeScript —
-- mesmo padrão que o resto do código já usa (verificarOwner/garantirOwner).

create table public.maintenance_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.invite_codes (
  code text primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'barber')),
  created_at timestamptz not null default now()
);

create index invite_codes_company_id_idx on public.invite_codes(company_id);

-- =============================================
-- Row Level Security
-- =============================================

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.clientes enable row level security;
alter table public.servicos enable row level security;
alter table public.horarios_config enable row level security;
alter table public.agendamentos enable row level security;
alter table public.avaliacoes enable row level security;
alter table public.maintenance_accounts enable row level security; -- sem policies: só client admin
alter table public.invite_codes enable row level security; -- sem policies: só client admin

-- helper: empresa do usuário autenticado
create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where id = auth.uid()
$$;

-- companies: leitura pública das ativas (storefront por slug) + a própria
-- empresa pra equipe (mesmo se estiver inativa, pra conseguir ver o aviso)
create policy "Leitura pública de empresas ativas"
  on public.companies for select
  using (status = 'ativo');

create policy "Equipe vê a própria empresa"
  on public.companies for select
  using (id = public.current_company_id());

-- profiles
create policy "Usuário vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Equipe vê perfis da mesma empresa"
  on public.profiles for select
  using (company_id = public.current_company_id());

-- leitura pública dos barbeiros ativos (storefront de agendamento) — o
-- filtro por empresa é feito na query (getBarbeirosAtivos), não aqui
create policy "Leitura pública de barbeiros ativos"
  on public.profiles for select
  using (ativo = true);

create policy "Usuário cria o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Owner atualiza perfis da própria empresa"
  on public.profiles for update
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

-- clientes: cada cliente vê/edita só a própria conta; qualquer membro de
-- equipe (de qualquer empresa) pode consultar pra casar whatsapp/e-mail
-- ao finalizar um agendamento
create policy "Cliente vê o próprio cadastro"
  on public.clientes for select
  using (auth.uid() = id);

create policy "Equipe consulta clientes"
  on public.clientes for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

create policy "Cliente cria o próprio cadastro"
  on public.clientes for insert
  with check (auth.uid() = id);

create policy "Cliente atualiza o próprio cadastro"
  on public.clientes for update
  using (auth.uid() = id);

-- servicos e horarios_config: leitura pública (storefront), escrita só
-- via client admin dentro de app/actions/config.ts (já checa owner)
create policy "Leitura pública de serviços" on public.servicos for select using (true);
create policy "Leitura pública de horários" on public.horarios_config for select using (true);

-- agendamentos: sem leitura pública (dados de cliente); equipe vê os da
-- própria empresa. Disponibilidade de horário pro storefront usa a
-- função agendamentos_ocupados() acima, não select direto na tabela.
create policy "Inserção pública de agendamentos"
  on public.agendamentos for insert
  with check (true);

create policy "Owner vê agendamentos da própria empresa"
  on public.agendamentos for select
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Barbeiro vê os próprios agendamentos"
  on public.agendamentos for select
  using (barbeiro_id = auth.uid());

-- cliente vê os próprios agendamentos (histórico e avaliação) — casados por
-- whatsapp, igual ao resto do código (não há cliente_id em agendamentos)
create policy "Cliente vê os próprios agendamentos"
  on public.agendamentos for select
  using (
    cliente_whatsapp = (select whatsapp from public.clientes where id = auth.uid())
  );

create policy "Owner atualiza agendamentos da própria empresa"
  on public.agendamentos for update
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Barbeiro atualiza os próprios agendamentos"
  on public.agendamentos for update
  using (barbeiro_id = auth.uid());

create policy "Owner deleta agendamentos da própria empresa"
  on public.agendamentos for delete
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

-- avaliacoes
create policy "Leitura pública de avaliações"
  on public.avaliacoes for select using (true);

create policy "Cliente insere própria avaliação"
  on public.avaliacoes for insert
  with check (auth.uid() = cliente_id);

create policy "Cliente atualiza própria avaliação"
  on public.avaliacoes for update
  using (auth.uid() = cliente_id);
