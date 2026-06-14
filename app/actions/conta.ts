"use server"

import { createClient } from "@/lib/supabase/server"
import { enviarEmail } from "@/lib/email/resend"
import { emailBoasVindas } from "@/lib/email/templates"
import { barbearia } from "@/config/barbearia"

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
      error:
        "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, número e caractere especial.",
    }
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
      error:
        "A senha precisa ter no mínimo 8 caracteres, com letra maiúscula, número e caractere especial.",
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: novaSenha })

  if (error) {
    return { ok: false, error: "Não foi possível redefinir sua senha. O link pode ter expirado." }
  }

  return { ok: true }
}
