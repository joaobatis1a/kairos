"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { listarNotificacoes } from "@/app/actions/notificacoes"
import { Bell } from "lucide-react"

const MotionLink = motion.create(Link)

/** Sino leva direto pra central de notificações (/painel/notificacoes),
 * como no práxis — sem dropdown. Só busca a contagem de não lidas aqui,
 * a lista em si mora na página. */
export function SinoNotificacoes() {
  const [naoLidas, setNaoLidas] = useState(0)

  useEffect(() => {
    function carregar() {
      listarNotificacoes().then((lista) => setNaoLidas(lista.filter((n) => !n.lida).length))
    }
    carregar()
    // reconfere periodicamente — sem realtime aqui de propósito, o sino
    // não precisa da mesma urgência da lista de agendamentos ao vivo
    const t = setInterval(carregar, 60_000)
    return () => clearInterval(t)
  }, [])

  return (
    <MotionLink
      href="/painel/notificacoes"
      aria-label="Notificações"
      whileHover={{ rotate: [0, -14, 11, -8, 5, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Bell className="h-[18px] w-[18px]" />
      {naoLidas > 0 && (
        <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
      )}
    </MotionLink>
  )
}
