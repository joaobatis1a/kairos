import { KairosMark } from "@/components/kairos-mark"

const SERVICOS = ["Corte", "Barba", "Degradê", "Sobrancelha", "Pigmentação", "Pézinho", "Hidratação", "Navalhado"]

/**
 * Faixa que corre sem parar logo abaixo do hero: os serviços de uma
 * barbearia em letra gigante, separados pela marca. Duas linhas em sentidos
 * opostos (uma cheia, uma só contorno). Animação em CSS (compositor),
 * parada pra quem pede menos movimento.
 */
function Linha({ reverso, contorno }: { reverso?: boolean; contorno?: boolean }) {
  const itens = (
    <span className="flex shrink-0 items-center">
      {SERVICOS.map((s) => (
        <span key={s} className="flex items-center">
          <span
            className={
              contorno
                ? "titulo-gigante px-6 text-[clamp(4rem,9vw,8rem)] text-transparent [-webkit-text-stroke:2px_var(--primary)]"
                : "titulo-gigante px-6 text-[clamp(4rem,9vw,8rem)]"
            }
          >
            {s}
          </span>
          <KairosMark className="h-[clamp(2rem,4vw,3.5rem)] w-[clamp(2rem,4vw,3.5rem)] text-primary" />
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
    <div aria-hidden className="tema-escuro relative flex select-none flex-col gap-2 py-8 md:gap-3 md:py-12">
      <Linha />
      <Linha reverso contorno />
    </div>
  )
}
