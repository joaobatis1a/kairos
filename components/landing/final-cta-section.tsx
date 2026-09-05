import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"

export function FinalCtaSection() {
  return (
    <section id="contato" className="scroll-mt-20">
      <div className="mx-auto max-w-2xl px-6 py-28 text-center md:py-36">
        <Reveal>
          <Eyebrow>A cadeira está livre</Eyebrow>
        </Reveal>

        <h2 className="mt-6 font-serif text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          <TextReveal delay={0.1} lines={["Vamos colocar sua", <em key="2" className="texto-dourado font-accent italic">barbearia no kairos?</em>]} />
        </h2>

        <Reveal delay={0.22}>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
            Conte da sua barbearia no e-mail. Devolvemos o acesso já configurado.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex flex-col items-center gap-4">
            <Magnetico forca={0.3}>
              <Button size="lg" asChild className="h-13 rounded-full px-8 text-base font-bold">
                <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                  <Mail className="h-4 w-4" />
                  Falar com a gente
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </Magnetico>
            <p className="text-xs text-muted-foreground/70">
              Sem cadastro automático e sem cobrança nenhuma pra conversar.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
