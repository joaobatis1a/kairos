import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { PalcoProduto } from "@/components/landing/palco-produto"

const TITULO = ["A", "cadeira", "cheia,", "a", "agenda", "no", "lugar."]

/** Espera a cortina de abertura subir (≈1.2s) antes de começar. */
const INICIO = 1.2

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="relative mx-auto max-w-3xl text-center">
        <p
          className="revelar revelar-tarde inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-4 py-1.5 text-sm font-bold"
          style={{ animationDelay: `${INICIO}s` }}
        >
          <span className="anim-pulsar h-1.5 w-1.5 rounded-full bg-primary text-primary" />
          <span className="texto-dourado">Sistema para barbearias</span>
        </p>

        {/* uma palavra por vez, cada uma subindo de dentro de uma máscara */}
        <h1 className="mt-6 text-balance font-serif text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          {TITULO.map((palavra, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span
                className="revelar-linha revelar-tarde inline-block"
                style={{ animationDelay: `${INICIO + 0.1 + i * 0.07}s` }}
              >
                {palavra}
                {i < TITULO.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="revelar revelar-tarde mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: `${INICIO + 0.6}s` }}
        >
          Seu cliente agenda sozinho. Você vê tudo num painel só.
        </p>

        <div className="revelar revelar-tarde mt-9" style={{ animationDelay: `${INICIO + 0.75}s` }}>
          <Magnetico forca={0.25}>
            <Button size="lg" asChild className="h-13 rounded-full px-8 text-base font-bold">
              <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                <Mail className="h-5 w-5" />
                Falar com a gente
              </a>
            </Button>
          </Magnetico>
        </div>
      </div>

      <PalcoProduto />
    </section>
  )
}
