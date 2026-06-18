-- Adiciona coluna atende_como_barbeiro na tabela profiles
alter table public.profiles
  add column if not exists atende_como_barbeiro boolean not null default false;
