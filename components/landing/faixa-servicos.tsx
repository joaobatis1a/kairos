const SERVICOS = ["Corte", "Barba", "Degradê", "Sobrancelha", "Pigmentação", "Pézinho", "Hidratação", "Navalhado"]

/**
 * Faixa que corre devagar logo abaixo do hero: os serviços de uma barbearia
 * em letra fina, separados por um ponto dourado. Animação em CSS
 * (compositor), parada pra quem pede menos movimento.
 */
export function FaixaServicos() {
  const itens = (
    <span className="flex shrink-0 items-center">
      {SERVICOS.map((s) => (
        <span key={s} className="flex items-center">
          <span className="titulo-fino px-8 text-[clamp(2.4rem,5vw,4.5rem)] text-foreground/70">{s}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      ))}
    </span>
  )

  return (
    <div
      aria-hidden
      className="tema-escuro relative select-none overflow-hidden whitespace-nowrap border-y border-foreground/10 py-8 md:py-12"
    >
      <div className="anim-faixa flex w-max will-change-transform">
        {itens}
        {itens}
      </div>
      {/* bordas que apagam a faixa */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent md:w-48" />
    </div>
  )
}
