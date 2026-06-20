"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { AgendamentoComBarbeiro, StatusAgendamento } from "@/lib/types"

async function getUsuario() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single()
  return profile ? { id: profile.id, role: profile.role as string } : null
}

// Lista agendamentos. Dono vê todos; barbeiro vê os seus.
export async function listarAgendamentos(filtro?: {
  data?: string
  status?: StatusAgendamento
}): Promise<AgendamentoComBarbeiro[]> {
  const usuario = await getUsuario()
  if (!usuario) return []

  const supabase = await createClient()
  let query = supabase
    .from("agendamentos")
    .select("*, barbeiro:profiles!agendamentos_barbeiro_id_fkey(id, nome)")
    .order("data", { ascending: true })
    .order("horario", { ascending: true })

  if (usuario.role !== "owner") {
    query = query.eq("barbeiro_id", usuario.id)
  }
  if (filtro?.data) query = query.eq("data", filtro.data)
  if (filtro?.status) query = query.eq("status", filtro.status)

  const { data, error } = await query
  if (error) {
    console.log("[v0] Erro ao listar agendamentos:", error.message)
    return []
  }
  return (data ?? []) as AgendamentoComBarbeiro[]
}

export async function atualizarStatusAgendamento(id: string, status: StatusAgendamento) {
  const usuario = await getUsuario()
  if (!usuario) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { error } = await supabase.from("agendamentos").update({ status }).eq("id", id)
  if (error) {
    console.log("[v0] Erro ao atualizar status:", error.message)
    return { ok: false, error: error.message }
  }
  revalidatePath("/painel")
  revalidatePath("/painel/agendamentos")
  revalidatePath("/painel/agenda")
  return { ok: true }
}

export async function cancelarAgendamento(id: string, motivo: string) {
  const usuario = await getUsuario()
  if (!usuario) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("agendamentos")
    .update({ status: "cancelado", motivo_cancelamento: motivo })
    .eq("id", id)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel")
  revalidatePath("/painel/agendamentos")
  revalidatePath("/painel/agenda")
  return { ok: true }
}

export async function excluirAgendamento(id: string) {
  const usuario = await getUsuario()
  if (!usuario) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { error } = await supabase.from("agendamentos").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel")
  revalidatePath("/painel/agendamentos")
  revalidatePath("/painel/agenda")
  return { ok: true }
}

export async function sair() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
