"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getBarbeariaConfig } from "@/app/actions/config"
import { revalidatePath } from "next/cache"

function senhaValidaServidor(senha: string) {
  const temTamanho = senha.length >= 8
  const temMaiuscula = /[A-Z]/.test(senha)
  const temNumero = /[0-9]/.test(senha)
  const temEspecial = /[^A-Za-z0-9]/.test(senha)
  return temTamanho && temMaiuscula && temNumero && temEspecial
}

type CadastroInput = {
  nome: string
  email: string
  whatsapp: string
  senha: string
}

export async function cadastrarCliente(input: CadastroInput) {
  const nome = input.nome.trim()
  const email = input.email.trim().toLowerCase()
  const whatsapp = input.whatsapp.trim()
  const senha = input.senha

  if (!nome || !email || !whatsapp || !senha) {
    return { ok: false, error: "Preencha todos os campos." }
  }

  if (!senhaValidaServidor(senha)) {
    return {
      ok: false,
      error: "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, número e caractere especial.",
    }
  }

  const admin = createAdminClient()

  // Cria já confirmado (via admin) em vez de signUp comum: o projeto exige
  // confirmação de e-mail por padrão, e sem isso a conta fica sem sessão.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome, whatsapp },
  })

  if (error || !data.user) {
    const jaExiste = error?.message.toLowerCase().includes("already registered") || error?.message.toLowerCase().includes("already been registered")
    return {
      ok: false,
      error: jaExiste ? "Já existe uma conta com esse e-mail. Faça login." : "Não foi possível criar sua conta. Tente novamente.",
    }
  }

  const { error: clienteError } = await admin.from("clientes").insert({
    id: data.user.id,
    nome,
    email,
    whatsapp,
  })

  if (clienteError) {
    return { ok: false, error: "Não foi possível concluir seu cadastro. Tente novamente." }
  }

  const supabase = await createClient()
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (loginError) {
    return { ok: false, error: "Conta criada, mas não foi possível entrar automaticamente. Faça login." }
  }

  return { ok: true }
}

export async function solicitarRedefinicaoSenha(email: string) {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${origin}/conta/redefinir-senha`,
  })

  if (error) {
    return { ok: false, error: "Não foi possível enviar o e-mail. Verifique o endereço informado." }
  }

  return { ok: true }
}

export async function redefinirSenha(novaSenha: string) {
  if (!senhaValidaServidor(novaSenha)) {
    return {
      ok: false,
      error: "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, número e caractere especial.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: novaSenha })

  if (error) {
    return { ok: false, error: "Não foi possível redefinir sua senha. O link pode ter expirado." }
  }

  return { ok: true }
}

// Transferir cargo de owner para outro usuário
export async function transferirOwner(novoOwnerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Não autenticado." }

  // Verifica se quem está chamando é owner
  const { data: perfil } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .single()

  if (perfil?.role !== "owner") return { ok: false, error: "Sem permissão." }
  if (user.id === novoOwnerId) return { ok: false, error: "Você já é o owner." }

  const admin = createAdminClient()

  // Verifica se o novo owner existe — só aceita equipe da mesma empresa
  const { data: novoPerfilEquipe } = await admin
    .from("profiles")
    .select("id, nome")
    .eq("id", novoOwnerId)
    .eq("company_id", perfil.company_id)
    .single()

  const { data: novoPerfilCliente } = await admin
    .from("clientes")
    .select("id, nome")
    .eq("id", novoOwnerId)
    .single()

  if (!novoPerfilEquipe && !novoPerfilCliente) {
    return { ok: false, error: "Usuário não encontrado." }
  }

  const nomeNovo = novoPerfilEquipe?.nome ?? novoPerfilCliente?.nome ?? "Usuário"

  // Promove novo owner
  if (novoPerfilEquipe) {
    await admin.from("profiles").update({ role: "owner", ativo: true }).eq("id", novoOwnerId)
  } else {
    // Era cliente, cria perfil como owner nesta empresa
    await admin.from("profiles").insert({
      id: novoOwnerId,
      company_id: perfil.company_id,
      nome: nomeNovo,
      role: "owner",
      ativo: true,
    })
  }

  // Rebaixa owner atual para cliente (remove do profiles)
  await admin.from("profiles").delete().eq("id", user.id)

  revalidatePath("/painel")
  return { ok: true }
}

// Deletar própria conta
export async function deletarConta() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Não autenticado." }

  const admin = createAdminClient()

  // Verifica se é owner — owner só pode deletar se transferir antes
  const { data: perfil } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (perfil?.role === "owner") {
    return { ok: false, error: "Transfira o cargo de administrador antes de deletar sua conta." }
  }

  // Deleta o usuário no auth (cascata limpa profiles e clientes via trigger/FK)
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}
