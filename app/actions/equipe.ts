"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

function senhaValidaServidor(senha: string) {
  const temTamanho = senha.length >= 8
  const temMaiuscula = /[A-Z]/.test(senha)
  const temNumero = /[0-9]/.test(senha)
  const temEspecial = /[^A-Za-z0-9]/.test(senha)
  return temTamanho && temMaiuscula && temNumero && temEspecial
}

// Cadastro de equipe via código de convite (gerado no /manutencao pra um
// owner novo, ou por um owner existente pra um barbeiro). Se já existir uma
// sessão autenticada (ex: acabou de logar com Google) só falta resgatar o
// código pra essa conta; senão, cria a conta com e-mail/senha primeiro.
export async function cadastrarComCodigo(input: {
  nome?: string
  email?: string
  senha?: string
  codigo: string
}) {
  const codigo = input.codigo.trim().toUpperCase()
  if (!codigo) return { ok: false, error: "Informe o código de convite." }

  const admin = createAdminClient()
  const { data: invite } = await admin
    .from("invite_codes")
    .select("company_id, role")
    .eq("code", codigo)
    .maybeSingle()

  if (!invite) return { ok: false, error: "Código inválido." }

  const supabase = await createClient()
  const {
    data: { user: usuarioAtual },
  } = await supabase.auth.getUser()

  let userId: string
  let nomeFinal: string

  if (usuarioAtual) {
    userId = usuarioAtual.id
    nomeFinal =
      usuarioAtual.user_metadata?.full_name ||
      usuarioAtual.user_metadata?.name ||
      usuarioAtual.email?.split("@")[0] ||
      "Administrador"
  } else {
    const nome = input.nome?.trim()
    const email = input.email?.trim().toLowerCase()
    const senha = input.senha

    if (!nome || !email || !senha) {
      return { ok: false, error: "Preencha todos os campos." }
    }
    if (!senhaValidaServidor(senha)) {
      return {
        ok: false,
        error: "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, número e caractere especial.",
      }
    }

    // Cria já confirmado (via admin) em vez de signUp comum: o projeto exige
    // confirmação de e-mail por padrão, e sem isso a conta fica sem sessão
    // (o resgate "funciona" mas a pessoa nunca entra logada).
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome },
    })

    if (error || !data.user) {
      const jaExiste = error?.message.toLowerCase().includes("already registered") || error?.message.toLowerCase().includes("already been registered")
      return {
        ok: false,
        error: jaExiste ? "Já existe uma conta com esse e-mail. Faça login." : "Não foi possível criar sua conta.",
      }
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (loginError) {
      return { ok: false, error: "Conta criada, mas não foi possível entrar automaticamente. Faça login." }
    }

    userId = data.user.id
    nomeFinal = nome
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    company_id: invite.company_id,
    role: invite.role,
    nome: nomeFinal,
    ativo: true,
  })

  if (profileError) {
    return { ok: false, error: "Não foi possível vincular sua conta à empresa." }
  }

  return { ok: true }
}

// Verifica se o usuário logado é dono, e de qual empresa
async function garantirOwner() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .single()
  return profile?.role === "owner" ? { id: user.id, companyId: profile.company_id as string } : null
}

// Lista todos os perfis de barbeiros/equipe (somente dono)
export async function listarEquipe() {
  const owner = await garantirOwner()
  if (!owner) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true })
    .order("nome", { ascending: true })

  if (error) {
    console.log("[v0] Erro ao listar equipe:", error.message)
    return []
  }
  return data ?? []
}

// Cria um barbeiro (somente dono)
export async function criarBarbeiro(input: { nome: string; email: string; senha: string }) {
  const owner = await garantirOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  if (input.senha.length < 6) {
    return { ok: false, error: "A senha deve ter ao menos 6 caracteres." }
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.senha,
    email_confirm: true,
    user_metadata: { nome: input.nome.trim(), role: "barber" },
  })

  if (error) {
    console.log("[v0] Erro ao criar barbeiro:", error.message)
    return { ok: false, error: error.message }
  }

  await admin.from("profiles").insert({
    id: data.user.id,
    company_id: owner.companyId,
    nome: input.nome.trim(),
    role: "barber",
    ativo: true,
  })

  revalidatePath("/painel/equipe")
  return { ok: true }
}

// Ativa/desativa um barbeiro (somente dono)
export async function alternarAtivoBarbeiro(id: string, ativo: boolean) {
  const owner = await garantirOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { error } = await supabase.from("profiles").update({ ativo }).eq("id", id)
  if (error) return { ok: false, error: error.message }

  revalidatePath("/painel/equipe")
  return { ok: true }
}

// Remove um barbeiro (somente dono)
export async function removerBarbeiro(id: string) {
  const owner = await garantirOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }
  if (owner.id === id) return { ok: false, error: "Você não pode remover a si mesmo." }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) {
    console.log("[v0] Erro ao remover barbeiro:", error.message)
    return { ok: false, error: error.message }
  }

  revalidatePath("/painel/equipe")
  return { ok: true }
}

// Alterna se o owner atende como barbeiro
export async function alternarAtendeBarbeiro(valor: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Não autenticado." }

  const { error } = await supabase
    .from("profiles")
    .update({ atende_como_barbeiro: valor })
    .eq("id", user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath("/painel/config")
  return { ok: true }
}

// Lista todos usuários disponíveis para transferência (equipe + clientes)
export async function listarUsuariosParaTransferencia() {
  const owner = await garantirOwner()
  if (!owner) return []

  const admin = createAdminClient()

  const { data: equipe } = await admin
    .from("profiles")
    .select("id, nome, role")
    .eq("company_id", owner.companyId)
    .neq("id", owner.id)
    .neq("role", "owner")
    .order("nome")

  // só clientes que já agendaram com esta empresa (não faz sentido oferecer
  // pra transferir o cargo pra alguém que nunca foi cliente daqui)
  const { data: agendamentosDaEmpresa } = await admin
    .from("agendamentos")
    .select("cliente_whatsapp")
    .eq("company_id", owner.companyId)

  const whatsappsClientes = Array.from(new Set((agendamentosDaEmpresa ?? []).map((a) => a.cliente_whatsapp)))

  const { data: clientes } = whatsappsClientes.length
    ? await admin.from("clientes").select("id, nome").in("whatsapp", whatsappsClientes).order("nome")
    : { data: [] }

  const idsEquipe = new Set((equipe ?? []).map((u) => u.id))
  const clientesSemPerfil = (clientes ?? [])
    .filter((c) => !idsEquipe.has(c.id))
    .map((c) => ({ id: c.id, nome: c.nome, role: "cliente" }))

  return [...(equipe ?? []), ...clientesSemPerfil]
}
