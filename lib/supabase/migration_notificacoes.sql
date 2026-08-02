-- ============================================================
-- Notificações in-app
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase.
-- destinatario_id aponta pra uma pessoa específica; destinatario_role
-- manda pra todo mundo com aquele cargo na empresa; os dois nulos manda
-- pra empresa inteira (broadcast). Inserção sempre via client admin nos
-- server actions — não existe policy pública de insert.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  titulo text not null,
  corpo text not null default '',
  link text,
  destinatario_role text check (destinatario_role in ('owner', 'barber')),
  destinatario_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index notifications_company_id_idx on public.notifications(company_id);
create index notifications_created_at_idx on public.notifications(created_at desc);

create table public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, profile_id)
);

alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;

create policy "Equipe vê notificações direcionadas a ela"
  on public.notifications for select
  using (
    company_id = public.current_company_id()
    and (destinatario_id is null or destinatario_id = auth.uid())
    and (
      destinatario_role is null
      or destinatario_role = (select role from public.profiles where id = auth.uid())
    )
  );

create policy "Usuário vê as próprias leituras"
  on public.notification_reads for select
  using (profile_id = auth.uid());

create policy "Usuário marca a própria notificação como lida"
  on public.notification_reads for insert
  with check (profile_id = auth.uid());
