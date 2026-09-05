import { Check } from "lucide-react"
import { ScissorMark } from "@/components/scissor-mark"

const INCLUSOS = ["Link próprio", "Painel completo", "Você configura com a gente"]

/**
 * A senha de agendamento que vira o centro do hero, no lugar do bloco de
 * gradiente + lista de check genérica que toda landing de SaaS tem. É o
 * próprio produto (uma marcação) desenhado como o objeto físico que
 * substitui: a fichinha numerada do balcão da barbearia. `aria-hidden`
 * porque é ilustração — o conteúdo real da promessa está no H1 e no texto
 * ao lado.
 */
export function HeroTicket() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[300px] select-none">
      {/* segunda fichinha, atrás, só a silhueta — dá a ideia de "vários agendamentos", não só um */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl border border-primary/25 bg-card shadow-[0_20px_45px_-30px_rgb(0_0_0/0.6)]"
        style={{ transform: "rotate(7deg) translateY(14px)" }}
      />

      <div
        className="anim-flutuar relative rounded-2xl border border-border bg-card p-6 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.55)]"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ScissorMark className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-bold tracking-[0.22em]">KAIROS</span>
          </div>
          <span className="font-accent text-lg italic text-primary/70">Nº 047</span>
        </div>

        {/* linha de destacar: tracejado + duas mordidas nas bordas, como um talão de verdade */}
        <div className="relative my-5">
          <div className="border-t border-dashed border-border" />
          <span className="absolute top-1/2 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          <span className="absolute top-1/2 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
        </div>

        <p className="font-serif text-xl leading-snug">Corte + Barba</p>
        <p className="mt-1 text-sm text-muted-foreground">Hoje · 18:30 · com Rafael</p>

        <span className="texto-dourado-interativo mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1 text-xs font-bold text-primary">
          <Check className="h-3 w-3" aria-hidden />
          Confirmado
        </span>

        <div className="mt-5 flex flex-col gap-2 border-t border-border/70 pt-4">
          {INCLUSOS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3 shrink-0 text-primary" aria-hidden />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
