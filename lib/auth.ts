import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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
    .select("*, empresa:companies(status)")
    .eq("id", user.id)
    .single()

  if (!profile) {
    // conta de manutenção e conta de cliente não têm profile (não pertencem a
    // nenhuma empresa) — sem esses desvios elas ficariam presas num loop
    // /auth/login <-> /painel
    if (await ehContaManutencao(user.email)) {
      redirect("/manutencao")
    }
    const { data: cliente } = await supabase
      .from("clientes")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()
    if (cliente) {
      redirect("/conta")
    }
    redirect("/auth/login")
  }

  // Nem RLS nem o middleware barram acesso de um perfil desativado ou de uma
  // empresa desativada — os dois só afetam o storefront público. Sem essa
  // checagem aqui, desativar um barbeiro ou desativar a empresa no
  // /manutencao não tira o acesso de ninguém que já estava logado.
  const { empresa, ...perfilSemEmpresa } = profile as Profile & { empresa: { status: string } | null }

  // O signOut de verdade (que limpa o cookie) acontece no middleware — aqui
  // é só o desvio, caso alguma rota escape do matcher. Ver lib/supabase/proxy.ts.
  if (!perfilSemEmpresa.ativo) {
    redirect("/auth/login?erro=inativo")
  }

  if (empresa?.status === "inativo") {
    redirect("/auth/login?erro=empresa-inativa")
  }

  return perfilSemEmpresa
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

// Verifica se o usuário logado é uma conta de manutenção (superadmin da
// plataforma). maintenance_accounts não tem policy de RLS pra client comum,
// então a checagem sempre passa pelo client admin.
export async function ehContaManutencao(email: string | undefined | null): Promise<boolean> {
  if (!email) return false
  const admin = createAdminClient()
  const { data } = await admin
    .from("maintenance_accounts")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle()
  return !!data
}

export async function getContaManutencaoOuRedirect() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!(await ehContaManutencao(user.email))) {
    redirect("/painel")
  }

  return user
}
