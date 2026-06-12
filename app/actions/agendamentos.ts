"use server"

import { createClient } from "@/lib/supabase/server"
import { servicos } from "@/config/barbearia"
import type { Profile } from "@/lib/types"

// Lista barbeiros ativos (público)
export async function getBarbeirosAtivos(): Promise<Pick<Profile, "id" | "nome">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome")

  if (error) {
    console.log("[v0] Erro ao buscar barbeiros:", error.message)
    return []
  }
  return (data ?? []).filter((b) => b.nome && b.nome.trim().length > 0)
}

// Retorna os horários já ocupados de um barbeiro em uma data
export async function getHorariosOcupados(barbeiroId: string, data: string): Promise<string[]> {
  const supabase = await createClient()
  const { data: ags, error } = await supabase
    .from("agendamentos")
    .select("horario")
    .eq("barbeiro_id", barbeiroId)
    .eq("data", data)
    .neq("status", "cancelado")

  if (error) {
    console.log("[v0] Erro ao buscar horários ocupados:", error.message)
    return []
  }
  // normaliza para HH:MM
  return (ags ?? []).map((a) => (a.horario as string).slice(0, 5))
}

type CriarAgendamentoInput = {
  clienteNome: string
  clienteWhatsapp: string
  servicoId: string
  barbeiroId: string
  data: string
  horario: string
  observacoes?: string
}

export async function criarAgendamento(input: CriarAgendamentoInput) {
  const servico = servicos.find((s) => s.id === input.servicoId)
  if (!servico) {
    return { ok: false, error: "Serviço inválido." }
  }

  if (!input.clienteNome.trim() || !input.clienteWhatsapp.trim()) {
    return { ok: false, error: "Preencha nome e WhatsApp." }
  }

  const supabase = await createClient()

  // Verifica se o horário ainda está livre (evita corrida)
  const { data: existentes } = await supabase
    .from("agendamentos")
    .select("id")
    .eq("barbeiro_id", input.barbeiroId)
    .eq("data", input.data)
    .eq("horario", input.horario)
    .neq("status", "cancelado")

  if (existentes && existentes.length > 0) {
    return { ok: false, error: "Esse horário acabou de ser preenchido. Escolha outro." }
  }

  const { error } = await supabase.from("agendamentos").insert({
    cliente_nome: input.clienteNome.trim(),
    cliente_whatsapp: input.clienteWhatsapp.trim(),
    servico_id: servico.id,
    servico_nome: servico.nome,
    servico_preco: servico.preco,
    barbeiro_id: input.barbeiroId,
    data: input.data,
    horario: input.horario,
    observacoes: input.observacoes?.trim() || null,
    status: "pendente",
  })

  if (error) {
    console.log("[v0] Erro ao criar agendamento:", error.message)
    return { ok: false, error: "Não foi possível concluir o agendamento. Tente novamente." }
  }

  return { ok: true }
}
