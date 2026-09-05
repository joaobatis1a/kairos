"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  criarAviso,
  marcarAvisoLido,
  listarRespostas,
  responderAviso,
  type AvisoDb,
  type RespostaAvisoDb,
} from "@/app/actions/avisos"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Megaphone, Plus, ChevronDown, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function AvisoCard({ aviso }: { aviso: AvisoDb }) {
  const [expandido, setExpandido] = useState(false)
  const [respostas, setRespostas] = useState<RespostaAvisoDb[] | null>(null)
  const [texto, setTexto] = useState("")
  const [pending, startTransition] = useTransition()
  const [lido, setLido] = useState(aviso.lido)

  function expandir() {
    const abrir = !expandido
    setExpandido(abrir)
    if (abrir) {
      if (!lido) {
        setLido(true)
        startTransition(() => {
          void marcarAvisoLido(aviso.id)
        })
      }
      if (respostas === null) {
        listarRespostas(aviso.id).then(setRespostas)
      }
    }
  }

  function enviar() {
    if (!texto.trim()) return
    startTransition(async () => {
      const res = await responderAviso(aviso.id, texto)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setTexto("")
      const atualizadas = await listarRespostas(aviso.id)
      setRespostas(atualizadas)
    })
  }

  return (
    <motion.div variants={item}>
      <Card className={cn("cartao-interativo overflow-hidden", !lido && "border-primary/30")}>
        <button type="button" onClick={expandir} className="flex w-full items-start gap-3 p-4 text-left">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Megaphone className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {!lido && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
              <p className={cn("truncate font-semibold", !lido && "text-foreground")}>{aviso.titulo}</p>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {aviso.autor_nome} · {aviso.destinatario_nome ? `pra ${aviso.destinatario_nome}` : "pra toda a equipe"} ·{" "}
              {formatDistanceToNow(new Date(aviso.created_at), { addSuffix: true, locale: ptBR })}
              {aviso.total_respostas > 0 && ` · ${aviso.total_respostas} resposta${aviso.total_respostas === 1 ? "" : "s"}`}
            </p>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expandido && "rotate-180")} />
        </button>

        {expandido && (
          <CardContent className="flex flex-col gap-3 border-t border-border pt-4">
            <p className="whitespace-pre-wrap text-sm">{aviso.mensagem}</p>

            {respostas === null ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              respostas.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-border pt-3">
                  {respostas.map((r) => (
                    <div key={r.id} className="rounded-lg bg-muted/40 p-2.5 text-sm">
                      <p className="text-xs font-medium text-muted-foreground">
                        {r.autor_nome} ·{" "}
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                      <p className="mt-0.5">{r.mensagem}</p>
                    </div>
                  ))}
                </div>
              )
            )}

            <div className="flex items-center gap-2">
              <Input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Responder..."
                onKeyDown={(e) => e.key === "Enter" && enviar()}
              />
              <Button size="icon" onClick={enviar} disabled={pending || !texto.trim()} aria-label="Enviar resposta">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}

export function AvisosView({
  avisos,
  equipe,
  isOwner,
}: {
  avisos: AvisoDb[]
  equipe: { id: string; nome: string }[]
  isOwner: boolean
}) {
  const [open, setOpen] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [destinatarioId, setDestinatarioId] = useState("todos")
  const [pending, startTransition] = useTransition()

  function criar() {
    startTransition(async () => {
      const res = await criarAviso({
        titulo,
        mensagem,
        destinatarioId: destinatarioId === "todos" ? null : destinatarioId,
      })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Aviso enviado.")
      setTitulo("")
      setMensagem("")
      setDestinatarioId("todos")
      setOpen(false)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {isOwner && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="self-end"><Plus className="h-4 w-4" /> Novo aviso</Button>} />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Novo aviso</DialogTitle>
              <DialogDescription>Manda uma mensagem pra toda a equipe ou só pra uma pessoa.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Destinatário</Label>
                <Select value={destinatarioId} onValueChange={(v) => setDestinatarioId(v ?? "todos")}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {destinatarioId === "todos" ? "Toda a equipe" : equipe.find((p) => p.id === destinatarioId)?.nome}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Toda a equipe</SelectItem>
                    {equipe.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Horário especial no feriado" />
              </div>
              <div className="grid gap-2">
                <Label>Mensagem</Label>
                <Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={criar} disabled={pending || !titulo.trim() || !mensagem.trim()} className="w-full">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar aviso"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {avisos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Megaphone className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum aviso por aqui ainda.</p>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-3">
          {avisos.map((a) => (
            <AvisoCard key={a.id} aviso={a} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
