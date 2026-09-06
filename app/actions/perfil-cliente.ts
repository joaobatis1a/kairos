"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"

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

export async function trocarSenhaCliente(novaSenha: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  if (novaSenha.length < 6) {
    return { ok: false, error: "A senha precisa ter pelo menos 6 caracteres." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: novaSenha })

  if (error) {
    return { ok: false, error: "Não foi possível trocar sua senha." }
  }

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

/**
 * Foto de perfil do cliente.
 *
 * A URL vai pro user_metadata do Auth, não pra uma coluna nova em
 * `clientes`: assim não depende de migração de schema (que neste projeto é
 * aplicada à mão no editor do Supabase). É o mesmo caminho que o praxis usa
 * pra usuário sem empresa. Se um dia precisar consultar a foto de outro
 * usuário fora da própria sessão, aí sim vale mover pra coluna.
 */
export async function enviarFotoCliente(formData: FormData) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const arquivo = formData.get("foto")
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { ok: false, error: "Escolha uma imagem." }
  }
  if (arquivo.size > 2 * 1024 * 1024) {
    return { ok: false, error: "A imagem precisa ter no máximo 2 MB." }
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
    return { ok: false, error: "Use uma imagem JPG, PNG ou WebP." }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sessão expirada. Entre novamente." }

  const ext = arquivo.type === "image/png" ? "png" : arquivo.type === "image/webp" ? "webp" : "jpg"
  // caminho fixo por usuário + upsert: cada pessoa tem um arquivo só, então
  // trocar a foto não vai acumulando lixo no bucket
  const caminho = `${user.id}/foto.${ext}`

  const { error: erroUpload } = await supabase.storage
    .from("avatares")
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type })

  if (erroUpload) {
    return { ok: false, error: "Não foi possível enviar a imagem." }
  }

  const { data: publica } = supabase.storage.from("avatares").getPublicUrl(caminho)
  // a query string força o navegador a buscar de novo depois do upsert,
  // senão a foto antiga fica no cache
  const fotoUrl = `${publica.publicUrl}?v=${Date.now()}`

  const { error: erroPerfil } = await supabase.auth.updateUser({ data: { foto_url: fotoUrl } })
  if (erroPerfil) return { ok: false, error: "Imagem enviada, mas não foi possível salvar no perfil." }

  revalidatePath("/conta", "layout")
  return { ok: true, fotoUrl }
}

export async function removerFotoCliente() {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sessão expirada. Entre novamente." }

  const { error } = await supabase.auth.updateUser({ data: { foto_url: null } })
  if (error) return { ok: false, error: "Não foi possível remover a foto." }

  revalidatePath("/conta", "layout")
  return { ok: true }
}

/** Foto do cliente logado, ou null. Lida do metadata do Auth. */
export async function getFotoCliente(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (user?.user_metadata?.foto_url as string | undefined) ?? null
}
