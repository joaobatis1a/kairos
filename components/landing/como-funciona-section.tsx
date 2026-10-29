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

/** Passo: o número acende em ouro quando o fio de progresso chega nele. */
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
  const acende = useTransform(progresso, [ponto - 0.1, ponto + 0.02], [0.22, 1])
  const marca = useTransform(progresso, [ponto - 0.04, ponto + 0.02], [0.4, 1])

  return (
    <Reveal delay={indice * 0.12} className="relative">
      <div className="relative">
        {/* ponto no fio */}
        <motion.span
          aria-hidden
          style={{ opacity: acende, scale: marca }}
          className="absolute -top-[2.1rem] left-0 hidden h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_20px_4px_rgb(201_162_75/0.5)] md:block"
        />
        <motion.span style={{ opacity: acende }} className="titulo-fino block text-[clamp(4rem,7vw,7rem)] text-primary">
          {passo.n}
        </motion.span>
      </div>
      <h3 className="mt-4 text-2xl font-light leading-snug tracking-tight">{passo.titulo}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>
    </Reveal>
  )
}

export function ComoFuncionaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const progresso = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const larguraLinha = useTransform(progresso, [0, 1], ["0%", "100%"])

  return (
    <section id="como-funciona" className="tema-claro relative scroll-mt-20 overflow-hidden px-5 py-28 md:px-8 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_100%,rgb(201_162_75/0.1),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[92rem]">
        <Reveal>
          <Eyebrow>Começar</Eyebrow>
        </Reveal>
        <h2 className="titulo-fino mt-8 text-[clamp(2.8rem,7vw,7rem)]">
          <TextReveal
            delay={0.1}
            lines={[
              "Do primeiro contato",
              <em key="2" className="font-accent font-medium italic text-primary">
                à agenda cheia.
              </em>,
            ]}
          />
        </h2>
        <Reveal delay={0.22}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Não tem cadastro solto no site: a gente configura a sua barbearia junto com você.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-24">
          {/* fio que se preenche conforme a seção entra na tela */}
          <div className="absolute left-0 right-0 top-0 hidden h-px bg-foreground/15 md:block">
            <motion.div style={{ width: larguraLinha }} className="h-full bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-14 md:grid-cols-4 md:gap-10 md:pt-12">
            {PASSOS.map((p, i) => (
              <Passo key={p.n} passo={p} indice={i} progresso={progresso} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
