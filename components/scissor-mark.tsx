/**
 * A mesma tesoura do favicon (app/icon.svg), como componente — pra usar a
 * marca de verdade (não o ícone genérico `Scissors` do lucide) em qualquer
 * lugar que precise identificar o kairos: nav, telas de conta, rodapé.
 * `stroke="currentColor"` pra herdar cor do `text-*` do elemento pai, do
 * jeito que o `Scissors` do lucide já era usado.
 */
export function ScissorMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="19" cy="44" r="7" />
        <circle cx="19" cy="20" r="7" />
        <path d="M25 40 48 15M25 24 48 49" />
      </g>
    </svg>
  )
}
