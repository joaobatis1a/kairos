-- Tabela de perfis (donos e barbeiros)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  role text not null default 'barber' check (role in ('owner', 'barber')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tabela de agendamentos
create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  cliente_whatsapp text not null,
  servico_id text not null,
  servico_nome text not null,
  servico_preco numeric(10,2) not null default 0,
  barbeiro_id uuid references public.profiles(id) on delete set null,
  data date not null,
  horario time not null,
  status text not null default 'pendente' check (status in ('pendente', 'confirmado', 'cancelado')),
  observacoes text,
  created_at timestamptz not null default now()
);

-- Trigger: cria perfil automaticamente ao criar usuário no Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, role, ativo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'role', 'barber'),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table public.profiles enable row level security;
alter table public.agendamentos enable row level security;

-- Policies: profiles
create policy "Usuário vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Owner vê todos os perfis"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'owner'
    )
  );

create policy "Owner atualiza qualquer perfil"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'owner'
    )
  );

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Policies: agendamentos
create policy "Inserção pública de agendamentos"
  on public.agendamentos for insert
  with check (true);

create policy "Owner vê todos os agendamentos"
  on public.agendamentos for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'owner'
    )
  );

create policy "Barbeiro vê os próprios agendamentos"
  on public.agendamentos for select
  using (barbeiro_id = auth.uid());

create policy "Owner atualiza qualquer agendamento"
  on public.agendamentos for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'owner'
    )
  );

create policy "Barbeiro atualiza os próprios agendamentos"
  on public.agendamentos for update
  using (barbeiro_id = auth.uid());

create policy "Owner deleta qualquer agendamento"
  on public.agendamentos for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'owner'
    )
  );

-- Permite leitura pública de horários ocupados (para o formulário do cliente)
create policy "Leitura pública de horários"
  on public.agendamentos for select
  using (true);