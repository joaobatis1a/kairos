-- Habilita Realtime nas tabelas profiles e companies, necessário pro
-- componente SessaoTempoReal (components/sessao-tempo-real.tsx) derrubar a
-- sessão na hora quando o dono desativa um barbeiro ou a empresa inteira no
-- /manutencao, em vez de esperar a próxima navegação.
--
-- Rode isso uma vez no SQL editor do Supabase.

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.companies;
