import { KairosMark } from "@/components/kairos-mark"

/**
 * Abertura da landing: uma linha dourada "corta" a tela e a cortina sobe,
 * revelando o hero. Toda em CSS (classe .intro-cortina) e com estado base
 * oculto: se o movimento estiver reduzido ou a animação não rodar, a
 * cortina simplesmente nunca aparece e o conteúdo fica livre.
 */
export function IntroCortina() {
  return (
    <div aria-hidden className="intro-cortina pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="intro-cortina__marca flex flex-col items-center gap-5">
        <KairosMark className="h-14 w-14 text-primary" />
        <span className="font-serif text-xl tracking-[0.5em] text-foreground/80">kairos</span>
      </div>
      <span className="intro-cortina__corte absolute left-0 top-1/2 h-px w-full origin-left bg-primary/70" />
    </div>
  )
}
