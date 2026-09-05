"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getBarbeariaConfig } from "@/app/actions/config"
import { enviarEmailConfirmacao } from "@/lib/emails"
import { notificar } from "@/lib/notificacoes"
import type { Profile, FormaPagamento } from "@/lib/types"

export async function getBarbeirosAtivos(companyId: string): Promise<Pick<Profile, "id" | "nome">[]> {
  const supabase = await createClient()
  // via RPC security definer (barbeiros_publicos) em vez de select direto:
  // profiles não tem mais leitura pública, e a função já aplica o filtro de
  // empresa + ativo + (barbeiro ou owner que atende) + nome preenchido.
  const { data, error } = await supabase.rpc("barbeiros_publicos", { p_company_id: companyId })

  if (error) {
    console.log("[v0] Erro ao buscar barbeiros:", error.message)
    return []
  }

  return (data ?? []) as Pick<Profile, "id" | "nome">[]
}

function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.slice(0, 5).split(":").map(Number)
  return h * 60 + m
}

// Dos `slots` do dia, os que um serviço de `duracaoMin` NÃO cabe: colidiria
// com um agendamento existente (já expandido pela duração dele) ou com um
// bloqueio de agenda.
export async function getHorariosOcupados(
  barbeiroId: string,
  data: string,
  duracaoMin = 30,
  slots: string[] = [],
): Promise<string[]> {
  const supabase = await createClient()
  const { data: intervalos, error } = await supabase.rpc("agenda_indisponivel", {
    p_barbeiro_id: barbeiroId,
    p_data: data,
  })

  if (error) {
    console.log("[v0] Erro ao buscar agenda indisponível:", error.message)
    return []
  }

  const ocupado = ((intervalos ?? []) as { inicio: string; fim: string }[]).map((i) => ({
    inicio: paraMinutos(i.inicio),
    fim: paraMinutos(i.fim),
  }))

  return slots.filter((s) => {
    const ini = paraMinutos(s)
    const fim = ini + duracaoMin
    return ocupado.some((o) => ini < o.fim && fim > o.inicio)
  })
}

type CriarAgendamentoInput = {
  companyId: string
  servicoId: string       // uuid do banco
  barbeiroId: string
  data: string
  horario: string
  observacoes?: string
  formaPagamento: FormaPagamento
}

