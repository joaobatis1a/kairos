"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getContaManutencaoOuRedirect } from "@/lib/auth"
import { notificar } from "@/lib/notificacoes"
import { revalidatePath } from "next/cache"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"

export type MensagemSuporte = {
  id: string
  origem: "empresa" | "suporte"
  autor_nome: string
  mensagem: string
  created_at: string
}

export type ConversaSuporte = {
  companyId: string
  nome: string
  slug: string
  ultimaMensagem: string
  ultimaEm: string
  naoLidas: number
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

// ── Lado da barbearia ────────────────────────────────────────

export async function getConversaSuporte(): Promise<{ mensagens: MensagemSuporte[]; isOwner: boolean }> {
  const perfil = await getPerfilSuporte()
  if (!perfil) return { mensagens: [], isOwner: false }

  const supabase = await createClient()
  const { data } = await supabase
    .from("suporte_mensagens")
    .select("id, origem, autor_nome, mensagem, created_at")
    .eq("company_id", perfil.companyId)
    .order("created_at", { ascending: true })

  // marca a conversa como lida pelo lado da empresa
  await supabase
    .from("suporte_leituras")
    .upsert(
      { company_id: perfil.companyId, lado: "empresa", last_read_at: new Date().toISOString() },
      { onConflict: "company_id,lado" },
    )

  return { mensagens: (data ?? []) as MensagemSuporte[], isOwner: perfil.role === "owner" }
}

export async function enviarMensagemSuporte(texto: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const perfil = await getPerfilSuporte()
  if (!perfil || perfil.role !== "owner") return { ok: false as const, error: "Só o administrador fala com o suporte." }

  const mensagem = texto.trim()
  if (!mensagem) return { ok: false as const, error: "Escreva uma mensagem." }

  const supabase = await createClient()
  const { error } = await supabase.from("suporte_mensagens").insert({
    company_id: perfil.companyId,
    autor_id: perfil.id,
    origem: "empresa",
    autor_nome: perfil.nome || "Barbearia",
    mensagem,
  })

  if (error) return { ok: false as const, error: "Não foi possível enviar a mensagem." }

  revalidatePath("/painel/suporte")
  return { ok: true as const }
}

// ── Lado da manutenção (admin client, gated por ehContaManutencao) ────

export async function listarConversasSuporte(): Promise<ConversaSuporte[]> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: mensagens } = await admin
    .from("suporte_mensagens")
    .select("company_id, origem, mensagem, created_at")
    .order("created_at", { ascending: false })

  if (!mensagens?.length) return []

  const companyIds = Array.from(new Set(mensagens.map((m) => m.company_id)))

  const [{ data: empresas }, { data: leituras }] = await Promise.all([
    admin.from("companies").select("id, nome, slug").in("id", companyIds),
    admin.from("suporte_leituras").select("company_id, last_read_at").eq("lado", "suporte").in("company_id", companyIds),
  ])

  const empresaPorId = new Map((empresas ?? []).map((e) => [e.id, e]))
  const lidoEm = new Map((leituras ?? []).map((l) => [l.company_id, l.last_read_at]))

  return companyIds
    .map((cid) => {
      const daEmpresa = mensagens.filter((m) => m.company_id === cid)
      const ultima = daEmpresa[0] // já vem desc
      const lastRead = lidoEm.get(cid)
      const naoLidas = daEmpresa.filter(
        (m) => m.origem === "empresa" && (!lastRead || m.created_at > lastRead),
      ).length
      const empresa = empresaPorId.get(cid)
      return {
        companyId: cid,
        nome: empresa?.nome ?? "Empresa",
        slug: empresa?.slug ?? "",
        ultimaMensagem: ultima.mensagem,
        ultimaEm: ultima.created_at,
        naoLidas,
      }
    })
    .sort((a, b) => b.ultimaEm.localeCompare(a.ultimaEm))
}

export async function getConversaSuporteAdmin(
  companyId: string,
): Promise<{ nome: string; mensagens: MensagemSuporte[] } | null> {
  await getContaManutencaoOuRedirect()
  const admin = createAdminClient()

  const { data: empresa } = await admin.from("companies").select("nome").eq("id", companyId).maybeSingle()
  if (!empresa) return null

  const { data } = await admin
    .from("suporte_mensagens")
    .select("id, origem, autor_nome, mensagem, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true })

  await admin
    .from("suporte_leituras")
    .upsert(
      { company_id: companyId, lado: "suporte", last_read_at: new Date().toISOString() },
      { onConflict: "company_id,lado" },
    )

  return { nome: empresa.nome, mensagens: (data ?? []) as MensagemSuporte[] }
}

export async function responderSuporteAdmin(companyId: string, texto: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const user = await getContaManutencaoOuRedirect()
  const mensagem = texto.trim()
  if (!mensagem) return { ok: false as const, error: "Escreva uma mensagem." }

  const admin = createAdminClient()
  const { error } = await admin.from("suporte_mensagens").insert({
    company_id: companyId,
    autor_id: user.id,
    origem: "suporte",
    autor_nome: "Suporte",
    mensagem,
  })

  if (error) return { ok: false as const, error: "Não foi possível enviar a resposta." }

  notificar({
    companyId,
    titulo: "Resposta do suporte",
    corpo: mensagem.length > 80 ? mensagem.slice(0, 80) + "…" : mensagem,
    link: "/painel/suporte",
    destinatarioRole: "owner",
  })

  revalidatePath("/manutencao/suporte")
  return { ok: true as const }
}
