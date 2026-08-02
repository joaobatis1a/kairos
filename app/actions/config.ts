"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { Company } from "@/lib/types"

export type BarbeariaConfig = Pick<
  Company,
  "nome" | "slug" | "slogan" | "descricao" | "telefone" | "whatsapp" | "endereco" | "maps_url" | "instagram" | "instagram_url"
>

export type ServicoDb = {
  id: string
  nome: string
  descricao: string
  preco: number
  duracao_min: number
  ordem: number
  ativo: boolean
}

export type HorariosConfig = {
  dias_abertos: number[]
  horarios: string[]
}

const configVazia: BarbeariaConfig = {
  nome: "Minha Barbearia", slug: "", slogan: "", descricao: "", telefone: "",
  whatsapp: "", endereco: "", maps_url: "", instagram: "", instagram_url: "",
}

// ── Leitura (pública, por empresa) ──────────────────────────────

export async function getEmpresaPorSlug(slug: string): Promise<Company | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "ativo")
    .maybeSingle()
  return (data as Company) ?? null
}

export async function getBarbeariaConfig(companyId: string): Promise<BarbeariaConfig> {
  const supabase = await createClient()
  const { data } = await supabase.from("companies").select("*").eq("id", companyId).single()
  return data ?? configVazia
}

export async function getServicos(companyId: string): Promise<ServicoDb[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("servicos")
    .select("*")
    .eq("company_id", companyId)
    .eq("ativo", true)
    .order("ordem")
  return data ?? []
}

export async function getHorariosConfig(companyId: string): Promise<HorariosConfig> {
  const supabase = await createClient()
  const { data } = await supabase.from("horarios_config").select("*").eq("company_id", companyId).single()
  return data ?? { dias_abertos: [1, 2, 3, 4, 5, 6], horarios: [] }
}

// ── Escrita (só owner, sempre restrita à própria empresa) ─────────

async function verificarOwner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("profiles").select("role, company_id").eq("id", user.id).single()
  if (data?.role !== "owner") return null
  return { id: user.id, companyId: data.company_id as string }
}

export async function salvarBarbeariaConfig(config: BarbeariaConfig) {
  const owner = await verificarOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin
    .from("companies")
    .update({ ...config, updated_at: new Date().toISOString() })
    .eq("id", owner.companyId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function adicionarServico(dados: Omit<ServicoDb, "id" | "ordem" | "ativo">) {
  const owner = await verificarOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { data: ultimo } = await supabase
    .from("servicos")
    .select("ordem")
    .eq("company_id", owner.companyId)
    .order("ordem", { ascending: false })
    .limit(1)
    .single()

  const admin = createAdminClient()
  const { error } = await admin.from("servicos").insert({
    ...dados,
    company_id: owner.companyId,
    ordem: (ultimo?.ordem ?? 0) + 1,
    ativo: true,
  })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function editarServico(id: string, dados: Omit<ServicoDb, "id" | "ordem" | "ativo">) {
  const owner = await verificarOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin.from("servicos").update(dados).eq("id", id).eq("company_id", owner.companyId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function excluirServico(id: string) {
  const owner = await verificarOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin
    .from("servicos")
    .update({ ativo: false })
    .eq("id", id)
    .eq("company_id", owner.companyId)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function salvarHorarios(config: HorariosConfig) {
  const owner = await verificarOwner()
  if (!owner) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin
    .from("horarios_config")
    .upsert({ company_id: owner.companyId, ...config, updated_at: new Date().toISOString() })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/painel/config")
  return { ok: true }
}
