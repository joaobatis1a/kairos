/**
 * Entradas da landing, em CSS.
 *
 * Eram framer-motion com `initial={{opacity:0}}` e, no TextReveal, cada
 * linha em translateY(115%) dentro de overflow-hidden — o que deixava todo
 * título e parágrafo da página invisível até o JavaScript rodar. Numa
 * página cujo único trabalho é vender, isso é caro demais. Agora o estado
 * base é o visível e a animação (classes .revelar / .revelar-linha) só
 * acontece por cima, respeitando prefers-reduced-motion.
 *
 * O `delay` continua na assinatura porque várias seções o passam, mas
 * agora é aplicado como animation-delay — sem fill-mode, então um atraso
 * nunca esconde conteúdo.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <div className={`revelar ${className ?? ""}`} style={delay ? { animationDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  )
}

/** Headline revelada linha a linha: cada linha vive numa máscara e sobe de baixo. */
export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: React.ReactNode[]
  className?: string
  lineClassName?: (i: number) => string | undefined
  delay?: number
  animateOnMount?: boolean
}) {
  return (
    <span className={className}>
      {lines.map((linha, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <span
            className={`revelar-linha block ${lineClassName?.(i) ?? ""}`}
            style={{ animationDelay: `${delay + i * 0.11}s` }}
          >
            {linha}
          </span>
        </span>
      ))}
    </span>
  )
}

/** Rótulo pequeno acima dos títulos. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block text-sm font-bold text-primary ${className ?? ""}`}>{children}</span>
  )
}
