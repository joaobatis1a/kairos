/**
 * Marca do kairos: um K desenhado como navalha. A haste é o cabo e o braço
 * de cima é a lâmina aberta. O nome vem do deus grego do momento certo,
 * que era representado com uma navalha equilibrada no fio de uma balança.
 * `fill="currentColor"` pra herdar a cor do `text-*` do elemento pai.
 */
export function KairosMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="13" y="9" width="9" height="46" rx="2.5" />
      <path d="M27 31.5 47.2 8.6a2.1 2.1 0 0 1 3.5 2.3L34 36.5z" />
      <path d="M27 40.5 35 36 52.6 53.4a2.1 2.1 0 0 1-1.5 3.6h-6.4z" />
    </svg>
  )
}
