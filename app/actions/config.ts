"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export type BarbeariaConfig = {
  nome: string
  slogan: string
  descricao: string
  telefone: string
  whatsapp: string
  endereco: string
  maps_url: string
  instagram: string
  instagram_url: string
}

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

// ── Leitura ──────────────────────────────────────────────────

export async function getBarbeariaConfig(): Promise<BarbeariaConfig> {
  const supabase = await createClient()
  const { data } = await supabase.from("barbearia_config").select("*").eq("id", 1).single()
  return data ?? {
    nome: "Minha Barbearia", slogan: "", descricao: "", telefone: "",
    whatsapp: "", endereco: "", maps_url: "", instagram: "", instagram_url: "",
  }
}

export async function getServicos(): Promise<ServicoDb[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("servicos")
    .select("*")
    .eq("ativo", true)
    .order("ordem")
  return data ?? []
}

export async function getHorariosConfig(): Promise<HorariosConfig> {
  const supabase = await createClient()
  const { data } = await supabase.from("horarios_config").select("*").eq("id", 1).single()
  return data ?? { dias_abertos: [1, 2, 3, 4, 5, 6], horarios: [] }
}

// ── Escrita (só owner) ────────────────────────────────────────

async function verificarOwner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (data?.role !== "owner") return null
  return user
}

export async function salvarBarbeariaConfig(config: BarbeariaConfig) {
  const user = await verificarOwner()
  if (!user) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin
    .from("barbearia_config")
    .update({ ...config, updated_at: new Date().toISOString() })
    .eq("id", 1)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function adicionarServico(dados: Omit<ServicoDb, "id" | "ordem" | "ativo">) {
  const user = await verificarOwner()
  if (!user) return { ok: false, error: "Sem permissão." }

  const supabase = await createClient()
  const { data: ultimo } = await supabase
    .from("servicos").select("ordem").order("ordem", { ascending: false }).limit(1).single()

  const admin = createAdminClient()
  const { error } = await admin.from("servicos").insert({
    ...dados,
    ordem: (ultimo?.ordem ?? 0) + 1,
    ativo: true,
  })

  if (error) return { ok: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function editarServico(id: string, dados: Omit<ServicoDb, "id" | "ordem" | "ativo">) {
  const user = await verificarOwner()
  if (!user) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin.from("servicos").update(dados).eq("id", id)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function excluirServico(id: string) {
  const user = await verificarOwner()
  if (!user) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin.from("servicos").update({ ativo: false }).eq("id", id)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/painel/config")
  return { ok: true }
}

export async function salvarHorarios(config: HorariosConfig) {
  const user = await verificarOwner()
  if (!user) return { ok: false, error: "Sem permissão." }

  const admin = createAdminClient()
  const { error } = await admin
    .from("horarios_config")
    .update({ ...config, updated_at: new Date().toISOString() })
    .eq("id", 1)

  if (error) return { ok: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/painel/config")
  return { ok: true }
}
