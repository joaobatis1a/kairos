-- ============================================================
-- Vitrine de produtos (itens vendidos no balcão, sem checkout)
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_14.
--
-- Mesmo padrão de servicos: leitura pública (storefront), escrita só via
-- client admin dentro de app/actions/config.ts (já checa owner). Não tem
-- estoque nem pagamento — é só uma vitrine pra despertar interesse; a venda
-- continua acontecendo presencialmente na barbearia.

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  nome text not null,
  descricao text not null default '',
  preco numeric(10,2) not null default 0,
  foto_url text not null default '',
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create index produtos_company_id_idx on public.produtos(company_id);

alter table public.produtos enable row level security;

create policy "Leitura pública de produtos" on public.produtos for select using (true);

-- Bucket de fotos de produto — mesmo padrão do bucket "logos"
-- (migration_06/09): pasta = company_id, só o owner da empresa escreve.
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "Leitura pública dos arquivos de produto"
  on storage.objects for select
  using (bucket_id = 'produtos');

create policy "Owner envia foto de produto na pasta da própria empresa"
  on storage.objects for insert
  with check (
    bucket_id = 'produtos'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Owner substitui foto de produto da própria empresa"
  on storage.objects for update
  using (
    bucket_id = 'produtos'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Owner apaga foto de produto da própria empresa"
  on storage.objects for delete
  using (
    bucket_id = 'produtos'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );
