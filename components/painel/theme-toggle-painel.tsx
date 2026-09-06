"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

/** Botão rápido de tema pro painel — mesma animação do práxis (crossfade
 * com rotação + escala em spring). O seletor completo continua em
 * /painel/minha-conta; isso aqui é só o atalho de um clique. */
export function ThemeTogglePainel() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9" aria-hidden />

  const escuro = theme === "dark"

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85, rotate: -20 }}
      aria-label="Alternar tema"
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="absolute"
        >
          {escuro ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
