"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { stagger, item } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import {
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  type NotificacaoDb,
} from "@/app/actions/notificacoes"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function CentralNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoDb[] | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    listarNotificacoes().then(setNotificacoes)
  }, [])

  const naoLidas = notificacoes?.filter((n) => !n.lida).length ?? 0

  function abrirNotificacao(n: NotificacaoDb) {
    if (n.lida) return
    setNotificacoes((prev) => prev?.map((x) => (x.id === n.id ? { ...x, lida: true } : x)) ?? prev)
    startTransition(() => {
      void marcarComoLida(n.id)
    })
  }

  function marcarTudo() {
    setNotificacoes((prev) => prev?.map((n) => ({ ...n, lida: true })) ?? prev)
    startTransition(() => {
      void marcarTodasComoLidas()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Central de notificações</h1>
          <p className="text-muted-foreground">
            {notificacoes === null
              ? "Carregando..."
              : naoLidas > 0
                ? `${naoLidas} não lida${naoLidas > 1 ? "s" : ""}.`
                : "Tudo em dia por aqui."}
          </p>
        </div>
        {naoLidas > 0 && (
          <Button variant="outline" onClick={marcarTudo} disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notificacoes === null ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Carregando" />
        </div>
      ) : notificacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma notificação por aqui ainda.</p>
        </div>
      ) : (
        <motion.ul variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {notificacoes.map((n) => (
              <motion.li key={n.id} variants={item} layout>
                <Link
                  href={n.link ?? "/painel"}
                  onClick={() => abrirNotificacao(n)}
                  className={cn(
                    "group relative flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:shadow-lg",
                    !n.lida ? "border-primary/40" : "border-border",
                  )}
                >
                  {!n.lida && (
                    <span
                      className="absolute left-0 top-4 h-[calc(100%-2rem)] w-1 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                    <Bell className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm", n.lida ? "text-muted-foreground" : "font-semibold")}>
                        {n.titulo}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                      </span>
                    </span>
                    {n.corpo && (
                      <span className="mt-0.5 block truncate text-sm text-muted-foreground">{n.corpo}</span>
                    )}
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}
