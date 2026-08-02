"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"

/**
 * Número que conta de zero até o valor quando entra na tela.
 * Usado nos mockups do painel — o número subindo é o que faz o
 * "faturamento do mês" parecer vivo em vez de um print estático.
 */
export function Contador({
  valor,
  prefixo = "",
  sufixo = "",
  duracao = 1.6,
}: {
  valor: number
  prefixo?: string
  sufixo?: string
  duracao?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const emVista = useInView(ref, { once: true, margin: "-60px" })
  // começa já no valor final: se o JS não rodar, o número mostrado é o
  // verdadeiro em vez de zero. A contagem é enfeite por cima disso.
  const [atual, setAtual] = useState(valor)

  useEffect(() => {
    if (!emVista) return
    // Aba em segundo plano congela o requestAnimationFrame: a contagem
    // ficaria parada em 0 mostrando um número errado. Sem animação, então.
    if (document.visibilityState !== "visible") {
      setAtual(valor)
      return
    }
    const controle = animate(0, valor, {
      duration: duracao,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setAtual(Math.round(v)),
      onComplete: () => setAtual(valor),
    })
    // se for interrompida no meio, o número final ainda tem que ficar certo
    return () => {
      controle.stop()
      setAtual(valor)
    }
  }, [emVista, valor, duracao])

  return (
    <span ref={ref} className="tabular-nums">
      {prefixo}
      {atual.toLocaleString("pt-BR")}
      {sufixo}
    </span>
  )
}
