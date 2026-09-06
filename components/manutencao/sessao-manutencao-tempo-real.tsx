"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

/**
 * Espelha components/sessao-tempo-real.tsx pra conta de manutenção: sem
 * isso, remover um superadmin em /manutencao/equipe não derruba a sessão
 * dele em tempo real — só no próximo clique (que já é bloqueado pela
 * checagem em getContaManutencaoOuRedirect, mas a UI fica "logada" até lá).
 * Mesmo padrão que o práxis já usa (canal maintenance-self-${email}).
 */
export function SessaoManutencaoTempoReal({ email }: { email: string }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const canal = supabase
      .channel(`sessao-manutencao-${email}`)
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "maintenance_accounts", filter: `email=eq.${email}` },
        async () => {
          await supabase.auth.signOut()
          router.replace("/auth/login")
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [email, router])

  return null
}
