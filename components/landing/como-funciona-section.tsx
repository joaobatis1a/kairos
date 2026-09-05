"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"

const PASSOS = [
  { n: "01", titulo: "Você fala com a gente", texto: "Conta como a barbearia funciona hoje: serviços, equipe, horários." },
  { n: "02", titulo: "A gente monta a casa", texto: "Sua barbearia entra na plataforma já configurada, com link próprio." },
  { n: "03", titulo: "Você recebe a chave", texto: "Um código de convite libera o painel como administrador da sua barbearia." },
  { n: "04", titulo: "A agenda abre", texto: "Sua equipe entra, o link vai pro ar e os clientes começam a marcar." },
]

/** Marcador que acende quando a linha de progresso chega nele. */
function Passo({
  passo,
  indice,
  progresso,
}: {
  passo: (typeof PASSOS)[number]
  indice: number
  progresso: MotionValue<number>
}) {
  const ponto = indice / (PASSOS.length - 1)
  const escala = useTransform(progresso, [ponto - 0.06, ponto + 0.02], [0, 1])
  const brilho = useTransform(progresso, [ponto - 0.06, ponto + 0.02], [0, 1])

  return (
    <Reveal delay={indice * 0.12} className="relative">
      <div className="flex items-center gap-4 md:block">
        <span className="relative z-10 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background">
          {/* halo + anel acendem quando a linha de progresso alcança o passo */}
          <motion.span style={{ opacity: brilho }} className="absolute -inset-1 rounded-full bg-primary/25 blur-[4px]" />
          <motion.span
            style={{ opacity: brilho, scale: escala }}
            className="absolute inset-0 rounded-full border border-primary"
          />
          <span className="relative font-serif text-[11px] text-primary">{indice + 1}</span>
        </span>
        <span className="font-serif text-xs tracking-[0.3em] text-primary/40 md:mt-6 md:block">{passo.n}</span>
      </div>
      <h3 className="mt-4 font-serif text-xl leading-snug md:mt-2">{passo.titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>
    </Reveal>
  )
}

export function ComoFuncionaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const progresso = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const larguraLinha = useTransform(progresso, [0, 1], ["0%", "100%"])

  return (
    <section id="como-funciona" className="relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow>Começar</Eyebrow>
          </Reveal>
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            <TextReveal delay={0.1} lines={["Do primeiro contato", <em key="2" className="texto-dourado font-accent italic">à agenda cheia.</em>]} />
          </h2>
          <Reveal delay={0.22}>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Não tem cadastro solto no site: a gente configura a sua barbearia junto com você.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-20">
          {/* trilho que se preenche conforme a seção entra na tela */}
          <div className="absolute left-0 right-0 top-[13px] hidden h-px bg-border/70 md:block">
            <motion.div style={{ width: larguraLinha }} className="h-full bg-primary/80" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            {PASSOS.map((p, i) => (
              <Passo key={p.n} passo={p} indice={i} progresso={progresso} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
