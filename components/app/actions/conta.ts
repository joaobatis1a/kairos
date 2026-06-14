"use server"

import { createClient } from "@/lib/supabase/server"
import { enviarEmail } from "@/lib/email/resend"
import { emailBoasVindas } from "@/lib/email/templates"
import { barbearia } from "@/config/barbearia"

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

  if (senha.length < 6) {
    return { ok: false, error: "A senha precisa ter pelo menos 6 caracteres." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome,
        whatsapp,
      },
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { ok: false, error: "Já existe uma conta com esse e-mail. Faça login." }
    }
    return { ok: false, error: "Não foi possível criar sua conta. Tente novamente." }
  }

  // Envia e-mail de boas-vindas (não bloqueia o cadastro se falhar)
  if (data.user?.email) {
    enviarEmail({
      to: data.user.email,
      subject: `Bem-vindo(a) à ${barbearia.nome}!`,
      html: emailBoasVindas({ nome, barbeariaNome: barbearia.nome }),
    }).catch(() => {})
  }

  return { ok: true }
}

export async function solicitarRedefinicaoSenha(email: string) {
  const supabase = await createClient()

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${origin}/conta/redefinir-senha`,
  })

  if (error) {
    return { ok: false, error: "Não foi possível enviar o e-mail. Verifique o endereço informado." }
  }

  return { ok: true }
}

export async function redefinirSenha(novaSenha: string) {
  if (novaSenha.length < 6) {
    return { ok: false, error: "A senha precisa ter pelo menos 6 caracteres." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: novaSenha })

  if (error) {
    return { ok: false, error: "Não foi possível redefinir sua senha. O link pode ter expirado." }
  }

  return { ok: true }
}
