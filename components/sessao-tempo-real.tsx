"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

/**
 * Nem RLS nem o middleware barram acesso de quem já estava logado quando o
 * dono desativa um barbeiro ou desativa a empresa inteira no /manutencao —
 * a sessão só é checada a cada navegação (ver getPerfilOuRedirect em
 * lib/auth.ts). Isso assina Realtime no próprio perfil e na própria empresa
 * pra derrubar a sessão na hora, mesmo que a pessoa fique parada numa
 * página sem navegar pra lugar nenhum.
 */
export function SessaoTempoReal({
  perfilId,
  companyId,
}: {
  perfilId: string
  companyId: string
}) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function encerrarSessao(motivo: "inativo" | "empresa-inativa") {
      await supabase.auth.signOut()
      router.replace(`/auth/login?erro=${motivo}`)
    }

    const channel = supabase
      .channel(`sessao-tempo-real-${perfilId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${perfilId}` },
        (payload: RealtimePostgresChangesPayload<{ ativo: boolean }>) => {
          if ("ativo" in payload.new && payload.new.ativo === false) {
            encerrarSessao("inativo")
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "profiles", filter: `id=eq.${perfilId}` },
        () => encerrarSessao("inativo"),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "companies", filter: `id=eq.${companyId}` },
        (payload: RealtimePostgresChangesPayload<{ status: string }>) => {
          if ("status" in payload.new && payload.new.status === "inativo") {
            encerrarSessao("empresa-inativa")
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [perfilId, companyId, router])

  return null
}
