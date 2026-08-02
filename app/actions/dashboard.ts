"use server"

import { createClient } from "@/lib/supabase/server"

async function getUsuarioDashboard() {
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

function hojeIso() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function inicioSemanaIso() {
  const d = new Date()
  const diaSemana = d.getDay() // 0 = domingo
  d.setDate(d.getDate() - diaSemana)
  return d.toISOString().slice(0, 10)
}

function inicioMesIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}

export type DashboardData = {
  receitaHoje: number
  receitaSemana: number
  receitaMes: number
  rankingBarbeiros: { id: string; nome: string; total: number; receita: number }[]
  servicosPopulares: { nome: string; total: number }[]
  avaliacoesGerais: {
    mediaServico: number
    mediaBarbeiro: number
    totalAvaliacoes: number
    recentes: {
      id: string
      notaServico: number
      notaBarbeiro: number | null
      comentario: string | null
      clienteNome: string
      barbeiroNome: string | null
      createdAt: string
    }[]
  }
}

// Dashboard completo do owner (visão geral do negócio)
export async function getDashboardOwner(): Promise<DashboardData | null> {
  const usuario = await getUsuarioDashboard()
  if (!usuario || usuario.role !== "owner") return null

  const supabase = await createClient()
  const hoje = hojeIso()
  const inicioSemana = inicioSemanaIso()
  const inicioMes = inicioMesIso()

  const { data: finalizadosMes } = await supabase
    .from("agendamentos")
    .select("servico_preco, servico_nome, data, barbeiro_id, barbeiro:profiles!agendamentos_barbeiro_id_fkey(id, nome)")
    .eq("status", "finalizado")
    .gte("data", inicioMes)

  const lista = finalizadosMes ?? []

  const receitaHoje = lista
    .filter((a) => a.data === hoje)
    .reduce((sum, a) => sum + Number(a.servico_preco), 0)

  const receitaSemana = lista
    .filter((a) => a.data >= inicioSemana)
    .reduce((sum, a) => sum + Number(a.servico_preco), 0)

  const receitaMes = lista.reduce((sum, a) => sum + Number(a.servico_preco), 0)

  // Ranking de barbeiros (pelo mês)
  const porBarbeiro = new Map<string, { nome: string; total: number; receita: number }>()
  for (const a of lista) {
    if (!a.barbeiro_id) continue
    const barbeiroInfo = Array.isArray(a.barbeiro) ? a.barbeiro[0] : a.barbeiro
    const nome = barbeiroInfo?.nome ?? "Barbeiro"
    const atual = porBarbeiro.get(a.barbeiro_id) ?? { nome, total: 0, receita: 0 }
    atual.total += 1
    atual.receita += Number(a.servico_preco)
    porBarbeiro.set(a.barbeiro_id, atual)
  }
  const rankingBarbeiros = Array.from(porBarbeiro.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 10)

  // Serviços mais populares (pelo mês)
  const porServico = new Map<string, number>()
  for (const a of lista) {
    porServico.set(a.servico_nome, (porServico.get(a.servico_nome) ?? 0) + 1)
  }
  const servicosPopulares = Array.from(porServico.entries())
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  const avaliacoesGerais = await getAvaliacoesGerais()

  return {
    receitaHoje,
    receitaSemana,
    receitaMes,
    rankingBarbeiros,
    servicosPopulares,
    avaliacoesGerais,
  }
}

export type AvaliacoesResumo = Awaited<ReturnType<typeof getAvaliacoesGerais>>

// Avaliações gerais de toda a barbearia (todos os barbeiros)
export async function getAvaliacoesGerais() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("avaliacoes")
    .select(
      "id, nota_servico, nota_barbeiro, comentario, created_at, barbeiro:profiles!barbeiro_id(nome), agendamento:agendamentos!agendamento_id(cliente_nome)",
    )
    .order("created_at", { ascending: false })
    .limit(20)

  const lista = data ?? []

  const totalAvaliacoes = lista.length
  const mediaServico =
    totalAvaliacoes > 0
      ? lista.reduce((sum, a) => sum + a.nota_servico, 0) / totalAvaliacoes
      : 0
  const comNotaBarbeiro = lista.filter((a) => a.nota_barbeiro !== null)
  const mediaBarbeiro =
    comNotaBarbeiro.length > 0
      ? comNotaBarbeiro.reduce((sum, a) => sum + (a.nota_barbeiro ?? 0), 0) / comNotaBarbeiro.length
      : 0

  const recentes = lista.slice(0, 10).map((a) => {
    const barbeiroInfo = Array.isArray(a.barbeiro) ? a.barbeiro[0] : a.barbeiro
    const agendamentoInfo = Array.isArray(a.agendamento) ? a.agendamento[0] : a.agendamento
    return {
      id: a.id,
      notaServico: a.nota_servico,
      notaBarbeiro: a.nota_barbeiro,
      comentario: a.comentario,
      clienteNome: agendamentoInfo?.cliente_nome ?? "Cliente",
      barbeiroNome: barbeiroInfo?.nome ?? null,
      createdAt: a.created_at,
    }
  })

  return { mediaServico, mediaBarbeiro, totalAvaliacoes, recentes }
}

// Avaliações recebidas apenas pelo barbeiro logado
export async function getAvaliacoesDoBarbeiro() {
  const usuario = await getUsuarioDashboard()
  if (!usuario) return { mediaServico: 0, mediaBarbeiro: 0, totalAvaliacoes: 0, recentes: [] }

  const supabase = await createClient()

  const { data } = await supabase
    .from("avaliacoes")
    .select(
      "id, nota_servico, nota_barbeiro, comentario, created_at, agendamento:agendamentos!agendamento_id(cliente_nome)",
    )
    .eq("barbeiro_id", usuario.id)
    .order("created_at", { ascending: false })
    .limit(30)

  const lista = data ?? []
  const totalAvaliacoes = lista.length
  const mediaServico =
    totalAvaliacoes > 0
      ? lista.reduce((sum, a) => sum + a.nota_servico, 0) / totalAvaliacoes
      : 0
  const comNotaBarbeiro = lista.filter((a) => a.nota_barbeiro !== null)
  const mediaBarbeiro =
    comNotaBarbeiro.length > 0
      ? comNotaBarbeiro.reduce((sum, a) => sum + (a.nota_barbeiro ?? 0), 0) / comNotaBarbeiro.length
      : 0

  const recentes = lista.map((a) => {
    const agendamentoInfo = Array.isArray(a.agendamento) ? a.agendamento[0] : a.agendamento
    return {
      id: a.id,
      notaServico: a.nota_servico,
      notaBarbeiro: a.nota_barbeiro,
      comentario: a.comentario,
      clienteNome: agendamentoInfo?.cliente_nome ?? "Cliente",
      barbeiroNome: null,
      createdAt: a.created_at,
    }
  })

  return { mediaServico, mediaBarbeiro, totalAvaliacoes, recentes }
}
