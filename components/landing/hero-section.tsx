import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[380px] w-[760px] max-w-[110vw] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-[120px]"
      />

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
    </section>
  )
}
