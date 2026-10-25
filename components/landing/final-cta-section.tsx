"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { KairosMark } from "@/components/kairos-mark"

export function FinalCtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const marcaY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  const marcaRot = useTransform(scrollYProgress, [0, 1], [-8, 8])

  return (
    <section id="contato" ref={ref} className="tema-vinho relative scroll-mt-20 overflow-hidden px-5 py-28 md:px-8 md:py-44">
      <motion.div
        aria-hidden
        style={{ y: marcaY, rotate: marcaRot }}
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 text-foreground/[0.07]"
      >
        <KairosMark className="h-[44rem] w-[44rem] max-w-none" />
      </motion.div>

      <div className="relative mx-auto max-w-[92rem]">
        <Reveal>
          <Eyebrow>A cadeira está livre</Eyebrow>
        </Reveal>

        <h2 className="titulo-gigante mt-6 text-[clamp(3.4rem,11vw,11rem)]">
          <TextReveal
            delay={0.12}
            lines={[
              "Vamos colocar sua",
              "barbearia no",
              <span key="3" className="inline-block bg-foreground px-[0.12em] text-background">
                kairos?
              </span>,
            ]}
          />
        </h2>

        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
            <Magnetico forca={0.3}>
              <a
                href={LINK_CONTATO}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground py-2.5 pl-8 pr-2.5 text-lg font-bold text-background ring-2 ring-foreground transition-colors hover:bg-transparent hover:text-foreground"
              >
                Falar com a gente
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </Magnetico>
            <p className="max-w-xs text-sm font-medium leading-snug">
              Conte da sua barbearia no e-mail. Devolvemos o acesso já configurado, sem cobrança pra conversar.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
