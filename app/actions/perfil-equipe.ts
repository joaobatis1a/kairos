"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"
import { senhaValidaServidor, ERRO_SENHA_FRACA } from "@/lib/senha"

type AtualizarPerfilEquipeInput = {
  nome: string
  whatsapp: string
}

export async function atualizarPerfilEquipe(input: AtualizarPerfilEquipeInput) {
  if (DEMO_MODE) return bloqueadoNoDemo()

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

export async function trocarSenhaEquipe(senhaAtual: string, novaSenha: string) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  if (!senhaValidaServidor(novaSenha)) {
    return { ok: false, error: ERRO_SENHA_FRACA }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { ok: false, error: "Sessão expirada. Faça login novamente." }

  // Confirma a senha atual antes de trocar — sem isso, qualquer um que
  // acesse uma sessão já aberta (computador compartilhado, sessão
  // esquecida logada) consegue trocar a senha e tomar a conta sem nunca
  // ter sabido a senha original.
  const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email, password: senhaAtual })
  if (authError) return { ok: false, error: "Senha atual incorreta." }

  const { error } = await supabase.auth.updateUser({ password: novaSenha })
  if (error) return { ok: false, error: "Não foi possível trocar sua senha." }

  return { ok: true }
}
