import { getPerfilOuRedirect } from "@/lib/auth"
import { getAvaliacoesGerais, getAvaliacoesDoBarbeiro } from "@/app/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Estrelas } from "@/components/estrelas"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquareQuote } from "lucide-react"

export const dynamic = "force-dynamic"

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

function formatarDataCurta(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}

export default async function AvaliacoesPage() {
  const perfil = await getPerfilOuRedirect()
  const isOwner = perfil.role === "owner"

  const dados = isOwner ? await getAvaliacoesGerais() : await getAvaliacoesDoBarbeiro()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Avaliações</h1>
        <p className="text-muted-foreground">
          {isOwner
            ? "Avaliações de todos os barbeiros e clientes."
            : "Avaliações que você recebeu dos seus atendimentos."}
        </p>
      </div>

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

      <div>
        <h2 className="mb-3 font-serif text-xl font-semibold">
          {isOwner ? "Avaliações recentes" : "Suas avaliações"}
        </h2>
        {dados.recentes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Nenhuma avaliação ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {dados.recentes.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
