"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type AtualizarPerfilEquipeInput = {
  nome: string
  whatsapp: string
}

export async function atualizarPerfilEquipe(input: AtualizarPerfilEquipeInput) {
  const nome = input.nome.trim()
  const whatsapp = input.whatsapp.trim()

  if (!nome) {
    return { ok: false, error: "Informe seu nome." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Sessão expirada. Faça login novamente." }
  }

  const { error } = await supabase.from("profiles").update({ nome, whatsapp }).eq("id", user.id)

  if (error) {
    return { ok: false, error: "Não foi possível atualizar seus dados." }
  }

  revalidatePath("/painel/minha-conta")
  revalidatePath("/painel")
  return { ok: true }
}

export async function trocarSenhaEquipe(novaSenha: string) {
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
