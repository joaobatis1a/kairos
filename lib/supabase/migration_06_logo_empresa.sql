-- ============================================================
-- Logo da empresa
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase.
-- O bucket "logos" (público) já foi criado via API; este arquivo só
-- adiciona a coluna e as policies de Storage (mesmo padrão do bucket
-- "destaques": pasta = company_id, só o dono da empresa escreve/apaga).

alter table public.companies
  add column if not exists logo_url text not null default '';

create policy "Leitura pública dos arquivos de logo"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "Owner envia logo na pasta da própria empresa"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Owner substitui logo da própria empresa"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

create policy "Owner apaga logo da própria empresa"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = public.current_company_id()::text
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );
