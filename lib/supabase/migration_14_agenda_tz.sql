-- ============================================================
-- Fix: agenda_indisponivel convertia bloqueio pro fuso do servidor (UTC)
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_13.
--
-- bloqueios_agenda guarda timestamptz; `::time` direto usa o fuso da
-- sessão (UTC no servidor), então um bloqueio das 14h (BRT) aparecia como
-- 17h. Os agendamentos não têm esse problema (horario é `time` puro).
-- Como a plataforma é só Brasil, converte explícito pra America/Sao_Paulo.

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
  select
    case
      when (b.inicio at time zone 'America/Sao_Paulo')::date < p_data then time '00:00'
      else (b.inicio at time zone 'America/Sao_Paulo')::time
    end as inicio,
    case
      when (b.fim at time zone 'America/Sao_Paulo')::date > p_data then time '23:59:59'
      else (b.fim at time zone 'America/Sao_Paulo')::time
    end as fim
  from public.bloqueios_agenda b
  join public.profiles p on p.id = p_barbeiro_id
  where (b.barbeiro_id = p_barbeiro_id or (b.barbeiro_id is null and b.company_id = p.company_id))
    and (b.inicio at time zone 'America/Sao_Paulo')::date <= p_data
    and (b.fim at time zone 'America/Sao_Paulo')::date >= p_data
$$;
