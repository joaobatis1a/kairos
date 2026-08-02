import { getClienteOuRedirect } from "@/lib/auth"
import { getHistoricoCliente } from "@/app/actions/avaliacoes"
import { HistoricoView } from "@/components/conta/historico-view"

export const dynamic = "force-dynamic"

export default async function HistoricoPage() {
  const [, historico] = await Promise.all([getClienteOuRedirect(), getHistoricoCliente()])
  return <HistoricoView historico={historico} />
}
