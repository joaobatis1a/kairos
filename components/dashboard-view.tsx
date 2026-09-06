"use client"

import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import { formatarPreco } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Estrelas } from "@/components/estrelas"
import { Badge } from "@/components/ui/badge"
import type { DashboardData } from "@/app/actions/dashboard"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Trophy,
  Scissors,
  Star,
  MessageSquareQuote,
} from "lucide-react"

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

function formatarDataCurta(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}

function CartaoReceita({
  icon: Icon,
  valor,
  rotulo,
}: {
  icon: React.ElementType
  valor: number
  rotulo: string
}) {
  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="texto-dourado truncate font-serif text-2xl leading-tight">{formatarPreco(valor)}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{rotulo}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function DashboardView({ dados }: { dados: DashboardData }) {
  const { receitaHoje, receitaSemana, receitaMes, rankingBarbeiros, servicosPopulares, avaliacoesGerais } = dados

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6">
      {/* Receita por período */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CartaoReceita icon={DollarSign} valor={receitaHoje} rotulo="Receita hoje" />
        <CartaoReceita icon={Calendar} valor={receitaSemana} rotulo="Receita na semana" />
        <CartaoReceita icon={TrendingUp} valor={receitaMes} rotulo="Receita no mês" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Ranking de barbeiros */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Trophy className="h-4 w-4 text-primary" /> Ranking de barbeiros
              </CardTitle>
              <CardDescription>Por receita gerada no mês.</CardDescription>
            </CardHeader>
            <CardContent>
              {rankingBarbeiros.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum atendimento finalizado este mês ainda.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {rankingBarbeiros.map((b, i) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 font-serif text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium leading-tight">{b.nome}</p>
                          <p className="text-xs text-muted-foreground">{b.total} atendimentos</p>
                        </div>
                      </div>
                      <span className="texto-dourado font-serif text-sm">{formatarPreco(b.receita)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Serviços mais pedidos */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Scissors className="h-4 w-4 text-primary" /> Serviços mais pedidos
              </CardTitle>
              <CardDescription>No mês atual.</CardDescription>
            </CardHeader>
            <CardContent>
              {servicosPopulares.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum atendimento finalizado este mês ainda.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {servicosPopulares.map((s) => {
                    const max = servicosPopulares[0].total
                    const pct = Math.round((s.total / max) * 100)
                    return (
                      <div key={s.nome} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{s.nome}</span>
                          <span className="text-muted-foreground">{s.total}x</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Avaliações gerais */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Star className="h-4 w-4 text-primary" /> Avaliações gerais
            </CardTitle>
            <CardDescription>De todos os barbeiros e clientes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Nota média do serviço</p>
                <div className="flex items-center gap-2">
                  <Estrelas valor={Math.round(avaliacoesGerais.mediaServico)} readonly />
                  <span className="font-serif text-sm font-semibold">
                    {avaliacoesGerais.mediaServico.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Nota média dos barbeiros</p>
                <div className="flex items-center gap-2">
                  <Estrelas valor={Math.round(avaliacoesGerais.mediaBarbeiro)} readonly />
                  <span className="font-serif text-sm font-semibold">
                    {avaliacoesGerais.mediaBarbeiro.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Total de avaliações</p>
                <p className="font-serif text-lg font-bold">{avaliacoesGerais.totalAvaliacoes}</p>
              </div>
            </div>

            {avaliacoesGerais.recentes.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border/60 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Mais recentes
                </p>
                {avaliacoesGerais.recentes.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{a.clienteNome}</span>
                        {a.barbeiroNome && (
                          <Badge variant="outline" className="text-xs">
                            {a.barbeiroNome}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatarDataCurta(a.createdAt)}</span>
                    </div>
                    <Estrelas valor={a.notaServico} readonly tamanho="sm" />
                    {a.comentario && (
                      <p className="flex items-start gap-1.5 text-xs italic text-muted-foreground">
                        <MessageSquareQuote className="mt-0.5 h-3 w-3 shrink-0" />
                        {a.comentario}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
