-- ============================================================
-- Buckets de Storage: logos e avatares
-- ============================================================
-- Rode este arquivo no SQL Editor do Supabase, depois de migration_08.
--
-- Diferente de migration_06 (que assumia o bucket "logos" já criado
-- manualmente pelo painel), aqui os dois buckets são criados via SQL,
-- então este arquivo é a fonte única de verdade pra Storage do projeto.
-- As policies de "logos" já existem em migration_06_logo_empresa.sql
-- e continuam valendo; só falta o bucket em si.

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do nothing;

-- avatares: cada cliente autenticado tem uma pasta própria (auth.uid())
-- e gerencia só a sua. Padrão usado em app/actions/perfil-cliente.ts
-- (enviarFotoCliente / removerFotoCliente): caminho fixo `${user.id}/foto.<ext>`.

create policy "Leitura pública dos avatares"
  on storage.objects for select
  using (bucket_id = 'avatares');

create policy "Usuário envia o próprio avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuário substitui o próprio avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuário apaga o próprio avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
