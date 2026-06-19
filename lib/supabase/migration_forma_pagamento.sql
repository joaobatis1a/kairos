-- Adiciona coluna forma_pagamento na tabela agendamentos
alter table public.agendamentos
  add column if not exists forma_pagamento text
  check (forma_pagamento in ('pix', 'dinheiro', 'debito', 'credito'));
