"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getContaManutencaoOuRedirect } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { StatusEmpresa } from "@/lib/types"

export type EmpresaManutencao = {
  id: string
  slug: string
  nome: string
  status: StatusEmpresa
  createdAt: string
  totalEquipe: number
  ownerNome: string | null
}

function gerarCodigoConvite(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // sem 0/O, 1/I pra evitar confusão
  let code = ""
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function slugBase(nome: string): string {
  const base = nome
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "") // remove marcas diacríticas (acentos) após normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return base || "barbearia"
}

async function gerarSlugUnico(admin: ReturnType<typeof createAdminClient>, nome: string) {
  const base = slugBase(nome)
  let slug = base
  let tentativa = 0
  while (true) {
    const { data } = await admin.from("companies").select("id").eq("slug", slug).maybeSingle()
    if (!data) return slug
    tentativa += 1
    slug = `${base}-${tentativa + 1}`
  }
}

export async function listarEmpresas(): Promise<EmpresaManutencao[]> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: empresas } = await admin
    .from("companies")
    .select("id, slug, nome, status, created_at")
    .order("created_at", { ascending: false })

  if (!empresas?.length) return []

  const { data: perfis } = await admin
    .from("profiles")
    .select("company_id, nome, role")
    .in("company_id", empresas.map((e) => e.id))

  return empresas.map((e) => {
    const daEmpresa = (perfis ?? []).filter((p) => p.company_id === e.id)
    const owner = daEmpresa.find((p) => p.role === "owner")
    return {
      id: e.id,
      slug: e.slug,
      nome: e.nome,
      status: e.status as StatusEmpresa,
      createdAt: e.created_at,
      totalEquipe: daEmpresa.length,
      ownerNome: owner?.nome ?? null,
    }
  })
}

export async function criarEmpresa(nome: string) {
  await getContaManutencaoOuRedirect()
  const nomeTratado = nome.trim()
  if (!nomeTratado) return { ok: false as const, error: "Informe o nome da barbearia." }

  const admin = createAdminClient()
  const slug = await gerarSlugUnico(admin, nomeTratado)

  const { data: empresa, error } = await admin
    .from("companies")
    .insert({ nome: nomeTratado, slug })
    .select("id")
    .single()

  if (error || !empresa) {
    return { ok: false as const, error: "Não foi possível criar a empresa." }
  }

  const code = gerarCodigoConvite()
  const { error: codeError } = await admin
    .from("invite_codes")
    .insert({ code, company_id: empresa.id, role: "owner" })

  if (codeError) {
    return { ok: false as const, error: "Empresa criada, mas não foi possível gerar o código de convite." }
  }

  await admin.from("horarios_config").insert({ company_id: empresa.id })

  revalidatePath("/manutencao")
  return { ok: true as const, code, slug }
}

export async function alternarStatusEmpresa(id: string, status: StatusEmpresa) {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()
  const { error } = await admin.from("companies").update({ status }).eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível atualizar o status." }
  revalidatePath("/manutencao")
  return { ok: true as const }
}

export async function verCodigoConvite(companyId: string) {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()
  const { data } = await admin
    .from("invite_codes")
    .select("code")
    .eq("company_id", companyId)
    .eq("role", "owner")
    .maybeSingle()
  return data?.code ?? null
}

// Exclui a empresa e todo mundo que trabalha nela. Precisa apagar as contas
// de auth ANTES de apagar a empresa: profiles referencia auth.users (cascade),
// então apagar o usuário já limpa o profile; só depois disso dá pra apagar a
// company (que em cascata leva servicos/horarios_config/agendamentos/invite_codes).
export async function excluirEmpresa(id: string) {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: perfis } = await admin.from("profiles").select("id").eq("company_id", id)

  for (const perfil of perfis ?? []) {
    await admin.auth.admin.deleteUser(perfil.id)
  }

  const { error } = await admin.from("companies").delete().eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível excluir a empresa." }

  revalidatePath("/manutencao")
  return { ok: true as const }
}

// ── Equipe de manutenção (outros superadmins da plataforma) ──────────

export type ContaManutencao = {
  id: string
  email: string
  createdAt: string
}

export async function listarContasManutencao(): Promise<ContaManutencao[]> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()
  const { data } = await admin
    .from("maintenance_accounts")
    .select("id, email, created_at")
    .order("created_at", { ascending: true })

  return (data ?? []).map((c) => ({ id: c.id, email: c.email, createdAt: c.created_at }))
}

export async function adicionarContaManutencao(email: string) {
  await getContaManutencaoOuRedirect()
  const emailTratado = email.trim().toLowerCase()
  if (!emailTratado || !emailTratado.includes("@")) {
    return { ok: false as const, error: "Informe um e-mail válido." }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("maintenance_accounts").insert({ email: emailTratado })

  if (error) {
    const jaExiste = error.message.toLowerCase().includes("duplicate")
    return {
      ok: false as const,
      error: jaExiste ? "Esse e-mail já é uma conta de manutenção." : "Não foi possível adicionar.",
    }
  }

  revalidatePath("/manutencao/equipe")
  return { ok: true as const }
}

// Nunca deixa remover a própria conta nem a última conta de manutenção
// restante — sem isso dava pra travar o acesso à plataforma inteira.
export async function removerContaManutencao(id: string) {
  const user = await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { count } = await admin.from("maintenance_accounts").select("id", { count: "exact", head: true })
  if ((count ?? 0) <= 1) {
    return { ok: false as const, error: "Não é possível remover a última conta de manutenção." }
  }

  const { data: alvo } = await admin.from("maintenance_accounts").select("email").eq("id", id).maybeSingle()
  if (alvo?.email === user.email) {
    return { ok: false as const, error: "Você não pode remover a própria conta." }
  }

  const { error } = await admin.from("maintenance_accounts").delete().eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível remover." }

  revalidatePath("/manutencao/equipe")
  return { ok: true as const }
}
