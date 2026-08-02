import { Mail, ArrowDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"

/**
 * Hero sem a foto de banco de imagens que ocupava 100svh.
 * Ela era a mesma imagem usada no CTA final e no storefront, não dizia
 * nada sobre o produto e empurrava o argumento pra baixo da dobra. Aqui a
 * promessa e a ação aparecem de cara, e a entrada é em CSS — o conteúdo
 * não depende do JavaScript pra existir.
 */
const PONTOS = [
  "Sua barbearia com link próprio",
  "Agenda, equipe e faturamento num painel",
  "A gente configura tudo com você",
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[380px] w-[760px] max-w-[110vw] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="revelar text-sm font-bold text-primary">Sistema para barbearias</p>

        <h1 className="revelar mt-4 text-balance font-serif text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          A cadeira cheia, a agenda no lugar.
        </h1>

        <p className="revelar mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Seus clientes agendam sozinhos, a qualquer hora. Você acompanha equipe, horários e
          faturamento num painel só.
        </p>

        <div className="revelar mt-9 flex flex-col items-center gap-5">
          <Button size="lg" asChild className="h-13 rounded-full px-8 text-base font-bold">
            <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
              <Mail className="h-5 w-5" />
              Falar com a gente
            </a>
          </Button>

          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {PONTOS.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" aria-hidden />
                {p}
              </li>
            ))}
          </ul>

          <a
            href="#sistema"
            className="group inline-flex items-center gap-2 rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Ver o sistema por dentro
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}
