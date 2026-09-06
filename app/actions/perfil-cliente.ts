"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"
import { senhaValidaServidor, ERRO_SENHA_FRACA } from "@/lib/senha"

type AtualizarPerfilInput = {
  nome: string
  whatsapp: string
}

export async function atualizarPerfilCliente(input: AtualizarPerfilInput) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const nome = input.nome.trim()
  const whatsapp = input.whatsapp.trim()

  if (!nome || !whatsapp) {
    return { ok: false, error: "Preencha todos os campos." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Sessão expirada. Faça login novamente." }
  }

  const { error } = await supabase
    .from("clientes")
    .update({ nome, whatsapp })
    .eq("id", user.id)

  if (error) {
    return { ok: false, error: "Não foi possível atualizar seus dados." }
  }

  revalidatePath("/conta/perfil")
  return { ok: true }
}

export async function sairDaConta() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function trocarSenhaCliente(senhaAtual: string, novaSenha: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  if (!senhaValidaServidor(novaSenha)) {
    return { ok: false, error: ERRO_SENHA_FRACA }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { ok: false, error: "Sessão expirada. Faça login novamente." }

  // Confirma a senha atual antes de trocar — mesma proteção que o painel
  // da equipe: sem isso, qualquer um numa sessão já aberta troca a senha
  // e toma a conta sem nunca ter sabido a senha original.
  const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email, password: senhaAtual })
  if (authError) return { ok: false, error: "Senha atual incorreta." }

  const { error } = await supabase.auth.updateUser({ password: novaSenha })
  if (error) return { ok: false, error: "Não foi possível trocar sua senha." }

  return { ok: true }
}

export type ResumoCliente = {
  proximo: {
    id: string
    servicoNome: string
    servicoPreco: number
    data: string
    horario: string
    status: string
    barbeariaNome: string
    barbeariaSlug: string
    barbeiroNome: string | null
  } | null
  totalFinalizados: number
  totalAgendamentos: number
  barbearias: { nome: string; slug: string; visitas: number }[]
}

/**
 * Resumo da conta do cliente: o próximo horário marcado, quantos cortes já
 * fez e em quais barbearias. Antes a página /conta só tinha dois formulários
 * — nada disso estava em lugar nenhum, apesar de o dado já existir.
 */
export async function getResumoCliente(): Promise<ResumoCliente> {
  const vazio: ResumoCliente = { proximo: null, totalFinalizados: 0, totalAgendamentos: 0, barbearias: [] }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return vazio

  const { data: cliente } = await supabase
    .from("clientes")
    .select("whatsapp")
    .eq("id", user.id)
    .maybeSingle()
  if (!cliente?.whatsapp) return vazio

  const { data } = await supabase
    .from("agendamentos")
    .select(`
      id, servico_nome, servico_preco, data, horario, status,
      empresa:companies(nome, slug),
      barbeiro:profiles(nome)
    `)
    .eq("cliente_whatsapp", cliente.whatsapp)
    .order("data", { ascending: true })
    .order("horario", { ascending: true })

  const lista = (data ?? []).map((a) => {
    // embeds do PostgREST vêm como objeto ou array conforme a FK — normaliza
    const empresa = Array.isArray(a.empresa) ? a.empresa[0] : a.empresa
    const barbeiro = Array.isArray(a.barbeiro) ? a.barbeiro[0] : a.barbeiro
    return { ...a, empresa, barbeiro }
  })

  const hoje = new Date().toISOString().slice(0, 10)
  const proximoBruto = lista.find(
    (a) => (a.status === "pendente" || a.status === "confirmado") && a.data >= hoje,
  )

  const porBarbearia = new Map<string, { nome: string; slug: string; visitas: number }>()
  for (const a of lista) {
    if (!a.empresa?.slug) continue
    const atual = porBarbearia.get(a.empresa.slug) ?? { nome: a.empresa.nome, slug: a.empresa.slug, visitas: 0 }
    atual.visitas += 1
    porBarbearia.set(a.empresa.slug, atual)
  }

  return {
    proximo: proximoBruto
      ? {
          id: proximoBruto.id,
          servicoNome: proximoBruto.servico_nome,
          servicoPreco: Number(proximoBruto.servico_preco),
          data: proximoBruto.data,
          horario: proximoBruto.horario,
          status: proximoBruto.status,
          barbeariaNome: proximoBruto.empresa?.nome ?? "Barbearia",
          barbeariaSlug: proximoBruto.empresa?.slug ?? "",
          barbeiroNome: proximoBruto.barbeiro?.nome ?? null,
        }
      : null,
    totalFinalizados: lista.filter((a) => a.status === "finalizado").length,
    totalAgendamentos: lista.length,
    barbearias: [...porBarbearia.values()].sort((a, b) => b.visitas - a.visitas),
  }
}

// Foto de perfil: ver app/actions/avatar.ts (comum a cliente, equipe e
// manutenção — antes era duplicada aqui só pra cliente).
