"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { DEMO_MODE, bloqueadoNoDemo } from "@/lib/demo"

/**
 * Foto de perfil, comum a qualquer conta autenticada (cliente, dono,
 * barbeiro ou manutenção). Fica no user_metadata do Auth, não numa coluna
 * de tabela: é o único dado de perfil que existe igual em `profiles` e em
 * `clientes`, e a conta de manutenção não tem linha em nenhuma das duas.
 */
export async function enviarFotoPerfil(formData: FormData) {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const arquivo = formData.get("foto")
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { ok: false as const, error: "Escolha uma imagem." }
  }
  if (arquivo.size > 2 * 1024 * 1024) {
    return { ok: false as const, error: "A imagem precisa ter no máximo 2 MB." }
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
    return { ok: false as const, error: "Use uma imagem JPG, PNG ou WebP." }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: "Sessão expirada. Entre novamente." }

  const ext = arquivo.type === "image/png" ? "png" : arquivo.type === "image/webp" ? "webp" : "jpg"
  // caminho fixo por usuário + upsert: cada pessoa tem um arquivo só, então
  // trocar a foto não vai acumulando lixo no bucket
  const caminho = `${user.id}/foto.${ext}`

  const { error: erroUpload } = await supabase.storage
    .from("avatares")
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type })

  if (erroUpload) {
    return { ok: false as const, error: "Não foi possível enviar a imagem." }
  }

  const { data: publica } = supabase.storage.from("avatares").getPublicUrl(caminho)
  // a query string força o navegador a buscar de novo depois do upsert,
  // senão a foto antiga fica no cache
  const fotoUrl = `${publica.publicUrl}?v=${Date.now()}`

  const { error: erroPerfil } = await supabase.auth.updateUser({ data: { foto_url: fotoUrl } })
  if (erroPerfil) return { ok: false as const, error: "Imagem enviada, mas não foi possível salvar no perfil." }

  revalidatePath("/conta", "layout")
  revalidatePath("/painel", "layout")
  revalidatePath("/manutencao", "layout")
  return { ok: true as const, fotoUrl }
}

export async function removerFotoPerfil() {
  if (DEMO_MODE) return bloqueadoNoDemo()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: "Sessão expirada. Entre novamente." }

  const { error } = await supabase.auth.updateUser({ data: { foto_url: null } })
  if (error) return { ok: false as const, error: "Não foi possível remover a foto." }

  revalidatePath("/conta", "layout")
  revalidatePath("/painel", "layout")
  revalidatePath("/manutencao", "layout")
  return { ok: true as const }
}

/** Foto do usuário logado, ou null. Lida do metadata do Auth. */
export async function getFotoPerfil(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (user?.user_metadata?.foto_url as string | undefined) ?? null
}
