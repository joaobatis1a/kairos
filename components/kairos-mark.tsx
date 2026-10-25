import { useId } from "react"

/**
 * Marca do kairos: um K pesado, cortado na diagonal por uma lâmina, com a
 * metade de cima deslizando um pouco pra fora do lugar. Kairos é o momento
 * certo; o corte é o instante em que ele acontece.
 * `fill="currentColor"` pra herdar a cor do `text-*` do elemento pai.
 */
const K = "M10 8h15v48H10z M25 33 43 8h17L38 38 25 40z M31 35.5 38 31 60 56H43z"

export function KairosMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <defs>
        <clipPath id={`${id}a`}>
          <path d="M-4 -4H68V30L-4 46z" />
        </clipPath>
        <clipPath id={`${id}b`}>
          <path d="M-4 46 68 30V68H-4z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}a)`} transform="translate(2.5 -2.5)">
        <path d={K} />
      </g>
      <g clipPath={`url(#${id}b)`}>
        <path d={K} />
      </g>
    </svg>
  )
}
