import { Mail, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"
import { HeroTicket } from "@/components/landing/hero-ticket"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-24 h-[320px] w-[320px] rounded-full bg-primary/[0.14] blur-[100px] md:right-[14%]"
      />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-16 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
        <div className="text-center md:text-left">
          <p className="revelar texto-dourado text-sm font-bold">Sistema para barbearias</p>

          <h1 className="revelar mt-4 text-balance font-serif text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            A cadeira cheia, a agenda no lugar.
          </h1>

          <p className="revelar mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground md:mx-0">
            Seus clientes agendam sozinhos, a qualquer hora. Você acompanha equipe, horários e
            faturamento num painel só.
          </p>

          <div className="revelar mt-9 flex flex-col items-center gap-5 md:items-start">
            <Button size="lg" asChild className="h-13 rounded-full px-8 text-base font-bold">
              <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                <Mail className="h-5 w-5" />
                Falar com a gente
              </a>
            </Button>

            <a
              href="#sistema"
              className="group inline-flex items-center gap-2 rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Ver o sistema por dentro
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="revelar">
          <HeroTicket />
        </div>
      </div>
    </section>
  )
}
