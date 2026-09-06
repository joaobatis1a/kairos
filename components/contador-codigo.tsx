"use client"

import { useEffect, useRef, useState } from "react"

/** Mostra quanto falta pro código expirar e avisa o pai uma vez quando
 * chega em zero (o pai busca/gera um código novo). Usado nos dois lugares
 * que mostram código de convite: /manutencao (dono) e /painel/equipe
 * (barbeiro). */
export function ContadorCodigo({ expiresAt, onExpirar }: { expiresAt: string; onExpirar: () => void }) {
  const [restante, setRestante] = useState(0)
  const avisouRef = useRef(false)

  useEffect(() => {
    avisouRef.current = false
    const alvo = new Date(expiresAt).getTime()

    function atualizar() {
      const restanteMs = alvo - Date.now()
      setRestante(Math.max(0, Math.round(restanteMs / 1000)))
      if (restanteMs <= 0 && !avisouRef.current) {
        avisouRef.current = true
        onExpirar()
      }
    }

    atualizar()
    const t = setInterval(atualizar, 1000)
    return () => clearInterval(t)
  }, [expiresAt, onExpirar])

  const min = Math.floor(restante / 60)
  const seg = restante % 60

  return (
    <p className="text-center text-xs text-muted-foreground">
      {restante > 0 ? `Expira em ${min}:${String(seg).padStart(2, "0")}` : "Gerando um novo código…"}
    </p>
  )
}
