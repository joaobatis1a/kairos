"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { KairosMark } from "@/components/kairos-mark"
import { Revelar } from "@/components/landing/revelar"

/** Uma face da moeda, com aro serrilhado e o fio gravado por dentro. */
function Face({ children, verso }: { children: React.ReactNode; verso?: boolean }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center rounded-full [backface-visibility:hidden]"
      style={{
        transform: verso ? "rotateY(180deg)" : undefined,
        background: "radial-gradient(circle at 32% 28%, #f6e3a8 0%, #d4aa55 38%, #a47d2f 72%, #6e5420 100%)",
        boxShadow: "inset 0 0 0 6px rgb(110 84 32 / 0.55), inset 0 0 0 9px rgb(246 227 168 / 0.35), 0 40px 80px -30px rgb(0 0 0 / 0.55)",
      }}
    >
      <div className="absolute inset-[7%] rounded-full border border-[#6e5420]/50" />
      {children}
    </div>
  )
}

const PARAGRAFOS = [
  "Os gregos tinham duas palavras para o tempo. Chronos era o tempo do relógio, que passa igual pra todo mundo. Kairós era o momento certo, aquele que aparece uma vez só.",
  "Pintavam Kairós careca atrás e com uma única mecha na testa: quem vê o momento chegando agarra pela frente. Depois que passa, não tem por onde segurar.",
  "Numa barbearia, o momento certo tem nome e hora: o cliente que quer cortar amanhã às dez e a cadeira livre esperando por ele. O kairos existe pra não deixar esse momento passar.",
]

/**
 * "O nome": a história do kairos, em papel cor de osso. A moeda gira sobre
 * o próprio eixo conforme a página rola: de um lado o K com a mecha, do
 * outro o nome em grego.
 */
export function ONome() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const giro = useSpring(useTransform(scrollYProgress, [0.1, 0.9], [-25, 340]), { stiffness: 60, damping: 20 })
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"])

  return (
    <section id="o-nome" ref={ref} className="kairos-osso relative scroll-mt-16 overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <motion.div style={{ y }} className="flex justify-center lg:col-span-5">
          <div className="relative aspect-square w-[min(70vw,24rem)] [perspective:1200px]">
            <motion.div style={{ rotateY: giro }} className="absolute inset-0 [transform-style:preserve-3d]">
              <Face>
                <KairosMark className="h-[56%] w-[56%] text-[#3a2c10] [filter:drop-shadow(0_1px_0_rgb(246_227_168/0.6))]" />
              </Face>
              <Face verso>
                <div className="text-center text-[#3a2c10]">
                  <p className="letreiro text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.18em]">ΚΑΙΡΟΣ</p>
                  <p className="letreiro mt-2 text-[10px] tracking-[0.3em] opacity-70">o momento certo</p>
                </div>
              </Face>
            </motion.div>
            {/* sombra no papel */}
            <div className="absolute -bottom-10 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />
          </div>
        </motion.div>

        <div className="lg:col-span-7 lg:pl-8">
          <Revelar>
            <p className="letreiro flex items-center gap-3 text-[11px] text-primary md:text-xs">
              <span className="h-px w-8 bg-primary" />
              Por que kairos
            </p>
            <h2 className="titulo mt-6 text-[clamp(2.6rem,5.4vw,5.2rem)]">
              Agarre o momento <em className="italic text-primary">pela mecha.</em>
            </h2>
          </Revelar>
          <div className="mt-10 max-w-xl space-y-6">
            {PARAGRAFOS.map((p, i) => (
              <Revelar key={i} atraso={0.08 * i}>
                <p className={i === 2 ? "text-lg leading-relaxed text-foreground md:text-xl" : "text-base leading-relaxed text-muted-foreground md:text-[17px]"}>
                  {p}
                </p>
              </Revelar>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
