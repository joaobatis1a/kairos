"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Reveal, Eyebrow } from "@/components/landing/reveal"

/** Palavras da frase; `ouro` marca as que viram itálico dourado. */
const PALAVRAS: { t: string; ouro?: boolean }[] = [
  { t: "Seu" },
  { t: "tempo" },
  { t: "volta" },
  { t: "para" },
  { t: "a" },
  { t: "cadeira.", ouro: true },
]

const TROCAS = [
  { antes: "Responder WhatsApp entre um corte e outro", depois: "O cliente agenda sozinho, a qualquer hora" },
  { antes: "Caderno de agenda com letra ilegível", depois: "A agenda do dia inteira, atualizada na hora" },
  { antes: "Fechar o mês no chute", depois: "Faturamento e comissão de cada barbeiro, sem conta" },
]

const arred = (n: number) => Math.round(n * 100) / 100

/** Mostrador: anéis finos, 60 marcas e um ponteiro que gira devagar. */
function Mostrador() {
  const marcas = Array.from({ length: 60 }, (_, i) => {
    const ang = (i / 60) * Math.PI * 2
    const longa = i % 5 === 0
    const r1 = 392
    const r2 = longa ? 368 : 380
    return {
      i,
      longa,
      x1: arred(400 + Math.sin(ang) * r1),
      y1: arred(400 - Math.cos(ang) * r1),
      x2: arred(400 + Math.sin(ang) * r2),
      y2: arred(400 - Math.cos(ang) * r2),
    }
  })

  return (
    <svg
      viewBox="0 0 800 800"
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[min(150vw,120vh)] w-[min(150vw,120vh)] max-w-none -translate-x-1/2 -translate-y-1/2 text-primary opacity-[0.22]"
    >
      <defs>
        <linearGradient id="ponteiro-ouro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="400" cy="400" r="396" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 7" />
      <circle cx="400" cy="400" r="200" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="400" cy="400" r="4" fill="currentColor" />
      {marcas.map((m) => (
        <line key={m.i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke="currentColor" strokeWidth={m.longa ? 1.6 : 0.8} />
      ))}
      <g className="anim-girar origin-center" style={{ transformOrigin: "400px 400px", animationDuration: "60s" }}>
        <rect x="399" y="8" width="2" height="392" fill="url(#ponteiro-ouro)" />
      </g>
    </svg>
  )
}

/** Palavra: de apagada a acesa conforme o progresso chega nela. */
function Palavra({
  palavra,
  indice,
  progresso,
}: {
  palavra: (typeof PALAVRAS)[number]
  indice: number
  progresso: MotionValue<number>
}) {
  const ini = (indice / PALAVRAS.length) * 0.85
  const opacity = useTransform(progresso, [ini, ini + 0.14], [0.16, 1])

  return (
    <motion.span
      style={{ opacity }}
      className={palavra.ouro ? "font-accent font-medium italic text-primary" : undefined}
    >
      {palavra.t}{" "}
    </motion.span>
  )
}

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "center 0.45"] })

  return (
    <section ref={ref} className="tema-claro relative overflow-hidden px-5 py-32 md:px-8 md:py-48">
      <Mostrador />
      {/* a borda do mostrador some no preto, sem corte */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_78%)]"
      />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <Eyebrow>καιρός · o momento certo</Eyebrow>
          </Reveal>

          <h2 className="titulo-fino mt-10 text-[clamp(3rem,9vw,9rem)]">
            {PALAVRAS.map((p, i) => (
              <Palavra key={p.t} palavra={p} indice={i} progresso={scrollYProgress} />
            ))}
          </h2>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              Kairós, em grego antigo, é a oportunidade que passa uma vez só. É o que uma agenda cheia e bem cuidada faz por
              você: o horário certo, na cadeira certa.
            </p>
          </Reveal>
        </div>

        <div className="mt-24 grid grid-cols-1 border-t border-foreground/15 md:mt-32 md:grid-cols-3">
          {TROCAS.map((t, i) => (
            <Reveal key={t.antes} delay={0.1 + i * 0.1}>
              <div className="h-full border-b border-foreground/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0">
                <p className="text-sm text-muted-foreground line-through decoration-foreground/30">{t.antes}</p>
                <p className="mt-4 text-2xl font-light leading-snug tracking-tight md:text-[1.7rem]">{t.depois}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
