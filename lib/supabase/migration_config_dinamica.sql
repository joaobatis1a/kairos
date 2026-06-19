-- ============================================================
-- Configurações dinâmicas da barbearia
-- ============================================================

-- Tabela de configurações gerais (1 linha só)
create table if not exists public.barbearia_config (
  id integer primary key default 1 check (id = 1), -- garante só 1 linha
  nome text not null default 'Minha Barbearia',
  slogan text not null default '',
  descricao text not null default '',
  telefone text not null default '',
  whatsapp text not null default '',
  endereco text not null default '',
  maps_url text not null default '',
  instagram text not null default '',
  instagram_url text not null default '',
  updated_at timestamptz not null default now()
);

-- Seed inicial com os dados do config/barbearia.ts
insert into public.barbearia_config (id, nome, slogan, descricao, telefone, whatsapp, endereco, maps_url, instagram, instagram_url)
values (
  1,
  'Navalha de Ouro',
  'Tradição e estilo em cada corte',
  'Há mais de 10 anos cuidando do visual masculino com técnica, navalha e bom atendimento. Ambiente acolhedor, profissionais experientes e aquele café por conta da casa.',
  '(11) 95555-0123',
  '5511955550123',
  'Rua das Tesouras, 123 - Centro, São Paulo - SP',
  'https://maps.google.com/?q=Rua+das+Tesouras+123+Centro+Sao+Paulo',
  '@navalhadeouro',
  'https://instagram.com'
) on conflict (id) do nothing;

-- Tabela de serviços
create table if not exists public.servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text not null default '',
  preco numeric(10,2) not null default 0,
  duracao_min integer not null default 30,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed dos serviços
insert into public.servicos (nome, descricao, preco, duracao_min, ordem) values
  ('Corte de Cabelo', 'Corte na tesoura ou máquina, finalizado com toalha quente.', 45, 40, 1),
  ('Barba na Navalha', 'Toalha quente, navalha e produtos premium para uma barba impecável.', 35, 30, 2),
  ('Corte + Barba', 'O combo completo: corte de cabelo e barba na navalha.', 70, 60, 3),
  ('Pezinho / Acabamento', 'Acabamento na nuca e contornos para manter o visual em dia.', 20, 15, 4),
  ('Sobrancelha', 'Design de sobrancelha masculina na navalha ou pinça.', 15, 15, 5)
on conflict do nothing;

-- Tabela de horários disponíveis
create table if not exists public.horarios_config (
  id integer primary key default 1 check (id = 1),
  dias_abertos integer[] not null default '{1,2,3,4,5,6}', -- 0=dom ... 6=sab
  horarios text[] not null default '{"09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"}',
  updated_at timestamptz not null default now()
);

insert into public.horarios_config (id) values (1) on conflict (id) do nothing;

-- RLS
alter table public.barbearia_config enable row level security;
alter table public.servicos enable row level security;
alter table public.horarios_config enable row level security;

-- Leitura pública
create policy "Leitura pública barbearia_config" on public.barbearia_config for select using (true);
create policy "Leitura pública servicos" on public.servicos for select using (true);
create policy "Leitura pública horarios_config" on public.horarios_config for select using (true);

-- Escrita só para owner
create policy "Owner edita barbearia_config" on public.barbearia_config for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy "Owner insere servicos" on public.servicos for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy "Owner edita servicos" on public.servicos for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy "Owner deleta servicos" on public.servicos for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy "Owner edita horarios_config" on public.horarios_config for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));
