"use client"

import { Estrelas } from "@/components/estrelas"
import { Button } from "@/components/ui/button"
import { CalendarCheck, Scissors } from "lucide-react"
import type { BarbeiroVitrine } from "@/app/actions/agendamentos"

/**
 * Quem vai cortar o seu cabelo. A versão anterior mostrava só a inicial e o
 * nome — nada que ajudasse a escolher. Agora traz a nota média e quantos
 * atendimentos a pessoa já fez na casa, que é dado real e de leitura pública.
 */
export function StorefrontEquipe({
  barbeiros,
  onAgendar,
}: {
  barbeiros: BarbeiroVitrine[]
  onAgendar: () => void
}) {
  if (barbeiros.length === 0) return null

  return (
    <section id="equipe" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 md:py-24">
      <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.02em]">
        Quem corta
      </h2>
      <p className="mt-2 text-muted-foreground">Você escolhe o profissional na hora de agendar.</p>

      <div className="mt-10 flex flex-wrap gap-4 [&>*]:min-w-[min(100%,17rem)] [&>*]:flex-1">
        {barbeiros.map((b) => (
          <div
            key={b.id}
            className="surgir-suave cartao-interativo group flex flex-col rounded-2xl border border-border bg-card p-6 hover:border-primary/50"
          >
            <div className="flex items-center gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-xl font-bold text-primary transition-transform duration-300 group-hover:scale-105"
                aria-hidden
              >
                {b.nome.trim()[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-serif text-lg font-semibold">{b.nome}</p>
                {b.nota !== null ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Estrelas valor={Math.round(b.nota)} readonly tamanho="sm" />
                    <span className="text-sm font-semibold tabular-nums">{b.nota.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({b.totalAvaliacoes})</span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Ainda sem avaliações</p>
                )}
              </div>
            </div>

            {b.totalCortes > 0 && (
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Scissors className="h-3.5 w-3.5" aria-hidden />
                <span className="tabular-nums">{b.totalCortes}</span>
                {b.totalCortes === 1 ? " atendimento na casa" : " atendimentos na casa"}
              </p>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onAgendar}
              className="mt-5 rounded-full font-bold"
            >
              <CalendarCheck className="h-4 w-4" />
              Agendar com {b.nome.trim().split(" ")[0]}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
