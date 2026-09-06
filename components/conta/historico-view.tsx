"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { salvarAvaliacao } from "@/app/actions/avaliacoes"
import { cancelarMeuAgendamento } from "@/app/actions/agendamentos"
import { Estrelas } from "@/components/estrelas"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatarPreco } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Scissors, Star, CalendarDays, Loader2 } from "lucide-react"

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

const statusConfig: Record<string, { label: string; classe: string }> = {
  pendente: { label: "Pendente", classe: "bg-primary/15 text-primary border-primary/30" },
  confirmado: { label: "Confirmado", classe: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  finalizado: { label: "Finalizado", classe: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cancelado: { label: "Cancelado", classe: "bg-destructive/15 text-destructive border-destructive/30" },
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-")
  return `${dia} ${MESES[parseInt(mes) - 1]} ${ano}`
}

export type AgHistorico = {
  id: string
  servico_nome: string
  servico_preco: number
  barbeiro_id: string | null
  data: string
  horario: string
  status: string
  forma_pagamento: string | null
  barbeiro: { id: string; nome: string } | null
  avaliacao: { id: string; nota_servico: number; nota_barbeiro: number | null; comentario: string | null }[] | null
}

/** Atendimentos anteriores e as avaliações deles. */
export function HistoricoView({ historico }: { historico: AgHistorico[] }) {
  const router = useRouter()
  const [agAvaliando, setAgAvaliando] = useState<AgHistorico | null>(null)
  const [notaServico, setNotaServico] = useState(0)
  const [notaBarbeiro, setNotaBarbeiro] = useState(0)
  const [comentario, setComentario] = useState("")
  const [agCancelando, setAgCancelando] = useState<AgHistorico | null>(null)
  const [motivoCancel, setMotivoCancel] = useState("")
  const [pending, startTransition] = useTransition()

  function cancelar() {
    if (!agCancelando) return
    startTransition(async () => {
      const res = await cancelarMeuAgendamento(agCancelando.id, motivoCancel)
      if (!res.ok) { toast.error(res.error ?? "Erro ao cancelar."); return }
      toast.success("Agendamento cancelado.")
      setAgCancelando(null)
      setMotivoCancel("")
      router.refresh()
    })
  }

  function abrirAvaliacao(ag: AgHistorico) {
    const av = ag.avaliacao?.[0]
    setNotaServico(av?.nota_servico ?? 0)
    setNotaBarbeiro(av?.nota_barbeiro ?? 0)
    setComentario(av?.comentario ?? "")
    setAgAvaliando(ag)
  }

  function salvar() {
    if (!agAvaliando || notaServico === 0) {
      toast.error("Avalie o serviço com pelo menos 1 estrela.")
      return
    }
    startTransition(async () => {
      const res = await salvarAvaliacao({
        agendamentoId: agAvaliando.id,
        barbeiroId: agAvaliando.barbeiro_id,
        notaServico,
        notaBarbeiro: notaBarbeiro > 0 ? notaBarbeiro : null,
        comentario,
      })
      if (!res.ok) { toast.error(res.error ?? "Erro ao salvar."); return }
      toast.success("Avaliação salva!")
      setAgAvaliando(null)
    })
  }

  if (historico.length === 0) {
    return (
      <div className="surgir flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground/30" aria-hidden />
        <p className="text-muted-foreground">Você ainda não tem atendimentos.</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Depois do primeiro corte, ele aparece aqui pra você avaliar.
        </p>
      </div>
    )
  }

  return (
    <div className="surgir flex flex-col gap-3">
      {historico.map((ag) => {
        const av = ag.avaliacao?.[0]
        return (
          <div
            key={ag.id}
            className={cn(
              "cartao-interativo flex flex-col gap-3 rounded-2xl border border-border bg-card p-5",
              ag.status === "cancelado" && "opacity-70",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Scissors className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold leading-tight">{ag.servico_nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatarData(ag.data)} · {ag.horario.slice(0, 5)} · {ag.barbeiro?.nome ?? "Barbeiro"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="texto-dourado font-serif font-bold tabular-nums">
                  {formatarPreco(Number(ag.servico_preco))}
                </span>
                <Badge variant="outline" className={statusConfig[ag.status]?.classe}>
                  {statusConfig[ag.status]?.label}
                </Badge>
              </div>
            </div>

            {(ag.status === "pendente" || ag.status === "confirmado") && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setMotivoCancel(""); setAgCancelando(ag) }}
                className="self-start rounded-full"
              >
                Cancelar agendamento
              </Button>
            )}

            {av ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    Serviço <Estrelas valor={av.nota_servico} readonly tamanho="sm" />
                  </span>
                  {av.nota_barbeiro && (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      Barbeiro <Estrelas valor={av.nota_barbeiro} readonly tamanho="sm" />
                    </span>
                  )}
                  {av.comentario && (
                    <span className="text-sm italic text-muted-foreground">
                      &ldquo;{av.comentario}&rdquo;
                    </span>
                  )}
                </div>
                <Button size="sm" variant="ghost" onClick={() => abrirAvaliacao(ag)}>
                  Editar avaliação
                </Button>
              </div>
            ) : (
              ag.status === "finalizado" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => abrirAvaliacao(ag)}
                  className="self-start rounded-full font-bold"
                >
                  <Star className="h-4 w-4" aria-hidden /> Avaliar atendimento
                </Button>
              )
            )}
          </div>
        )
      })}

      <Dialog open={!!agCancelando} onOpenChange={(o) => !o && setAgCancelando(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Cancelar agendamento</DialogTitle>
            <DialogDescription>
              {agCancelando?.servico_nome} · {agCancelando?.data ? formatarData(agCancelando.data) : ""} às{" "}
              {agCancelando?.horario.slice(0, 5)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <p className="text-sm font-medium">Motivo (opcional)</p>
            <Textarea
              value={motivoCancel}
              onChange={(e) => setMotivoCancel(e.target.value)}
              placeholder="Ex: imprevisto, vou remarcar depois..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgCancelando(null)}>Voltar</Button>
            <Button variant="destructive" onClick={cancelar} disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Confirmar cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!agAvaliando} onOpenChange={(o) => !o && setAgAvaliando(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Avaliar atendimento</DialogTitle>
            <DialogDescription>
              {agAvaliando?.servico_nome} · {agAvaliando?.data ? formatarData(agAvaliando.data) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Serviço <span className="text-destructive">*</span></p>
              <Estrelas valor={notaServico} onChange={setNotaServico} tamanho="lg" />
            </div>
            {agAvaliando?.barbeiro && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Barbeiro ({agAvaliando.barbeiro.nome})</p>
                <Estrelas valor={notaBarbeiro} onChange={setNotaBarbeiro} tamanho="lg" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Comentário (opcional)</p>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Conte como foi sua experiência..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgAvaliando(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={pending || notaServico === 0}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Salvar avaliação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
