"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getContaManutencaoOuRedirect } from "@/lib/auth"
import { notificar } from "@/lib/notificacoes"
import { revalidatePath } from "next/cache"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"

export type StatusChamado = "aberto" | "encerrado"

export type MensagemChamado = {
  id: string
  origem: "empresa" | "suporte"
  autor_nome: string
  mensagem: string
  created_at: string
}

export type ChamadoResumo = {
  id: string
  titulo: string
  status: StatusChamado
  autorNome: string
  updatedAt: string
  naoLidas: number
}

export type ChamadoAdminResumo = ChamadoResumo & {
  companyId: string
  empresaNome: string
  empresaSlug: string
}

async function getPerfilSuporte() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: perfil } = await supabase
    .from("profiles")
    .select("id, nome, role, company_id")
    .eq("id", user.id)
    .single()
  if (!perfil) return null
  return { id: user.id, nome: perfil.nome as string, role: perfil.role as string, companyId: perfil.company_id as string }
}

// ── Lado da barbearia (dono ou barbeiro — qualquer um da equipe) ────────

export async function listarChamados(): Promise<ChamadoResumo[]> {
  const perfil = await getPerfilSuporte()
  if (!perfil) return []

  const supabase = await createClient()
  const { data: chamados } = await supabase
    .from("chamados")
    .select("id, titulo, status, autor_nome, updated_at")
    .eq("company_id", perfil.companyId)
    .order("updated_at", { ascending: false })

  if (!chamados?.length) return []

  const ids = chamados.map((c) => c.id)
  const [{ data: mensagens }, { data: leituras }] = await Promise.all([
    supabase.from("chamado_mensagens").select("chamado_id, origem, created_at").in("chamado_id", ids),
    supabase.from("chamado_leituras").select("chamado_id, last_read_at").eq("lado", "empresa").in("chamado_id", ids),
  ])

  const lidoEm = new Map((leituras ?? []).map((l) => [l.chamado_id, l.last_read_at]))

  return chamados.map((c) => {
    const lastRead = lidoEm.get(c.id)
    const naoLidas = (mensagens ?? []).filter(
      (m) => m.chamado_id === c.id && m.origem === "suporte" && (!lastRead || m.created_at > lastRead),
    ).length
    return {
      id: c.id,
      titulo: c.titulo,
      status: c.status as StatusChamado,
      autorNome: c.autor_nome,
      updatedAt: c.updated_at,
      naoLidas,
    }
  })
}

export async function abrirChamado(titulo: string, mensagem: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const perfil = await getPerfilSuporte()
  if (!perfil) return { ok: false as const, error: "Não autenticado." }

  const tituloTratado = titulo.trim()
  const mensagemTratada = mensagem.trim()
  if (!tituloTratado || !mensagemTratada) return { ok: false as const, error: "Preencha título e mensagem." }

  const supabase = await createClient()
  const { data: chamado, error } = await supabase
    .from("chamados")
    .insert({ company_id: perfil.companyId, autor_id: perfil.id, autor_nome: perfil.nome || "Equipe", titulo: tituloTratado })
    .select("id")
    .single()

  if (error || !chamado) return { ok: false as const, error: "Não foi possível abrir o chamado." }

  const { error: msgError } = await supabase.from("chamado_mensagens").insert({
    chamado_id: chamado.id,
    autor_id: perfil.id,
    origem: "empresa",
    autor_nome: perfil.nome || "Equipe",
    mensagem: mensagemTratada,
  })
  if (msgError) return { ok: false as const, error: "Chamado aberto, mas a mensagem não foi enviada." }

  revalidatePath("/painel/suporte")
  return { ok: true as const, id: chamado.id as string }
}

export async function getChamado(id: string): Promise<{ titulo: string; status: StatusChamado; mensagens: MensagemChamado[] } | null> {
  const perfil = await getPerfilSuporte()
  if (!perfil) return null

  const supabase = await createClient()
  const { data: chamado } = await supabase
    .from("chamados")
    .select("titulo, status")
    .eq("id", id)
    .eq("company_id", perfil.companyId)
    .maybeSingle()
  if (!chamado) return null

  const { data: mensagens } = await supabase
    .from("chamado_mensagens")
    .select("id, origem, autor_nome, mensagem, created_at")
    .eq("chamado_id", id)
    .order("created_at", { ascending: true })

  await supabase
    .from("chamado_leituras")
    .upsert({ chamado_id: id, lado: "empresa", last_read_at: new Date().toISOString() }, { onConflict: "chamado_id,lado" })

  return { titulo: chamado.titulo, status: chamado.status as StatusChamado, mensagens: (mensagens ?? []) as MensagemChamado[] }
}

