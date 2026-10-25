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

/** Passo: o número gigante preenche de cobre quando a linha de progresso chega nele. */
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
  const acende = useTransform(progresso, [ponto - 0.08, ponto + 0.02], [0, 1])

  return (
    <Reveal delay={indice * 0.12} className="relative">
      <div className="relative">
        {/* contorno sempre visível; o preenchimento verde sobe por cima */}
        <span className="titulo-gigante block text-[clamp(5rem,9vw,8.5rem)] text-transparent [-webkit-text-stroke:2px_var(--primary)]">
          {passo.n}
        </span>
        <motion.span
          aria-hidden
          style={{ opacity: acende }}
          className="titulo-gigante absolute inset-0 block text-[clamp(5rem,9vw,8.5rem)] text-primary"
        >
          {passo.n}
        </motion.span>
      </div>
      <h3 className="mt-5 text-2xl font-bold leading-snug">{passo.titulo}</h3>
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
    <section id="como-funciona" className="tema-escuro relative scroll-mt-20 overflow-hidden px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[92rem]">
        <Reveal>
          <Eyebrow>Começar</Eyebrow>
        </Reveal>
        <h2 className="titulo-gigante mt-6 text-[clamp(3rem,8vw,8rem)]">
          <TextReveal
            delay={0.1}
            lines={[
              "Do primeiro contato",
              <em key="2" className="font-accent text-[0.92em] font-semibold normal-case italic tracking-[-0.02em] text-primary">
                à agenda cheia.
              </em>,
            ]}
          />
        </h2>
        <Reveal delay={0.22}>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Não tem cadastro solto no site: a gente configura a sua barbearia junto com você.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-20">
          {/* trilho que se preenche conforme a seção entra na tela */}
          <div className="absolute left-0 right-0 top-0 hidden h-0.5 bg-border md:block">
            <motion.div style={{ width: larguraLinha }} className="h-full bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-14 md:grid-cols-4 md:gap-8 md:pt-10">
            {PASSOS.map((p, i) => (
              <Passo key={p.n} passo={p} indice={i} progresso={progresso} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
