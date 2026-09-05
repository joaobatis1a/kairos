"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  listarConversasSuporte,
  getConversaSuporteAdmin,
  responderSuporteAdmin,
  type ConversaSuporte,
  type MensagemSuporte,
} from "@/app/actions/suporte"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Send, Loader2, LifeBuoy, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function SuporteManutencaoView({ conversasIniciais }: { conversasIniciais: ConversaSuporte[] }) {
  const [conversas, setConversas] = useState(conversasIniciais)
  const [aberta, setAberta] = useState<ConversaSuporte | null>(null)
  const [mensagens, setMensagens] = useState<MensagemSuporte[] | null>(null)
  const [texto, setTexto] = useState("")
  const [pending, startTransition] = useTransition()
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  function abrir(c: ConversaSuporte) {
    setAberta(c)
    setMensagens(null)
    getConversaSuporteAdmin(c.companyId).then((res) => setMensagens(res?.mensagens ?? []))
    // zera o contador de não lidas localmente
    setConversas((prev) => prev.map((x) => (x.companyId === c.companyId ? { ...x, naoLidas: 0 } : x)))
  }

  function responder() {
    if (!aberta) return
    const msg = texto.trim()
    if (!msg) return
    startTransition(async () => {
      const res = await responderSuporteAdmin(aberta.companyId, msg)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setTexto("")
      const [conv, lista] = await Promise.all([
        getConversaSuporteAdmin(aberta.companyId),
        listarConversasSuporte(),
      ])
      setMensagens(conv?.mensagens ?? [])
      setConversas(lista)
    })
  }

  if (aberta) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setAberta(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Todas as conversas
        </button>
        <div>
          <h1 className="font-serif text-2xl font-bold">{aberta.nome}</h1>
          <p className="text-sm text-muted-foreground">/b/{aberta.slug}</p>
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
            <Button size="icon" onClick={responder} disabled={pending || !texto.trim()}>
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
        <p className="text-muted-foreground">Conversas abertas pelas barbearias.</p>
      </div>

      {conversas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <LifeBuoy className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma conversa de suporte ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversas.map((c) => (
            <button
              key={c.companyId}
              type="button"
              onClick={() => abrir(c)}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {c.naoLidas > 0 && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
                  <p className={cn("truncate font-medium", c.naoLidas > 0 && "text-foreground")}>{c.nome}</p>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{c.ultimaMensagem}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.ultimaEm), { addSuffix: true, locale: ptBR })}
                </span>
                {c.naoLidas > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {c.naoLidas}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
