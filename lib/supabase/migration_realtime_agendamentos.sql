-- Habilita Realtime na tabela agendamentos, necessário pra
-- /painel/agendamentos (components/painel/agendamentos-view.tsx) atualizar
-- a lista sozinha quando um cliente agenda/cancela, sem precisar dar
-- refresh.
--
-- Rode isso uma vez no SQL editor do Supabase.

alter publication supabase_realtime add table public.agendamentos;
