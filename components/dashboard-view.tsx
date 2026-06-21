import { formatarPreco } from "@/config/barbearia"
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

export function DashboardView({ dados }: { dados: DashboardData }) {
  const { receitaHoje, receitaSemana, receitaMes, rankingBarbeiros, servicosPopulares, avaliacoesGerais } = dados

  return (
    <div className="flex flex-col gap-6">
      {/* Receita por período */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">{formatarPreco(receitaHoje)}</p>
              <p className="text-xs text-muted-foreground">Receita hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">{formatarPreco(receitaSemana)}</p>
              <p className="text-xs text-muted-foreground">Receita na semana</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">{formatarPreco(receitaMes)}</p>
              <p className="text-xs text-muted-foreground">Receita no mês</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Ranking de barbeiros */}
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
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium leading-tight">{b.nome}</p>
                        <p className="text-xs text-muted-foreground">{b.total} atendimentos</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatarPreco(b.receita)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serviços mais pedidos */}
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
              <div className="flex flex-col gap-2">
                {servicosPopulares.map((s) => {
                  const max = servicosPopulares[0].total
                  const pct = Math.round((s.total / max) * 100)
                  return (
                    <div key={s.nome} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.nome}</span>
                        <span className="text-muted-foreground">{s.total}x</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Avaliações gerais */}
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
                <span className="text-sm font-semibold">
                  {avaliacoesGerais.mediaServico.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Nota média dos barbeiros</p>
              <div className="flex items-center gap-2">
                <Estrelas valor={Math.round(avaliacoesGerais.mediaBarbeiro)} readonly />
                <span className="text-sm font-semibold">
                  {avaliacoesGerais.mediaBarbeiro.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Total de avaliações</p>
              <p className="text-lg font-bold">{avaliacoesGerais.totalAvaliacoes}</p>
            </div>
          </div>

          {avaliacoesGerais.recentes.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mais recentes
              </p>
              {avaliacoesGerais.recentes.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/30 p-3"
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
