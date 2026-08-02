import { getClienteOuRedirect } from "@/lib/auth"
import { ContaView } from "@/components/conta-view"

export const dynamic = "force-dynamic"

export default async function ContaPage() {
  const cliente = await getClienteOuRedirect()
  return <ContaView cliente={cliente} />
}
