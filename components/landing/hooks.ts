"use client"

import { useEffect, useState } from "react"

/**
 * Detecta aparelho sem cursor (toque), onde nenhum efeito de hover acontece.
 * Usado pelas linhas/células da landing pra trocar o estado de "hover" por
 * "cruzou o centro da tela" no celular.
 */
export function useSemCursor() {
  const [semCursor, setSemCursor] = useState(false)

  useEffect(() => {
    const consulta = window.matchMedia("(hover: none)")
    const atualizar = () => setSemCursor(consulta.matches)
    atualizar()
    consulta.addEventListener("change", atualizar)
    return () => consulta.removeEventListener("change", atualizar)
  }, [])

  return semCursor
}
