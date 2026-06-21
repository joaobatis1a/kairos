"use server"

import { createClient } from "@/lib/supabase/server"
import { getBarbeariaConfig } from "@/app/actions/config"
import { enviarEmailConfirmacao } from "@/lib/emails"
import type { Profile, FormaPagamento } from "@/lib/types"

export async function getBarbeirosAtivos(): Promise<Pick<Profile, "id" | "nome">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, role, atende_como_barbeiro")
    .eq("ativo", true)
    .order("nome")

  if (error) {
    console.log("[v0] Erro ao buscar barbeiros:", error.message)
    return []
  }

  return (data ?? []).filter((b) => {
    if (!b.nome || b.nome.trim().length === 0) return false
    if (b.role === "barber") return true
    if (b.role === "owner") return b.atende_como_barbeiro === true
    return false
  })
}

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
  return (ags ?? []).map((a) => (a.horario as string).slice(0, 5))
}

type CriarAgendamentoInput = {
  clienteNome: string
  clienteWhatsapp: string
  servicoId: string       // uuid do banco
  servicoNome: string
  servicoPreco: number
  barbeiroId: string
  data: string
  horario: string
  observacoes?: string
  formaPagamento: FormaPagamento
}

export async function criarAgendamento(input: CriarAgendamentoInput) {
  if (!input.clienteNome.trim() || !input.clienteWhatsapp.trim()) {
    return { ok: false, error: "Preencha nome e WhatsApp." }
  }

  const supabase = await createClient()

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
    servico_id: input.servicoId,
    servico_nome: input.servicoNome,
    servico_preco: input.servicoPreco,
    barbeiro_id: input.barbeiroId,
    data: input.data,
    horario: input.horario,
    observacoes: input.observacoes?.trim() || null,
    forma_pagamento: input.formaPagamento,
    status: "pendente",
  })

  if (error) {
    console.log("[v0] Erro ao criar agendamento:", error.message)
    return { ok: false, error: "Não foi possível concluir o agendamento. Tente novamente." }
  }

  // Envia email de confirmação (sem bloquear a resposta)
  getBarbeariaConfig().then((config) => {
    enviarEmailConfirmacao({
      clienteNome: input.clienteNome,
      clienteEmail: null, // cliente não tem email obrigatório ainda
      servicoNome: input.servicoNome,
      servicoPreco: input.servicoPreco,
      barbeiroNome: null,
      data: input.data,
      horario: input.horario,
      nomeBarbearia: config.nome,
    })
  })

  return { ok: true }
}
