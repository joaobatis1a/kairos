"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { notificar } from "@/lib/notificacoes"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"

export type AvisoDb = {
  id: string
  titulo: string
  mensagem: string
  autor_id: string
  autor_nome: string
  destinatario_id: string | null
  destinatario_nome: string | null
  created_at: string
  lido: boolean
  total_respostas: number
}

export type RespostaAvisoDb = {
  id: string
  autor_id: string
  autor_nome: string
  mensagem: string
  created_at: string
}

async function getUsuarioAtual() {
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

export async function listarAvisos(): Promise<AvisoDb[]> {
  const usuario = await getUsuarioAtual()
  if (!usuario) return []

  const supabase = await createClient()

  const [{ data: avisos }, { data: leituras }] = await Promise.all([
    supabase
      .from("avisos")
      .select("id, titulo, mensagem, autor_id, destinatario_id, created_at, autor:profiles!autor_id(nome), destinatario:profiles!destinatario_id(nome)")
      .eq("company_id", usuario.companyId)
      .order("created_at", { ascending: false }),
    supabase.from("aviso_leituras").select("aviso_id").eq("profile_id", usuario.id),
  ])

  if (!avisos) return []

  const idsLidos = new Set((leituras ?? []).map((l) => l.aviso_id))

  const { data: respostasCount } = await supabase
    .from("aviso_respostas")
    .select("aviso_id")
    .in("aviso_id", avisos.map((a) => a.id))

  const contagem = new Map<string, number>()
  for (const r of respostasCount ?? []) {
    contagem.set(r.aviso_id, (contagem.get(r.aviso_id) ?? 0) + 1)
  }

  return avisos.map((a) => {
    const autor = Array.isArray(a.autor) ? a.autor[0] : a.autor
    const destinatario = Array.isArray(a.destinatario) ? a.destinatario[0] : a.destinatario
    return {
      id: a.id,
      titulo: a.titulo,
      mensagem: a.mensagem,
      autor_id: a.autor_id,
      autor_nome: autor?.nome ?? "Equipe",
      destinatario_id: a.destinatario_id,
      destinatario_nome: destinatario?.nome ?? null,
      created_at: a.created_at,
      lido: idsLidos.has(a.id),
      total_respostas: contagem.get(a.id) ?? 0,
    }
  })
}

export async function listarEquipeParaAviso(): Promise<{ id: string; nome: string }[]> {
  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.role !== "owner") return []

  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, nome")
    .eq("company_id", usuario.companyId)
    .neq("id", usuario.id)
    .order("nome")

  return data ?? []
}

export async function criarAviso(input: { titulo: string; mensagem: string; destinatarioId: string | null }) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const usuario = await getUsuarioAtual()
  if (!usuario || usuario.role !== "owner") return { ok: false as const, error: "Sem permissão." }

  const titulo = input.titulo.trim()
  const mensagem = input.mensagem.trim()
  if (!titulo || !mensagem) return { ok: false as const, error: "Preencha título e mensagem." }

  const supabase = await createClient()
  const { data: aviso, error } = await supabase
    .from("avisos")
    .insert({
      company_id: usuario.companyId,
      autor_id: usuario.id,
      titulo,
      mensagem,
      destinatario_id: input.destinatarioId,
    })
    .select("id")
    .single()

  if (error || !aviso) return { ok: false as const, error: "Não foi possível criar o aviso." }

  notificar({
    companyId: usuario.companyId,
    titulo: "Novo aviso",
    corpo: titulo,
    link: "/painel/avisos",
    destinatarioId: input.destinatarioId ?? undefined,
  })

  revalidatePath("/painel/avisos")
  return { ok: true as const }
}

export async function marcarAvisoLido(avisoId: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const usuario = await getUsuarioAtual()
  if (!usuario) return { ok: false as const, error: "Sessão expirada." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("aviso_leituras")
    .upsert({ aviso_id: avisoId, profile_id: usuario.id }, { onConflict: "aviso_id,profile_id" })

  if (error) return { ok: false as const, error: "Não foi possível marcar como lido." }
  revalidatePath("/painel/avisos")
  return { ok: true as const }
}

export async function listarRespostas(avisoId: string): Promise<RespostaAvisoDb[]> {
  const usuario = await getUsuarioAtual()
  if (!usuario) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from("aviso_respostas")
    .select("id, autor_id, mensagem, created_at, autor:profiles!autor_id(nome)")
    .eq("aviso_id", avisoId)
    .order("created_at", { ascending: true })

  return (data ?? []).map((r) => {
    const autor = Array.isArray(r.autor) ? r.autor[0] : r.autor
    return {
      id: r.id,
      autor_id: r.autor_id,
      autor_nome: autor?.nome ?? "Equipe",
      mensagem: r.mensagem,
      created_at: r.created_at,
    }
  })
}

export async function responderAviso(avisoId: string, mensagem: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const usuario = await getUsuarioAtual()
  if (!usuario) return { ok: false as const, error: "Sessão expirada." }

  const texto = mensagem.trim()
  if (!texto) return { ok: false as const, error: "Escreva uma resposta." }

  const supabase = await createClient()
  const { error } = await supabase.from("aviso_respostas").insert({
    aviso_id: avisoId,
    autor_id: usuario.id,
    mensagem: texto,
  })

  if (error) return { ok: false as const, error: "Não foi possível enviar a resposta." }

  // avisa o autor original do aviso (se não for quem acabou de responder)
  const admin = createAdminClient()
  const { data: aviso } = await admin.from("avisos").select("autor_id, titulo, company_id").eq("id", avisoId).single()
  if (aviso && aviso.autor_id !== usuario.id) {
    notificar({
      companyId: aviso.company_id,
      titulo: "Nova resposta no aviso",
      corpo: `${usuario.nome} respondeu: "${aviso.titulo}"`,
      link: "/painel/avisos",
      destinatarioId: aviso.autor_id,
    })
  }

  revalidatePath("/painel/avisos")
  return { ok: true as const }
}
