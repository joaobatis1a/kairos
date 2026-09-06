"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getBarbeariaConfig } from "@/app/actions/config"
import { enviarEmailCancelamento, enviarEmailPedidoAvaliacao } from "@/lib/emails"
import { registrarAuditoria } from "@/lib/auditoria"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"
import type { AgendamentoComBarbeiro, StatusAgendamento } from "@/lib/types"

function hojeIso() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

async function getUsuario() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, nome")
    .eq("id", user.id)
    .single()
  return profile ? { id: profile.id, role: profile.role as string, nome: profile.nome as string } : null
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
  if (DEMO_MODE) return bloqueadoNoDemo()

  const usuario = await getUsuario()
  if (!usuario) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()

  // Busca o agendamento para validar regras e (se finalizado) enviar email
  const { data: ag } = await supabase
    .from("agendamentos")
    .select("id, company_id, data, cliente_nome, cliente_whatsapp, servico_nome, servico_preco, barbeiro_id, barbeiro:profiles!agendamentos_barbeiro_id_fkey(nome)")
    .eq("id", id)
    .single()

  if (!ag) return { ok: false, error: "Agendamento não encontrado." }

  // Só permite finalizar se o agendamento for do dia atual
  if (status === "finalizado" && ag.data !== hojeIso()) {
    return { ok: false, error: "Só é possível finalizar agendamentos do dia de hoje." }
  }

  const { error } = await supabase.from("agendamentos").update({ status }).eq("id", id)
  if (error) {
    console.log("[v0] Erro ao atualizar status:", error.message)
    return { ok: false, error: error.message }
  }

  // Ao finalizar, dispara email pedindo avaliação
  if (status === "finalizado") {
    const barbeiroNome = Array.isArray(ag.barbeiro) ? ag.barbeiro[0]?.nome : (ag.barbeiro as { nome: string } | null)?.nome

    // busca email do cliente, se ele tiver conta
    let clienteEmail: string | null = null
    const { data: cli } = await supabase
      .from("clientes")
      .select("email")
      .eq("whatsapp", ag.cliente_whatsapp)
      .maybeSingle()
    clienteEmail = cli?.email ?? null

    getBarbeariaConfig(ag.company_id).then((config) => {
      enviarEmailPedidoAvaliacao({
        clienteNome: ag.cliente_nome,
        clienteEmail,
        servicoNome: ag.servico_nome,
        servicoPreco: Number(ag.servico_preco),
        barbeiroNome: barbeiroNome ?? null,
        data: ag.data,
        horario: "",
        nomeBarbearia: config.nome,
      })
    })
  }

  revalidatePath("/painel")
  revalidatePath("/painel/agendamentos")
  revalidatePath("/painel/agenda")
  return { ok: true }
}

export async function cancelarAgendamento(id: string, motivo: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const usuario = await getUsuario()
  if (!usuario) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()

  // Busca dados do agendamento para o email
  const { data: ag } = await supabase
    .from("agendamentos")
    .select("company_id, cliente_nome, cliente_whatsapp, servico_nome, servico_preco, data, horario")
    .eq("id", id)
    .single()

  const { error } = await supabase
    .from("agendamentos")
    .update({ status: "cancelado", motivo_cancelamento: motivo })
    .eq("id", id)

  if (error) return { ok: false, error: error.message }

  if (ag) {
    registrarAuditoria(
      ag.company_id,
      usuario.nome,
      "Agendamento cancelado",
      `${ag.cliente_nome} · ${ag.servico_nome} · ${ag.data} ${ag.horario}${motivo ? ` · Motivo: ${motivo}` : ""}`,
    )
  }

  // Envia email de cancelamento
  if (ag) {
    const { data: cli } = await supabase
      .from("clientes")
      .select("email")
      .eq("whatsapp", ag.cliente_whatsapp)
      .maybeSingle()

    getBarbeariaConfig(ag.company_id).then((config) => {
      enviarEmailCancelamento({
        clienteNome: ag.cliente_nome,
        clienteEmail: cli?.email ?? null,
        servicoNome: ag.servico_nome,
        servicoPreco: Number(ag.servico_preco),
        barbeiroNome: null,
        data: ag.data,
        horario: ag.horario,
        nomeBarbearia: config.nome,
      }, motivo)
    })
  }

  revalidatePath("/painel")
  revalidatePath("/painel/agendamentos")
  revalidatePath("/painel/agenda")
  return { ok: true }
}

function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.slice(0, 5).split(":").map(Number)
  return h * 60 + m
}

export async function remarcarAgendamento(id: string, novaData: string, novoHorario: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const usuario = await getUsuario()
  if (!usuario) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { data: ag } = await supabase
    .from("agendamentos")
    .select("id, company_id, barbeiro_id, status, servico:servicos!servico_id(duracao_min)")
    .eq("id", id)
    .single()

  if (!ag) return { ok: false, error: "Agendamento não encontrado." }
  if (ag.status === "cancelado" || ag.status === "finalizado") {
    return { ok: false, error: "Não dá pra remarcar um agendamento já encerrado." }
  }

  const dur =
    (Array.isArray(ag.servico) ? ag.servico[0]?.duracao_min : (ag.servico as { duracao_min: number } | null)?.duracao_min) ?? 30

  const { data: intervalos } = await supabase.rpc("agenda_indisponivel", {
    p_barbeiro_id: ag.barbeiro_id,
    p_data: novaData,
  })
  const ini = paraMinutos(novoHorario)
  const fim = ini + dur
  const conflita = ((intervalos ?? []) as { inicio: string; fim: string }[]).some(
    (o) => ini < paraMinutos(o.fim) && fim > paraMinutos(o.inicio),
  )
  if (conflita) return { ok: false, error: "O barbeiro já tem compromisso nesse horário." }

  const { error } = await supabase
    .from("agendamentos")
    .update({ data: novaData, horario: novoHorario })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }

  registrarAuditoria(ag.company_id, usuario.nome, "Agendamento remarcado", `${novaData} ${novoHorario}`)

  revalidatePath("/painel")
  revalidatePath("/painel/agendamentos")
  revalidatePath("/painel/agenda")
  return { ok: true }
}

export async function excluirAgendamento(id: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

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
