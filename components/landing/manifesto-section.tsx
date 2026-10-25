"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { KairosMark } from "@/components/kairos-mark"
import { useSemCursor } from "@/components/landing/hooks"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"

const TROCAS = [
  { antes: "Responder WhatsApp entre um corte e outro", depois: "O cliente agenda sozinho, a qualquer hora" },
  { antes: "Caderno de agenda com letra ilegível", depois: "A agenda do dia inteira, atualizada na hora" },
  { antes: "Fechar o mês no chute", depois: "Faturamento e comissão de cada barbeiro, sem conta" },
]

/** Linha da lista: preenche de cobre no hover e, no celular, ao cruzar o centro. */
function LinhaTroca({ antes, depois, indice }: { antes: string; depois: string; indice: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const semCursor = useSemCursor()
  const noCentro = useInView(ref, { margin: "-45% 0px -45% 0px" })
  const ativo = semCursor && noCentro

  return (
    <Reveal delay={0.12 + indice * 0.12}>
      <div
        ref={ref}
        data-ativo={ativo}
        className="group relative -mx-4 border-t-2 border-foreground px-4 py-6 transition-colors duration-300 hover:bg-primary data-[ativo=true]:bg-primary md:py-7"
      >
        <p className="text-sm text-muted-foreground line-through decoration-foreground/40 group-hover:text-primary-foreground/70 group-data-[ativo=true]:text-primary-foreground/70">
          {antes}
        </p>
        <p className="mt-2 flex items-start gap-3 text-xl font-bold leading-snug md:text-2xl">
          <span className="mt-[0.2em] text-2xl leading-none transition-transform duration-300 group-hover:translate-x-1.5 group-data-[ativo=true]:translate-x-1.5">
            →
          </span>
          {depois}
        </p>
      </div>
    </Reveal>
  )
}

/** Verbete: o significado do nome, num adesivo inclinado que se endireita no hover. */
function Verbete() {
  return (
    <motion.div
      initial={{ rotate: -4, opacity: 0, y: 40 }}
      whileInView={{ rotate: -3, opacity: 1, y: 0 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16 }}
      className="tema-escuro relative flex aspect-[4/5] flex-col justify-between overflow-hidden border-2 border-foreground p-7 shadow-[12px_12px_0_0_var(--primary)] md:p-9"
    >
      <KairosMark className="pointer-events-none absolute -right-12 -top-8 h-[22rem] w-[22rem] text-primary/[0.1]" />

      <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Verbete · grego antigo
      </p>

      <div className="relative">
        <p className="font-accent text-7xl font-semibold italic leading-none text-primary md:text-8xl">καιρός</p>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">kairós, substantivo</p>
        <p className="mt-6 max-w-[17rem] text-xl font-bold leading-snug">
          O momento certo. A oportunidade que passa uma vez só.
        </p>
      </div>

      {/* régua do dia: um ponto percorre as horas, marcando o instante */}
      <div className="relative">
        <div className="relative h-px bg-foreground/30">
          <span className="anim-regua absolute -top-[4px] h-[9px] w-[9px] rounded-full bg-primary" />
        </div>
        <div className="mt-3 flex justify-between text-[10px] tabular-nums text-muted-foreground">
          {["09h", "11h", "13h", "15h", "17h", "19h"].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const topoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])

  return (
    <section ref={ref} className="tema-claro relative overflow-hidden px-5 py-28 md:px-8 md:py-40">
      <motion.div aria-hidden style={{ y: topoY }} className="fundo-risca pointer-events-none absolute -inset-y-[8%] inset-x-0" />

      <div className="relative mx-auto grid max-w-[92rem] grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5 md:pr-6">
          <Verbete />
        </div>

        <div className="md:col-span-7">
          <Reveal>
            <Eyebrow>O que muda</Eyebrow>
          </Reveal>

          <h2 className="titulo-gigante mt-6 text-[clamp(3rem,7.4vw,7.5rem)]">
            <TextReveal
              delay={0.1}
              lines={[
                "Seu tempo volta",
                <em key="2" className="marca-texto font-accent text-[0.92em] font-semibold normal-case italic tracking-[-0.02em]">
                  para a cadeira.
                </em>,
              ]}
            />
          </h2>

          <div className="mt-12 flex flex-col border-b-2 border-foreground">
            {TROCAS.map((t, i) => (
              <LinhaTroca key={t.antes} antes={t.antes} depois={t.depois} indice={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
