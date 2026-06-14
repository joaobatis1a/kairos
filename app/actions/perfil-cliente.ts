"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type AtualizarPerfilInput = {
  nome: string
  whatsapp: string
}

export async function atualizarPerfilCliente(input: AtualizarPerfilInput) {
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

  revalidatePath("/conta")
  return { ok: true }
}

export async function sairDaConta() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
