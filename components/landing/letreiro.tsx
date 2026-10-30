import { KairosMark } from "@/components/kairos-mark"

const SERVICOS = ["Corte", "Barba", "Degradê", "Navalhado", "Pigmentação", "Sobrancelha", "Pezinho", "Hidratação"]

/**
 * Letreiro corrido: os serviços da casa em capitulares de folha de ouro,
 * entre dois fios de meandro, como a faixa pintada na vitrine.
 */
export function Letreiro() {
  const itens = (
    <span className="flex shrink-0 items-center">
      {SERVICOS.map((s) => (
        <span key={s} className="flex items-center">
          <span className="letreiro ouro-folha px-8 text-2xl md:px-12 md:text-4xl">{s}</span>
          <KairosMark className="h-5 w-5 text-[#d4aa55]/70 md:h-6 md:w-6" />
        </span>
      ))}
    </span>
  )

  return (
    <div aria-hidden className="kairos-noite relative select-none overflow-hidden py-8 md:py-10">
      <div className="anim-faixa flex w-max will-change-transform">
        {itens}
        {itens}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0b0a09] to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0b0a09] to-transparent md:w-40" />
    </div>
  )
}
