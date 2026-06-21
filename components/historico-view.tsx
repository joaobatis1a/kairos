"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { salvarAvaliacao } from "@/app/actions/avaliacoes"
import { Estrelas } from "@/components/estrelas"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Cliente } from "@/lib/types"
import { formatarPreco } from "@/config/barbearia"
import {
  Scissors, Clock, ArrowLeft, Star, CheckCheck, X, Loader2, CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; classe: string }> = {
  pendente: { label: "Pendente", classe: "bg-primary/15 text-primary border-primary/30" },
  confirmado: { label: "Confirmado", classe: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  finalizado: { label: "Finalizado", classe: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cancelado: { label: "Cancelado", classe: "bg-destructive/15 text-destructive border-destructive/30" },
}

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-")
  return `${dia} ${MESES[parseInt(mes) - 1]} ${ano}`
}

type AgHistorico = {
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

export function HistoricoView({ cliente, historico }: { cliente: Cliente; historico: AgHistorico[] }) {
  const [agAvaliando, setAgAvaliando] = useState<AgHistorico | null>(null)
  const [notaServico, setNotaServico] = useState(0)
  const [notaBarbeiro, setNotaBarbeiro] = useState(0)
  const [comentario, setComentario] = useState("")
  const [pending, startTransition] = useTransition()

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

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-lg font-semibold">Histórico & Avaliações</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6">
        {historico.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
            <Button asChild variant="outline"><Link href="/">Agendar agora</Link></Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {historico.map((ag) => {
              const av = ag.avaliacao?.[0]
              const podeAvaliar = ag.status === "finalizado"

              return (
                <div
                  key={ag.id}
                  className={cn(
                    "rounded-xl border bg-card p-4 flex flex-col gap-3",
                    ag.status === "cancelado" && "opacity-60",
                    ag.status === "finalizado" && "border-emerald-500/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Scissors className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{ag.servico_nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatarData(ag.data)} · {ag.horario.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={statusConfig[ag.status]?.classe}>
                      {statusConfig[ag.status]?.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{ag.barbeiro?.nome ?? "Barbeiro"}</span>
                    <span className="font-semibold text-primary">{formatarPreco(Number(ag.servico_preco))}</span>
                  </div>

                  {/* Avaliação existente */}
                  {av && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Serviço</span>
                            <Estrelas valor={av.nota_servico} readonly tamanho="sm" />
                          </div>
                          {av.nota_barbeiro && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Barbeiro</span>
                              <Estrelas valor={av.nota_barbeiro} readonly tamanho="sm" />
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => abrirAvaliacao(ag)}>
                          Editar
                        </Button>
                      </div>
                      {av.comentario && (
                        <p className="text-xs text-muted-foreground italic">"{av.comentario}"</p>
                      )}
                    </div>
                  )}

                  {/* Botão avaliar */}
                  {podeAvaliar && !av && (
                    <Button size="sm" variant="outline" onClick={() => abrirAvaliacao(ag)} className="self-start">
                      <Star className="h-3.5 w-3.5" /> Avaliar
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal de avaliação */}
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
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar avaliação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
