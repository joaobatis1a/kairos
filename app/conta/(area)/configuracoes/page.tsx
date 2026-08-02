import { getClienteOuRedirect } from "@/lib/auth"
import { ConfiguracoesView } from "@/components/conta/configuracoes-view"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  const cliente = await getClienteOuRedirect()
  return <ConfiguracoesView cliente={cliente} />
}
