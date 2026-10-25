import { KairosMark } from "@/components/kairos-mark"

const SERVICOS = ["Corte", "Barba", "Degradê", "Sobrancelha", "Pigmentação", "Pézinho", "Hidratação", "Navalhado"]

/**
 * Faixa que corre sem parar entre o hero e o resto: os serviços de uma
 * barbearia em letra grande, separados pela marca. Duas linhas em sentidos
 * opostos. Animação em CSS (compositor), parada pra quem pede menos movimento.
 */
function Linha({ reverso, outline }: { reverso?: boolean; outline?: boolean }) {
  const itens = (
    <span className="flex shrink-0 items-center">
      {SERVICOS.map((s) => (
        <span key={s} className="flex items-center">
          <span
            className={
              outline
                ? "px-7 font-serif text-5xl text-transparent [-webkit-text-stroke:1px_color-mix(in_oklch,var(--primary)_55%,transparent)] md:text-7xl"
                : "px-7 font-accent text-5xl italic text-foreground/85 md:text-7xl"
            }
          >
            {s}
          </span>
          <KairosMark className="h-6 w-6 text-primary/70 md:h-8 md:w-8" />
        </span>
      ))}
    </span>
  )

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className={`anim-faixa ${reverso ? "anim-faixa-reversa" : ""} flex w-max will-change-transform`}>
        {itens}
        {itens}
      </div>
    </div>
  )
}

export function FaixaServicos() {
  return (
    <div aria-hidden className="relative flex select-none flex-col gap-3 border-y border-border/50 bg-background/50 py-8 md:gap-5 md:py-12">
      <Linha />
      <Linha reverso outline />
    </div>
  )
}
