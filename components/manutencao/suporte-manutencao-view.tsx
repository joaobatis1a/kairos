"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  listarChamadosAdmin,
  getChamadoAdmin,
  responderChamadoAdmin,
  alternarStatusChamadoAdmin,
  type ChamadoAdminResumo,
  type MensagemChamado,
  type StatusChamado,
} from "@/app/actions/suporte"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Send, Loader2, LifeBuoy, ArrowLeft, Lock, LockOpen } from "lucide-react"
import { cn } from "@/lib/utils"

function BadgeStatus({ status }: { status: StatusChamado }) {
  return (
    <Badge variant={status === "aberto" ? "default" : "outline"} className="shrink-0">
      {status === "aberto" ? "Aberto" : "Encerrado"}
    </Badge>
  )
}

export function SuporteManutencaoView({ chamadosIniciais }: { chamadosIniciais: ChamadoAdminResumo[] }) {
  const [chamados, setChamados] = useState(chamadosIniciais)
  const [aberto, setAberto] = useState<ChamadoAdminResumo | null>(null)
  const [status, setStatus] = useState<StatusChamado>("aberto")
  const [mensagens, setMensagens] = useState<MensagemChamado[] | null>(null)
  const [texto, setTexto] = useState("")
  const [pending, startTransition] = useTransition()
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  function abrir(c: ChamadoAdminResumo) {
    setAberto(c)
    setStatus(c.status)
    setMensagens(null)
    getChamadoAdmin(c.id).then((res) => {
      if (res) setStatus(res.status)
      setMensagens(res?.mensagens ?? [])
    })
    setChamados((prev) => prev.map((x) => (x.id === c.id ? { ...x, naoLidas: 0 } : x)))
  }

  function responder() {
    if (!aberto) return
    const msg = texto.trim()
    if (!msg) return
    startTransition(async () => {
      const res = await responderChamadoAdmin(aberto.id, msg)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setTexto("")
      const [conv, lista] = await Promise.all([getChamadoAdmin(aberto.id), listarChamadosAdmin()])
      if (conv) setStatus(conv.status)
      setMensagens(conv?.mensagens ?? [])
      setChamados(lista)
    })
  }

  function alternarStatus() {
    if (!aberto) return
    const novo: StatusChamado = status === "aberto" ? "encerrado" : "aberto"
    startTransition(async () => {
      const res = await alternarStatusChamadoAdmin(aberto.id, novo)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setStatus(novo)
    })
  }

  if (aberto) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setAberto(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Todos os chamados
        </button>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold">{aberto.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {aberto.empresaNome} · /b/{aberto.empresaSlug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BadgeStatus status={status} />
            <Button variant="outline" size="sm" onClick={alternarStatus} disabled={pending}>
              {status === "aberto" ? (
                <>
                  <Lock className="h-3.5 w-3.5" /> Encerrar
                </>
              ) : (
                <>
                  <LockOpen className="h-3.5 w-3.5" /> Reabrir
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex h-[65vh] flex-col rounded-xl border border-border bg-card">
          <div className="flex-1 overflow-y-auto p-4">
            {mensagens === null ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {mensagens.map((m) => {
                  const doSuporte = m.origem === "suporte"
                  return (
                    <div key={m.id} className={cn("flex flex-col", doSuporte ? "items-end" : "items-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          doSuporte ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted",
                        )}
                      >
                        <p className="whitespace-pre-wrap">{m.mensagem}</p>
                      </div>
                      <p className="mt-1 px-1 text-xs text-muted-foreground">
                        {doSuporte ? "Suporte" : m.autor_nome || "Barbearia"} ·{" "}
                        {formatDistanceToNow(new Date(m.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  )
                })}
                <div ref={fimRef} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Responder..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && responder()}
              disabled={pending}
            />
            <Button size="icon" onClick={responder} disabled={pending || !texto.trim()} aria-label="Enviar resposta">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Suporte</h1>
        <p className="text-muted-foreground">Chamados abertos pelas barbearias.</p>
      </div>

      {chamados.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <LifeBuoy className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum chamado ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {chamados.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => abrir(c)}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {c.naoLidas > 0 && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
                  <p className={cn("truncate font-medium", c.naoLidas > 0 && "text-foreground")}>{c.titulo}</p>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {c.empresaNome} · {c.autorNome}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <BadgeStatus status={c.status} />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
