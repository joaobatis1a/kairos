import { getClienteOuRedirect } from "@/lib/auth"
import { getFotoCliente } from "@/app/actions/perfil-cliente"
import { ContaPerfilView } from "@/components/conta/conta-perfil-view"

export const dynamic = "force-dynamic"

export default async function PerfilPage() {
  const [cliente, fotoUrl] = await Promise.all([getClienteOuRedirect(), getFotoCliente()])
  return <ContaPerfilView cliente={cliente} fotoUrl={fotoUrl} />
}
