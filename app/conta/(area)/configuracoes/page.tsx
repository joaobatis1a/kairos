import { getClienteOuRedirect } from "@/lib/auth"
import { ConfiguracoesClienteView } from "@/components/configuracoes-cliente-view"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  const cliente = await getClienteOuRedirect()
  return <ConfiguracoesClienteView cliente={cliente} />
}
