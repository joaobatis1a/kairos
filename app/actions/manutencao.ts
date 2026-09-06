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
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
  const { error: codeError } = await admin
    .from("invite_codes")
    .insert({ code, company_id: empresa.id, role: "owner", expires_at: expiresAt })

  if (codeError) {
    return { ok: false as const, error: "Empresa criada, mas não foi possível gerar o código de convite." }
  }

  await admin.from("horarios_config").insert({ company_id: empresa.id })

  revalidatePath("/manutencao")
  return { ok: true as const, id: empresa.id as string, code, expiresAt, slug }
}

export async function alternarStatusEmpresa(id: string, status: StatusEmpresa) {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()
  const { error } = await admin.from("companies").update({ status }).eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível atualizar o status." }
  revalidatePath("/manutencao")
  return { ok: true as const }
}

// Retorna o código de owner vigente, gerando um novo na hora se o
// existente já venceu (2 minutos de validade) — mesma lógica de
// "obterConviteBarbeiro" em app/actions/equipe.ts.
export async function verCodigoConvite(companyId: string) {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()
  const agora = new Date().toISOString()

  const { data: existente } = await admin
    .from("invite_codes")
    .select("code, expires_at")
    .eq("company_id", companyId)
    .eq("role", "owner")
    .gt("expires_at", agora)
    .maybeSingle()

  if (existente) return { code: existente.code, expiresAt: existente.expires_at }

  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .eq("role", "owner")
  if ((count ?? 0) > 0) return null // já tem dono, não faz sentido gerar código novo

  await admin.from("invite_codes").delete().eq("company_id", companyId).eq("role", "owner")

  const code = gerarCodigoConvite()
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
  const { error } = await admin
    .from("invite_codes")
    .insert({ code, company_id: companyId, role: "owner", expires_at: expiresAt })
  if (error) return null

  return { code, expiresAt }
}

// Força um código de owner novo agora, mesmo que o atual ainda seja
// válido (ex: foi enviado pra pessoa errada). Só funciona enquanto
// ninguém resgatou — depois que existe um owner, não faz sentido.
export async function rotacionarConviteOwner(companyId: string) {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .eq("role", "owner")

  if ((count ?? 0) > 0) {
    return { ok: false as const, error: "Essa empresa já tem um dono." }
  }

  await admin.from("invite_codes").delete().eq("company_id", companyId).eq("role", "owner")

  const code = gerarCodigoConvite()
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
  const { error } = await admin
    .from("invite_codes")
    .insert({ code, company_id: companyId, role: "owner", expires_at: expiresAt })
  if (error) return { ok: false as const, error: "Não foi possível gerar o código." }

  revalidatePath("/manutencao")
  return { ok: true as const, code, expiresAt }
}

export type MetricasPlataforma = {
  empresasAtivas: number
  empresasInativas: number
  totalEquipe: number
  totalClientes: number
  agendamentosMes: number
}

export async function getMetricasPlataforma(): Promise<MetricasPlataforma> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const inicioMes = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`

  const [ativas, inativas, equipe, clientes, agMes] = await Promise.all([
    admin.from("companies").select("id", { count: "exact", head: true }).eq("status", "ativo"),
    admin.from("companies").select("id", { count: "exact", head: true }).eq("status", "inativo"),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("clientes").select("id", { count: "exact", head: true }),
    admin.from("agendamentos").select("id", { count: "exact", head: true }).gte("data", inicioMes),
  ])

  return {
    empresasAtivas: ativas.count ?? 0,
    empresasInativas: inativas.count ?? 0,
    totalEquipe: equipe.count ?? 0,
    totalClientes: clientes.count ?? 0,
    agendamentosMes: agMes.count ?? 0,
  }
}

// Exclui a empresa e todo mundo que trabalha nela. Precisa apagar as contas
// de auth ANTES de apagar a empresa: profiles referencia auth.users (cascade),
// então apagar o usuário já limpa o profile; só depois disso dá pra apagar a
// company (que em cascata leva servicos/horarios_config/agendamentos/invite_codes).
export async function excluirEmpresa(id: string) {
  const contaAtual = await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: perfis } = await admin.from("profiles").select("id").eq("company_id", id)

  // Se a própria conta de manutenção (por engano, ou por ter testado o
  // onboarding com a própria conta) também é perfil dessa empresa, apagar
  // a empresa apagaria o login dela sem aviso nenhum — mesmo cuidado que
  // já existe pra removerContaManutencao, só que faltava aqui.
  if ((perfis ?? []).some((p) => p.id === contaAtual.id)) {
    return {
      ok: false as const,
      error: "Sua própria conta faz parte dessa empresa — remova-se da equipe dela antes de excluir.",
    }
  }

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
