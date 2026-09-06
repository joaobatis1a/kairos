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
 *
 * Um único listener com event: "*" por canal (em vez de um .on() por tipo
 * de evento) — mesmo padrão usado no práxis depois de um bug idêntico lá
 * (só UPDATE era escutado, então uma remoção não derrubava a sessão até
 * a pessoa recarregar por conta própria).
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

    const canalPerfil = supabase
      .channel(`sessao-tempo-real-perfil-${perfilId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${perfilId}` },
        (payload: RealtimePostgresChangesPayload<{ ativo: boolean }>) => {
          if (payload.eventType === "DELETE") {
            encerrarSessao("inativo")
            return
          }
          if ("ativo" in payload.new && payload.new.ativo === false) {
            encerrarSessao("inativo")
          }
        },
      )
      .subscribe()

    const canalEmpresa = supabase
      .channel(`sessao-tempo-real-empresa-${companyId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "companies", filter: `id=eq.${companyId}` },
        (payload: RealtimePostgresChangesPayload<{ status: string }>) => {
          if (payload.eventType === "DELETE") return // excluirEmpresa já apaga o profile primeiro
          if ("status" in payload.new && payload.new.status === "inativo") {
            encerrarSessao("empresa-inativa")
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canalPerfil)
      supabase.removeChannel(canalEmpresa)
    }
  }, [perfilId, companyId, router])

  return null
}
