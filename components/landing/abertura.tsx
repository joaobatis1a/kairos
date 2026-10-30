import { KairosMark } from "@/components/kairos-mark"

/**
 * Abertura (≈2s): o aro da moeda se desenha em ouro, a moeda e o nome
 * aparecem e a cortina sobe. CSS puro; com movimento reduzido nem existe.
 * Não bloqueia clique depois que sobe (visibility: hidden no fim).
 */
export function Abertura() {
  return (
    <div
      aria-hidden
      className="abertura kairos-noite pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
    >
      <div className="relative h-28 w-28 md:h-32 md:w-32">
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="31"
            pathLength={1}
            fill="none"
            stroke="#d4aa55"
            strokeWidth="0.8"
            className="abertura-traco"
          />
        </svg>
        <KairosMark className="abertura-surge absolute inset-[22%] h-[56%] w-[56%] text-[#d4aa55] [animation-delay:0.7s]" />
      </div>
      <p className="letreiro ouro-folha abertura-surge text-lg [animation-delay:0.95s]">Kairos</p>
    </div>
  )
}
