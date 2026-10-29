"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { LINK_CONTATO } from "@/components/landing/contato"
import { FundoOuro } from "@/components/landing/fundo-ouro"
import { Magnetico } from "@/components/landing/magnetico"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { KairosMark } from "@/components/kairos-mark"

export function FinalCtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const marcaY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section
      id="contato"
      ref={ref}
      className="tema-escuro relative flex min-h-[100svh] scroll-mt-20 items-center overflow-hidden px-5 py-32 md:px-8"
    >
      {/* aqui a luz sobe do chão, fechando a página como o hero a abre */}
      <FundoOuro origem="base" forca={1.15} poeira={0.8} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />

      <motion.div
        aria-hidden
        style={{ y: marcaY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/[0.06]"
      >
        <KairosMark className="h-[min(90vw,46rem)] w-[min(90vw,46rem)] max-w-none" />
      </motion.div>

      <div className="relative mx-auto w-full max-w-6xl text-center">
        <Reveal>
          <Eyebrow>A cadeira está livre</Eyebrow>
        </Reveal>

        <h2 className="titulo-fino mt-10 text-[clamp(2.6rem,7.4vw,7.4rem)] md:whitespace-nowrap">
          <TextReveal
            delay={0.12}
            lines={[
              "Vamos colocar sua",
              <span key="2">
                barbearia no{" "}
                <em className="font-accent font-medium italic text-primary">kairos?</em>
              </span>,
            ]}
          />
        </h2>

        <Reveal delay={0.4}>
          <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-foreground/75">
            Conte da sua barbearia no e-mail. Devolvemos o acesso já configurado, sem cobrança pra conversar.
          </p>
          <div className="mt-10 flex justify-center">
            <Magnetico forca={0.3}>
              <a
                href={LINK_CONTATO}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-primary py-2.5 pl-8 pr-2.5 text-lg font-semibold text-primary-foreground shadow-[0_20px_60px_-15px_rgb(201_162_75/0.6)] transition-colors hover:bg-foreground"
              >
                Falar com a gente
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </Magnetico>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
