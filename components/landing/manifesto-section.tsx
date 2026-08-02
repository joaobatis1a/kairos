"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useSemCursor } from "@/components/landing/card-recurso"
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
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <motion.img
              style={{ y: fotoY }}
              src="/images/barbeiro-trabalho.png"
              alt="Barbeiro fazendo a barba de um cliente com navalha"
              className="absolute inset-0 h-[116%] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
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
              lines={["Seu tempo volta", <em key="2" className="texto-dourado italic">para a cadeira.</em>]}
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
