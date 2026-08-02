"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  type NotificacaoDb,
} from "@/app/actions/notificacoes"
import { Bell, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function SinoNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoDb[]>([])
  const [carregado, setCarregado] = useState(false)
  const [pending, startTransition] = useTransition()

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  async function carregar() {
    const lista = await listarNotificacoes()
    setNotificacoes(lista)
    setCarregado(true)
  }

  useEffect(() => {
    carregar()
    // reconfere periodicamente — sem realtime aqui de propósito, o sino
    // não precisa da mesma urgência da lista de agendamentos ao vivo
    const t = setInterval(carregar, 60_000)
    return () => clearInterval(t)
  }, [])

  function abrirNotificacao(n: NotificacaoDb) {
    if (n.lida) return
    setNotificacoes((prev) => prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x)))
    startTransition(() => {
      void marcarComoLida(n.id)
    })
  }

  function marcarTudo() {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
    startTransition(() => {
      void marcarTodasComoLidas()
    })
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && !carregado && carregar()}>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Notificações"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-[18px] w-[18px]" />
            {naoLidas > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
            )}
          </button>
        }
      />

      <DropdownMenuContent align="end" sideOffset={10} className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <span className="text-sm font-semibold">Notificações</span>
          {naoLidas > 0 && (
            <button
              type="button"
              onClick={marcarTudo}
              disabled={pending}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-1.5">
          {notificacoes.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Nenhuma notificação por aqui.
            </p>
          ) : (
            notificacoes.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="p-0 focus:bg-transparent focus:text-inherit not-data-[variant=destructive]:focus:**:text-inherit data-highlighted:bg-transparent"
                onClick={() => abrirNotificacao(n)}
                render={
                  <Link
                    href={n.link ?? "/painel"}
                    className={cn(
                      "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/60",
                      !n.lida && "bg-primary/[0.06]",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {!n.lida && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
                      <span className={cn("flex-1 truncate font-medium", n.lida && "font-normal text-muted-foreground")}>
                        {n.titulo}
                      </span>
                    </span>
                    {n.corpo && (
                      <span className="truncate pl-3.5 text-xs text-muted-foreground">{n.corpo}</span>
                    )}
                    <span className="pl-3.5 text-[11px] text-muted-foreground/70">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </Link>
                }
              />
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
