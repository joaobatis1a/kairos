import { BarberPole } from "@/components/landing/barber-pole"

/**
 * Cenário fixo atrás da landing inteira (não só do hero) — fica parado
 * enquanto a página rola por baixo, dando continuidade visual do topo ao
 * rodapé. De propósito só gradiente + CSS puro, sem blur/mix-blend-mode:
 * esse elemento fica de pé o scroll inteiro, e qualquer coisa que force
 * repintura vira custo constante em aparelho fraco (mesma categoria de bug
 * já corrigida nas barras sticky do painel/manutenção, ver memory de
 * performance).
 */
export function LandingBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]" />
      <BarberPole />
    </div>
  )
}
