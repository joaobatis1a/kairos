"use client"

import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Estrelas } from "@/components/estrelas"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquareQuote } from "lucide-react"
import type { AvaliacoesResumo } from "@/app/actions/dashboard"

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

function formatarDataCurta(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}

export function AvaliacoesView({ dados, isOwner }: { dados: AvaliacoesResumo; isOwner: boolean }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Star className="h-4 w-4 text-primary" /> Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Nota média do serviço</p>
              <div className="flex items-center gap-2">
                <Estrelas valor={Math.round(dados.mediaServico)} readonly />
                <span className="text-sm font-semibold">{dados.mediaServico.toFixed(1)}</span>
              </div>
            </div>
            {isOwner && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Nota média dos barbeiros</p>
                <div className="flex items-center gap-2">
                  <Estrelas valor={Math.round(dados.mediaBarbeiro)} readonly />
                  <span className="text-sm font-semibold">{dados.mediaBarbeiro.toFixed(1)}</span>
                </div>
              </div>
            )}
            {!isOwner && dados.mediaBarbeiro > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Sua nota média</p>
                <div className="flex items-center gap-2">
                  <Estrelas valor={Math.round(dados.mediaBarbeiro)} readonly />
                  <span className="text-sm font-semibold">{dados.mediaBarbeiro.toFixed(1)}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Total de avaliações</p>
              <p className="text-lg font-bold">{dados.totalAvaliacoes}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="mb-3 font-serif text-xl font-semibold">
          {isOwner ? "Avaliações recentes" : "Suas avaliações"}
        </h2>
        {dados.recentes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Nenhuma avaliação ainda.
          </p>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-2">
            {dados.recentes.map((a) => (
              <motion.div
                key={a.id}
                variants={item}
                className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.clienteNome}</span>
                    {isOwner && a.barbeiroNome && (
                      <Badge variant="outline" className="text-xs">
                        {a.barbeiroNome}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatarDataCurta(a.createdAt)}
                  </span>
                </div>
                <Estrelas valor={a.notaServico} readonly tamanho="sm" />
                {a.comentario && (
                  <p className="flex items-start gap-1.5 text-xs italic text-muted-foreground">
                    <MessageSquareQuote className="mt-0.5 h-3 w-3 shrink-0" />
                    {a.comentario}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
