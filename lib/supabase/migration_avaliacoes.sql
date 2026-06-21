-- Tabela de avaliações
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  agendamento_id uuid not null references public.agendamentos(id) on delete cascade,
  cliente_id uuid not null,
  barbeiro_id uuid references public.profiles(id) on delete set null,
  nota_servico integer not null check (nota_servico between 1 and 5),
  nota_barbeiro integer check (nota_barbeiro between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  unique(agendamento_id) -- apenas 1 avaliação por agendamento
);

alter table public.avaliacoes enable row level security;

-- Qualquer um pode ler
create policy "Leitura pública de avaliações"
  on public.avaliacoes for select using (true);

-- Só cliente autenticado pode inserir a própria
create policy "Cliente insere própria avaliação"
  on public.avaliacoes for insert
  with check (auth.uid() = cliente_id);

-- Só o cliente pode atualizar a própria
create policy "Cliente atualiza própria avaliação"
  on public.avaliacoes for update
  using (auth.uid() = cliente_id);
