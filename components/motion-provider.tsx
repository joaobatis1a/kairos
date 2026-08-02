"use client"

import { MotionConfig } from "framer-motion"

/**
 * Faz todo o framer-motion do app respeitar a preferência de movimento
 * reduzido do sistema. Sem isso cada componente teria que checar por conta
 * própria — e nenhum estava checando.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