export async function criarAgendamento(input: CriarAgendamentoInput) {
  const supabase = await createClient()

  // Exige conta de cliente para agendar
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Você precisa estar logado para agendar." }
  }

  // Nome e whatsapp vêm do cadastro do cliente, não do formulário. O
  // whatsapp é o que a RLS "Cliente vê os próprios agendamentos" usa pra
  // casar o histórico — se o cliente digitasse um número diferente (ou só
  // formatado diferente) o agendamento sumia da conta dele.
  const { data: cliente } = await supabase
    .from("clientes")
    .select("nome, whatsapp, email")
    .eq("id", user.id)
    .maybeSingle()

  if (!cliente) {
    return { ok: false, error: "Você precisa de uma conta de cliente para agendar." }
  }
  if (!cliente.whatsapp?.trim()) {
    return { ok: false, error: "Adicione um WhatsApp no seu perfil antes de agendar." }
  }

  // Nome e preço vêm do banco, nunca do payload do cliente — senão dá pra
  // agendar qualquer serviço de graça só editando o request no devtools.
  // O filtro por company_id também impede passar o id de um serviço de
  // outra empresa junto com o barbeiroId desta.
  const { data: servico } = await supabase
    .from("servicos")
    .select("nome, preco, duracao_min")
    .eq("id", input.servicoId)
    .eq("company_id", input.companyId)
    .single()

  if (!servico) {
    return { ok: false, error: "Serviço inválido." }
  }

  // Antecedência mínima pra agendar
  const { data: cfg } = await supabase
    .from("horarios_config")
    .select("antecedencia_min_horas")
    .eq("company_id", input.companyId)
    .maybeSingle()
  const antecedencia = cfg?.antecedencia_min_horas ?? 0
  if (antecedencia > 0) {
    const inicio = new Date(`${input.data}T${input.horario}:00-03:00`)
    if (inicio.getTime() - Date.now() < antecedencia * 3600_000) {
      return {
        ok: false,
        error: `Agendamentos precisam ser feitos com pelo menos ${antecedencia}h de antecedência.`,
      }
    }
  }

  // Conflito com a agenda (agendamento existente já expandido pela duração,
  // ou bloqueio de folga) — não só o slot exato.
  const { data: intervalos } = await supabase.rpc("agenda_indisponivel", {
    p_barbeiro_id: input.barbeiroId,
    p_data: input.data,
  })
  const ini = paraMinutos(input.horario)
  const fim = ini + (servico.duracao_min ?? 30)
  const conflita = ((intervalos ?? []) as { inicio: string; fim: string }[]).some(
    (o) => ini < paraMinutos(o.fim) && fim > paraMinutos(o.inicio),
  )
  if (conflita) {
    return { ok: false, error: "Esse horário não está mais disponível. Escolha outro." }
  }

  const { error } = await supabase.from("agendamentos").insert({
    company_id: input.companyId,
    cliente_nome: cliente.nome,
    cliente_whatsapp: cliente.whatsapp.trim(),
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
      clienteNome: cliente.nome,
      clienteEmail: cliente.email ?? null,
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
    corpo: `${cliente.nome} agendou ${servico.nome} para ${input.data} às ${input.horario}.`,
    link: "/painel/agendamentos",
    destinatarioRole: "owner",
  })

  return { ok: true }
}

// Cliente cancela o próprio agendamento (respeitando a antecedência da barbearia).
export async function cancelarMeuAgendamento(id: string, motivo: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: "Sessão expirada." }

  const { data: cliente } = await supabase.from("clientes").select("whatsapp").eq("id", user.id).maybeSingle()
  if (!cliente?.whatsapp) return { ok: false as const, error: "Conta de cliente não encontrada." }

  const { data: ag } = await supabase
    .from("agendamentos")
    .select("id, company_id, cliente_whatsapp, status, data, horario")
    .eq("id", id)
    .maybeSingle()

  if (!ag || ag.cliente_whatsapp !== cliente.whatsapp) {
    return { ok: false as const, error: "Agendamento não encontrado." }
  }
  if (ag.status !== "pendente" && ag.status !== "confirmado") {
    return { ok: false as const, error: "Esse agendamento não pode mais ser cancelado." }
  }

  const { data: cfg } = await supabase
    .from("horarios_config")
    .select("antecedencia_min_horas")
    .eq("company_id", ag.company_id)
    .maybeSingle()
  const antecedencia = cfg?.antecedencia_min_horas ?? 0
  if (antecedencia > 0) {
    const inicio = new Date(`${ag.data}T${ag.horario.slice(0, 5)}:00-03:00`)
    if (inicio.getTime() - Date.now() < antecedencia * 3600_000) {
      return {
        ok: false as const,
        error: `Cancelamentos precisam ser feitos com pelo menos ${antecedencia}h de antecedência. Entre em contato com a barbearia.`,
      }
    }
  }

  const { error } = await supabase
    .from("agendamentos")
    .update({ status: "cancelado", motivo_cancelamento: motivo.trim() || "Cancelado pelo cliente" })
    .eq("id", id)
  if (error) return { ok: false as const, error: "Não foi possível cancelar." }

  notificar({
    companyId: ag.company_id,
    titulo: "Agendamento cancelado pelo cliente",
    corpo: `${ag.data} às ${ag.horario}${motivo.trim() ? ` · ${motivo.trim()}` : ""}`,
    link: "/painel/agendamentos",
    destinatarioRole: "owner",
  })

  revalidatePath("/conta/historico")
  return { ok: true as const }
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
