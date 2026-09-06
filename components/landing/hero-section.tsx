import { Mail, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-8 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-primary/[0.14] blur-[130px]" />
        <div className="absolute left-1/2 top-32 h-[220px] w-[420px] max-w-[90vw] -translate-x-1/2 rounded-full bg-primary/[0.1] blur-[90px]" />
        <div className="kairos-grain absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="revelar texto-dourado text-sm font-bold">Sistema para barbearias</p>

        <h1 className="revelar mt-4 text-balance font-serif text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          A cadeira cheia, a agenda no lugar.
        </h1>

        <p className="revelar mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
          Seu cliente agenda sozinho. Você vê tudo num painel só.
        </p>

        <div className="revelar mt-9">
          <Button size="lg" asChild className="h-13 rounded-full px-8 text-base font-bold">
            <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
              <Mail className="h-5 w-5" />
              Falar com a gente
            </a>
          </Button>
        </div>
      </div>

      <a
        href="#sistema"
        aria-label="Ver o sistema por dentro"
        className="anim-flutuar absolute inset-x-0 bottom-6 mx-auto flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:bottom-10"
      >
        <ChevronDown className="h-5 w-5" aria-hidden />
      </a>
    </section>
  )
}
