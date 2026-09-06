"use client"

import { useEffect, useState } from "react"
import { animate } from "framer-motion"

/** Conta de 0 até o valor quando ele aparece ou muda — mesmo efeito do
 * práxis nos cartões de estatística. `formatar` recebe o valor intermediário
 * (ainda não inteiro) a cada frame, então funciona tanto pra preço
 * (formatarPreco) quanto pra contagem simples. */
export function NumeroAnimado({
  valor,
  formatar = (v: number) => String(Math.round(v)),
}: {
  valor: number
  formatar?: (v: number) => string
}) {
  const [exibido, setExibido] = useState(0)

  useEffect(() => {
    const controls = animate(0, valor, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setExibido,
    })
    return () => controls.stop()
  }, [valor])

  return <>{formatar(exibido)}</>
}
