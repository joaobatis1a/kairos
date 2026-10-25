import { KairosMark } from "@/components/kairos-mark"

/**
 * Abertura da landing: um bloco verde-ácido cobre a tela, o K se corta ao
 * meio e a cortina sobe revelando o hero. Toda em CSS (classe
 * .intro-cortina) e com estado base oculto: com movimento reduzido ou sem
 * a animação, a cortina nunca aparece e o conteúdo fica livre.
 */
export function IntroCortina() {
  return (
    <div
      aria-hidden
      className="intro-cortina pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[#5a1620] text-[#f1e8d8]"
    >
      <div className="intro-cortina__marca flex flex-col items-center gap-4">
        <KairosMark className="h-28 w-28 md:h-36 md:w-36" />
        <span className="titulo-gigante text-3xl tracking-[0.2em]">kairos</span>
      </div>
    </div>
  )
}
