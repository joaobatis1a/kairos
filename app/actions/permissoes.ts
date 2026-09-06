"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"

export type PermissoesEquipe = {
  ver_agendamentos_todos: boolean
  ver_faturamento: boolean
}

const PADRAO: PermissoesEquipe = { ver_agendamentos_todos: false, ver_faturamento: false }

async function verificarOwner() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("profiles").select("role, company_id").eq("id", user.id).single()
  if (data?.role !== "owner") return null
  return { companyId: data.company_id as string }
}

export async function getPermissoesEquipe(companyId: string): Promise<PermissoesEquipe> {
  const supabase = await createClient()
  const { data } = await supabase.from("companies").select("permissoes").eq("id", companyId).single()
  return { ...PADRAO, ...((data?.permissoes as Partial<PermissoesEquipe>) ?? {}) }
}

export async function salvarPermissoesEquipe(permissoes: PermissoesEquipe) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const owner = await verificarOwner()
  if (!owner) return { ok: false as const, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin.from("companies").update({ permissoes }).eq("id", owner.companyId)
  if (error) return { ok: false as const, error: "Não foi possível salvar as permissões." }

  revalidatePath("/painel/cargos")
  revalidatePath("/painel/agenda")
  return { ok: true as const }
}
