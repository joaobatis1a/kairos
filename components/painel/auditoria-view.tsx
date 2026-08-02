"use client"

import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import { History } from "lucide-react"
import type { EntradaAuditoria } from "@/lib/auditoria"

function formatarDataHora(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

export function AuditoriaView({ entradas }: { entradas: EntradaAuditoria[] }) {
  if (entradas.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        Nenhuma ação registrada ainda.
      </p>
    )
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-2">
      {entradas.map((e) => (
        <motion.div
          key={e.id}
          variants={item}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <History className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium leading-tight">{e.acao}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{formatarDataHora(e.created_at)}</span>
            </div>
            {e.detalhes && <p className="mt-0.5 text-sm text-muted-foreground">{e.detalhes}</p>}
            <p className="mt-1 text-xs text-muted-foreground">por {e.ator_nome}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
