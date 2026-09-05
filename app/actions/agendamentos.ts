"use server"

import { createClient } from "@/lib/supabase/server"
import { getBarbeariaConfig } from "@/app/actions/config"
import { enviarEmailConfirmacao } from "@/lib/emails"
import { notificar } from "@/lib/notificacoes"
import type { Profile, FormaPagamento } from "@/lib/types"

export async function getBarbeirosAtivos(companyId: string): Promise<Pick<Profile, "id" | "nome">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, role, atende_como_barbeiro")
    .eq("company_id", companyId)
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
  const { data: horarios, error } = await supabase.rpc("agendamentos_ocupados", {
    p_barbeiro_id: barbeiroId,
    p_data: data,
  })

  if (error) {
    console.log("[v0] Erro ao buscar horários ocupados:", error.message)
    return []
  }
  return ((horarios ?? []) as { horario: string }[]).map((h) => h.horario.slice(0, 5))
}

type CriarAgendamentoInput = {
  companyId: string
  clienteNome: string
  clienteWhatsapp: string
  servicoId: string       // uuid do banco
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

  // Exige conta de cliente para agendar
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Você precisa estar logado para agendar." }
  }

  // Nome e preço vêm do banco, nunca do payload do cliente — senão dá pra
  // agendar qualquer serviço de graça só editando o request no devtools.
  // O filtro por company_id também impede passar o id de um serviço de
  // outra empresa junto com o barbeiroId desta.
  const { data: servico } = await supabase
    .from("servicos")
    .select("nome, preco")
    .eq("id", input.servicoId)
    .eq("company_id", input.companyId)
    .single()

  if (!servico) {
    return { ok: false, error: "Serviço inválido." }
  }

  const { data: existentes } = await supabase
    .from("agendamentos")
    .select("id")
    .eq("company_id", input.companyId)
    .eq("barbeiro_id", input.barbeiroId)
    .eq("data", input.data)
    .eq("horario", input.horario)
    .neq("status", "cancelado")

  if (existentes && existentes.length > 0) {
    return { ok: false, error: "Esse horário acabou de ser preenchido. Escolha outro." }
  }

  const { error } = await supabase.from("agendamentos").insert({
    company_id: input.companyId,
    cliente_nome: input.clienteNome.trim(),
    cliente_whatsapp: input.clienteWhatsapp.trim(),
    servico_id: input.servicoId,
    servico_nome: servico.nome,
    servico_preco: servico.preco,
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
  getBarbeariaConfig(input.companyId).then((config) => {
    enviarEmailConfirmacao({
      clienteNome: input.clienteNome,
      clienteEmail: null, // cliente não tem email obrigatório ainda
      servicoNome: servico.nome,
      servicoPreco: servico.preco,
      barbeiroNome: null,
      data: input.data,
      horario: input.horario,
      nomeBarbearia: config.nome,
    })
  })

  notificar({
    companyId: input.companyId,
    titulo: "Novo agendamento pendente",
    corpo: `${input.clienteNome} agendou ${servico.nome} para ${input.data} às ${input.horario}.`,
    link: "/painel/agendamentos",
    destinatarioRole: "owner",
  })

  return { ok: true }
}

export type BarbeiroVitrine = {
  id: string
  nome: string
  nota: number | null
  totalAvaliacoes: number
  totalCortes: number
}

/**
 * Barbeiros da vitrine com a reputação real deles. A seção "Quem corta"
 * mostrava só o nome — nada que ajudasse a pessoa a escolher. Avaliação
 * tem leitura pública (ver policy no schema), então dá pra exibir sem expor
 * dado de cliente.
 */
export async function getBarbeirosVitrine(companyId: string): Promise<BarbeiroVitrine[]> {
  const barbeiros = await getBarbeirosAtivos(companyId)
  if (barbeiros.length === 0) return []

  const supabase = await createClient()
  const ids = barbeiros.map((b) => b.id)

  const [{ data: avaliacoes }, { data: finalizados }] = await Promise.all([
    supabase.from("avaliacoes").select("barbeiro_id, nota_barbeiro").in("barbeiro_id", ids),
    supabase
      .from("agendamentos")
      .select("barbeiro_id")
      .eq("company_id", companyId)
      .eq("status", "finalizado")
      .in("barbeiro_id", ids),
  ])

  return barbeiros.map((b) => {
    const notas = (avaliacoes ?? [])
      .filter((a) => a.barbeiro_id === b.id && a.nota_barbeiro !== null)
      .map((a) => a.nota_barbeiro as number)
    return {
      id: b.id,
      nome: b.nome,
      nota: notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : null,
      totalAvaliacoes: notas.length,
      totalCortes: (finalizados ?? []).filter((a) => a.barbeiro_id === b.id).length,
    }
  })
}
