"use client"

import { Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatarPreco } from "@/config/barbearia"
import type { ServicoDb } from "@/app/actions/config"

/**
 * Cartão de serviço no formato de ficha de barbearia: preço e duração são a
 * informação que a pessoa procura, então ficam no topo da hierarquia — não
 * escondidos num rodapé de card.
 */
export function ServicoCard({
  servico,
  indice,
  onAgendar,
}: {
  servico: ServicoDb
  indice: number
  onAgendar: () => void
}) {
  return (
    <div className="surgir-suave cartao-interativo group flex flex-col rounded-2xl border border-border bg-card p-6 hover:border-primary/50">
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 text-pretty font-serif text-xl font-semibold leading-tight">{servico.nome}</h3>
        <span className="texto-dourado shrink-0 font-serif text-2xl font-bold tabular-nums transition-transform duration-300 group-hover:scale-105">
          {formatarPreco(servico.preco)}
        </span>
      </div>

      {servico.descricao && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{servico.descricao}</p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {servico.duracao_min} min
        </span>
        <Button size="sm" onClick={onAgendar} className="rounded-full font-bold">
          Agendar
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  )
}
