import { MARCA_HASTE, MARCA_MECHA, MARCA_PERNA } from "@/lib/marca"

/**
 * Marca do kairos: o K com a mecha (ver lib/marca.ts).
 * `fill="currentColor"` pra herdar a cor do `text-*` do elemento pai.
 */
export function KairosMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" className={className}>
      <path d={MARCA_HASTE} />
      <path d={MARCA_PERNA} />
      <path d={MARCA_MECHA} />
    </svg>
  )
}
