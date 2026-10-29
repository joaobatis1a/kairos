import { ArrowUpRight } from "lucide-react"
import { LINK_CONTATO } from "@/components/landing/contato"
import { FundoOuro } from "@/components/landing/fundo-ouro"
import { Magnetico } from "@/components/landing/magnetico"
import { PalcoProduto } from "@/components/landing/palco-produto"

/** Espera a cortina de abertura subir (≈1.2s) antes de começar. */
const INICIO = 1.2

const CAPACIDADES = ["Agenda online, 24 horas", "Equipe e comissão sem conta", "O mês fechado num painel"]

/** Uma linha do título: sobe de dentro de uma máscara. */
function Linha({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <span className="revelar-linha revelar-tarde block" style={{ animationDelay: `${INICIO + i * 0.14}s` }}>
        {children}
      </span>
    </span>
  )
}

export function HeroSection() {
  return (
    <section className="tema-escuro relative overflow-hidden px-5 pb-24 pt-32 md:px-8 md:pb-36 md:pt-44">
      <FundoOuro />
      {/* o fundo termina no preto da próxima seção, sem corte */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto max-w-[92rem]">
        <p
          className="revelar revelar-tarde mb-8 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em] text-primary"
          style={{ animationDelay: `${INICIO}s` }}
        >
          <span className="h-px w-8 bg-primary" />
          Sistema para barbearias
        </p>

        <h1 className="titulo-fino text-[clamp(3.2rem,10.5vw,10.5rem)]">
          <Linha i={0}>A cadeira cheia.</Linha>
          <Linha i={1}>
            A agenda{" "}
            <em className="font-accent font-medium italic text-primary">no lugar.</em>
          </Linha>
        </h1>

        <div
          className="revelar revelar-tarde mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12 md:items-end"
          style={{ animationDelay: `${INICIO + 0.7}s` }}
        >
          <ul className="md:col-span-5">
            {CAPACIDADES.map((c) => (
              <li
                key={c}
                className="group flex items-center justify-between gap-6 border-t border-foreground/15 py-4 text-sm text-foreground/80 last:border-b"
              >
                {c}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </li>
            ))}
          </ul>

          <div className="md:col-span-5 md:col-start-8">
            <p className="text-lg leading-snug text-foreground/85 md:text-xl">
              Seu cliente agenda sozinho. Você vê a casa inteira num painel só, do corte ao faturamento do mês.
            </p>
            <div className="mt-7">
              <Magnetico forca={0.25}>
                <a
                  href={LINK_CONTATO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-primary py-2 pl-7 pr-2 text-base font-semibold text-primary-foreground transition-colors hover:bg-foreground"
                >
                  Falar com a gente
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-primary transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </a>
              </Magnetico>
            </div>
          </div>
        </div>

        <PalcoProduto />
      </div>
    </section>
  )
}
