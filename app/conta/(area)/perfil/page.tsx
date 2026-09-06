import { getClienteOuRedirect } from "@/lib/auth"
import { getFotoPerfil } from "@/app/actions/avatar"
import { ContaPerfilView } from "@/components/conta/conta-perfil-view"

export const dynamic = "force-dynamic"

export default async function PerfilPage() {
  const [cliente, fotoUrl] = await Promise.all([getClienteOuRedirect(), getFotoPerfil()])
  return <ContaPerfilView cliente={cliente} fotoUrl={fotoUrl} />
}
