"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

/**
 * Envolve um botão e o puxa levemente na direção do cursor, voltando com
 * mola ao sair. É o detalhe que faz o CTA principal parecer "vivo" sem
 * precisar de brilho piscando.
 */
export function Magnetico({
  children,
  forca = 0.28,
  className,
}: {
  children: React.ReactNode
  forca?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const molaX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const molaY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  function acompanhar(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * forca)
    y.set((e.clientY - (r.top + r.height / 2)) * forca)
  }

  function soltar() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={acompanhar}
      onMouseLeave={soltar}
      whileTap={{ scale: 0.96 }}
      style={{ x: molaX, y: molaY }}
      className={className ?? "inline-block"}
    >
      {children}
    </motion.div>
  )
}
