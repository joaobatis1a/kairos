import { ArrowUpRight } from "lucide-react"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { PalcoProduto } from "@/components/landing/palco-produto"
import { KairosMark } from "@/components/kairos-mark"

/** Espera a cortina de abertura subir (≈1.2s) antes de começar. */
const INICIO = 1.2

/** Uma linha do título: sobe de dentro de uma máscara. */
function Linha({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span className="revelar-linha revelar-tarde block" style={{ animationDelay: `${INICIO + i * 0.12}s` }}>
        {children}
      </span>
    </span>
  )
}

/** Selo giratório: texto em círculo em volta da marca. */
function Selo() {
  return (
    <div className="relative h-36 w-36 shrink-0 md:h-44 md:w-44">
      <svg viewBox="0 0 200 200" className="anim-girar absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="selo-circulo" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <text fill="currentColor" className="font-display text-[15px] font-bold uppercase tracking-[0.2em]">
          <textPath href="#selo-circulo">sem app ✦ sem caderno ✦ sem vai e volta ✦ </textPath>
        </text>
      </svg>
      <span className="absolute inset-[22%] flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-foreground">
        <KairosMark className="h-1/2 w-1/2" />
      </span>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="tema-claro relative overflow-hidden px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36">
      <div aria-hidden className="fundo-risca pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[92rem]">
        <p
          className="revelar revelar-tarde mb-6 inline-flex items-center gap-2 border border-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
          style={{ animationDelay: `${INICIO}s` }}
        >
          <span className="anim-pulsar h-2 w-2 rounded-full bg-primary text-primary ring-1 ring-foreground" />
          Sistema para barbearias
        </p>

        <h1 className="titulo-gigante relative text-[clamp(3.4rem,12.5vw,12rem)]">
          <Linha i={0}>A cadeira</Linha>
          <Linha i={1}>
            cheia,{" "}
            <em className="marca-texto font-accent text-[0.92em] font-semibold normal-case italic tracking-[-0.02em]">
              a agenda
            </em>
          </Linha>
          <Linha i={2}>no lugar.</Linha>
          {/* sublinhado à mão: fora das máscaras das linhas pra não ser cortado */}
          <svg
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            aria-hidden
            className="pointer-events-none absolute -bottom-[0.1em] left-0 h-[0.22em] w-[3.9em] overflow-visible"
          >
            <path
              d="M4 22C50 4 90 34 140 16s90 14 140-4 80 12 116-2"
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth={7}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="desenhar"
              style={{ animationDelay: `${INICIO + 0.9}s` }}
            />
          </svg>
        </h1>

        <div
          className="revelar revelar-tarde mt-10 flex flex-col items-start justify-between gap-8 md:mt-14 md:flex-row md:items-end"
          style={{ animationDelay: `${INICIO + 0.7}s` }}
        >
          <div className="max-w-md">
            <p className="text-lg leading-snug md:text-xl">
              Seu cliente agenda sozinho. Você vê a casa inteira num painel só, do corte ao faturamento do mês.
            </p>
            <div className="mt-7">
              <Magnetico forca={0.25}>
                <a
                  href={LINK_CONTATO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-primary py-2 pl-7 pr-2 text-base font-bold text-primary-foreground ring-2 ring-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Falar com a gente
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </a>
              </Magnetico>
            </div>
          </div>
          <Selo />
        </div>

        <PalcoProduto />
      </div>
    </section>
  )
}
