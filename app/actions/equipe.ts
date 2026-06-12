"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// Verifica se já existe um dono cadastrado (para o setup inicial)
export async function existeOwner(): Promise<boolean> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "owner")

  if (error) {
    console.log("[v0] Erro ao verificar owner:", error.message)
    return false
  }
  return (count ?? 0) > 0
}

// Cria a conta do dono (somente se ainda não existir nenhum)
export async function criarOwner(input: { nome: string; email: string; senha: string }) {
  if (await existeOwner()) {
    return { ok: false, error: "Já existe um administrador cadastrado." }
  }

  if (input.senha.length < 6) {
    return { ok: false, error: "A senha deve ter ao menos 6 caracteres." }
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.senha,
    email_confirm: true,
    user_metadata: { nome: input.nome.trim(), role: "owner" },
  })

  if (error) {
    console.log("[v0] Erro ao criar owner:", error.message)
    return { ok: false, error: error.message }
  }

  // garante o perfil como owner (trigger pode ter usado defaults)
  await admin
    .from("profiles")
    .update({ nome: input.nome.trim(), role: "owner", ativo: true })
    .eq("id", data.user.id)

  return { ok: true }
}

// Verifica se o usuário logado é dono
async function garantirOwner() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  return profile?.role === "owner" ? user : null
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

  await admin
    .from("profiles")
    .update({ nome: input.nome.trim(), role: "barber", ativo: true })
    .eq("id", data.user.id)

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
