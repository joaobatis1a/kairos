import { getClienteOuRedirect } from "@/lib/auth"
import { getHistoricoCliente } from "@/app/actions/avaliacoes"
import { HistoricoView } from "@/components/historico-view"

export const dynamic = "force-dynamic"

export default async function HistoricoPage() {
  const cliente = await getClienteOuRedirect()
  const historico = await getHistoricoCliente()
  return <HistoricoView cliente={cliente} historico={historico} />
}
