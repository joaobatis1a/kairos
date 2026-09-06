"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  abrirChamado,
  getChamado,
  responderChamado,
  alternarStatusChamado,
  listarChamados,
  type ChamadoResumo,
  type MensagemChamado,
  type StatusChamado,
} from "@/app/actions/suporte"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Send, Loader2, LifeBuoy, Plus, ArrowLeft, Lock, LockOpen } from "lucide-react"
import { cn } from "@/lib/utils"

function BadgeStatus({ status }: { status: StatusChamado }) {
  return (
    <Badge variant={status === "aberto" ? "default" : "outline"} className="shrink-0">
      {status === "aberto" ? "Aberto" : "Encerrado"}
    </Badge>
  )
}

export function SuporteView({ chamadosIniciais }: { chamadosIniciais: ChamadoResumo[] }) {
  const [chamados, setChamados] = useState(chamadosIniciais)
  const [abertoId, setAbertoId] = useState<string | null>(null)
  const [novoOpen, setNovoOpen] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [pending, startTransition] = useTransition()

  function recarregarLista() {
    startTransition(async () => {
      setChamados(await listarChamados())
    })
  }

  function criarChamado() {
    if (!titulo.trim() || !mensagem.trim()) return
    startTransition(async () => {
      const res = await abrirChamado(titulo, mensagem)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Chamado aberto!")
      setTitulo("")
      setMensagem("")
      setNovoOpen(false)
      setChamados(await listarChamados())
      setAbertoId(res.id)
    })
  }

  if (abertoId) {
    return <ChamadoThread id={abertoId} onVoltar={() => { setAbertoId(null); recarregarLista() }} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Dialog open={novoOpen} onOpenChange={setNovoOpen}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Abrir chamado</Button>} />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Novo chamado</DialogTitle>
              <DialogDescription>Descreva sua dúvida ou problema — a equipe do kairos responde por aqui.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Input placeholder="Título (ex: dúvida sobre pagamento)" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <Textarea placeholder="Descreva o que está acontecendo..." value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={4} />
            </div>
            <DialogFooter>
              <Button onClick={criarChamado} disabled={pending || !titulo.trim() || !mensagem.trim()} className="w-full">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Abrir chamado"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {chamados.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <LifeBuoy className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum chamado ainda. Abra um se precisar de ajuda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {chamados.map((c) => (
            <button
              key={c.id}
              onClick={() => setAbertoId(c.id)}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{c.titulo}</p>
                  {c.naoLidas > 0 && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.autorNome} · {formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
              <BadgeStatus status={c.status} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChamadoThread({ id, onVoltar }: { id: string; onVoltar: () => void }) {
  const [titulo, setTitulo] = useState("")
  const [status, setStatus] = useState<StatusChamado>("aberto")
  const [mensagens, setMensagens] = useState<MensagemChamado[]>([])
  const [texto, setTexto] = useState("")
  const [carregado, setCarregado] = useState(false)
  const [pending, startTransition] = useTransition()
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getChamado(id).then((c) => {
      if (c) {
        setTitulo(c.titulo)
        setStatus(c.status)
        setMensagens(c.mensagens)
      }
      setCarregado(true)
    })
  }, [id])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  function enviar() {
    const msg = texto.trim()
    if (!msg) return
    startTransition(async () => {
      const res = await responderChamado(id, msg)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setTexto("")
      const c = await getChamado(id)
      if (c) {
        setStatus(c.status)
        setMensagens(c.mensagens)
      }
    })
  }

  function alternarStatus() {
    const novo: StatusChamado = status === "aberto" ? "encerrado" : "aberto"
    startTransition(async () => {
      const res = await alternarStatusChamado(id, novo)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setStatus(novo)
    })
  }

  if (!carregado) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-xl border border-border bg-card">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-3">
        <Button variant="ghost" size="icon" onClick={onVoltar} aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <p className="min-w-0 flex-1 truncate font-medium">{titulo}</p>
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

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {mensagens.map((m) => {
            const daEmpresa = m.origem === "empresa"
            return (
              <div key={m.id} className={cn("flex flex-col", daEmpresa ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    daEmpresa ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.mensagem}</p>
                </div>
                <p className="mt-1 px-1 text-xs text-muted-foreground">
                  {daEmpresa ? m.autor_nome || "Você" : "Suporte"} ·{" "}
                  {formatDistanceToNow(new Date(m.created_at), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            )
          })}
          <div ref={fimRef} />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva sua mensagem..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviar()}
          disabled={pending}
        />
        <Button size="icon" onClick={enviar} disabled={pending || !texto.trim()} aria-label="Enviar mensagem">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
