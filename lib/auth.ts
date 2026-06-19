import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile, Cliente } from "@/lib/types"

export async function getPerfilOuRedirect(): Promise<Profile> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/auth/login")
  }

  return profile as Profile
}

export async function getClienteOuRedirect(): Promise<Cliente> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/conta/login")
  }

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!cliente) {
    redirect("/conta/login")
  }

  return cliente as Cliente
}

export async function getClienteAtual(): Promise<Cliente | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", user.id)
    .single()

  return (cliente as Cliente) ?? null
}
export async function getPerfilAtual(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (profile as Profile) ?? null
}
