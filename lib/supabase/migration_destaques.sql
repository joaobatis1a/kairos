-- ============================================================
-- Cortes em destaque — galeria de fotos da barbearia
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase.
-- O bucket "destaques" (público) já foi criado via API; este arquivo
-- cria a tabela, as policies de acesso e as policies do Storage.

create table public.destaques (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  titulo text not null default '',
  descricao text not null default '',
  foto_url text not null,
  -- caminho dentro do bucket, guardado pra conseguir apagar o arquivo
  -- quando o destaque for removido (a URL pública não serve pra isso)
  foto_path text not null default '',
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create index destaques_company_id_idx on public.destaques(company_id);

alter table public.destaques enable row level security;

-- leitura pública: aparecem no storefront pra visitante anônimo
create policy "Leitura pública de destaques"
  on public.destaques for select using (true);

-- escrita só pelo dono da própria empresa
create policy "Owner gerencia destaques da própria empresa"
  on public.destaques for all
  using (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  )
  with check (
    company_id = public.current_company_id()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

-- ── Storage ────────────────────────────────────────────────
-- Os arquivos ficam em destaques/<company_id>/<arquivo>. A primeira pasta
-- do caminho é o id da empresa, então dá pra amarrar o acesso à empresa
-- de quem está enviando.

create policy "Leitura pública dos arquivos de destaque"
  on storage.objects for select
  using (bucket_id = 'destaques');

create policy "Owner envia foto na pasta da própria empresa"
  on storage.objects for insert
  with check (
    bucket_id = 'destaques'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Owner apaga foto da própria empresa"
  on storage.objects for delete
  using (
    bucket_id = 'destaques'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );
