"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useSemCursor } from "@/components/landing/hooks"
import { Reveal, Eyebrow } from "@/components/landing/reveal"

const RECURSOS = [
  {
    titulo: "Link próprio",
    texto: "Sua barbearia com endereço exclusivo, pronto pra colar na bio do Instagram.",
  },
  {
    titulo: "Horários sob controle",
    texto: "Você define dias de funcionamento, intervalos e a duração de cada serviço.",
  },
  {
    titulo: "Equipe organizada",
    texto: "Cadastre barbeiros, ative e desative quem está atendendo na semana.",
  },
  {
    titulo: "Avisos automáticos",
    texto: "Confirmação, lembrete na véspera e agradecimento saem sem você lembrar.",
  },
  {
    titulo: "Avaliação após o corte",
    texto: "O cliente avalia o serviço e o profissional; a média fica no seu painel.",
  },
  {
    titulo: "Cada um no seu lugar",
    texto: "Dono vê tudo, barbeiro vê a própria agenda. Sem dado trocado entre barbearias.",
  },
]

/**
 * Linha do "quadro de serviços" — um número + nome + descrição, com a
 * coluna de preço de um quadro de barbearia de verdade substituída por
 * "incluso". Troca a grade de cards com ícone (o clichê de landing de SaaS)
 * por uma lista de linhas, a mesma linguagem estrutural do "O que muda"
 * (LinhaTroca em manifesto-section) — então a página fala uma língua só.
 */
function LinhaRecurso({
  titulo,
  texto,
  indice,
}: {
  titulo: string
  texto: string
  indice: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const semCursor = useSemCursor()
  const noCentro = useInView(ref, { margin: "-45% 0px -45% 0px" })
  const ativo = semCursor && noCentro

  return (
    <Reveal delay={0.06 * indice}>
      <div
        ref={ref}
        data-ativo={ativo}
        className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-t border-border/60 py-6 transition-colors duration-500 last:border-b hover:border-primary/40 data-[ativo=true]:border-primary/40 sm:gap-x-8"
      >
        <span className="font-accent text-lg italic text-primary/40 transition-colors duration-500 group-hover:text-primary group-data-[ativo=true]:text-primary tabular-nums">
          {String(indice + 1).padStart(2, "0")}
        </span>

        <div>
          <h3 className="font-serif text-lg leading-snug">{titulo}</h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{texto}</p>
        </div>

        <span className="texto-dourado hidden shrink-0 text-xs font-bold tracking-[0.18em] uppercase sm:inline">
          Incluso
        </span>
      </div>
    </Reveal>
  )
}

export function RecursosSection() {
  return (
    <section id="recursos" className="mx-auto max-w-4xl scroll-mt-20 px-6 py-28 md:py-36">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <Eyebrow>Também vem junto</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.02em]">
              O resto que faz falta<span className="texto-dourado">.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Detalhes pequenos que somem da sua cabeça e passam a acontecer sozinhos.
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        {RECURSOS.map((r, i) => (
          <LinhaRecurso key={r.titulo} titulo={r.titulo} texto={r.texto} indice={i} />
        ))}
      </div>
    </section>
  )
}
