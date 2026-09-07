import { KairosDial } from "@/components/landing/kairos-dial"

/**
 * Cenário fixo atrás da landing inteira (não só do hero) — fica parado
 * enquanto a página rola por baixo, dando continuidade visual do topo ao
 * rodapé. De propósito só gradiente + SVG com transform/opacity: nada de
 * blur ou mix-blend-mode aqui, porque esse elemento fica de pé o scroll
 * inteiro e qualquer coisa que force repintura vira custo constante em
 * aparelho fraco (foi exatamente o tipo de problema já corrigido nas
 * barras sticky do painel/manutenção, ver memory de performance).
 */
export function LandingBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]" />
      <div className="absolute left-1/2 top-[8%] aspect-square w-[min(160vw,1400px)] -translate-x-1/2">
        <KairosDial className="h-full w-full" />
      </div>
    </div>
  )
}
