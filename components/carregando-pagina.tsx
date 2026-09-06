import { Loader2 } from "lucide-react"

/** Preenchimento instantâneo de `loading.tsx`: aparece na hora do clique,
 * enquanto o servidor busca os dados da página nova — sem isso a tela
 * antiga ficava parada e dava a sensação de travado, não de carregando. */
export function CarregandoPagina() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Carregando" />
    </div>
  )
}
