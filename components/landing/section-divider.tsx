import { ScissorMark } from "@/components/scissor-mark"

/**
 * Corte entre seções: uma linha com a tesoura no meio, como a marca de
 * "corte aqui" de um cupom. Emenda leve entre uma seção e a próxima, no
 * lugar de só um espaço em branco.
 */
export function SectionDivider() {
  return (
    <div aria-hidden className="relative mx-auto max-w-6xl px-6">
      <div className="h-px bg-border/60" />
      <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background">
        <ScissorMark className="h-4 w-4 text-primary/70" />
      </span>
    </div>
  )
}
