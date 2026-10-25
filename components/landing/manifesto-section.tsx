"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useSemCursor } from "@/components/landing/hooks"
import { KairosMark } from "@/components/kairos-mark"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"

const TROCAS = [
  { antes: "Responder WhatsApp entre um corte e outro", depois: "O cliente agenda sozinho, a qualquer hora" },
  { antes: "Caderno de agenda com letra ilegível", depois: "A agenda do dia inteira, atualizada na hora" },
  { antes: "Fechar o mês no chute", depois: "Faturamento e comissão de cada barbeiro, sem conta" },
]

/** Linha da lista: o traço cresce no hover e, no celular, ao cruzar o centro. */
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
        className="group border-t border-border/70 py-6 transition-colors duration-500 hover:border-primary/40 data-[ativo=true]:border-primary/40"
      >
        <p className="text-sm text-muted-foreground/70 line-through decoration-muted-foreground/30">
          {antes}
        </p>
        <p className="mt-2 flex items-start gap-3 text-lg leading-snug text-foreground">
          <span className="mt-[0.55em] h-px w-6 shrink-0 bg-primary transition-all duration-500 group-hover:w-10 group-data-[ativo=true]:w-10" />
          {depois}
        </p>
      </div>
    </Reveal>
  )
}

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const fotoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <section ref={ref} className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-16">
        {/* Foto — revelada como uma cortina subindo, depois parallax no scroll */}
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5"
        >
          <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-sm border border-primary/20 bg-card/60 p-7 md:p-9">
            {/* marca gigante sangrando pelo canto, andando devagar com o scroll */}
            <motion.div style={{ y: fotoY }} className="pointer-events-none absolute -right-10 -top-6 text-primary/[0.09]">
              <KairosMark className="h-[22rem] w-[22rem]" />
            </motion.div>

            <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Verbete · grego antigo
            </p>

            <div className="relative">
              <p className="texto-dourado font-accent text-6xl italic leading-none md:text-7xl">καιρός</p>
              <p className="mt-3 font-serif text-sm tracking-[0.2em] text-muted-foreground">kairós, substantivo</p>
              <p className="mt-6 max-w-[16rem] font-serif text-xl leading-snug">
                O momento certo. A oportunidade que passa uma vez só.
              </p>
            </div>

            {/* régua do dia: um ponto percorre as horas, marcando o instante */}
            <div className="relative">
              <div className="relative h-px bg-border">
                <span className="anim-regua absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
              </div>
              <div className="mt-3 flex justify-between text-[10px] tabular-nums text-muted-foreground/70">
                {["09h", "11h", "13h", "15h", "17h", "19h"].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
            </div>
            <div className="kairos-grain absolute inset-0" />
          </div>
        </motion.div>

        {/* Texto — coluna larga, alinhado à esquerda */}
        <div className="md:col-span-7 md:pl-4">
          <Reveal>
            <Eyebrow>O que muda</Eyebrow>
          </Reveal>

          <h2 className="mt-6 font-serif text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            <TextReveal
              delay={0.1}
              lines={["Seu tempo volta", <em key="2" className="texto-dourado font-accent italic">para a cadeira.</em>]}
            />
          </h2>

          <div className="mt-12 flex flex-col">
            {TROCAS.map((t, i) => (
              <LinhaTroca key={t.antes} antes={t.antes} depois={t.depois} indice={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
