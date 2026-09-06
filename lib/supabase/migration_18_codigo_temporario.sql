-- ============================================================
-- Códigos de convite temporários (2 minutos)
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_17.
--
-- Sem isso, um código de convite (dono ou barbeiro) ficava válido pra
-- sempre até alguém resgatar — se vazasse (print de tela, mensagem
-- encaminhada errado), continuava servindo dias depois. Agora todo
-- código nasce com validade de 2 minutos; passou disso, o resgate falha
-- como "expirado" e quem está vendo a tela de convite (dono/manutenção)
-- gera outro na hora, automaticamente, na próxima vez que abrir a tela.

alter table public.invite_codes
  add column if not exists expires_at timestamptz not null default (now() + interval '2 minutes');
