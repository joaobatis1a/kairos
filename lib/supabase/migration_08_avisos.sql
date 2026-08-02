-- ============================================================
-- Mural de avisos internos
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase.
-- Diferente das notifications (migration_07): aviso é escrito à mão pelo
-- dono, não gerado por um evento do sistema, e admite resposta — é uma
-- conversa curta, não um evento passageiro.

create table public.avisos (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  autor_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  mensagem text not null,
  -- null = todo mundo da empresa; preenchido = só essa pessoa
  destinatario_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index avisos_company_id_idx on public.avisos(company_id);

create table public.aviso_leituras (
  aviso_id uuid not null references public.avisos(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (aviso_id, profile_id)
);

create table public.aviso_respostas (
  id uuid primary key default gen_random_uuid(),
  aviso_id uuid not null references public.avisos(id) on delete cascade,
  autor_id uuid not null references public.profiles(id) on delete cascade,
  mensagem text not null,
  created_at timestamptz not null default now()
);

create index aviso_respostas_aviso_id_idx on public.aviso_respostas(aviso_id);

alter table public.avisos enable row level security;
alter table public.aviso_leituras enable row level security;
alter table public.aviso_respostas enable row level security;

-- avisos: a própria empresa, e (é pra todo mundo OU é pra mim OU eu escrevi)
create policy "Equipe vê avisos da própria empresa"
  on public.avisos for select
  using (
    company_id = public.current_company_id()
    and (destinatario_id is null or destinatario_id = auth.uid() or autor_id = auth.uid())
  );

create policy "Owner cria aviso na própria empresa"
  on public.avisos for insert
  with check (
    company_id = public.current_company_id()
    and autor_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

-- leituras: só de avisos que a pessoa já pode ver (a policy de avisos acima
-- já filtra isso via join implícito do RLS); insere só a própria leitura
create policy "Equipe vê quem leu avisos que ela pode ver"
  on public.aviso_leituras for select
  using (
    exists (
      select 1 from public.avisos a
      where a.id = aviso_id and a.company_id = public.current_company_id()
    )
  );

create policy "Usuário marca a própria leitura"
  on public.aviso_leituras for insert
  with check (profile_id = auth.uid());

-- respostas: mesma regra de visibilidade dos avisos; qualquer um que veja
-- o aviso pode responder (dono ou o destinatário)
create policy "Equipe vê respostas de avisos que ela pode ver"
  on public.aviso_respostas for select
  using (
    exists (
      select 1 from public.avisos a
      where a.id = aviso_id
        and a.company_id = public.current_company_id()
        and (a.destinatario_id is null or a.destinatario_id = auth.uid() or a.autor_id = auth.uid())
    )
  );

create policy "Equipe responde avisos que ela pode ver"
  on public.aviso_respostas for insert
  with check (
    autor_id = auth.uid()
    and exists (
      select 1 from public.avisos a
      where a.id = aviso_id
        and a.company_id = public.current_company_id()
        and (a.destinatario_id is null or a.destinatario_id = auth.uid() or a.autor_id = auth.uid())
    )
  );
