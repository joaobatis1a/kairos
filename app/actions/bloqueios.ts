"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { registrarAuditoria } from "@/lib/auditoria"

export type Bloqueio = {
  id: string
  barbeiro_id: string | null
  barbeiro_nome: string | null
  inicio: string
  fim: string
  motivo: string
}

async function getUsuario() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: p } = await supabase
    .from("profiles")
    .select("id, nome, role, company_id")
    .eq("id", user.id)
    .single()
  if (!p) return null
  return { id: user.id, nome: p.nome as string, role: p.role as string, companyId: p.company_id as string }
}

export async function listarBloqueios(): Promise<Bloqueio[]> {
  const u = await getUsuario()
  if (!u) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from("bloqueios_agenda")
    .select("id, barbeiro_id, inicio, fim, motivo, barbeiro:profiles!barbeiro_id(nome)")
    .order("inicio", { ascending: true })

  return (data ?? []).map((b) => {
    const barbeiro = Array.isArray(b.barbeiro) ? b.barbeiro[0] : b.barbeiro
    return {
      id: b.id,
      barbeiro_id: b.barbeiro_id,
      barbeiro_nome: barbeiro?.nome ?? null,
      inicio: b.inicio,
      fim: b.fim,
      motivo: b.motivo,
    }
  })
}

export async function criarBloqueio(input: {
  barbeiroId: string | null
  inicio: string
  fim: string
  motivo: string
}) {
  const u = await getUsuario()
  if (!u) return { ok: false as const, error: "Sem permissão." }

  // Barbeiro só bloqueia a própria agenda; owner bloqueia qualquer um / a empresa.
  const barbeiroId = u.role === "owner" ? input.barbeiroId : u.id

  const inicio = new Date(input.inicio)
  const fim = new Date(input.fim)
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) || fim <= inicio) {
    return { ok: false as const, error: "Período inválido." }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("bloqueios_agenda").insert({
    company_id: u.companyId,
    barbeiro_id: barbeiroId,
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
    motivo: input.motivo.trim(),
  })

  if (error) return { ok: false as const, error: "Não foi possível criar a folga." }

  registrarAuditoria(u.companyId, u.nome, "Folga/bloqueio adicionado", input.motivo.trim())
  revalidatePath("/painel/gerenciamento")
  revalidatePath("/painel/agendamentos")
  return { ok: true as const }
}

export async function excluirBloqueio(id: string) {
  const u = await getUsuario()
  if (!u) return { ok: false as const, error: "Sem permissão." }

  const supabase = await createClient()
  const { error } = await supabase.from("bloqueios_agenda").delete().eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível remover." }

  revalidatePath("/painel/gerenciamento")
  revalidatePath("/painel/agendamentos")
  return { ok: true as const }
}
