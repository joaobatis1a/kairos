"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type NotificacaoDb = {
  id: string
  titulo: string
  corpo: string
  link: string | null
  created_at: string
  lida: boolean
}

async function getUsuarioAtual() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// As notificações já vêm filtradas por destinatário via RLS (ver
// migration_notificacoes.sql); aqui só precisa cruzar com o que o próprio
// usuário já marcou como lida.
export async function listarNotificacoes(): Promise<NotificacaoDb[]> {
  const user = await getUsuarioAtual()
  if (!user) return []

  const supabase = await createClient()

  const [{ data: notificacoes }, { data: lidas }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, titulo, corpo, link, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("notification_reads").select("notification_id").eq("profile_id", user.id),
  ])

  const idsLidas = new Set((lidas ?? []).map((l) => l.notification_id))
  return (notificacoes ?? []).map((n) => ({ ...n, lida: idsLidas.has(n.id) }))
}

export async function contarNaoLidas(): Promise<number> {
  const notificacoes = await listarNotificacoes()
  return notificacoes.filter((n) => !n.lida).length
}

export async function marcarComoLida(notificationId: string) {
  const user = await getUsuarioAtual()
  if (!user) return { ok: false as const, error: "Sessão expirada." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("notification_reads")
    .upsert({ notification_id: notificationId, profile_id: user.id }, { onConflict: "notification_id,profile_id" })

  if (error) return { ok: false as const, error: "Não foi possível marcar como lida." }
  revalidatePath("/painel", "layout")
  return { ok: true as const }
}

export async function marcarTodasComoLidas() {
  const user = await getUsuarioAtual()
  if (!user) return { ok: false as const, error: "Sessão expirada." }

  const notificacoes = await listarNotificacoes()
  const naoLidas = notificacoes.filter((n) => !n.lida)
  if (naoLidas.length === 0) return { ok: true as const }

  const supabase = await createClient()
  const { error } = await supabase
    .from("notification_reads")
    .upsert(
      naoLidas.map((n) => ({ notification_id: n.id, profile_id: user.id })),
      { onConflict: "notification_id,profile_id" },
    )

  if (error) return { ok: false as const, error: "Não foi possível marcar como lidas." }
  revalidatePath("/painel", "layout")
  return { ok: true as const }
}
