"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type Avaliacao = {
  id: string
  agendamento_id: string
  nota_servico: number
  nota_barbeiro: number | null
  comentario: string | null
  created_at: string
}

export async function getAvaliacaoDoAgendamento(agendamentoId: string): Promise<Avaliacao | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("avaliacoes")
    .select("*")
    .eq("agendamento_id", agendamentoId)
    .single()
  return data ?? null
}

export async function salvarAvaliacao(input: {
  agendamentoId: string
  barbeiroId: string | null
  notaServico: number
  notaBarbeiro: number | null
  comentario: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Não autenticado." }

  // Verifica se o agendamento pertence ao cliente e está finalizado
  const { data: ag } = await supabase
    .from("agendamentos")
    .select("id, status, cliente_whatsapp")
    .eq("id", input.agendamentoId)
    .eq("status", "finalizado")
    .single()

  if (!ag) return { ok: false, error: "Agendamento não encontrado ou não finalizado." }

  const { error } = await supabase.from("avaliacoes").upsert({
    agendamento_id: input.agendamentoId,
    cliente_id: user.id,
    barbeiro_id: input.barbeiroId,
    nota_servico: input.notaServico,
    nota_barbeiro: input.notaBarbeiro,
    comentario: input.comentario.trim() || null,
  }, { onConflict: "agendamento_id" })

  if (error) return { ok: false, error: error.message }

  revalidatePath("/conta/historico")
  return { ok: true }
}

export async function getHistoricoCliente() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: cliente } = await supabase
    .from("clientes")
    .select("whatsapp")
    .eq("id", user.id)
    .single()

  if (!cliente?.whatsapp) return []

  // Busca agendamentos pelo whatsapp do cliente
  const { data } = await supabase
    .from("agendamentos")
    .select(`
      id, servico_nome, servico_preco, barbeiro_id, data, horario, status,
      forma_pagamento, observacoes,
      barbeiro:profiles(id, nome),
      avaliacao:avaliacoes(id, nota_servico, nota_barbeiro, comentario)
    `)
    .eq("cliente_whatsapp", cliente.whatsapp)
    .order("data", { ascending: false })
    .order("horario", { ascending: false })

  return data ?? []
}
