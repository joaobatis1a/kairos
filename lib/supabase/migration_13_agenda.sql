-- ============================================================
-- Agenda: duração do serviço, bloqueios/folga, antecedência mínima
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_12.

-- Antecedência mínima (em horas) pra agendar OU cancelar. 0 = sem trava.
alter table public.horarios_config
  add column if not exists antecedencia_min_horas integer not null default 0;

-- Folga / bloqueio de agenda. barbeiro_id null = empresa inteira.
create table public.bloqueios_agenda (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  barbeiro_id uuid references public.profiles(id) on delete cascade,
  inicio timestamptz not null,
  fim timestamptz not null,
  motivo text not null default '',
  created_at timestamptz not null default now()
);

create index bloqueios_agenda_company_id_idx on public.bloqueios_agenda(company_id, inicio);

alter table public.bloqueios_agenda enable row level security;

create policy "Equipe vê bloqueios da própria empresa"
  on public.bloqueios_agenda for select
  using (company_id = public.current_company_id());

create policy "Owner gerencia bloqueios da própria empresa"
  on public.bloqueios_agenda for all
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  )
  with check (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Barbeiro gerencia os próprios bloqueios"
  on public.bloqueios_agenda for all
  using (barbeiro_id = auth.uid() and company_id = public.current_company_id())
  with check (barbeiro_id = auth.uid() and company_id = public.current_company_id());

-- Substitui agendamentos_ocupados (que só devolvia o slot exato). Agora
-- devolve os intervalos [inicio, fim) realmente ocupados no dia: cada
-- agendamento expande pela duração do serviço, e os bloqueios entram junto.
-- security definer pra o storefront anônimo continuar enxergando a agenda
-- sem ter acesso de leitura à tabela agendamentos.
drop function if exists public.agendamentos_ocupados(uuid, date);

create or replace function public.agenda_indisponivel(p_barbeiro_id uuid, p_data date)
returns table(inicio time, fim time)
language sql
stable
security definer
set search_path = public
as $$
  select a.horario as inicio,
         (a.horario + make_interval(mins => coalesce(s.duracao_min, 30)))::time as fim
  from public.agendamentos a
  left join public.servicos s on s.id = a.servico_id
  where a.barbeiro_id = p_barbeiro_id
    and a.data = p_data
    and a.status <> 'cancelado'
  union all
  select greatest(b.inicio, p_data::timestamptz)::time as inicio,
         least(b.fim, (p_data + 1)::timestamptz - interval '1 second')::time as fim
  from public.bloqueios_agenda b
  join public.profiles p on p.id = p_barbeiro_id
  where (b.barbeiro_id = p_barbeiro_id or (b.barbeiro_id is null and b.company_id = p.company_id))
    and b.inicio < (p_data + 1)::timestamptz
    and b.fim > p_data::timestamptz
$$;

grant execute on function public.agenda_indisponivel(uuid, date) to anon, authenticated;
