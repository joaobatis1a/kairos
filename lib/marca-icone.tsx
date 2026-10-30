import { MARCA_HASTE, MARCA_MECHA, MARCA_PERNA } from "@/lib/marca"

export const OURO = "#B8893B"
export const PRETO = "#0E0D0B"

/** O K com a mecha, em formas simples, pras rotas de ícone que rodam no satori. */
export function MarcaIcone({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill={OURO}>
      <path d={MARCA_HASTE} />
      <path d={MARCA_PERNA} />
      <path d={MARCA_MECHA} />
    </svg>
  )
}
