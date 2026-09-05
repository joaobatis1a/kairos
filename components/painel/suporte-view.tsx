"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { enviarMensagemSuporte, getConversaSuporte, type MensagemSuporte } from "@/app/actions/suporte"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Send, Loader2, LifeBuoy } from "lucide-react"
import { cn } from "@/lib/utils"

export function SuporteView({ mensagensIniciais }: { mensagensIniciais: MensagemSuporte[] }) {
  const [mensagens, setMensagens] = useState(mensagensIniciais)
  const [texto, setTexto] = useState("")
  const [pending, startTransition] = useTransition()
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  function enviar() {
    const msg = texto.trim()
    if (!msg) return
    startTransition(async () => {
      const res = await enviarMensagemSuporte(msg)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setTexto("")
      const { mensagens: novas } = await getConversaSuporte()
      setMensagens(novas)
    })
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-border bg-card">
      <div className="flex-1 overflow-y-auto p-4">
        {mensagens.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <LifeBuoy className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              Nenhuma mensagem ainda. Manda a sua dúvida que a gente responde por aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mensagens.map((m) => {
              const daEmpresa = m.origem === "empresa"
              return (
                <div key={m.id} className={cn("flex flex-col", daEmpresa ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      daEmpresa
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.mensagem}</p>
                  </div>
                  <p className="mt-1 px-1 text-xs text-muted-foreground">
                    {daEmpresa ? "Você" : "Suporte"} ·{" "}
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
          placeholder="Escreva sua mensagem..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviar()}
          disabled={pending}
        />
        <Button size="icon" onClick={enviar} disabled={pending || !texto.trim()}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
