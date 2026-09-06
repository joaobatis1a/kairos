-- Código de convite passa de 2 para 5 minutos de validade. As actions
-- (app/actions/equipe.ts, app/actions/manutencao.ts) sempre passam
-- expires_at explícito no insert; isso só corrige o default da coluna
-- pra não ficar enganoso.
alter table public.invite_codes alter column expires_at set default (now() + interval '5 minutes');
