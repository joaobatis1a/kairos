"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { AgendamentoComBarbeiro, StatusAgendamento } from "@/lib/types"
import { AgendamentoCard } from "@/components/painel/agendamento-card"
import { CalendarX } from "lucide-react"

type Props = {
  agendamentosIniciais: AgendamentoComBarbeiro[]
  mostrarBarbeiro?: boolean
  vazioTexto?: string
}

// Lista que escuta mudanças em tempo real e revalida via router.refresh()
export function ListaAgendamentos({ agendamentosIniciais, mostrarBarbeiro, vazioTexto }: Props) {
  const router = useRouter()
  const [, setTick] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    const canal = supabase
      .channel("painel-agendamentos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agendamentos" },
        () => {
          router.refresh()
          setTick((t) => t + 1)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [router])

  if (agendamentosIniciais.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <CalendarX className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{vazioTexto ?? "Nenhum agendamento encontrado."}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {agendamentosIniciais.map((ag) => (
        <AgendamentoCard key={ag.id} ag={ag} mostrarBarbeiro={mostrarBarbeiro} />
      ))}
    </div>
  )
}

export type { StatusAgendamento }