export async function responderChamado(id: string, texto: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const perfil = await getPerfilSuporte()
  if (!perfil) return { ok: false as const, error: "Não autenticado." }

  const mensagem = texto.trim()
  if (!mensagem) return { ok: false as const, error: "Escreva uma mensagem." }

  const supabase = await createClient()
  const { error } = await supabase.from("chamado_mensagens").insert({
    chamado_id: id,
    autor_id: perfil.id,
    origem: "empresa",
    autor_nome: perfil.nome || "Equipe",
    mensagem,
  })
  if (error) return { ok: false as const, error: "Não foi possível enviar a mensagem." }

  revalidatePath("/painel/suporte")
  return { ok: true as const }
}

export async function alternarStatusChamado(id: string, status: StatusChamado) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const perfil = await getPerfilSuporte()
  if (!perfil) return { ok: false as const, error: "Não autenticado." }

  const supabase = await createClient()
  const { error } = await supabase.from("chamados").update({ status }).eq("id", id).eq("company_id", perfil.companyId)
  if (error) return { ok: false as const, error: "Não foi possível atualizar o chamado." }

  revalidatePath("/painel/suporte")
  return { ok: true as const }
}

// ── Lado da manutenção (admin client, gated por ehContaManutencao) ────

export async function listarChamadosAdmin(): Promise<ChamadoAdminResumo[]> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: chamados } = await admin
    .from("chamados")
    .select("id, company_id, titulo, status, autor_nome, updated_at")
    .order("updated_at", { ascending: false })

  if (!chamados?.length) return []

  const companyIds = Array.from(new Set(chamados.map((c) => c.company_id)))
  const ids = chamados.map((c) => c.id)

  const [{ data: empresas }, { data: mensagens }, { data: leituras }] = await Promise.all([
    admin.from("companies").select("id, nome, slug").in("id", companyIds),
    admin.from("chamado_mensagens").select("chamado_id, origem, created_at").in("chamado_id", ids),
    admin.from("chamado_leituras").select("chamado_id, last_read_at").eq("lado", "suporte").in("chamado_id", ids),
  ])

  const empresaPorId = new Map((empresas ?? []).map((e) => [e.id, e]))
  const lidoEm = new Map((leituras ?? []).map((l) => [l.chamado_id, l.last_read_at]))

  return chamados.map((c) => {
    const lastRead = lidoEm.get(c.id)
    const naoLidas = (mensagens ?? []).filter(
      (m) => m.chamado_id === c.id && m.origem === "empresa" && (!lastRead || m.created_at > lastRead),
    ).length
    const empresa = empresaPorId.get(c.company_id)
    return {
      id: c.id,
      companyId: c.company_id,
      empresaNome: empresa?.nome ?? "Empresa",
      empresaSlug: empresa?.slug ?? "",
      titulo: c.titulo,
      status: c.status as StatusChamado,
      autorNome: c.autor_nome,
      updatedAt: c.updated_at,
      naoLidas,
    }
  })
}

export async function getChamadoAdmin(id: string): Promise<{ titulo: string; status: StatusChamado; empresaNome: string; mensagens: MensagemChamado[] } | null> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: chamado } = await admin.from("chamados").select("titulo, status, company_id").eq("id", id).maybeSingle()
  if (!chamado) return null

  const [{ data: empresa }, { data: mensagens }] = await Promise.all([
    admin.from("companies").select("nome").eq("id", chamado.company_id).maybeSingle(),
    admin.from("chamado_mensagens").select("id, origem, autor_nome, mensagem, created_at").eq("chamado_id", id).order("created_at", { ascending: true }),
  ])

  await admin
    .from("chamado_leituras")
    .upsert({ chamado_id: id, lado: "suporte", last_read_at: new Date().toISOString() }, { onConflict: "chamado_id,lado" })

  return {
    titulo: chamado.titulo,
    status: chamado.status as StatusChamado,
    empresaNome: empresa?.nome ?? "Empresa",
    mensagens: (mensagens ?? []) as MensagemChamado[],
  }
}

export async function responderChamadoAdmin(id: string, texto: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  await getContaManutencaoOuRedirect()
  const mensagem = texto.trim()
  if (!mensagem) return { ok: false as const, error: "Escreva uma mensagem." }

  const admin = createAdminClient()
  const { data: chamado } = await admin.from("chamados").select("company_id, autor_id").eq("id", id).maybeSingle()
  if (!chamado) return { ok: false as const, error: "Chamado não encontrado." }

  const { error } = await admin.from("chamado_mensagens").insert({
    chamado_id: id,
    origem: "suporte",
    autor_nome: "Suporte",
    mensagem,
  })
  if (error) return { ok: false as const, error: "Não foi possível enviar a resposta." }

  notificar({
    companyId: chamado.company_id,
    titulo: "Resposta do suporte",
    corpo: mensagem.length > 80 ? mensagem.slice(0, 80) + "…" : mensagem,
    link: "/painel/suporte",
    destinatarioId: chamado.autor_id ?? undefined,
  })

  revalidatePath("/manutencao/suporte")
  return { ok: true as const }
}

export async function alternarStatusChamadoAdmin(id: string, status: StatusChamado) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()
  const { error } = await admin.from("chamados").update({ status }).eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível atualizar o chamado." }

  revalidatePath("/manutencao/suporte")
  return { ok: true as const }
}
