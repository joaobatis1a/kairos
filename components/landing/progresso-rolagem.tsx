"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/** Fio dourado no topo da tela que se preenche conforme a página rola. */
export function ProgressoRolagem() {
  const { scrollYProgress } = useScroll()
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: escala }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary/40 via-primary to-primary/70"
    />
  )
}
